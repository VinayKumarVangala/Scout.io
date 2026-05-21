import uuid
import logging
from fastapi import APIRouter, Depends, Request, Header, HTTPException, status
from sqlalchemy import create_engine, text

from config import get_settings
from schemas.tenant import TenantCreateRequest

router = APIRouter()
settings = get_settings()
logger = logging.getLogger("scoutio.tenant")

# Initialize database engine
engine = None
if settings.DATABASE_URL:
    engine = create_engine(settings.DATABASE_URL)

async def verify_admin_key(request: Request):
    """
    Reusable dependency verifying that the request contains the correct
    Authorization: Bearer <ADMIN_SECRET_KEY> header.
    """
    auth_header = request.headers.get("Authorization")
    expected_prefix = "Bearer "
    
    if not auth_header or not auth_header.startswith(expected_prefix):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "success": False,
                "error": {
                    "code": "UNAUTHORIZED",
                    "message": "Invalid admin key"
                }
            }
        )
    
    token = auth_header[len(expected_prefix):]
    if token != settings.ADMIN_SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "success": False,
                "error": {
                    "code": "UNAUTHORIZED",
                    "message": "Invalid admin key"
                }
            }
        )

@router.post("/create")
async def create_tenant(tenant: TenantCreateRequest, _ = Depends(verify_admin_key)):
    """
    Creates a new tenant and generates a widget public key (widget_key).
    Requires Admin Authorization Header.
    """
    tenant_id = str(uuid.uuid4())
    widget_key = str(uuid.uuid4())

    if not engine:
        logger.warning("DATABASE_URL is not set. Creating tenant in demo-mock mode.")
        return {
            "success": True,
            "data": {
                "tenant_id": tenant_id,
                "widget_key": widget_key
            },
            "meta": {
                "warning": "DATABASE_URL is not set. Created tenant in mock mode."
            }
        }

    try:
        with engine.begin() as conn:
            # Insert into tenants
            conn.execute(
                text("INSERT INTO tenants (id, name, domain) VALUES (:id, :name, :domain)"),
                {"id": tenant_id, "name": tenant.name, "domain": tenant.domain}
            )
            # Insert into api_keys with key_type="widget_public"
            conn.execute(
                text("INSERT INTO api_keys (key, tenant_id, key_type) VALUES (:key, :tenant_id, :key_type)"),
                {"key": widget_key, "tenant_id": tenant_id, "key_type": "widget_public"}
            )

        return {
            "success": True,
            "data": {
                "tenant_id": tenant_id,
                "widget_key": widget_key
            },
            "meta": {}
        }
    except Exception as e:
        logger.error(f"Tenant database insertion failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "error": {
                    "code": "DATABASE_ERROR",
                    "message": "Database write operation failed"
                }
            }
        )

@router.get("/config")
async def get_tenant_config(x_widget_key: str = Header(..., alias="X-Widget-Key")):
    """
    Looks up a tenant config by their public X-Widget-Key header.
    Accessible publicly by the embeddable chat widget.
    """
    if not engine:
        logger.warning("DATABASE_URL is not set. Returning mock tenant config.")
        return {
            "success": True,
            "data": {
                "theme": {"primary_color": "#2563eb"},
                "limits": {"max_tokens": 1000}
            },
            "meta": {
                "warning": "DATABASE_URL is not set. Returned default theme config."
            }
        }

    try:
        with engine.connect() as conn:
            # 1. Look up tenant ID by public widget key
            result = conn.execute(
                text("""
                    SELECT tenant_id FROM api_keys 
                    WHERE key = :key AND key_type = 'widget_public'
                """),
                {"key": x_widget_key}
            ).fetchone()

            if not result:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail={
                        "success": False,
                        "error": {
                            "code": "NOT_FOUND",
                            "message": "Tenant not found or invalid widget key"
                        }
                    }
                )

            tenant_id = result[0]

            # 2. Look up tenant config
            config_result = conn.execute(
                text("SELECT config FROM tenant_configs WHERE tenant_id = :tenant_id"),
                {"tenant_id": tenant_id}
            ).fetchone()

            if config_result:
                import json
                config_data = config_result[0]
                if isinstance(config_data, str):
                    config_data = json.loads(config_data)
            else:
                # Return standard default configs if tenant doesn't have custom configs set
                config_data = {
                    "theme": {"primary_color": "#2563eb"},
                    "limits": {"max_tokens": 1000}
                }

            return {
                "success": True,
                "data": config_data,
                "meta": {}
            }
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Tenant config lookup failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "error": {
                    "code": "DATABASE_ERROR",
                    "message": "Database query operation failed"
                }
            }
        )
