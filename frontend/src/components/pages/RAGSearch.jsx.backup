import React, { useState, useEffect } from 'react';
import {
  Search,
  Send,
  FileText,
  Link,
  ChevronDown,
  ChevronRight,
  Sparkles,
  CheckCircle,
  X,
  Loader2,
  RefreshCw
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './RAGSearch.css';

const RAGSearch = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [expandedChunks, setExpandedChunks] = useState({});
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load documents on mount
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDocuments();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a question');
      return;
    }

    setIsSearching(true);
    setResults(null);

    try {
      const data = await api.ragSearch(
        query, 
        selectedDocument, 
        5
      );
      setResults(data);
      toast.success('Search completed!');
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const toggleChunk = (id) => {
    setExpandedChunks(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults(null);
  };

  return (
    <div className="rag-search-page">
      <div className="page-header">
        <div>
          <h1>RAG Search</h1>
          <p className="page-subtitle">AI-powered legal document search with evidence tracing</p>
        </div>
        <div className="header-info">
          <span className="info-badge">
            <Sparkles size={14} />
            Real-time RAG
          </span>
        </div>
      </div>

      {/* Search Box */}
      <div className="search-container">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Ask a question about your documents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="search-input"
          />
          {query && (
            <button className="search-clear" onClick={clearSearch}>
              <X size={16} />
            </button>
          )}
          <button 
            className={`search-btn ${isSearching ? 'searching' : ''}`}
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
          >
            {isSearching ? (
              <Loader2 size={18} className="spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>

        {/* Document Filter */}
        <div className="search-filters">
          <span className="filter-label">Search in:</span>
          <select 
            className="filter-select"
            value={selectedDocument || ''}
            onChange={(e) => setSelectedDocument(e.target.value || null)}
          >
            <option value="">All Documents</option>
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} ({doc.total_chunks} chunks)
              </option>
            ))}
          </select>
          <button className="filter-refresh" onClick={loadDocuments}>
            <RefreshCw size={14} />
          </button>
        </div>

        <div className="search-suggestions">
          <span>Try:</span>
          <button className="suggestion-chip" onClick={() => setQuery('What are the termination conditions?')}>
            Termination conditions
          </button>
          <button className="suggestion-chip" onClick={() => setQuery('Who are the parties involved?')}>
            Parties involved
          </button>
          <button className="suggestion-chip" onClick={() => setQuery('What obligations does the employee have?')}>
            Employee obligations
          </button>
          <button className="suggestion-chip" onClick={() => setQuery('Identify potential risks')}>
            Identify risks
          </button>
        </div>
      </div>

      {/* Results */}
      {isSearching && (
        <div className="searching-state">
          <div className="searching-animation">
            <div className="dot-pulse"></div>
            <div className="dot-pulse"></div>
            <div className="dot-pulse"></div>
          </div>
          <p>Searching documents and generating response...</p>
          <span className="searching-sub">Using RAG with LLM</span>
        </div>
      )}

      {results && !isSearching && (
        <div className="results-container">
          {/* Query Display */}
          <div className="query-display">
            <span className="query-label">Query:</span>
            <span className="query-text">"{results.query}"</span>
            {results.document_id && (
              <span className="query-doc">in {results.document_name || 'document'}</span>
            )}
          </div>

          {/* Retrieved Context */}
          {results.evidence && results.evidence.length > 0 && (
            <div className="context-section">
              <h3>
                <Link size={18} />
                Retrieved Context
                <span className="chunk-count">{results.evidence.length} chunks</span>
              </h3>
              <div className="chunks-list">
                {results.evidence.map((chunk, idx) => (
                  <div key={idx} className="chunk-item">
                    <button 
                      className="chunk-header"
                      onClick={() => toggleChunk(idx)}
                    >
                      <div className="chunk-info">
                        <FileText size={16} />
                        <span>Chunk {idx + 1}</span>
                        <span className="chunk-doc">{chunk.document_name || 'Unknown'}</span>
                      </div>
                      <div className="chunk-meta">
                        <span className="relevance-score">Score: {(chunk.score * 100).toFixed(1)}%</span>
                        {expandedChunks[idx] ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </div>
                    </button>
                    {expandedChunks[idx] && (
                      <div className="chunk-content">
                        <p>{chunk.text}</p>
                        {chunk.chunk_index !== undefined && (
                          <span className="chunk-index">Index: {chunk.chunk_index}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LLM Generated Answer */}
          <div className="answer-section">
            <div className="answer-header">
              <Sparkles size={18} className="answer-icon" />
              <h3>AI Generated Answer</h3>
              <span className="answer-status">Real-time</span>
            </div>
            <div className="answer-content">
              <p>{results.answer || 'No answer generated'}</p>
              <div className="answer-meta">
                {results.confidence && (
                  <div className="confidence-meta">
                    <span className="label">Confidence:</span>
                    <div className="confidence-bar">
                      <div 
                        className="confidence-fill" 
                        style={{ width: `${results.confidence}%` }}
                      ></div>
                      <span className="confidence-value">{results.confidence}%</span>
                    </div>
                  </div>
                )}
                {results.model && (
                  <span className="model-tag">Model: {results.model}</span>
                )}
                <span className="status-tag success">Live</span>
              </div>
            </div>
          </div>

          {/* RAG Pipeline Visualization */}
          <div className="rag-pipeline">
            <div className="pipeline-step active">
              <span className="step-num">1</span>
              <span className="step-label">USER QUERY</span>
            </div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step active">
              <span className="step-num">2</span>
              <span className="step-label">RAG RETRIEVAL</span>
            </div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step active">
              <span className="step-num">3</span>
              <span className="step-label">EVIDENCE</span>
            </div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step active">
              <span className="step-num">4</span>
              <span className="step-label">LLM</span>
            </div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step success">
              <CheckCircle size={18} className="step-check" />
              <span className="step-label">ANSWER</span>
            </div>
          </div>
        </div>
      )}

      {!results && !isSearching && (
        <div className="empty-state">
          <Search size={48} className="empty-icon" />
          <h3>Search your legal documents</h3>
          <p>Ask a question and get AI-powered answers with evidence from your documents</p>
          <div className="empty-tips">
            <span>💡 Try asking about:</span>
            <ul>
              <li>Termination clauses</li>
              <li>Party obligations</li>
              <li>Confidentiality terms</li>
              <li>Notice periods</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default RAGSearch;