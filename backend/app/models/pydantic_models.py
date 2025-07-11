from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    fileName: str | None = None

class FileDeleteRequest(BaseModel):
    filename: str