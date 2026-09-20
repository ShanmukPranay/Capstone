from fastapi import APIRouter, HTTPException
from services.supabase_client import supabase_admin
from typing import List, Dict, Any
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


def _safe_date(val):
    if not val:
        return datetime.utcnow().isoformat()
    return val


@router.get("/all")
async def get_notifications(user_id: str = "default-user", limit: int = 20):
    """
    Build notifications from recent activity:
    - Document uploads
    - Analysis completions
    - High-severity risk detections
    - Pending reviews
    """
    try:
        items: List[Dict[str, Any]] = []
        cutoff = (datetime.utcnow() - timedelta(days=7)).isoformat()

        # ---- Documents uploaded & analyzed ----
        docs_res = (supabase_admin.table("documents")
                    .select("id, name, status, created_at, updated_at, total_chunks")
                    .eq("user_id", user_id)
                    .order("created_at", desc=True)
                    .limit(20)
                    .execute())
        docs = docs_res.data or []
        doc_map = {d["id"]: d["name"] for d in docs}

        for d in docs:
            # Upload notification
            items.append({
                "id": f"upload-{d['id']}",
                "type": "document_uploaded",
                "title": "Document Uploaded",
                "message": f"{d.get('name')} has been uploaded successfully. Ready for analysis.",
                "timestamp": _safe_date(d.get("created_at")),
                "read": False,
                "severity": "info",
                "link": "/documents",
            })

            # Analysis complete
            if d.get("status") == "analyzed":
                items.append({
                    "id": f"analyzed-{d['id']}",
                    "type": "analysis_complete",
                    "title": "Analysis Complete",
                    "message": f"{d.get('name')} analysis is complete. {d.get('total_chunks', 0)} chunks extracted.",
                    "timestamp": _safe_date(d.get("updated_at") or d.get("created_at")),
                    "read": False,
                    "severity": "success",
                    "link": "/ai-analysis",
                })

        # ---- High/medium risks ----
        if doc_map:
            risks_res = (supabase_admin.table("risks")
                         .select("id, document_id, risk, severity, created_at")
                         .in_("document_id", list(doc_map.keys()))
                         .in_("severity", ["high", "medium"])
                         .order("created_at", desc=True)
                         .limit(20)
                         .execute())
            risks = risks_res.data or []
            for r in risks:
                sev = r.get("severity", "medium")
                items.append({
                    "id": f"risk-{r['id']}",
                    "type": "risk_detected",
                    "title": f"{sev.capitalize()} Risk Detected",
                    "message": f"{sev.capitalize()} risk in {doc_map.get(r['document_id'], 'document')}: {(r.get('risk') or '')[:100]}",
                    "timestamp": _safe_date(r.get("created_at")),
                    "read": False,
                    "severity": "danger" if sev == "high" else "warning",
                    "link": "/risk-analysis",
                })

        # ---- Pending reviews ----
        reviews_res = (supabase_admin.table("reviews")
                       .select("id, status, created_at")
                       .eq("reviewer_id", user_id)
                       .eq("status", "pending")
                       .order("created_at", desc=True)
                       .limit(10)
                       .execute())
        pending_count = len(reviews_res.data or [])

        if pending_count > 0:
            items.append({
                "id": f"pending-reviews-{pending_count}",
                "type": "review_pending",
                "title": "Reviews Pending",
                "message": f"{pending_count} risk review(s) waiting for your adjudication.",
                "timestamp": _safe_date(reviews_res.data[0].get("created_at")),
                "read": False,
                "severity": "info",
                "link": "/reviewer-adjudication",
            })

        # Sort descending
        items.sort(key=lambda x: x["timestamp"], reverse=True)
        items = items[:limit]

        unread = sum(1 for i in items if not i["read"])

        return {
            "status": "success",
            "notifications": items,
            "total": len(items),
            "unread": unread,
        }
    except Exception as e:
        raise HTTPException(500, str(e))