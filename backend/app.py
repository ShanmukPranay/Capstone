from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from config import PORT
from routes import documents, rag, chat, analysis

app = FastAPI(
    title="Evidence-Traceable Legal Intelligence API",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "API running", "status": "healthy"}


@app.get("/api/health")
def health():
    return {"status": "healthy"}


app.include_router(documents.router)
app.include_router(rag.router)
app.include_router(chat.router)
app.include_router(analysis.router)


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=PORT, reload=True)
