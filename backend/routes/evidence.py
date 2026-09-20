from fastapi import APIRouter, HTTPException
from services.supabase_client import supabase_admin

router = APIRouter(prefix="/api/evidence", tags=["evidence"])


@router.get("/all")
async def get_all_evidence(user_id: str = "default-user", limit: int = 50):
    """
    Get all evidence citations from a user's chat history.
    Returns messages that have citations attached.
    """
    try:
        # Get user's sessions
        sessions_res = (supabase_admin.table("chat_sessions")
                        .select("id")
                        .eq("user_id", user_id)
                        .execute())
        session_ids = [s["id"] for s in (sessions_res.data or [])]

        if not session_ids:
            return {"status": "success", "evidence": [], "total": 0}

        # Get messages with citations
        messages_res = (supabase_admin.table("chat_messages")
                        .select("id, session_id, role, content, citations, model_used, confidence, created_at")
                        .in_("session_id", session_ids)
                        .eq("role", "assistant")
                        .order("created_at", desc=True)
                        .limit(limit)
                        .execute())

        messages = messages_res.data or []

        # Build evidence list
        evidence_items = []
        for msg in messages:
            citations = msg.get("citations") or []
            if not citations:
                continue
            for cit in citations:
                evidence_items.append({
                    "id": cit.get("chunk_id", msg["id"]),
                    "query_session_id": msg["session_id"],
                    "message_id": msg["id"],
                    "answer": msg["content"],
                    "chunk_id": cit.get("chunk_id"),
                    "document_id": cit.get("document_id"),
                    "chunk_index": cit.get("chunk_index"),
                    "excerpt": cit.get("excerpt", ""),
                    "similarity": cit.get("similarity", 0),
                    "confidence": msg.get("confidence", 0),
                    "model_used": msg.get("model_used"),
                    "created_at": msg["created_at"],
                })

        return {
            "status": "success",
            "evidence": evidence_items,
            "total": len(evidence_items),
        }
    except Exception as e:
        raise HTTPException(500, str(e))


@router.get("/document/{document_id}")
async def get_document_evidence(document_id: str):
    """Get all evidence for a specific document."""
    try:
        messages_res = (supabase_admin.table("chat_messages")
                        .select("id, session_id, content, citations, model_used, confidence, created_at")
                        .eq("role", "assistant")
                        .order("created_at", desc=True)
                        .limit(200)
                        .execute())

        messages = messages_res.data or []
        evidence_items = []

        for msg in messages:
            citations = msg.get("citations") or []
            for cit in citations:
                if cit.get("document_id") == document_id:
                    evidence_items.append({
                        "message_id": msg["id"],
                        "answer": msg["content"],
                        "chunk_id": cit.get("chunk_id"),
                        "chunk_index": cit.get("chunk_index"),
                        "excerpt": cit.get("excerpt", ""),
                        "similarity": cit.get("similarity", 0),
                        "confidence": msg.get("confidence", 0),
                        "created_at": msg["created_at"],
                    })

        return {
            "status": "success",
            "document_id": document_id,
            "evidence": evidence_items,
            "total": len(evidence_items),
        }
    except Exception as e:
        raise HTTPException(500, str(e))