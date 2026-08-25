import React, { useState } from 'react';
import {
  Shield,
  CheckCircle,
  XCircle,
  FileText,
  ExternalLink,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Clock
} from 'lucide-react';
import './EvidenceCard.css';

const EvidenceCard = ({ 
  id,
  claim,
  evidence,
  sourceText,
  strength = 'Strong',
  confidence = 90,
  verified = false,
  category = 'General',
  onVerify,
  onViewSource,
  onOpenDocument
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStrengthBadge = (strength) => {
    const colors = {
      'Strong': 'strength-strong',
      'Medium': 'strength-medium',
      'Weak': 'strength-weak'
    };
    return `strength-badge ${colors[strength] || 'strength-medium'}`;
  };

  const getStrengthColor = (strength) => {
    const colors = {
      'Strong': '#22c55e',
      'Medium': '#f59e0b',
      'Weak': '#ef4444'
    };
    return colors[strength] || '#f59e0b';
  };

  return (
    <div className={`evidence-card ${verified ? 'verified' : 'unverified'}`}>
      <div className="evidence-card-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="evidence-card-left">
          <span className="evidence-id">#{id}</span>
          <span className="evidence-claim">{claim}</span>
        </div>
        <div className="evidence-card-right">
          <span className={`evidence-status ${verified ? 'verified' : 'pending'}`}>
            {verified ? <CheckCircle size={14} /> : <Clock size={14} />}
            {verified ? 'Verified' : 'Pending'}
          </span>
          <span className={getStrengthBadge(strength)}>
            {strength}
          </span>
          <button className="evidence-expand-btn">
            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="evidence-card-body">
          <div className="evidence-detail-row">
            <span className="evidence-detail-label">Evidence:</span>
            <span className="evidence-detail-value">{evidence}</span>
          </div>
          
          <div className="evidence-detail-row">
            <span className="evidence-detail-label">Source:</span>
            <span className="evidence-detail-value source-text">"{sourceText}"</span>
          </div>

          <div className="evidence-detail-row">
            <span className="evidence-detail-label">Confidence:</span>
            <div className="evidence-confidence-bar">
              <div 
                className="evidence-confidence-fill" 
                style={{ width: `${confidence}%`, background: getStrengthColor(strength) }}
              ></div>
              <span className="evidence-confidence-value">{confidence}%</span>
            </div>
          </div>

          <div className="evidence-detail-row">
            <span className="evidence-detail-label">Category:</span>
            <span className="evidence-category-tag">{category}</span>
          </div>

          <div className="evidence-actions">
            <button className="evidence-btn evidence-btn-view" onClick={onViewSource}>
              <FileText size={14} />
              View Evidence
            </button>
            <button className="evidence-btn evidence-btn-open" onClick={onOpenDocument}>
              <ExternalLink size={14} />
              Open Document
            </button>
            {!verified && onVerify && (
              <button className="evidence-btn evidence-btn-verify" onClick={onVerify}>
                <CheckCircle size={14} />
                Verify
              </button>
            )}
          </div>

          {verified && (
            <div className="evidence-verified-badge">
              <CheckCircle size={16} />
              <span>This claim has been verified by a reviewer</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EvidenceCard;