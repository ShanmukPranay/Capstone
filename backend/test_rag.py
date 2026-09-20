from services.supabase_client import supabase_admin
from models.embeddings import EmbeddingService
from models.llm_handler import LLMHandler

query = "What is the notice period?"

# 1. Embed the query
embedder = EmbeddingService()
q_emb = embedder.encode(query)
print("Query:", query)
print("Embedding length:", len(q_emb))

# 2. Vector search via match_chunks RPC
print("\n--- Vector Search ---")
results = supabase_admin.rpc("match_chunks", {
    "query_embedding": q_emb,
    "match_threshold": 0.1,
    "match_count": 5,
}).execute()

print("Found", len(results.data), "matches")
for r in results.data:
    print("\n  Chunk", r["chunk_index"], "| similarity:", round(r["similarity"], 3))
    print("  Text:", r["text"][:200])

# 3. Generate answer with LLM
print("\n--- LLM Answer ---")
context = [r["text"] for r in results.data]
llm = LLMHandler()
answer = llm.generate_response(query, context)
print(answer["text"])
