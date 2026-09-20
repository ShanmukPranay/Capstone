from fastapi import APIRouter, HTTPException
from services.supabase_client import supabase_admin
from datetime import datetime, timedelta
from collections import defaultdict

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/overview")
async def analytics_overview(user_id: str = "default-user"):
    """
    Compute analytics for the dashboard from real data.
    """
    try:
        # --- Documents ---
        docs_res = supabase_admin.table("documents").select("*").eq("user_id", user_id).execute()
        docs = docs_res.data or []

        total_docs = len(docs)
        analyzed_docs = sum(1 for d in docs if d.get("status") == "analyzed")
        total_chunks = sum((d.get("total_chunks") or 0) for d in docs)

        # --- Chat sessions & messages ---
        sessions_res = supabase_admin.table("chat_sessions").select("id").eq("user_id", user_id).execute()
        session_ids = [s["id"] for s in (sessions_res.data or [])]

        messages = []
        if session_ids:
            msgs_res = (supabase_admin.table("chat_messages")
                        .select("id, session_id, role, content, citations, model_used, confidence, created_at")
                        .in_("session_id", session_ids)
                        .order("created_at", desc=False)
                        .execute())
            messages = msgs_res.data or []

        user_msgs = [m for m in messages if m["role"] == "user"]
        assistant_msgs = [m for m in messages if m["role"] == "assistant"]

        total_citations = sum(len(m.get("citations") or []) for m in assistant_msgs)
        real_llm_msgs = [m for m in assistant_msgs if m.get("model_used") and m["model_used"] != "mock"]

        # --- Documents per month (last 6 months) ---
        docs_per_month = defaultdict(int)
        analyzed_per_month = defaultdict(int)
        six_months_ago = datetime.utcnow() - timedelta(days=180)

        for d in docs:
            created_str = d.get("created_at")
            if not created_str:
                continue
            try:
                created = datetime.fromisoformat(created_str.replace("Z", "+00:00").replace("+00:00", ""))
                if created >= six_months_ago:
                    month_key = created.strftime("%b")
                    docs_per_month[month_key] += 1
                    if d.get("status") == "analyzed":
                        analyzed_per_month[month_key] += 1
            except Exception:
                pass

        # Fill missing months in order
        month_order = []
        now = datetime.utcnow()
        for i in range(5, -1, -1):
            m = now - timedelta(days=30 * i)
            month_order.append(m.strftime("%b"))

        monthly_trend = [
            {
                "month": m,
                "documents": docs_per_month.get(m, 0),
                "analyzed": analyzed_per_month.get(m, 0),
            }
            for m in month_order
        ]

        # --- Documents by type ---
        docs_by_type = defaultdict(int)
        for d in docs:
            t = d.get("document_type") or "legal"
            docs_by_type[t] += 1
        type_distribution = [{"name": k, "value": v} for k, v in docs_by_type.items()]

        # --- Model usage ---
        model_usage = defaultdict(int)
        for m in assistant_msgs:
            model = m.get("model_used") or "unknown"
            model_usage[model] += 1
        model_distribution = [
            {"name": "Real LLM" if k != "mock" else "Mock", "value": v, "model": k}
            for k, v in model_usage.items()
        ]

        # --- Recent queries ---
        recent_queries = []
        for m in reversed(user_msgs[-10:]):
            recent_queries.append({
                "id": m["id"],
                "content": m["content"],
                "created_at": m["created_at"],
            })

        # --- Top documents by chunks ---
        top_docs = sorted(docs, key=lambda d: d.get("total_chunks") or 0, reverse=True)[:5]
        top_documents = [
            {
                "id": d["id"],
                "name": d["name"],
                "chunks": d.get("total_chunks") or 0,
                "status": d.get("status"),
            }
            for d in top_docs
        ]

        return {
            "status": "success",
            "summary": {
                "total_documents": total_docs,
                "analyzed_documents": analyzed_docs,
                "total_chunks": total_chunks,
                "total_chat_sessions": len(session_ids),
                "total_user_queries": len(user_msgs),
                "total_ai_answers": len(assistant_msgs),
                "total_citations": total_citations,
                "real_llm_answers": len(real_llm_msgs),
                "avg_confidence": round(
                    sum((m.get("confidence") or 0) for m in assistant_msgs) / len(assistant_msgs), 1
                ) if assistant_msgs else 0,
            },
            "monthly_trend": monthly_trend,
            "type_distribution": type_distribution,
            "model_distribution": model_distribution,
            "recent_queries": recent_queries,
            "top_documents": top_documents,
        }
    except Exception as e:
        raise HTTPException(500, str(e))