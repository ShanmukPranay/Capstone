from typing import List, Dict


class RAGEngine:
    def __init__(self, chunk_size: int = 100, overlap: int = 20):
        self.chunk_size = chunk_size
        self.overlap = overlap

    def chunk_text(self, text: str) -> List[str]:
        words = text.split()
        if not words:
            return []
        step = max(1, self.chunk_size - self.overlap)
        chunks = []
        for i in range(0, len(words), step):
            chunks.append(" ".join(words[i:i + self.chunk_size]))
        return [c for c in chunks if c.strip()]

    def add_document(self, doc: Dict) -> Dict:
        chunks = self.chunk_text(doc["text"])
        return {"total_chunks": len(chunks), "document_id": doc["id"]}
