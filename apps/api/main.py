import logging
from fastapi import FastAPI, Request, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Import config and routers
from config import get_settings
from routes.health import router as health_router
from routes.tenant import router as tenant_router
from routes.upload import router as upload_router
from routes.chat import router as chat_router
from routes.retrieval import router as retrieval_router
from middleware.request_logger import request_logger_middleware
from middleware.error_handler import http_exception_handler
from fastapi import HTTPException

# Initialize Settings
settings = get_settings()

# Initialize Logger
logger = logging.getLogger("scoutio")
logging.basicConfig(level=getattr(logging, settings.LOG_LEVEL))

# Initialize FastAPI Application
app = FastAPI(
    title="Scout.io API",
    version="v1",
)

# CORS middleware allowing all origins (for MVP)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register request logger middleware
app.middleware("http")(request_logger_middleware)

# Root APIRouter to group v1 routes under /api/v1 prefix
api_v1_router = APIRouter(prefix="/api/v1")

# Register routes
api_v1_router.include_router(health_router, prefix="/health", tags=["Health"])
api_v1_router.include_router(tenant_router, prefix="/tenant", tags=["Tenant"])
api_v1_router.include_router(upload_router, prefix="/upload", tags=["Upload"])
api_v1_router.include_router(chat_router, prefix="/chat", tags=["Chat"])
api_v1_router.include_router(retrieval_router, prefix="/retrieval", tags=["Retrieval"])

# Mount all v1 routers under /api/v1
app.include_router(api_v1_router)

# Startup event
@app.on_event("startup")
async def startup_event():
    print(f"Scout.io API started — environment: {settings.ENVIRONMENT}")

# Register global exception handler for FastAPI HTTPExceptions
app.add_exception_handler(HTTPException, http_exception_handler)

# Global exception handler for unhandled errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error occurred:")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "Unexpected error"
            }
        }
    )

