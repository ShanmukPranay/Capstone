from supabase import create_client, Client
from config import SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise RuntimeError("Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
supabase_admin: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
