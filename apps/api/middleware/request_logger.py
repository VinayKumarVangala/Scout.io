import time
import json
import uuid
import logging
from fastapi import Request

logger = logging.getLogger("scoutio.request_logger")

async def request_logger_middleware(request: Request, call_next):
    """
    HTTP middleware logging incoming request and response statistics
    in a structured JSON format and appending the X-Request-ID header to the response.
    """
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    
    start_time = time.time()
    
    # Process the request downstream
    response = await call_next(request)
    
    # Calculate duration in ms
    duration_ms = int((time.time() - start_time) * 1000)
    
    # Add custom trace header
    response.headers["X-Request-ID"] = request_id
    
    # Log structured JSON at INFO level
    log_record = {
        "request_id": request_id,
        "method": request.method,
        "path": request.url.path,
        "status": response.status_code,
        "duration_ms": duration_ms
    }
    logger.info(json.dumps(log_record))
    
    return response
