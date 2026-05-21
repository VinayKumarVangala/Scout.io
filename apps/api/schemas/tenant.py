from pydantic import BaseModel, Field

class TenantCreateRequest(BaseModel):
    name: str = Field(..., max_length=255, description="The name of the tenant")
    domain: str | None = Field(None, description="Optional custom domain for the tenant")
