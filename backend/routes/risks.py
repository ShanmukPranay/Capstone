from fastapi import APIRouter, HTTPException
from services.supabase_client import supabase_admin
from collections import Counter

router = APIRouter(prefix="/api/risks", tags=["risks"])


@router.get("/all")
async def get_all_risks(user_id: str = "default-user"):
    """Get all risks across all user documents."""
    try:
        docs_res = supabase_admin.table("documents").select("id, name").eq("user_id", user_id).execute()
        docs = docs_res.data or []
        doc_map = {d["id"]: d["name"] for d in docs}
        doc_ids = list(doc_map.keys())

        if not doc_ids:
            return {
                "status": "success",
                "risks": [],
                "summary": {"total": 0, "high": 0, "medium": 0, "low": 0, "resolved": 0},
                "by_severity": [],
                "by_category": [],
            }

        risks_res = (supabase_admin.table("risks")
                     .select("*")
                     .in_("document_id", doc_ids)
                     .order("created_at", desc=True)
                     .execute())
        risks = risks_res.data or []

        for r in risks:
            r["document_name"] = doc_map.get(r.get("document_id"), "Unknown")

        severity_counts = Counter(r.get("severity", "medium") for r in risks)
        category_counts = Counter(r.get("category", "general") for r in risks)

        return {
            "status": "success",
            "risks": risks,
            "summary": {
                "total": len(risks),
                "high": severity_counts.get("high", 0),
                "medium": severity_counts.get("medium", 0),
                "low": severity_counts.get("low", 0),
                "resolved": sum(1 for r in risks if r.get("is_resolved")),
            },
            "by_severity": [
                {"name": "High", "value": severity_counts.get("high", 0), "color": "#ef4444"},
                {"name": "Medium", "value": severity_counts.get("medium", 0), "color": "#f59e0b"},
                {"name": "Low", "value": severity_counts.get("low", 0), "color": "#22c55e"},
            ],
            "by_category": [{"name": k, "value": v} for k, v in category_counts.items()],
        }
    except Exception as e:
        raise HTTPException(500, str(e))


@router.patch("/{risk_id}/resolve")
async def resolve_risk(risk_id: str):
    """Mark a risk as resolved."""
    try:
        from datetime import datetime
        supabase_admin.table("risks").update({
            "is_resolved": True,
            "resolved_at": datetime.utcnow().isoformat(),
        }).eq("id", risk_id).execute()
        return {"status": "success", "risk_id": risk_id}
    except Exception as e:
        raise HTTPException(500, str(e))