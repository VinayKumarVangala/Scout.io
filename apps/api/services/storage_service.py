# SETUP: In Supabase dashboard → Storage → New bucket
# Bucket name: scout-uploads
# Public: NO (keep private — files served only through signed URLs or service key)

from functools import lru_cache
import logging
from supabase import create_client

from config import get_settings

logger = logging.getLogger("scoutio.storage")

class StorageError(Exception):
    """Custom exception raised by StorageService operations."""
    pass

class StorageService:
    def __init__(self):
        settings = get_settings()
        self.supabase_url = settings.SUPABASE_URL
        self.supabase_key = settings.SUPABASE_SERVICE_KEY
        self.bucket = settings.SUPABASE_STORAGE_BUCKET or "scout-uploads"
        
        if not self.supabase_url or not self.supabase_key:
            logger.warning("Supabase credentials are not fully configured. StorageService operations will fail.")
            self.client = None
        else:
            try:
                self.client = create_client(self.supabase_url, self.supabase_key)
                logger.info("Supabase client successfully initialized in StorageService.")
            except Exception as e:
                logger.error(f"Failed to initialize Supabase client: {e}")
                self.client = None

    def upload_file(self, file_bytes: bytes, destination_path: str, content_type: str = "text/plain") -> str:
        """
        Uploads file_bytes to Supabase Storage at destination_path.
        Returns the destination_path on success.
        """
        if not self.client:
            raise StorageError("Upload failed: Supabase client is not initialized due to missing credentials.")
            
        try:
            self.client.storage.from_(self.bucket).upload(
                path=destination_path,
                file=file_bytes,
                file_options={"content-type": content_type}
            )
            logger.info(f"Successfully uploaded file to Supabase Storage: {destination_path}")
            return destination_path
        except Exception as e:
            logger.exception(f"Supabase storage upload failure for path {destination_path}:")
            raise StorageError(f"Upload failed: {str(e)}")

    def download_file(self, storage_path: str) -> bytes:
        """
        Downloads a file from Supabase Storage and returns the raw bytes.
        """
        if not self.client:
            raise StorageError("Download failed: Supabase client is not initialized due to missing credentials.")

        try:
            raw_bytes = self.client.storage.from_(self.bucket).download(storage_path)
            logger.info(f"Successfully downloaded file from Supabase Storage: {storage_path}")
            return raw_bytes
        except Exception as e:
            logger.exception(f"Supabase storage download failure for path {storage_path}:")
            raise StorageError(f"Download failed: {str(e)}")

    def delete_file(self, storage_path: str) -> None:
        """
        Deletes a file from Supabase Storage (best-effort cleanup).
        """
        if not self.client:
            logger.warning("Delete operation skipped: Supabase client is not initialized.")
            return

        try:
            self.client.storage.from_(self.bucket).remove([storage_path])
            logger.info(f"Successfully deleted file from Supabase Storage: {storage_path}")
        except Exception as e:
            logger.warning(f"Delete file best-effort warning for {storage_path}: {e}")

    def get_content_type(self, filename: str) -> str:
        """
        Resolves the appropriate MIME content-type based on file extension.
        """
        filename_lower = filename.lower()
        if filename_lower.endswith(".md"):
            return "text/markdown"
        elif filename_lower.endswith(".txt"):
            return "text/plain"
        return "application/octet-stream"

@lru_cache()
def get_storage_service() -> StorageService:
    """Returns a cached StorageService singleton instance."""
    return StorageService()
