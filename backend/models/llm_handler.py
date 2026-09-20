import os
from typing import List, Dict, Any


class LLMHandler:
    def __init__(self):
        self.provider = os.getenv("LLM_PROVIDER", "mock").lower().strip()
        self.model = os.getenv("LLM_MODEL", "nex-agi/nex-n2.5-pro:free").strip()
        self.openai_key = (os.getenv("OPENAI_API_KEY") or "").strip()
        self.gemini_key = (os.getenv("GEMINI_API_KEY") or "").strip()
        print(f"[LLMHandler] provider={self.provider}, model={self.model}, key_len={len(self.openai_key)}")

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
            "If the answer is not in the context, say so explicitly. "
            "Be concise, professional, and specific."
        )
        return f"{sys}\n{ctx}\nUser: {message}\nAssistant:"

    def generate_response(self, prompt: str, context: List[str] = None) -> Dict[str, Any]:
        context = context or []
        full_prompt = self._build_prompt(prompt, context)

        # OPENROUTER FIRST (since it uses the openai_key field)
        if self.provider == "openrouter" and self.openai_key:
            try:
                return self._openrouter_call(full_prompt)
            except Exception as e:
                print(f"[LLMHandler] OpenRouter FAILED: {e}")
                return self._mock_call(prompt, context)

        # OPENAI
        if self.provider == "openai" and self.openai_key:
            try:
                return self._openai_call(full_prompt)
            except Exception as e:
                print(f"[LLMHandler] OpenAI FAILED: {e}")
                return self._mock_call(prompt, context)

        # GEMINI
        if self.provider == "gemini" and self.gemini_key:
            try:
                return self._gemini_call(full_prompt)
            except Exception as e:
                print(f"[LLMHandler] Gemini FAILED: {e}")
                return self._mock_call(prompt, context)

        print(f"[LLMHandler] Falling back to mock (provider={self.provider}, has_key={bool(self.openai_key)})")
        return self._mock_call(prompt, context)

    def _openrouter_call(self, prompt: str) -> Dict[str, Any]:
        from openai import OpenAI
        client = OpenAI(api_key=self.openai_key, base_url="https://openrouter.ai/api/v1")
        r = client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )
        return {"text": r.choices[0].message.content, "model": self.model}

    def _openai_call(self, prompt: str) -> Dict[str, Any]:
        from openai import OpenAI
        client = OpenAI(api_key=self.openai_key)
        r = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )
        return {"text": r.choices[0].message.content, "model": "gpt-4o-mini"}

    def _gemini_call(self, prompt: str) -> Dict[str, Any]:
        from google import genai
        client = genai.Client(api_key=self.gemini_key)
        response = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
        return {"text": response.text, "model": "gemini-2.0-flash"}

    def _mock_call(self, prompt: str, context: List[str]) -> Dict[str, Any]:
        if context:
            return {"text": f"Based on the retrieved context:\n\n{context[0][:400]}...\n\n(Mock response)", "model": "mock"}
        return {"text": f"No documents indexed yet for query: '{prompt[:100]}'.", "model": "mock"}

    def chat(self, message: str, context: List[str], history: List[Dict]) -> Dict[str, Any]:
        return self.generate_response(message, context)

    def stream_chat(self, message: str, context: List[str]):
        answer = self.generate_response(message, context)["text"]
        for word in answer.split():
            yield word + " "

    def extract_legal_entities(self, text: str) -> Dict[str, Any]:
        if self.provider == "openrouter" and self.openai_key:
            try:
                from openai import OpenAI
                import json
                client = OpenAI(api_key=self.openai_key, base_url="https://openrouter.ai/api/v1")
                prompt = (
                    "Extract legal entities from the text below. "
                    "Return ONLY valid JSON with keys: parties, dates, obligations, amounts, jurisdictions. "
                    "Each should be an array of strings. No markdown fences.\n\n"
                    f"TEXT:\n{text[:3000]}"
                )
                r = client.chat.completions.create(
                    model=self.model,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.1,
                )
                txt = r.choices[0].message.content.strip()
                if txt.startswith("```"):
                    txt = txt.split("```")[1]
                    if txt.startswith("json"):
                        txt = txt[4:]
                return json.loads(txt)
            except Exception as e:
                return {"error": str(e), "note": "Extraction failed"}
        return {"parties": [], "dates": [], "obligations": [], "amounts": [], "jurisdictions": [], "note": "LLM not configured"}