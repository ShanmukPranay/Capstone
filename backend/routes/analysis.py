from fastapi import APIRouter

from services.supabase_client import supabase_admin
from models.llm_handler import LLMHandler

router = APIRouter(prefix="/api/analyze", tags=["analysis"])

llm = LLMHandler()


@router.post("/{document_id}")
async def analyze_document(document_id: str):
    chunks = (supabase_admin.table("document_chunks")
              .select("text")
              .eq("document_id", document_id)
              .limit(5)
              .execute()).data

    combined = " ".join(c["text"] for c in chunks)
    entities = llm.extract_legal_entities(combined)

    return {
        "status": "success",
        "document_id": document_id,
        "total_chunks": len(chunks),
        "extracted": entities,
    }
