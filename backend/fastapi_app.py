from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn
import os
import shutil
from datetime import datetime

from models.rag_engine import RAGEngine
from models.llm_handler import LLMHandler

rag_engine = RAGEngine()
llm_handler = LLMHandler()

app = FastAPI(
    title="Evidence-Traceable Legal Intelligence API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RAGQuery(BaseModel):
    query: str
    document_id: Optional[str] = None
    top_k: Optional[int] = 5

@app.get("/")
async def root():
    return {"message": "API is running", "status": "healthy"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "API is operational"}

@app.post("/api/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        content = await file.read()
        text_content = content.decode("utf-8", errors="ignore")
        doc_id = f"doc_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        document = {
            "id": doc_id,
            "name": file.filename,
            "text": text_content[:10000]
        }
        result = rag_engine.add_document(document)
        return {
            "message": "Document uploaded",
            "filename": file.filename,
            "document_id": doc_id,
            "total_chunks": result["total_chunks"],
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/rag/search")
async def rag_search(request: RAGQuery):
    try:
        results = rag_engine.search(
            query=request.query,
            document_id=request.document_id,
            top_k=request.top_k or 5
        )
        context = [r["text"] for r in results]
        llm_response = llm_handler.generate_response(
            prompt=request.query,
            context=context if context else None
        )
        return {
            "query": request.query,
            "answer": llm_response.get("text", "No answer"),
            "evidence": results,
            "confidence": 85,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze/{document_id}")
async def analyze_document(document_id: str):
    try:
        chunks = rag_engine.get_document_chunks(document_id)
        combined_text = " ".join([c["text"] for c in chunks[:5]])
        entities = llm_handler.extract_legal_entities(combined_text)
        return {
            "status": "success",
            "document_id": document_id,
            "total_chunks": len(chunks),
            "extracted": entities
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/documents")
async def get_documents():
    try:
        docs = rag_engine.get_all_documents()
        return {"documents": docs, "total": len(docs), "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
