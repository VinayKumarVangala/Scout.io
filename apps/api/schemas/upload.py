from pydantic import BaseModel

class UploadResponseData(BaseModel):
    document_id: str
    status: str

class UploadStatusResponseData(BaseModel):
    status: str
