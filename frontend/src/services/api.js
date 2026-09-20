// Frontend API client for FastAPI backend
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ===== Get current user ID from localStorage =====
function getCurrentUserId() {
  try {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const user = JSON.parse(stored);
      if (user && user.id) return user.id;
      if (user && user.email) return user.email;
    }
  } catch { /* ignore */ }
  return 'default-user';
}

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
  // ---- Auth ----
  signup: (email, password, fullName = null, organization = null) =>
    request("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ 
        email, 
        password, 
        full_name: fullName, 
        organization 
      }),
    }),

  login: (email, password) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getMe: (userId) =>
    request(`/api/auth/me/` + userId),

  listUsers: () =>
    request("/api/auth/users"),

  // ---- Documents ----
  listDocuments: (userId = getCurrentUserId()) =>
    request(`/api/documents?user_id=${userId}`),

  getDocument: (docId) =>
    request(`/api/documents/${docId}`),

  uploadDocument: async (file, userId = getCurrentUserId()) => {
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
  getAllEvidence: (userId = getCurrentUserId()) =>
    request(`/api/evidence/all?user_id=` + userId),

  getDocumentEvidence: (docId) =>
    request(`/api/evidence/document/` + docId),

  // ---- Analysis ----
  analyzeDocument: (docId) =>
    request(`/api/analyze/${docId}`, { method: "POST" }),

  // ---- Notifications ----
  getNotifications: (userId = getCurrentUserId()) =>
    request(`/api/notifications/all?user_id=` + userId),

  // ---- History ----
  getHistory: (userId = getCurrentUserId()) =>
    request(`/api/history/all?user_id=` + userId),

  // ---- Reviews ----
  getReviews: (userId = getCurrentUserId()) =>
    request(`/api/reviews/all?user_id=` + userId),

  assignReview: (riskId, documentId, userId = getCurrentUserId()) =>
    request(`/api/reviews/assign`, {
      method: "POST",
      body: JSON.stringify({
        risk_id: riskId,
        document_id: documentId,
        reviewer_id: userId,
        priority: "normal",
      }),
    }),

  assignAllReviews: (userId = getCurrentUserId()) =>
    request(`/api/reviews/assign-all?user_id=` + userId, { method: "POST" }),

  updateReview: (reviewId, status, decision, comments) =>
    request(`/api/reviews/` + reviewId, {
      method: "PATCH",
      body: JSON.stringify({ status, decision, comments }),
    }),

  // ---- Risks ----
  getRisks: (userId = getCurrentUserId()) =>
    request(`/api/risks/all?user_id=` + userId),

  resolveRisk: (riskId) =>
    request(`/api/risks/` + riskId + `/resolve`, { method: "PATCH" }),

  // ---- Analytics ----
  getAnalytics: (userId = getCurrentUserId()) =>
    request(`/api/analytics/overview?user_id=` + userId),

  // ---- Health ----
  health: () => request("/api/health"),
};

export default api;
