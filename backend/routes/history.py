from fastapi import APIRouter, HTTPException
from services.supabase_client import supabase_admin
from typing import List, Dict, Any
from datetime import datetime

router = APIRouter(prefix="/api/history", tags=["history"])


def _safe_date(val: str) -> str:
    if not val:
        return datetime.utcnow().isoformat()
    return val


@router.get("/all")
async def get_history(user_id: str = "default-user", limit: int = 100):
    """
    Build a timeline of activity from documents, chats, risks, and reviews.
    """
    try:
        events: List[Dict[str, Any]] = []

        # -------- 1. Document uploads --------
        docs_res = supabase_admin.table("documents").select("id, name, status, created_at, total_chunks").eq("user_id", user_id).execute()
        docs = docs_res.data or []
        doc_map = {d["id"]: d.get("name", "Unknown") for d in docs}

        for d in docs:
            events.append({
                "id": f"doc-{d['id']}",
                "type": "document_uploaded",
                "title": f"Uploaded document: {d.get('name')}",
                "description": f"{d.get('total_chunks', 0)} chunks indexed",
                "timestamp": _safe_date(d.get("created_at")),
                "entity_id": d["id"],
                "icon": "file",
                "color": "#6366f1",
            })

            if d.get("status") == "analyzed":
                events.append({
                    "id": f"analyzed-{d['id']}",
                    "type": "document_analyzed",
                    "title": f"Analyzed document: {d.get('name')}",
                    "description": "LLM extracted clauses, parties, and risks",
                    "timestamp": _safe_date(d.get("updated_at") or d.get("created_at")),
                    "entity_id": d["id"],
                    "icon": "brain",
                    "color": "#8b5cf6",
                })

        # -------- 2. Chat sessions & messages --------
        sess_res = supabase_admin.table("chat_sessions").select("id, created_at").eq("user_id", user_id).execute()
        sessions = sess_res.data or []
        session_ids = [s["id"] for s in sessions]

        if session_ids:
            msgs_res = (supabase_admin.table("chat_messages")
                        .select("id, session_id, role, content, model_used, citations, created_at")
                        .in_("session_id", session_ids)
                        .order("created_at", desc=False)
                        .limit(200)
                        .execute())
            msgs = msgs_res.data or []

            for m in msgs:
                if m["role"] == "user":
                    events.append({
                        "id": f"query-{m['id']}",
                        "type": "query_asked",
                        "title": f"Asked: {m['content'][:80]}{'...' if len(m['content']) > 80 else ''}",
                        "description": "Query submitted to legal AI",
                        "timestamp": _safe_date(m.get("created_at")),
                        "entity_id": m["session_id"],
                        "icon": "message",
                        "color": "#06b6d4",
                    })
                elif m["role"] == "assistant":
                    model = m.get("model_used") or "unknown"
                    is_real = model != "mock"
                    events.append({
                        "id": f"answer-{m['id']}",
                        "type": "ai_answered",
                        "title": f"AI answered using {model}",
                        "description": f"{len(m.get('citations') or [])} citation(s) attached",
                        "timestamp": _safe_date(m.get("created_at")),
                        "entity_id": m["session_id"],
                        "icon": "sparkles",
                        "color": "#22c55e" if is_real else "#f59e0b",
                    })

        # -------- 3. Risks detected --------
        if docs:
            doc_ids = list(doc_map.keys())
            risks_res = (supabase_admin.table("risks")
                         .select("id, document_id, risk, severity, created_at")
                         .in_("document_id", doc_ids)
                         .execute())
            risks = risks_res.data or []

            for r in risks:
                events.append({
                    "id": f"risk-{r['id']}",
                    "type": "risk_detected",
                    "title": f"Risk detected: {(r.get('risk') or '')[:80]}",
                    "description": f"Severity: {r.get('severity', 'medium').upper()} · {doc_map.get(r['document_id'], '')}",
                    "timestamp": _safe_date(r.get("created_at")),
                    "entity_id": r["id"],
                    "icon": "alert",
                    "color": "#ef4444" if r.get("severity") == "high" else ("#f59e0b" if r.get("severity") == "medium" else "#22c55e"),
                })

        # -------- 4. Reviews --------
        rev_res = (supabase_admin.table("reviews")
                   .select("id, risk_id, status, reviewer_id, created_at, completed_at")
                   .eq("reviewer_id", user_id)
                   .execute())
        reviews = rev_res.data or []

        for rv in reviews:
            if rv.get("completed_at"):
                events.append({
                    "id": f"review-{rv['id']}",
                    "type": f"review_{rv['status']}",
                    "title": f"Risk review {rv['status'].replace('_', ' ')}",
                    "description": f"Reviewer decision recorded",
                    "timestamp": _safe_date(rv.get("completed_at")),
                    "entity_id": rv["id"],
                    "icon": "check" if rv["status"] == "approved" else ("x" if rv["status"] == "rejected" else "alert"),
                    "color": "#22c55e" if rv["status"] == "approved" else ("#ef4444" if rv["status"] == "rejected" else "#8b5cf6"),
                })

        # -------- Sort & limit --------
        events.sort(key=lambda e: e["timestamp"], reverse=True)
        events = events[:limit]

        # -------- Summary --------
        from collections import Counter
        type_counts = Counter(e["type"] for e in events)

        return {
            "status": "success",
            "events": events,
            "total": len(events),
            "summary": {
                "total_events": len(events),
                "documents": type_counts.get("document_uploaded", 0),
                "analyses": type_counts.get("document_analyzed", 0),
                "queries": type_counts.get("query_asked", 0),
                "ai_answers": type_counts.get("ai_answered", 0),
                "risks_detected": type_counts.get("risk_detected", 0),
                "reviews": sum(v for k, v in type_counts.items() if k.startswith("review_")),
            }
        }
    except Exception as e:
        raise HTTPException(500, str(e))