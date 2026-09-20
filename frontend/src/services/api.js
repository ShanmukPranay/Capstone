// Frontend API client for FastAPI backend
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API ${res.status}: ${err}`);
  }
  return res.json();
}

// ===== Documents =====
export const api = {
  // ---- Documents ----
  listDocuments: (userId = "default-user") =>
    request(`/api/documents?user_id=${userId}`),

  getDocument: (docId) =>
    request(`/api/documents/${docId}`),

  uploadDocument: async (file, userId = "default-user") => {
    const form = new FormData();
    form.append("file", file);
    form.append("user_id", userId);
    const res = await fetch(`${API_BASE}/api/documents/upload`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // ---- RAG Search ----
  ragSearch: (query, documentId = null, topK = 5) =>
    request("/api/rag/search", {
      method: "POST",
      body: JSON.stringify({
        query,
        document_id: documentId,
        top_k: topK,
      }),
    }),

  // ---- Chat ----
  createChatSession: (userId, documentId = null, title = "New Chat") =>
    request("/api/chat/sessions", {
      method: "POST",
      body: JSON.stringify({
        user_id: userId,
        document_id: documentId,
        title,
      }),
    }),

  listChatSessions: (userId) =>
    request(`/api/chat/sessions/${userId}`),

  getChatMessages: (sessionId) =>
    request(`/api/chat/sessions/${sessionId}/messages`),

  sendChatMessage: (sessionId, userId, message, documentId = null) =>
    request("/api/chat/message", {
      method: "POST",
      body: JSON.stringify({
        session_id: sessionId,
        user_id: userId,
        message,
        document_id: documentId,
        use_rag: true,
      }),
    }),

  // ---- Delete ----
  deleteDocument: (docId) =>
    request(`/api/documents/` + docId, { method: "DELETE" }),

  // ---- Evidence ----
  getAllEvidence: (userId = "default-user") =>
    request(`/api/evidence/all?user_id=` + userId),

  getDocumentEvidence: (docId) =>
    request(`/api/evidence/document/` + docId),

  // ---- Analysis ----
  analyzeDocument: (docId) =>
    request(`/api/analyze/${docId}`, { method: "POST" }),

  // ---- Analytics ----
  getAnalytics: (userId = "default-user") =>
    request(`/api/analytics/overview?user_id=` + userId),

  // ---- Health ----
  health: () => request("/api/health"),
};

export default api;
