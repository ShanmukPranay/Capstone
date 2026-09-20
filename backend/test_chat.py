from services.supabase_client import supabase_admin
from models.embeddings import EmbeddingService
from models.llm_handler import LLMHandler

sess = supabase_admin.table("chat_sessions").insert({
    "user_id": "default-user",
    "title": "Test Chat",
    "session_type": "general",
}).execute()

session_id = sess.data[0]["id"]
print("Session ID:", session_id)

supabase_admin.table("chat_messages").insert({
    "session_id": session_id,
    "role": "user",
    "content": "What is the notice period?",
}).execute()
print("User message saved")

embedder = EmbeddingService()
q_emb = embedder.encode("What is the notice period?")
results = supabase_admin.rpc("match_chunks", {
    "query_embedding": q_emb,
    "match_threshold": 0.1,
    "match_count": 5,
}).execute()

context = [r["text"] for r in results.data]

llm = LLMHandler()
answer = llm.generate_response("What is the notice period?", context)

msg = supabase_admin.table("chat_messages").insert({
    "session_id": session_id,
    "role": "assistant",
    "content": answer["text"],
    "model_used": answer["model"],
    "confidence": 85,
}).execute()

print("\nAssistant:", answer["text"][:200])
print("\nSUCCESS! Chat session created:", session_id)
