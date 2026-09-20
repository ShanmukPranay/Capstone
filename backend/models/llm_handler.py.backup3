import os
from typing import List, Dict, Any


class LLMHandler:
    def __init__(self):
        self.provider = os.getenv("LLM_PROVIDER", "mock").lower()
        self.model = os.getenv("LLM_MODEL", "gpt-4o-mini")
        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.gemini_key = os.getenv("GEMINI_API_KEY")

    def _build_prompt(self, message: str, context: List[str]) -> str:
        ctx = ""
        if context:
            ctx = "\n\n=== RETRIEVED LEGAL CONTEXT ===\n"
            for i, c in enumerate(context, 1):
                ctx += f"[{i}] {c}\n"
            ctx += "=== END CONTEXT ===\n"

        sys = (
            "You are a legal AI assistant for an evidence-traceable platform. "
            "Answer ONLY using the provided context. Cite sources as [1], [2], etc. "
            "If the answer is not in the context, say so explicitly."
        )
        return f"{sys}\n{ctx}\nUser: {message}\nAssistant:"

    def generate_response(self, prompt: str, context: List[str] = None) -> Dict[str, Any]:
        context = context or []
        full_prompt = self._build_prompt(prompt, context)

        if self.provider == "openai" and self.openai_key:
            return self._openai_call(full_prompt)
        elif self.provider == "gemini" and self.gemini_key:
            return self._gemini_call(full_prompt)
        return self._mock_call(prompt, context)

    def _openai_call(self, prompt: str) -> Dict[str, Any]:
        from openai import OpenAI
        client = OpenAI(api_key=self.openai_key)
        r = client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )
        return {"text": r.choices[0].message.content, "model": self.model}

    def _gemini_call(self, prompt: str) -> Dict[str, Any]:
        import google.generativeai as genai
        genai.configure(api_key=self.gemini_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        r = model.generate_content(prompt)
        return {"text": r.text, "model": "gemini-1.5-flash"}

    def _mock_call(self, prompt: str, context: List[str]) -> Dict[str, Any]:
        if context:
            answer = (
                f"Based on the retrieved context:\n\n"
                f"{context[0][:400]}...\n\n"
                f"(Mock response - add OPENAI_API_KEY or GEMINI_API_KEY in .env for real answers.)"
            )
        else:
            answer = (
                f"No documents indexed yet for query: '{prompt[:100]}'. "
                "Upload a document first."
            )
        return {"text": answer, "model": "mock"}

    def chat(self, message: str, context: List[str], history: List[Dict]) -> Dict[str, Any]:
        return self.generate_response(message, context)

    def stream_chat(self, message: str, context: List[str]):
        answer = self.generate_response(message, context)["text"]
        for word in answer.split():
            yield word + " "

    def extract_legal_entities(self, text: str) -> Dict[str, Any]:
        return {
            "parties": [],
            "dates": [],
            "obligations": [],
            "amounts": [],
            "jurisdictions": [],
            "note": "NER not configured"
        }
