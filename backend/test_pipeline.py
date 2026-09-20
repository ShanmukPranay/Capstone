import uuid
from datetime import datetime
from models.rag_engine import RAGEngine
from models.embeddings import EmbeddingService
from services.supabase_client import supabase_admin

# Read test file
with open("test_legal.txt", "r", encoding="utf-8") as f:
    text = f.read()

print("File content length:", len(text))

# Create doc ID
doc_id = "doc_" + datetime.now().strftime("%Y%m%d_%H%M%S") + "_" + uuid.uuid4().hex[:6]
print("Doc ID:", doc_id)

# Insert document
supabase_admin.table("documents").insert({
    "id": doc_id,
    "user_id": "default-user",
    "name": "test_legal.txt",
    "file_type": "text/plain",
    "file_size": len(text),
    "content": text[:50000],
    "status": "processing",
    "document_type": "legal",
}).execute()
print("Inserted document: OK")

# Chunk text
rag = RAGEngine()
chunks = rag.chunk_text(text)
print("Total chunks:", len(chunks))

# Embed + prepare chunk rows
embedder = EmbeddingService()
rows = []
for i, chunk in enumerate(chunks):
    emb = embedder.encode(chunk)
    rows.append({
        "document_id": doc_id,
        "chunk_index": i,
        "text": chunk,
        "token_count": len(chunk.split()),
        "embedding": emb,
    })

# Insert chunks
if rows:
    r2 = supabase_admin.table("document_chunks").insert(rows).execute()
    print("Inserted chunks:", len(r2.data))

# Update document status
supabase_admin.table("documents").update({
    "status": "analyzed",
    "total_chunks": len(rows),
}).eq("id", doc_id).execute()

print("SUCCESS! Doc ID:", doc_id)
