from fastapi import APIRouter, HTTPException

from schemas.requests import RAGQuery
from services.supabase_client import supabase_admin
from models.embeddings import EmbeddingService
from models.llm_handler import LLMHandler

router = APIRouter(prefix="/api/rag", tags=["rag"])

embedder = EmbeddingService()
llm = LLMHandler()


@router.post("/search")
async def rag_search(req: RAGQuery):
    try:
        q_emb = embedder.encode(req.query)
        params = {
            "query_embedding": q_emb,
            "match_threshold": 0.3,
            "match_count": req.top_k,
        }
        if req.document_id:
            params["p_document_id"] = req.document_id

        response = supabase_admin.rpc("match_chunks", params).execute()
        results = response.data or []

        context = [r["text"] for r in results]
        answer = llm.generate_response(req.query, context)

        return {
            "status": "success",
            "query": req.query,
            "answer": answer["text"],
            "evidence": results,
            "confidence": 85,
        }
    except Exception as e:
        raise HTTPException(500, str(e))
