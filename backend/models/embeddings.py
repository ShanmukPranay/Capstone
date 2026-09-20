from sentence_transformers import SentenceTransformer
from typing import List


class EmbeddingService:
    _instance = None
    _model = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def _get_model(self):
        if self._model is None:
            print("Loading embedding model (first time only)...")
            self._model = SentenceTransformer("all-MiniLM-L6-v2")
            print("Embedding model ready")
        return self._model

    def encode(self, text: str) -> List[float]:
        return self._get_model().encode(text, normalize_embeddings=True).tolist()

    def encode_batch(self, texts: List[str]) -> List[List[float]]:
        return self._get_model().encode(texts, normalize_embeddings=True).tolist()
