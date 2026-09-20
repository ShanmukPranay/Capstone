const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  // Health Check
  health: async () => {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.json();
  },

  // Documents
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  getDocuments: async () => {
    const response = await fetch(`${API_BASE_URL}/api/documents`);
    return response.json();
  },

  getDocument: async (documentId) => {
    const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}`);
    return response.json();
  },

  deleteDocument: async (documentId) => {
    const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // RAG Search
  ragSearch: async (query, documentId = null, topK = 5) => {
    const response = await fetch(`${API_BASE_URL}/api/rag/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query, 
        document_id: documentId,
        top_k: topK 
      }),
    });
    return response.json();
  },

  // Analysis
  analyzeDocument: async (documentId) => {
    const response = await fetch(`${API_BASE_URL}/api/analyze/${documentId}`, {
      method: 'POST',
    });
    return response.json();
  },

  // Evidence
  getEvidence: async (documentId) => {
    const response = await fetch(`${API_BASE_URL}/api/evidence/${documentId}`);
    return response.json();
  },

  // Risk Analysis
  getRisks: async (documentId) => {
    const response = await fetch(`${API_BASE_URL}/api/risk/${documentId}`);
    return response.json();
  },

  // Reviewer
  submitReview: async (reviewData) => {
    const response = await fetch(`${API_BASE_URL}/api/reviewer/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });
    return response.json();
  },
};

export default api;