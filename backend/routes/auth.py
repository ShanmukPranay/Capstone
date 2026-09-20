from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from services.supabase_client import supabase_admin

router = APIRouter(prefix="/api/auth", tags=["auth"])


class SignupRequest(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None
    organization: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str


def _user_response(profile: dict) -> dict:
    return {
        "id": profile["id"],
        "email": profile["email"],
        "full_name": profile.get("full_name"),
        "role": profile.get("role"),
        "organization": profile.get("organization"),
        "avatar_url": profile.get("avatar_url"),
    }


@router.post("/signup")
async def signup(payload: SignupRequest):
    try:
        email = payload.email.lower().strip()
        
        existing = supabase_admin.table("profiles").select("id").eq("email", email).execute()
        if existing.data:
            raise HTTPException(400, "Email already registered")
        
        res = supabase_admin.table("profiles").insert({
            "email": email,
            "password_hash": payload.password,
            "full_name": payload.full_name or email.split("@")[0],
            "organization": payload.organization or "KLEF",
            "role": "reviewer",
        }).execute()
        
        if not res.data:
            raise HTTPException(500, "Could not create user")
        
        return {"status": "success", "user": _user_response(res.data[0])}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))


@router.post("/login")
async def login(payload: LoginRequest):
    try:
        email = payload.email.lower().strip()
        res = supabase_admin.table("profiles").select("*").eq("email", email).execute()
        
        if not res.data:
            raise HTTPException(401, "Invalid email or password")
        
        profile = res.data[0]
        if profile.get("password_hash") != payload.password:
            raise HTTPException(401, "Invalid email or password")
        
        if not profile.get("is_active", True):
            raise HTTPException(403, "Account is disabled")
        
        supabase_admin.table("profiles").update({
            "last_login_at": datetime.utcnow().isoformat()
        }).eq("id", profile["id"]).execute()
        
        return {"status": "success", "user": _user_response(profile)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))


@router.get("/me/{user_id}")
async def get_me(user_id: str):
    try:
        res = supabase_admin.table("profiles").select("*").eq("id", user_id).execute()
        if not res.data:
            raise HTTPException(404, "User not found")
        return {"status": "success", "user": _user_response(res.data[0])}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))


@router.get("/users")
async def list_users():
    try:
        res = supabase_admin.table("profiles").select("id, email, full_name, role, organization, is_active, last_login_at, created_at").order("created_at", desc=True).execute()
        return {"status": "success", "users": res.data or []}
    except Exception as e:
        raise HTTPException(500, str(e))