import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  ExternalLink,
  Shield,
  ChevronDown,
  ChevronRight,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import './RiskAnalysis.css';

const RiskAnalysis = () => {
  const [expandedRisks, setExpandedRisks] = useState({});
  const [severityFilter, setSeverityFilter] = useState('all');

  const riskSummary = {
    high: 3,
    medium: 8,
    low: 12
  };

  const risks = [
    {
      id: 'R001',
      title: 'Unclear Termination Penalty',
      severity: 'high',
      evidence: 'Page 8 — Section 10',
      reason: 'Penalty conditions are not explicitly defined, leaving room for interpretation.',
      confidence: 87,
      category: 'Termination'
    },
    {
      id: 'R002',
      title: 'Broad Confidentiality Obligation',
      severity: 'medium',
      evidence: 'Page 6 — Section 7',
      reason: 'Confidentiality clause is overly broad and may be unenforceable.',
      confidence: 76,
      category: 'Confidentiality'
    },
    {
      id: 'R003',
      title: 'Ambiguous Non-Compete Scope',
      severity: 'high',
      evidence: 'Page 8 — Section 11',
      reason: 'Non-compete clause lacks geographic and time limitations.',
      confidence: 82,
      category: 'Non-Compete'
    },
    {
      id: 'R004',
      title: 'Missing Governing Law Clause',
      severity: 'low',
      evidence: 'Page 12',
      reason: 'Governing law is not explicitly specified, may lead to jurisdiction disputes.',
      confidence: 65,
      category: 'Jurisdiction'
    },
    {
      id: 'R005',
      title: 'Vague Dispute Resolution Process',
      severity: 'medium',
      evidence: 'Page 10 — Section 13',
      reason: 'Arbitration process is not clearly defined, may cause procedural confusion.',
      confidence: 71,
      category: 'Dispute Resolution'
    }
  ];

  const toggleRisk = (id) => {
    setExpandedRisks(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'high': return <TrendingUp size={16} className="severity-high" />;
      case 'medium': return <Minus size={16} className="severity-medium" />;
      case 'low': return <TrendingDown size={16} className="severity-low" />;
      default: return null;
    }
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      'high': 'badge-high',
      'medium': 'badge-medium',
      'low': 'badge-low'
    };
    return `severity-badge ${colors[severity]}`;
  };

  const filteredRisks = severityFilter === 'all' ? risks : risks.filter(r => r.severity === severityFilter);

  return (
    <div className="risk-analysis-page">
      <div className="page-header">
        <div>
          <h1>Risk Analysis</h1>
          <p className="page-subtitle">AI-detected legal risks with evidence-based assessment</p>
        </div>
        <div className="header-disclaimer">
          <Shield size={16} />
          <span>This system provides AI-assisted analysis and does not constitute legal advice.</span>
        </div>
      </div>

      {/* Risk Summary */}
      <div className="risk-summary">
        <div className="summary-card high">
          <div className="summary-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="summary-content">
            <span className="summary-number">{riskSummary.high}</span>
            <span className="summary-label">High Risk</span>
          </div>
        </div>
        <div className="summary-card medium">
          <div className="summary-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="summary-content">
            <span className="summary-number">{riskSummary.medium}</span>
            <span className="summary-label">Medium Risk</span>
          </div>
        </div>
        <div className="summary-card low">
          <div className="summary-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="summary-content">
            <span className="summary-number">{riskSummary.low}</span>
            <span className="summary-label">Low Risk</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <Filter size={16} />
          <span>Filter by severity:</span>
          <button className={`filter-btn ${severityFilter === 'all' ? 'active' : ''}`} onClick={() => setSeverityFilter('all')}>All</button>
          <button className={`filter-btn ${severityFilter === 'high' ? 'active' : ''}`} onClick={() => setSeverityFilter('high')}>High</button>
          <button className={`filter-btn ${severityFilter === 'medium' ? 'active' : ''}`} onClick={() => setSeverityFilter('medium')}>Medium</button>
          <button className={`filter-btn ${severityFilter === 'low' ? 'active' : ''}`} onClick={() => setSeverityFilter('low')}>Low</button>
        </div>
        <div className="search-filter">
          <Search size={16} />
          <input type="text" placeholder="Search risks..." />
        </div>
      </div>

      {/* Risks List */}
      <div className="risks-list">
        {filteredRisks.map((risk) => (
          <div key={risk.id} className={`risk-card ${risk.severity}`}>
            <button className="risk-header" onClick={() => toggleRisk(risk.id)}>
              <div className="risk-left">
                {getSeverityIcon(risk.severity)}
                <span className="risk-title">{risk.title}</span>
              </div>
              <div className="risk-right">
                <span className={getSeverityBadge(risk.severity)}>
                  {risk.severity.toUpperCase()}
                </span>
                <span className="risk-confidence">{risk.confidence}% confidence</span>
                {expandedRisks[risk.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </div>
            </button>

            {expandedRisks[risk.id] && (
              <div className="risk-details">
                <div className="detail-row">
                  <span className="detail-label">Evidence:</span>
                  <span className="detail-value">{risk.evidence}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Reason:</span>
                  <span className="detail-value reason-text">{risk.reason}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value category-tag">{risk.category}</span>
                </div>
                <div className="risk-actions">
                  <button className="btn-evidence">
                    <FileText size={14} />
                    View Evidence
                  </button>
                  <button className="btn-review">
                    <ExternalLink size={14} />
                    Send for Review
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Risk Disclaimer */}
      <div className="risk-disclaimer">
        <AlertTriangle size={16} />
        <p>Risk analysis is generated by AI based on document patterns. Please consult with legal counsel before making decisions based on these findings.</p>
      </div>
    </div>
  );
};

export default RiskAnalysis;