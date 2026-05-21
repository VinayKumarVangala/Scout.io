import logging
import httpx
from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine, text

from config import get_settings

router = APIRouter()
logger = logging.getLogger("scoutio.health")

@router.get("")
@router.get("/health")
async def health():
    """
    Pure liveness check.
    Returns immediately without querying any database or external service.
    """
    return {
        "success": True,
        "data": {
            "status": "healthy"
        }
    }

@router.get("/ready")
async def ready():
    """
    Readiness check.
    Validates active connections to PostgreSQL and Qdrant.
    """
    settings = get_settings()
    postgres_ok = False
    qdrant_ok = False

    # 1. Validate PostgreSQL connection
    if settings.DATABASE_URL:
        try:
            # Create a short-lived engine connection
            engine = create_engine(
                settings.DATABASE_URL,
                connect_args={"connect_timeout": 3}  # 3 seconds timeout
            )
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            postgres_ok = True
        except Exception as e:
            logger.error(f"PostgreSQL readiness check failed: {e}")
    else:
        logger.error("PostgreSQL DATABASE_URL settings missing")

    # 2. Validate Qdrant connection
    if settings.QDRANT_URL:
        try:
            url = f"{settings.QDRANT_URL.rstrip('/')}/health"
            headers = {}
            if settings.QDRANT_API_KEY:
                headers["api-key"] = settings.QDRANT_API_KEY
            
            with httpx.Client(timeout=3.0) as client:
                response = client.get(url, headers=headers)
                if response.status_code == 200:
                    qdrant_ok = True
                else:
                    logger.error(f"Qdrant readiness check returned status {response.status_code}")
        except Exception as e:
            logger.error(f"Qdrant readiness check failed: {e}")
    else:
        logger.error("Qdrant QDRANT_URL settings missing")

    # 3. Formulate response
    if postgres_ok and qdrant_ok:
        return {
            "success": True,
            "data": {
                "status": "ready",
                "postgres": "ok",
                "qdrant": "ok"
            }
        }
    
    # 4. Service Unavailable (HTTP 503)
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "success": False,
            "error": {
                "code": "SERVICE_UNAVAILABLE",
                "message": "Dependency check failed"
            }
        }
    )
