import uuid
import logging
from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy import create_engine, text

from config import get_settings
from schemas.chat import ChatRequest

router = APIRouter()
settings = get_settings()
logger = logging.getLogger("scoutio.chat")

# Initialize database engine
engine = None
if settings.DATABASE_URL:
    engine = create_engine(settings.DATABASE_URL)

# In-memory mock session and thread cache for developer onboarding
in_memory_sessions = set()
in_memory_messages = []

@router.post("")
async def chat_interaction(
    chat_req: ChatRequest,
    x_widget_key: str = Header(..., alias="X-Widget-Key")
):
    """
    Core Chat API endpoint allowing embedded widgets to send questions.
    Queries relevant context and feeds answers back transactionally.
    """
    
    # PHASE 7 NOTE: Inject Rate Limiting Middleware/Checks Here.
    # E.g. check_rate_limit(x_widget_key, rate_limit_rules)
    
    # 1. Validation checks
    if not chat_req.message or not chat_req.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "error": {
                    "code": "INVALID_REQUEST",
                    "message": "Message cannot be empty"
                }
            }
        )

    if len(chat_req.message) > 2000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "error": {
                    "code": "INVALID_REQUEST",
                    "message": "Message exceeds 2000 characters limit"
                }
            }
        )

    tenant_id = None

    # 2. Resolve X-Widget-Key to tenant_id
    if engine:
        try:
            with engine.connect() as conn:
                result = conn.execute(
                    text("""
                        SELECT tenant_id FROM api_keys 
                        WHERE key = :key AND key_type = 'widget_public'
                    """),
                    {"key": x_widget_key}
                ).fetchone()

                if result:
                    tenant_id = result[0]
        except Exception as e:
            logger.error(f"Failed to lookup tenant widget key in database: {e}")
    else:
        # DB not configured mock fallback
        logger.warning("DATABASE_URL is not set. Allowing demo widget key.")
        tenant_id = "demo_tenant"

    if not tenant_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "success": False,
                "error": {
                    "code": "TENANT_NOT_FOUND",
                    "message": "Tenant not found or invalid widget key"
                }
            }
        )

    try:
        # 3. Create or retrieve chat session
        if engine:
            with engine.begin() as conn:
                session_result = conn.execute(
                    text("SELECT id FROM chat_sessions WHERE id = :id AND tenant_id = :tenant_id"),
                    {"id": chat_req.session_id, "tenant_id": tenant_id}
                ).fetchone()

                if not session_result:
                    conn.execute(
                        text("INSERT INTO chat_sessions (id, tenant_id) VALUES (:id, :tenant_id)"),
                        {"id": chat_req.session_id, "tenant_id": tenant_id}
                    )
        else:
            in_memory_sessions.add(chat_req.session_id)

        # 4. Insert user message (role="user")
        user_msg_id = str(uuid.uuid4())
        if engine:
            with engine.begin() as conn:
                conn.execute(
                    text("""
                        INSERT INTO chat_messages (id, session_id, role, content) 
                        VALUES (:id, :session_id, :role, :content)
                    """),
                    {
                        "id": user_msg_id,
                        "session_id": chat_req.session_id,
                        "role": "user",
                        "content": chat_req.message
                    }
                )
        else:
            in_memory_messages.append({
                "id": user_msg_id,
                "session_id": chat_req.session_id,
                "role": "user",
                "content": chat_req.message
            })

        # 5. [STUB] RAG retrieval
        retrieved_chunks = []
        logger.info(f"RAG retrieval query: {chat_req.message} - Stub status: {len(retrieved_chunks)} chunks retrieved.")

        # 6. [STUB] LLM synthesis call
        response_text = "RAG and LLM not yet connected."
        logger.info(f"LLM synthesis call - Stub status: response generated successfully.")

        # 7. Insert assistant message (role="assistant")
        assistant_msg_id = str(uuid.uuid4())
        if engine:
            with engine.begin() as conn:
                conn.execute(
                    text("""
                        INSERT INTO chat_messages (id, session_id, role, content) 
                        VALUES (:id, :session_id, :role, :content)
                    """),
                    {
                        "id": assistant_msg_id,
                        "session_id": chat_req.session_id,
                        "role": "assistant",
                        "content": response_text
                    }
                )
        else:
            in_memory_messages.append({
                "id": assistant_msg_id,
                "session_id": chat_req.session_id,
                "role": "assistant",
                "content": response_text
            })

        # 8. Return response
        return {
            "success": True,
            "data": {
                "response": response_text,
                "sources": retrieved_chunks
            }
        }

    except Exception as process_err:
        logger.error(f"Chat processing failed: {process_err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "error": {
                    "code": "CHAT_PROCESSING_FAILED",
                    "message": "Unable to process request"
                }
            }
        )
