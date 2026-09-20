from pydantic import BaseModel
from typing import Optional


class RAGQuery(BaseModel):
    query: str
    document_id: Optional[str] = None
    top_k: int = 5


class ChatSessionCreate(BaseModel):
    user_id: str
    document_id: Optional[str] = None
    title: Optional[str] = "New Chat"
    session_type: str = "general"


class ChatMessageRequest(BaseModel):
    session_id: str
    user_id: str
    message: str
    document_id: Optional[str] = None
    use_rag: bool = True
    top_k: int = 5


class ChatFeedback(BaseModel):
    message_id: str
    feedback: str
