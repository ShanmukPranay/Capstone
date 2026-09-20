from fastapi import APIRouter, HTTPException

from schemas.requests import ChatSessionCreate, ChatMessageRequest, ChatFeedback
from services.supabase_client import supabase_admin
from models.embeddings import EmbeddingService
from models.llm_handler import LLMHandler

router = APIRouter(prefix="/api/chat", tags=["chat"])

embedder = EmbeddingService()
llm = LLMHandler()


@router.post("/sessions")
async def create_session(payload: ChatSessionCreate):
    res = supabase_admin.table("chat_sessions").insert({
        "user_id": payload.user_id,
        "document_id": payload.document_id,
        "title": payload.title,
        "session_type": payload.session_type,
    }).execute()
    return {"status": "success", "session": res.data[0]}


@router.get("/sessions/{user_id}")
async def list_sessions(user_id: str):
    res = (supabase_admin.table("chat_sessions")
           .select("*")
           .eq("user_id", user_id)
           .eq("is_archived", False)
           .order("last_message_at", desc=True)
           .execute())
    return {"status": "success", "sessions": res.data}


@router.get("/sessions/{session_id}/messages")
async def get_messages(session_id: str):
    res = (supabase_admin.table("chat_messages")
           .select("*")
           .eq("session_id", session_id)
           .order("created_at", desc=False)
           .execute())
    return {"status": "success", "messages": res.data}


@router.delete("/sessions/{session_id}")
async def archive_session(session_id: str):
    supabase_admin.table("chat_sessions").update({"is_archived": True}).eq("id", session_id).execute()
    return {"status": "success"}


@router.post("/message")
async def send_message(payload: ChatMessageRequest):
    try:
        supabase_admin.table("chat_messages").insert({
            "session_id": payload.session_id,
            "role": "user",
            "content": payload.message,
        }).execute()

        retrieved, context_texts, citations = [], [], []
        if payload.use_rag:
            q_emb = embedder.encode(payload.message)
            params = {
                "query_embedding": q_emb,
                "match_threshold": 0.3,
                "match_count": payload.top_k,
            }
            if payload.document_id:
                params["p_document_id"] = payload.document_id

            r = supabase_admin.rpc("match_chunks", params).execute()
            retrieved = r.data or []
            context_texts = [x["text"] for x in retrieved]
            citations = [{
                "chunk_id": x["id"],
                "document_id": x["document_id"],
                "chunk_index": x["chunk_index"],
                "excerpt": x["text"][:300],
                "similarity": round(x["similarity"], 3),
            } for x in retrieved]

        answer = llm.generate_response(payload.message, context_texts)

        res = supabase_admin.table("chat_messages").insert({
            "session_id": payload.session_id,
            "role": "assistant",
            "content": answer["text"],
            "retrieved_chunk_ids": [x["id"] for x in retrieved],
            "citations": citations,
            "model_used": answer["model"],
            "confidence": 85,
        }).execute()

        return {"status": "success", "message": res.data[0], "citations": citations}
    except Exception as e:
        raise HTTPException(500, str(e))


@router.post("/feedback")
async def feedback(payload: ChatFeedback):
    supabase_admin.table("chat_messages").update({"feedback": payload.feedback}).eq("id", payload.message_id).execute()
    return {"status": "success"}
