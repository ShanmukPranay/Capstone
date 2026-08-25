import React, { useState } from 'react';
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  ExternalLink,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  Shield,
  Send
} from 'lucide-react';
import './RiskCard.css';

const RiskCard = ({
  id,
  title,
  severity = 'medium',
  evidence,
  reason,
  confidence = 80,
  category = 'General',
  status = 'pending',
  onViewEvidence,
  onSendForReview,
  onResolve
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'high': return <TrendingUp size={16} className="severity-icon high" />;
      case 'medium': return <Minus size={16} className="severity-icon medium" />;
      case 'low': return <TrendingDown size={16} className="severity-icon low" />;
      default: return <AlertTriangle size={16} className="severity-icon medium" />;
    }
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      'high': 'severity-high',
      'medium': 'severity-medium',
      'low': 'severity-low'
    };
    return `severity-badge ${colors[severity] || 'severity-medium'}`;
  };

  const getStatusBadge = (status) => {
    const colors = {
      'pending': 'status-pending',
      'review': 'status-review',
      'resolved': 'status-resolved',
      'dismissed': 'status-dismissed'
    };
    return `risk-status ${colors[status] || 'status-pending'}`;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'high': '#ef4444',
      'medium': '#f59e0b',
      'low': '#22c55e'
    };
    return colors[severity] || '#f59e0b';
  };

  return (
    <div className={`risk-card severity-${severity}`}>
      <div className="risk-card-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="risk-card-left">
          {getSeverityIcon(severity)}
          <span className="risk-id">#{id}</span>
          <span className="risk-title">{title}</span>
        </div>
        <div className="risk-card-right">
          <span className={getSeverityBadge(severity)}>
            {severity.toUpperCase()}
          </span>
          <span className="risk-confidence">{confidence}%</span>
          <span className={getStatusBadge(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          <button className="risk-expand-btn">
            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="risk-card-body">
          <div className="risk-detail-row">
            <span className="risk-detail-label">Evidence:</span>
            <span className="risk-detail-value">{evidence}</span>
          </div>

          <div className="risk-detail-row">
            <span className="risk-detail-label">Reason:</span>
            <span className="risk-detail-value reason-text">{reason}</span>
          </div>

          <div className="risk-detail-row">
            <span className="risk-detail-label">Category:</span>
            <span className="risk-category-tag">{category}</span>
          </div>

          <div className="risk-detail-row">
            <span className="risk-detail-label">Confidence:</span>
            <div className="risk-confidence-bar">
              <div 
                className="risk-confidence-fill" 
                style={{ width: `${confidence}%`, background: getSeverityColor(severity) }}
              ></div>
              <span className="risk-confidence-value">{confidence}%</span>
            </div>
          </div>

          <div className="risk-actions">
            <button className="risk-btn risk-btn-evidence" onClick={onViewEvidence}>
              <FileText size={14} />
              View Evidence
            </button>
            <button className="risk-btn risk-btn-review" onClick={onSendForReview}>
              <Send size={14} />
              Send for Review
            </button>
            {status !== 'resolved' && (
              <button className="risk-btn risk-btn-resolve" onClick={onResolve}>
                <CheckCircle size={14} />
                Resolve
              </button>
            )}
          </div>

          {status === 'resolved' && (
            <div className="risk-resolved-badge">
              <CheckCircle size={16} />
              <span>This risk has been resolved</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RiskCard;