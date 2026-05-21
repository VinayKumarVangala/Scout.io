from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse

STATUS_CODE_MAPPING = {
    401: "UNAUTHORIZED",
    404: "NOT_FOUND",
    422: "INVALID_REQUEST",
    429: "RATE_LIMIT_EXCEEDED",
    500: "INTERNAL_SERVER_ERROR"
}

async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Global exception handler for HTTPException.
    Translates HTTP status codes to Scout.io standard error format.
    """
    # If the detail dict already matches our target format, return it unmodified
    if isinstance(exc.detail, dict) and "success" in exc.detail and "error" in exc.detail:
        return JSONResponse(status_code=exc.status_code, content=exc.detail)

    error_code = STATUS_CODE_MAPPING.get(exc.status_code, "BAD_REQUEST")
    
    # Handle dict details if custom Starlette structures slip in
    message = exc.detail
    if isinstance(message, dict):
        if "message" in message:
            message = message["message"]
        else:
            message = str(message)

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": error_code,
                "message": message
            }
        }
    )
