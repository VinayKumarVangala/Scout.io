from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    session_id: str = Field(..., description="The unique session identifier for the chat")
    message: str = Field(..., max_length=2000, description="The chat message input")
    metadata: dict = Field(default_factory=dict, description="Optional metadata parameters")
