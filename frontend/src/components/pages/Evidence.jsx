import React, { useState } from 'react';
import {
  Shield,
  CheckCircle,
  FileText,
  ExternalLink,
  AlertCircle,
  Link,
  Search,
  Filter,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import './Evidence.css';

const Evidence = () => {
  const [expandedClaims, setExpandedClaims] = useState({});
  const [filter, setFilter] = useState('all');

  const claims = [
    {
      id: '001',
      claim: 'Contract termination requires 30 days written notice.',
      evidence: 'Page 5, Section 8.2',
      sourceText: '"Employee shall provide written notice of termination at least thirty days prior to the intended termination date."',
      strength: 'Strong',
      confidence: 94,
      verified: true,
      category: 'Termination'
    },
    {
      id: '002',
      claim: 'Non-compete clause applies for 12 months after termination.',
      evidence: 'Page 8, Section 11.3',
      sourceText: '"The Employee agrees not to engage in any business that is competitive with the Employer for a period of 12 months following termination."',
      strength: 'Medium',
      confidence: 82,
      verified: false,
      category: 'Non-Compete'
    },
    {
      id: '003',
      claim: 'Confidentiality obligation extends indefinitely.',
      evidence: 'Page 6, Section 7.1',
      sourceText: '"All confidential information disclosed during employment shall remain confidential indefinitely."',
      strength: 'Strong',
      confidence: 91,
      verified: true,
      category: 'Confidentiality'
    },
    {
      id: '004',
      claim: 'Governing law is the State of California.',
      evidence: 'Page 12, Section 15.2',
      sourceText: '"This Agreement shall be governed by and construed in accordance with the laws of the State of California."',
      strength: 'Strong',
      confidence: 97,
      verified: true,
      category: 'Jurisdiction'
    },
    {
      id: '005',
      claim: 'Dispute resolution requires arbitration.',
      evidence: 'Page 10, Section 13.1',
      sourceText: '"Any dispute arising out of or relating to this Agreement shall be resolved by binding arbitration."',
      strength: 'Medium',
      confidence: 78,
      verified: false,
      category: 'Dispute Resolution'
    }
  ];

  const toggleClaim = (id) => {
    setExpandedClaims(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getStrengthBadge = (strength) => {
    const colors = {
      'Strong': 'badge-strong',
      'Medium': 'badge-medium',
      'Weak': 'badge-weak'
    };
    return `strength-badge ${colors[strength] || 'badge-medium'}`;
  };

  const filteredClaims = filter === 'all' ? claims : claims.filter(c => c.category === filter);
  const categories = ['all', ...new Set(claims.map(c => c.category))];

  return (
    <div className="evidence-page">
      <div className="page-header">
        <div>
          <h1>Evidence Traceability</h1>
          <p className="page-subtitle">Track and verify AI-extracted claims with source evidence</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{claims.length}</span>
            <span className="stat-label">Total Claims</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{claims.filter(c => c.verified).length}</span>
            <span className="stat-label">Verified</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{claims.filter(c => c.strength === 'Strong').length}</span>
            <span className="stat-label">Strong Evidence</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <Filter size={16} />
          <span>Filter by category:</span>
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <div className="search-filter">
          <Search size={16} />
          <input type="text" placeholder="Search claims..." />
        </div>
      </div>

      {/* Evidence Chain */}
      <div className="evidence-chain">
        <div className="chain-header">
          <h3>Evidence Chain</h3>
          <span className="chain-desc">AI Claim → Document → Source → Verification</span>
        </div>
        <div className="chain-flow">
          <span className="chain-node">AI CLAIM</span>
          <ChevronRight size={16} className="chain-arrow" />
          <span className="chain-node">DOCUMENT CHUNK</span>
          <ChevronRight size={16} className="chain-arrow" />
          <span className="chain-node">SOURCE SENTENCE</span>
          <ChevronRight size={16} className="chain-arrow" />
          <span className="chain-node">PAGE / SECTION</span>
          <ChevronRight size={16} className="chain-arrow" />
          <span className="chain-node verified">VERIFICATION STATUS</span>
        </div>
      </div>

      {/* Claims List */}
      <div className="claims-list">
        {filteredClaims.map((claim) => (
          <div key={claim.id} className={`claim-card ${claim.verified ? 'verified' : 'unverified'}`}>
            <button className="claim-header" onClick={() => toggleClaim(claim.id)}>
              <div className="claim-left">
                <span className="claim-id">#{claim.id}</span>
                <span className="claim-text">{claim.claim}</span>
              </div>
              <div className="claim-right">
                <span className={`status-badge ${claim.verified ? 'verified' : 'pending'}`}>
                  {claim.verified ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                  {claim.verified ? 'Verified' : 'Pending'}
                </span>
                <span className={getStrengthBadge(claim.strength)}>
                  {claim.strength}
                </span>
                {expandedClaims[claim.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </div>
            </button>

            {expandedClaims[claim.id] && (
              <div className="claim-details">
                <div className="detail-row">
                  <span className="detail-label">Evidence:</span>
                  <span className="detail-value">{claim.evidence}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Source Sentence:</span>
                  <span className="detail-value source-text">"{claim.sourceText}"</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Confidence:</span>
                  <div className="confidence-bar">
                    <div className="confidence-fill" style={{ width: `${claim.confidence}%` }}></div>
                    <span className="confidence-value">{claim.confidence}%</span>
                  </div>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value category-tag">{claim.category}</span>
                </div>
                <div className="claim-actions">
                  <button className="btn-view">
                    <FileText size={14} />
                    View Evidence
                  </button>
                  <button className="btn-open">
                    <ExternalLink size={14} />
                    Open Document
                  </button>
                  {!claim.verified && (
                    <button className="btn-verify">
                      <CheckCircle size={14} />
                      Verify
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Evidence;