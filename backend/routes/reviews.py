from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from services.supabase_client import supabase_admin
from collections import Counter

router = APIRouter(prefix="/api/reviews", tags=["reviews"])


class ReviewCreate(BaseModel):
    risk_id: str
    document_id: str
    reviewer_id: Optional[str] = "default-user"
    priority: Optional[str] = "normal"


class ReviewUpdate(BaseModel):
    status: str
    decision: Optional[str] = None
    comments: Optional[str] = None


@router.get("/all")
async def list_reviews(user_id: str = "default-user"):
    try:
        reviews_res = (supabase_admin.table("reviews")
                       .select("*")
                       .eq("reviewer_id", user_id)
                       .order("created_at", desc=True)
                       .execute())
        reviews = reviews_res.data or []

        risk_ids = [r["risk_id"] for r in reviews if r.get("risk_id")]
        risks_by_id = {}
        if risk_ids:
            risks_res = supabase_admin.table("risks").select("*").in_("id", risk_ids).execute()
            risks_by_id = {r["id"]: r for r in (risks_res.data or [])}

        doc_ids = list({r["document_id"] for r in reviews if r.get("document_id")})
        docs_by_id = {}
        if doc_ids:
            docs_res = supabase_admin.table("documents").select("id, name").in_("id", doc_ids).execute()
            docs_by_id = {d["id"]: d["name"] for d in (docs_res.data or [])}

        for r in reviews:
            risk = risks_by_id.get(r.get("risk_id"), {})
            r["risk"] = risk.get("risk")
            r["severity"] = risk.get("severity")
            r["evidence"] = risk.get("evidence")
            r["document_name"] = docs_by_id.get(r.get("document_id"), "Unknown")

        status_counts = Counter(r.get("status", "pending") for r in reviews)

        return {
            "status": "success",
            "reviews": reviews,
            "summary": {
                "total": len(reviews),
                "pending": status_counts.get("pending", 0),
                "approved": status_counts.get("approved", 0),
                "rejected": status_counts.get("rejected", 0),
                "needs_changes": status_counts.get("needs_changes", 0),
            },
        }
    except Exception as e:
        raise HTTPException(500, str(e))


@router.post("/assign")
async def assign_review(payload: ReviewCreate):
    try:
        existing = (supabase_admin.table("reviews")
                    .select("id")
                    .eq("risk_id", payload.risk_id)
                    .eq("reviewer_id", payload.reviewer_id)
                    .execute())
        if existing.data:
            return {"status": "already_assigned", "review": existing.data[0]}

        res = supabase_admin.table("reviews").insert({
            "risk_id": payload.risk_id,
            "document_id": payload.document_id,
            "reviewer_id": payload.reviewer_id,
            "priority": payload.priority,
            "status": "pending",
        }).execute()
        return {"status": "success", "review": res.data[0]}
    except Exception as e:
        raise HTTPException(500, str(e))


@router.post("/assign-all")
async def assign_all_unreviewed(user_id: str = "default-user"):
    try:
        docs_res = supabase_admin.table("documents").select("id").eq("user_id", user_id).execute()
        doc_ids = [d["id"] for d in (docs_res.data or [])]
        if not doc_ids:
            return {"status": "success", "assigned": 0}

        risks_res = supabase_admin.table("risks").select("id, document_id").in_("document_id", doc_ids).execute()
        risks = risks_res.data or []

        existing = supabase_admin.table("reviews").select("risk_id").eq("reviewer_id", user_id).execute()
        reviewed_ids = {r["risk_id"] for r in (existing.data or [])}

        new_rows = [
            {
                "risk_id": r["id"],
                "document_id": r["document_id"],
                "reviewer_id": user_id,
                "status": "pending",
                "priority": "normal",
            }
            for r in risks if r["id"] not in reviewed_ids
        ]

        if new_rows:
            supabase_admin.table("reviews").insert(new_rows).execute()

        return {"status": "success", "assigned": len(new_rows)}
    except Exception as e:
        raise HTTPException(500, str(e))


@router.patch("/{review_id}")
async def update_review(review_id: str, payload: ReviewUpdate):
    try:
        update_data = {
            "status": payload.status,
            "decision": payload.decision,
            "comments": payload.comments,
        }
        if payload.status in ("approved", "rejected", "needs_changes"):
            update_data["completed_at"] = datetime.utcnow().isoformat()

        res = supabase_admin.table("reviews").update(update_data).eq("id", review_id).execute()
        if not res.data:
            raise HTTPException(404, "Review not found")
        return {"status": "success", "review": res.data[0]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))