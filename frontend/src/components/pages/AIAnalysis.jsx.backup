import React, { useState } from 'react';
import {
  Brain,
  FileText,
  CheckCircle,
  AlertCircle,
  Link,
  ExternalLink,
  Sparkles,
  ChevronRight,
  Shield,
  Users
} from 'lucide-react';
import './AIAnalysis.css';

const AIAnalysis = () => {
  const [selectedDocument, setSelectedDocument] = useState('Employment_Agreement.pdf');
  const [analysisResult, setAnalysisResult] = useState({
    parties: {
      employer: 'ABC Technologies Pvt. Ltd.',
      employee: 'John Doe'
    },
    duration: {
      start: '01/07/2026',
      duration: '12 months'
    },
    noticePeriod: '30 days',
    obligation: 'Employee must provide written notice before termination.'
  });

  const [evidence] = useState({
    source: 'Page 5',
    section: 'Section 8.2',
    text: '"Employee shall provide written notice of termination at least thirty days prior to the intended termination date."',
    confidence: 94
  });

  const [highlightedText] = useState(
    'The Employment Agreement (the "Agreement") is entered into between ABC Technologies Pvt. Ltd. ("Employer") and John Doe ("Employee"). The Employee shall provide written notice of termination at least thirty days prior to the intended termination date. The notice period shall commence on the date of receipt of such notice.'
  );

  const [processingSteps] = useState([
    { label: 'Document uploaded', status: 'complete' },
    { label: 'Text extracted', status: 'complete' },
    { label: 'Text preprocessing completed', status: 'complete' },
    { label: 'Running RAG retrieval', status: 'complete' },
    { label: 'LLM analysis', status: 'complete' },
    { label: 'Evidence mapping', status: 'complete' },
    { label: 'Risk detection', status: 'complete' },
  ]);

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

      {/* Processing Steps */}
      <div className="processing-steps-bar">
        {processingSteps.map((step, idx) => (
          <div key={idx} className={`step ${step.status}`}>
            {step.status === 'complete' ? <CheckCircle size={16} /> : <span className="step-num">{idx + 1}</span>}
            <span className="step-label">{step.label}</span>
          </div>
        ))}
      </div>

      <div className="analysis-grid">
        {/* Left Column - Document Viewer */}
        <div className="document-viewer">
          <div className="viewer-header">
            <FileText size={18} />
            <span>{selectedDocument}</span>
          </div>
          <div className="viewer-content">
            <p className="document-text">
              {highlightedText.split(' ').map((word, idx) => {
                if (word.includes('notice') || word.includes('termination')) {
                  return <span key={idx} className="highlighted">{word} </span>;
                }
                return <span key={idx}>{word} </span>;
              })}
            </p>
            <div className="legend">
              <span className="legend-item">
                <span className="legend-color" style={{ background: '#fef3c7' }}></span>
                Key Clauses
              </span>
              <span className="legend-item">
                <span className="legend-color" style={{ background: '#dbeafe' }}></span>
                Evidence Source
              </span>
            </div>
          </div>
        </div>

        {/* Middle Column - AI Extraction Results */}
        <div className="extraction-results">
          <h3>Extracted Information</h3>
          
          <div className="extraction-card">
            <h4>Parties</h4>
            <div className="extraction-item">
              <span className="label">Employer:</span>
              <span className="value">{analysisResult.parties.employer}</span>
            </div>
            <div className="extraction-item">
              <span className="label">Employee:</span>
              <span className="value">{analysisResult.parties.employee}</span>
            </div>
          </div>

          <div className="extraction-card">
            <h4>Contract Duration</h4>
            <div className="extraction-item">
              <span className="label">Start Date:</span>
              <span className="value">{analysisResult.duration.start}</span>
            </div>
            <div className="extraction-item">
              <span className="label">Duration:</span>
              <span className="value">{analysisResult.duration.duration}</span>
            </div>
          </div>

          <div className="extraction-card highlight-card">
            <h4>Obligation</h4>
            <div className="extraction-item">
              <span className="label">Notice Period:</span>
              <span className="value highlight-value">{analysisResult.noticePeriod}</span>
            </div>
            <div className="extraction-item">
              <span className="label">Requirement:</span>
              <span className="value">{analysisResult.obligation}</span>
            </div>
          </div>
        </div>

        {/* Right Column - Evidence + Reasoning */}
        <div className="evidence-panel">
          <h3>Evidence & Reasoning</h3>
          
          <div className="evidence-card">
            <div className="evidence-header">
              <Shield size={18} className="evidence-icon" />
              <span>Evidence Found</span>
            </div>
            
            <div className="evidence-source">
              <span className="source-label">Source:</span>
              <span className="source-value">{evidence.source}</span>
            </div>
            <div className="evidence-source">
              <span className="source-label">Section:</span>
              <span className="source-value">{evidence.section}</span>
            </div>
            
            <div className="evidence-text">
              <span className="source-label">Evidence:</span>
              <p>{evidence.text}</p>
            </div>

            <div className="evidence-confidence">
              <span className="confidence-label">Confidence:</span>
              <div className="confidence-bar">
                <div className="confidence-fill" style={{ width: `${evidence.confidence}%` }}></div>
                <span className="confidence-value">{evidence.confidence}%</span>
              </div>
            </div>

            <div className="evidence-reasoning">
              <span className="source-label">Reasoning:</span>
              <p>"The notice-period requirement is explicitly stated in Section 8.2 and is connected with the termination condition described in Section 9."</p>
            </div>

            <button className="btn-view-source">
              <ExternalLink size={16} />
              View Source
            </button>
          </div>

          <div className="verification-badge">
            <CheckCircle size={16} />
            <span>AI Analysis Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;