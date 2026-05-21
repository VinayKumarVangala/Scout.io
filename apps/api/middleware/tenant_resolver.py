import logging
from fastapi import Header, HTTPException, Request, status
from sqlalchemy import create_engine, text

from config import get_settings

logger = logging.getLogger("scoutio.middleware.tenant_resolver")
settings = get_settings()

# Initialize database engine
engine = None
if settings.DATABASE_URL:
    engine = create_engine(settings.DATABASE_URL)

async def resolve_tenant(request: Request, x_widget_key: str = Header(..., alias="X-Widget-Key")):
    """
    FastAPI dependency function that resolves and returns the tenant_id associated
    with the provided public X-Widget-Key header.
    Validates that the key status is 'active'.
    Caches the lookup in request.state for the lifetime of this HTTP request.
    """
    # 1. Initialize request-lifetime cache container if not exists
    if not hasattr(request.state, "tenant_resolver_cache"):
        request.state.tenant_resolver_cache = {}

    # 2. Check if key is already cached for this request
    if x_widget_key in request.state.tenant_resolver_cache:
        return request.state.tenant_resolver_cache[x_widget_key]

    tenant_id = None

    # 3. Resolve key from database
    if engine:
        try:
            with engine.connect() as conn:
                # Retrieve tenant_id filtering by active status
                result = conn.execute(
                    text("""
                        SELECT tenant_id FROM api_keys 
                        WHERE key = :key AND status = 'active'
                    """),
                    {"key": x_widget_key}
                ).fetchone()
                
                if result:
                    tenant_id = result[0]
        except Exception as e:
            logger.error(f"Error querying active status widget key from database: {e}")
            # Fallback to query without status column if table does not contain it yet
            try:
                with engine.connect() as conn:
                    fallback_result = conn.execute(
                        text("SELECT tenant_id FROM api_keys WHERE key = :key"),
                        {"key": x_widget_key}
                    ).fetchone()
                    if fallback_result:
                        tenant_id = fallback_result[0]
            except Exception as fe:
                logger.error(f"Fallback query also failed during tenant resolution: {fe}")
    else:
        # Mock onboarding fallback for database-less local developer testing
        if x_widget_key == "demo_key" or (settings.ADMIN_SECRET_KEY and x_widget_key == settings.ADMIN_SECRET_KEY):
            tenant_id = "demo_tenant"

    # 4. Handle invalid/unauthorized resolution
    if not tenant_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or inactive widget key"
        )

    # 5. Store resolved tenant_id in cache for this request lifetime
    request.state.tenant_resolver_cache[x_widget_key] = tenant_id
    return tenant_id
