import uuid
import logging
from fastapi import APIRouter, Depends, UploadFile, File, Form, Header, HTTPException, status
from sqlalchemy import create_engine, text

from config import get_settings
from services.storage_service import get_storage_service

router = APIRouter()
settings = get_settings()
logger = logging.getLogger("scoutio.upload")

# Initialize database engine
engine = None
if settings.DATABASE_URL:
    engine = create_engine(settings.DATABASE_URL)

# In-memory session tracking for mocked testing and demonstration
in_memory_uploads = {}

async def verify_admin_widget_key(x_widget_key: str = Header(..., alias="X-Widget-Key")):
    """
    Validation dependency verifying that the request provides the Admin Secret Key
    inside the X-Widget-Key header.
    """
    if x_widget_key != settings.ADMIN_SECRET_KEY:
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

@router.post("")
async def upload_file(
    file: UploadFile = File(...),
    tenant_id: str = Form(...),
    _ = Depends(verify_admin_widget_key)
):
    """
    Uploads a knowledge source file (.txt or .md) for ingestion.
    Validates file sizes (<5MB) and formats. Saves to Supabase and triggers N8N.
    """
    # 1. Validation checks
    if not tenant_id or not tenant_id.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "error": {
                    "code": "BAD_REQUEST",
                    "message": "tenant_id cannot be empty"
                }
            }
        )

    filename = file.filename or ""
    if not (filename.endswith(".md") or filename.endswith(".txt")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "error": {
                    "code": "UNSUPPORTED_FILE",
                    "message": "Only .md and .txt files are supported"
                }
            }
        )

    # Safe file size validation (<= 5MB)
    try:
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)
    except Exception as e:
        logger.error(f"Error checking file size: {e}")
        file_size = 0

    if file_size > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "error": {
                    "code": "FILE_TOO_LARGE",
                    "message": "File size exceeds 5MB limit"
                }
            }
        )

    # 2. Generate document_id
    document_id = str(uuid.uuid4())

    try:
        content = await file.read()
        
        # 3. Call storage_service.upload_file()
        storage_service = get_storage_service()
        destination_path = f"{tenant_id}/{document_id}/{filename}"
        content_type = storage_service.get_content_type(filename)
        
        storage_path = storage_service.upload_file(
            file_bytes=content,
            destination_path=destination_path,
            content_type=content_type
        )

        # 4. Insert into database
        if engine:
            try:
                with engine.begin() as conn:
                    conn.execute(
                        text("""
                            INSERT INTO uploads (id, tenant_id, filename, storage_path, status)
                            VALUES (:id, :tenant_id, :filename, :storage_path, :status)
                        """),
                        {
                            "id": document_id,
                            "tenant_id": tenant_id,
                            "filename": filename,
                            "storage_path": storage_path,
                            "status": "uploaded"
                        }
                    )
            except Exception as db_err:
                logger.error(f"Database insertion failed for uploads table: {db_err}")
        
        # Cache in local memory for continuous local testing
        in_memory_uploads[document_id] = {
            "tenant_id": tenant_id,
            "filename": filename,
            "storage_path": storage_path,
            "status": "processing"  # API returns processing as the pipeline starts
        }

        # 5. Trigger N8N webhook (Stubbed logic logger)
        logger.info(f"N8N trigger: {document_id}")

        # 6. Return response
        return {
            "success": True,
            "data": {
                "document_id": document_id,
                "status": "processing"
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload process failed internally: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "error": {
                    "code": "UPLOAD_FAILED",
                    "message": "Failed to complete upload workflow"
                }
            }
        )

@router.get("/status/{document_id}")
async def get_upload_status(
    document_id: str,
    _ = Depends(verify_admin_widget_key)
):
    """
    Queries the ingestion sync status of a document.
    """
    status_val = None

    # Check database status
    if engine:
        try:
            with engine.connect() as conn:
                result = conn.execute(
                    text("SELECT status FROM uploads WHERE id = :id"),
                    {"id": document_id}
                ).fetchone()
                if result:
                    status_val = result[0]
        except Exception as e:
            logger.error(f"Database lookup failed for upload status: {e}")

    # Fallback to check local session cache
    if not status_val and document_id in in_memory_uploads:
        status_val = in_memory_uploads[document_id]["status"]

    if not status_val:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "success": False,
                "error": {
                    "code": "NOT_FOUND",
                    "message": "Document not found"
                }
            }
        )

    return {
        "success": True,
        "data": {
            "status": status_val
        }
    }
