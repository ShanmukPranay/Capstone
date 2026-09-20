import React, { useState, useEffect } from 'react';
import {
  Brain,
  FileText,
  CheckCircle,
  AlertCircle,
  Link,
  ExternalLink,
  Sparkles,
  Shield,
  Play,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import './AIAnalysis.css';

const AIAnalysis = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const [documentContent, setDocumentContent] = useState('');
  const [modelUsed, setModelUsed] = useState('');

  const processingSteps = [
    'Fetching document',
    'Text preprocessing',
    'Running RAG retrieval',
    'LLM analysis',
    'Evidence mapping',
    'Risk detection',
  ];

  // Load documents on mount
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const res = await api.listDocuments();
      const docs = res.documents || [];
      setDocuments(docs);
      if (docs.length > 0) {
        setSelectedDocId(docs[0].id);
        setDocumentContent(docs[0].content?.slice(0, 2000) || '');
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
      toast.error('Could not load documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedDocId) {
      toast.error('Please select a document');
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);
    setCurrentStep(0);

    // Animate steps (visual feedback)
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < processingSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 1200);

    try {
      const res = await api.analyzeDocument(selectedDocId);
      setAnalysis(res.analysis || {});
      setModelUsed(res.model || 'unknown');

      // Show document content for highlighting
      const doc = documents.find(d => d.id === selectedDocId);
      setDocumentContent(doc?.content?.slice(0, 2000) || '');

      toast.success('Analysis complete!');
      setCurrentStep(processingSteps.length - 1);
    } catch (err) {
      console.error('Analysis failed:', err);
      toast.error('Analysis failed: ' + err.message);
    } finally {
      clearInterval(stepInterval);
      setTimeout(() => setIsAnalyzing(false), 500);
    }
  };

  const renderHighlightedText = (text) => {
    if (!text) return null;
    const keywords = ['notice', 'termination', 'confidentiality', 'obligations', 'period'];
    return text.split(' ').map((word, idx) => {
      const lower = word.toLowerCase();
      const isHighlighted = keywords.some(k => lower.includes(k));
      return (
        <span key={idx} className={isHighlighted ? 'highlighted' : ''}>
          {word}{' '}
        </span>
      );
    });
  };

  return (
    <div className="ai-analysis-page">
      <div className="page-header">
        <div>
          <h1>AI Analysis</h1>
          <p className="page-subtitle">LLM-powered document analysis with evidence traceability</p>
        </div>
        <div className="header-badges">
          <span className="badge badge-ai">
            <Sparkles size={14} />
            AI Powered
          </span>
          <span className="badge badge-rag">
            <Link size={14} />
            RAG Enabled
          </span>
        </div>
      </div>

      {/* Document Selector + Analyze Button */}
      <div className="analysis-controls">
        <label className="control-label">
          <FileText size={16} />
          Select Document:
        </label>
        <select
          className="document-select"
          value={selectedDocId}
          onChange={(e) => {
            setSelectedDocId(e.target.value);
            const doc = documents.find(d => d.id === e.target.value);
            setDocumentContent(doc?.content?.slice(0, 2000) || '');
            setAnalysis(null);
          }}
          disabled={isLoading || isAnalyzing}
        >
          {documents.length === 0 ? (
            <option value="">No documents available</option>
          ) : (
            documents.map(doc => (
              <option key={doc.id} value={doc.id}>
                {doc.name} ({doc.total_chunks || 0} chunks)
              </option>
            ))
          )}
        </select>
        <button
          className="btn-analyze"
          onClick={handleAnalyze}
          disabled={isAnalyzing || !selectedDocId}
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={16} className="spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Play size={16} />
              Analyze Document
            </>
          )}
        </button>
      </div>

      {/* Progress Bar (during analysis) */}
      {isAnalyzing && (
        <div className="processing-steps-bar">
          {processingSteps.map((step, idx) => (
            <div
              key={idx}
              className={`step ${idx < currentStep ? 'complete' : ''} ${idx === currentStep ? 'active' : ''}`}
            >
              {idx < currentStep ? (
                <CheckCircle size={16} />
              ) : idx === currentStep ? (
                <Loader2 size={16} className="spin" />
              ) : (
                <span className="step-num">{idx + 1}</span>
              )}
              <span className="step-label">{step}</span>
            </div>
          ))}
        </div>
      )}

      {/* Analysis Result */}
      {analysis && !isAnalyzing && (
        <>
          {modelUsed && (
            <div className="model-info">
              ✅ Analysis complete · Model: <strong>{modelUsed}</strong>
            </div>
          )}

          <div className="analysis-grid">
            {/* Column 1: Document Viewer */}
            <div className="document-viewer">
              <div className="viewer-header">
                <FileText size={18} />
                <span>{documents.find(d => d.id === selectedDocId)?.name || 'Document'}</span>
              </div>
              <div className="viewer-content">
                <p className="document-text">
                  {renderHighlightedText(documentContent)}
                </p>
                <div className="legend">
                  <span className="legend-item">
                    <span className="legend-color" style={{ background: '#fef3c7' }}></span>
                    Key Clauses
                  </span>
                </div>
              </div>
            </div>

            {/* Column 2: Extracted Information */}
            <div className="extraction-results">
              <h3>Extracted Information</h3>

              {analysis.parties && (
                <div className="extraction-card">
                  <h4>👥 Parties</h4>
                  {Object.entries(analysis.parties).map(([key, val]) => {
                    if (!val) return null;
                    if (Array.isArray(val) && val.length === 0) return null;
                    return (
                      <div key={key} className="extraction-item">
                        <span className="label">{key.replace(/_/g, ' ')}:</span>
                        <span className="value">
                          {Array.isArray(val) ? val.join(', ') : val}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {analysis.dates && Object.values(analysis.dates).some(v => v) && (
                <div className="extraction-card">
                  <h4>📅 Dates</h4>
                  {Object.entries(analysis.dates).map(([key, val]) => {
                    if (!val) return null;
                    if (Array.isArray(val) && val.length === 0) return null;
                    return (
                      <div key={key} className="extraction-item">
                        <span className="label">{key.replace(/_/g, ' ')}:</span>
                        <span className="value">
                          {Array.isArray(val) ? val.join(', ') : val}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {analysis.notice_period && (
                <div className="extraction-card highlight-card">
                  <h4>⏱️ Notice Period</h4>
                  <div className="extraction-item">
                    <span className="value highlight-value">{analysis.notice_period}</span>
                  </div>
                </div>
              )}

              {analysis.key_obligations && analysis.key_obligations.length > 0 && (
                <div className="extraction-card">
                  <h4>📋 Key Obligations</h4>
                  <ul className="obligations-list">
                    {analysis.key_obligations.map((ob, i) => (
                      <li key={i}>{ob}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Column 3: Evidence & Risks */}
            <div className="evidence-panel">
              <h3>Evidence & Reasoning</h3>

              {analysis.key_clauses && analysis.key_clauses.length > 0 && (
                <div className="evidence-card">
                  <div className="evidence-header">
                    <Shield size={18} className="evidence-icon" />
                    <span>Key Clauses</span>
                  </div>
                  {analysis.key_clauses.map((clause, i) => (
                    <div key={i} className="clause-item">
                      <div className="clause-name">{clause.name}</div>
                      <div className="clause-text">{clause.text}</div>
                      {clause.evidence && (
                        <div className="clause-evidence">
                          📎 {clause.evidence}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {analysis.risks && analysis.risks.length > 0 && (
                <div className="evidence-card">
                  <div className="evidence-header">
                    <AlertTriangle size={18} className="evidence-icon" style={{ color: '#f59e0b' }} />
                    <span>Detected Risks ({analysis.risks.length})</span>
                  </div>
                  {analysis.risks.map((risk, i) => (
                    <div key={i} className={`risk-item risk-${risk.severity || 'medium'}`}>
                      <div className="risk-header">
                        <span className={`severity-badge severity-${risk.severity || 'medium'}`}>
                          {(risk.severity || 'medium').toUpperCase()}
                        </span>
                      </div>
                      <div className="risk-text">{risk.risk}</div>
                      {risk.evidence && (
                        <div className="risk-evidence">📎 {risk.evidence}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {(!analysis.key_clauses || analysis.key_clauses.length === 0) &&
               (!analysis.risks || analysis.risks.length === 0) && (
                <div className="evidence-card empty-evidence">
                  <p>No clauses or risks detected in this document.</p>
                </div>
              )}

              <div className="verification-badge">
                <CheckCircle size={16} />
                <span>AI Analysis Complete</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Empty state */}
      {!analysis && !isAnalyzing && documents.length > 0 && (
        <div className="empty-analysis-state">
          <Brain size={48} />
          <h3>Ready to Analyze</h3>
          <p>Select a document above and click "Analyze Document" to extract parties, clauses, risks, and evidence.</p>
        </div>
      )}

      {documents.length === 0 && !isLoading && (
        <div className="empty-analysis-state">
          <FileText size={48} />
          <h3>No Documents Yet</h3>
          <p>Upload a document first from the Documents page.</p>
        </div>
      )}
    </div>
  );
};

export default AIAnalysis;