from functools import lru_cache
from dotenv import load_dotenv

# Explicitly load .env file
load_dotenv()

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
    class Settings(BaseSettings):
        model_config = SettingsConfigDict(
            env_file=".env",
            env_file_encoding="utf-8",
            extra="ignore"
        )
        DATABASE_URL: str | None = None
        QDRANT_URL: str | None = None
        QDRANT_API_KEY: str | None = None
        QDRANT_COLLECTION: str = "scoutio_knowledge"
        OPENAI_API_KEY: str | None = None
        SUPABASE_URL: str | None = None
        SUPABASE_SERVICE_KEY: str | None = None
        SUPABASE_STORAGE_BUCKET: str = "scout-uploads"
        ADMIN_SECRET_KEY: str | None = None
        ENVIRONMENT: str = "development"
        LOG_LEVEL: str = "INFO"
except ImportError:
    try:
        # Fallback to Pydantic v1 BaseSettings
        from pydantic.v1 import BaseSettings
    except ImportError:
        from pydantic import BaseSettings

    class Settings(BaseSettings):
        DATABASE_URL: str | None = None
        QDRANT_URL: str | None = None
        QDRANT_API_KEY: str | None = None
        QDRANT_COLLECTION: str = "scoutio_knowledge"
        OPENAI_API_KEY: str | None = None
        SUPABASE_URL: str | None = None
        SUPABASE_SERVICE_KEY: str | None = None
        SUPABASE_STORAGE_BUCKET: str = "scout-uploads"
        ADMIN_SECRET_KEY: str | None = None
        ENVIRONMENT: str = "development"
        LOG_LEVEL: str = "INFO"

        class Config:
            env_file = ".env"
            env_file_encoding = "utf-8"
            extra = "ignore"

@lru_cache()
def get_settings() -> Settings:
    """
    Returns a cached Settings instance.
    Loads settings from .env file and environment variables.
    """
    return Settings()
