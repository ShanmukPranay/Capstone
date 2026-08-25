import React, { useState } from 'react';
import {
  Search,
  Send,
  FileText,
  Link,
  ChevronDown,
  ChevronRight,
  Sparkles,
  CheckCircle,
  Clock
} from 'lucide-react';
import './RAGSearch.css';

const RAGSearch = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [expandedChunks, setExpandedChunks] = useState({});

  const sampleResults = {
    query: 'What is the termination notice period?',
    results: [
      {
        id: 1,
        page: 5,
        section: 'Section 8.2',
        text: 'Employee shall provide written notice of termination at least thirty days prior to the intended termination date.',
        score: 0.94
      },
      {
        id: 2,
        page: 7,
        section: 'Section 9',
        text: 'Termination of employment shall be subject to the notice requirements set forth in Section 8.2 of this Agreement.',
        score: 0.87
      },
      {
        id: 3,
        page: 3,
        section: 'Section 4',
        text: 'This Agreement may be terminated by either party with written notice as provided in Section 8.2.',
        score: 0.72
      }
    ],
    answer: 'The agreement requires a 30-day written notice period before termination. The notice period shall commence on the date of receipt of such notice.',
    confidence: 94,
    evidence: 'Page 5, Section 8.2'
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setTimeout(() => {
      setResults(sampleResults);
      setIsSearching(false);
    }, 2000);
  };

  const toggleChunk = (id) => {
    setExpandedChunks(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="rag-search-page">
      <div className="page-header">
        <div>
          <h1>RAG Search</h1>
          <p className="page-subtitle">Retrieval-Augmented Legal Search with Evidence Traceability</p>
        </div>
        <div className="header-info">
          <span className="info-badge">
            <Sparkles size={14} />
            Vector Search
          </span>
        </div>
      </div>

      {/* Search Box */}
      <div className="search-container">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Ask a question about your document..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="search-input"
          />
          <button 
            className={`search-btn ${isSearching ? 'searching' : ''}`}
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <Clock size={18} className="spin" />
            ) : (
              <Send size={18} />
            )}
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
          <p>Retrieving relevant document chunks...</p>
        </div>
      )}

      {results && !isSearching && (
        <div className="results-container">
          {/* Query Display */}
          <div className="query-display">
            <span className="query-label">Query:</span>
            <span className="query-text">"{results.query}"</span>
          </div>

          {/* Retrieved Context */}
          <div className="context-section">
            <h3>
              <Link size={18} />
              Retrieved Context
            </h3>
            <div className="chunks-list">
              {results.results.map((chunk) => (
                <div key={chunk.id} className="chunk-item">
                  <button 
                    className="chunk-header"
                    onClick={() => toggleChunk(chunk.id)}
                  >
                    <div className="chunk-info">
                      <FileText size={16} />
                      <span>Page {chunk.page} — {chunk.section}</span>
                    </div>
                    <div className="chunk-meta">
                      <span className="relevance-score">Relevant Score: {chunk.score}</span>
                      {expandedChunks[chunk.id] ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </div>
                  </button>
                  {expandedChunks[chunk.id] && (
                    <div className="chunk-content">
                      <p>"{chunk.text}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* LLM Generated Answer */}
          <div className="answer-section">
            <div className="answer-header">
              <Sparkles size={18} />
              <h3>LLM Generated Answer</h3>
            </div>
            <div className="answer-content">
              <p>{results.answer}</p>
              <div className="answer-meta">
                <div className="evidence-link">
                  <span className="label">Evidence:</span>
                  <span className="value">{results.evidence}</span>
                </div>
                <div className="confidence-meta">
                  <span className="label">Confidence:</span>
                  <div className="confidence-bar">
                    <div className="confidence-fill" style={{ width: `${results.confidence}%` }}></div>
                    <span className="confidence-value">{results.confidence}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RAG Pipeline Visualization */}
          <div className="rag-pipeline">
            <div className="pipeline-step">
              <span className="step-num">1</span>
              <span className="step-label">USER QUERY</span>
              <ChevronRight size={16} className="step-arrow" />
            </div>
            <div className="pipeline-step">
              <span className="step-num">2</span>
              <span className="step-label">RAG RETRIEVAL</span>
              <ChevronRight size={16} className="step-arrow" />
            </div>
            <div className="pipeline-step">
              <span className="step-num">3</span>
              <span className="step-label">RELEVANT CHUNKS</span>
              <ChevronRight size={16} className="step-arrow" />
            </div>
            <div className="pipeline-step">
              <span className="step-num">4</span>
              <span className="step-label">LLM</span>
              <ChevronRight size={16} className="step-arrow" />
            </div>
            <div className="pipeline-step active">
              <CheckCircle size={18} className="step-check" />
              <span className="step-label">ANSWER + EVIDENCE</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RAGSearch;