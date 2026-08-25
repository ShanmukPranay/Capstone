import React, { useState } from 'react';
import {
  Users,
  CheckCircle,
  XCircle,
  Edit,
  Clock,
  FileText,
  Shield,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Send,
  Eye,
  Filter,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import './ReviewerAdjudication.css';

const ReviewerAdjudication = () => {
  const [expandedItems, setExpandedItems] = useState({});
  const [reviewStatus, setReviewStatus] = useState({});
  const [comments, setComments] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const [reviewItems] = useState([
    {
      id: 'R001',
      finding: 'Contract contains a 30-day termination notice requirement.',
      evidence: 'Page 5 — Section 8.2',
      confidence: 94,
      status: 'pending',
      document: 'Employment_Agreement.pdf',
      category: 'Termination'
    },
    {
      id: 'R002',
      finding: 'Non-compete clause applies for 12 months after termination.',
      evidence: 'Page 8 — Section 11.3',
      confidence: 82,
      status: 'pending',
      document: 'Employment_Agreement.pdf',
      category: 'Non-Compete'
    },
    {
      id: 'R003',
      finding: 'Confidentiality obligation extends indefinitely.',
      evidence: 'Page 6 — Section 7.1',
      confidence: 91,
      status: 'reviewed',
      document: 'NDA_Agreement.pdf',
      category: 'Confidentiality'
    },
    {
      id: 'R004',
      finding: 'Governing law is the State of California.',
      evidence: 'Page 12 — Section 15.2',
      confidence: 97,
      status: 'pending',
      document: 'Service_Contract.pdf',
      category: 'Jurisdiction'
    },
    {
      id: 'R005',
      finding: 'Dispute resolution requires arbitration.',
      evidence: 'Page 10 — Section 13.1',
      confidence: 78,
      status: 'pending',
      document: 'Partnership_Agreement.pdf',
      category: 'Dispute Resolution'
    }
  ]);

  const toggleItem = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleReview = (id, action) => {
    setReviewStatus(prev => ({
      ...prev,
      [id]: action
    }));
    toast.success(`Review ${action} for ${id}`);
  };

  const handleCommentChange = (id, value) => {
    setComments(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmitReview = (id) => {
    if (!reviewStatus[id]) {
      toast.error('Please select Accept, Modify, or Reject first');
      return;
    }

    const statusMap = {
      'accepted': '✅ Accepted',
      'modified': '✏️ Modified',
      'rejected': '❌ Rejected'
    };

    toast.success(`${statusMap[reviewStatus[id]]} - Review submitted for ${id}`);
  };

  const handleViewEvidence = (id) => {
    const item = reviewItems.find(i => i.id === id);
    toast.info(`📄 Evidence: ${item?.evidence || 'Not found'}`);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': <span className="status-badge pending"><Clock size={14} /> Pending Review</span>,
      'reviewed': <span className="status-badge reviewed"><CheckCircle size={14} /> Reviewed</span>,
      'verified': <span className="status-badge verified"><CheckCircle size={14} /> Verified</span>
    };
    return statusMap[status] || statusMap.pending;
  };

  const getReviewStatusBadge = (status) => {
    const statusMap = {
      'accepted': <span className="review-badge accepted">✅ Accepted</span>,
      'modified': <span className="review-badge modified">✏️ Modified</span>,
      'rejected': <span className="review-badge rejected">❌ Rejected</span>
    };
    return statusMap[status] || null;
  };

  const pendingCount = reviewItems.filter(item => 
    item.status === 'pending' || !reviewStatus[item.id]
  ).length;

  const verifiedCount = reviewItems.filter(item => 
    reviewStatus[item.id] === 'accepted' || item.status === 'verified'
  ).length;

  // Filter items
  const getFilteredItems = () => {
    if (filterStatus === 'all') return reviewItems;
    return reviewItems.filter(item => {
      if (filterStatus === 'pending') {
        return item.status === 'pending' || !reviewStatus[item.id];
      }
      if (filterStatus === 'reviewed') {
        return item.status === 'reviewed' || reviewStatus[item.id];
      }
      if (filterStatus === 'verified') {
        return reviewStatus[item.id] === 'accepted' || item.status === 'verified';
      }
      return true;
    });
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="reviewer-page">
      <div className="page-header">
        <div>
          <h1>Reviewer Adjudication</h1>
          <p className="page-subtitle">Human-in-the-loop verification of AI-generated findings</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{pendingCount}</span>
            <span className="stat-label">Pending Review</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{verifiedCount}</span>
            <span className="stat-label">Verified</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <button 
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pending')}
          >
            <Clock size={14} />
            Pending
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'reviewed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('reviewed')}
          >
            <CheckCircle size={14} />
            Reviewed
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'verified' ? 'active' : ''}`}
            onClick={() => setFilterStatus('verified')}
          >
            <Shield size={14} />
            Verified
          </button>
        </div>
        <div className="search-filter">
          <Search size={16} />
          <input type="text" placeholder="Search findings..." />
        </div>
      </div>

      {/* Review Workflow */}
      <div className="workflow-bar">
        <div className="workflow-step active">
          <span className="step-num">1</span>
          <span className="step-label">AI Result</span>
        </div>
        <div className="workflow-arrow">→</div>
        <div className="workflow-step active">
          <span className="step-num">2</span>
          <span className="step-label">Evidence</span>
        </div>
        <div className="workflow-arrow">→</div>
        <div className="workflow-step active">
          <span className="step-num">3</span>
          <span className="step-label">Reviewer Decision</span>
        </div>
        <div className="workflow-arrow">→</div>
        <div className="workflow-step">
          <span className="step-num">4</span>
          <span className="step-label">Verified Result</span>
        </div>
      </div>

      {/* Review Items */}
      <div className="review-items">
        {filteredItems.length === 0 ? (
          <div className="empty-state">
            <CheckCircle size={48} className="empty-icon" />
            <h3>No items to review</h3>
            <p>All items have been reviewed</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className={`review-card ${reviewStatus[item.id] || item.status}`}>
              <button className="review-header" onClick={() => toggleItem(item.id)}>
                <div className="review-left">
                  <span className="review-id">#{item.id}</span>
                  <span className="review-finding">{item.finding}</span>
                </div>
                <div className="review-right">
                  {getStatusBadge(reviewStatus[item.id] || item.status)}
                  {reviewStatus[item.id] && getReviewStatusBadge(reviewStatus[item.id])}
                  <span className="review-confidence">{item.confidence}% confidence</span>
                  {expandedItems[item.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </div>
              </button>

              {expandedItems[item.id] && (
                <div className="review-details">
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Document:</span>
                      <span className="detail-value">
                        <FileText size={14} />
                        {item.document}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Evidence:</span>
                      <span className="detail-value">{item.evidence}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Category:</span>
                      <span className="detail-value category-tag">{item.category}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">AI Confidence:</span>
                      <div className="confidence-bar">
                        <div className="confidence-fill" style={{ width: `${item.confidence}%` }}></div>
                        <span className="confidence-value">{item.confidence}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="review-actions">
                    <div className="action-buttons">
                      <button 
                        className={`btn-accept ${reviewStatus[item.id] === 'accepted' ? 'active' : ''}`}
                        onClick={() => handleReview(item.id, 'accepted')}
                      >
                        <CheckCircle size={16} />
                        Accept
                      </button>
                      <button 
                        className={`btn-modify ${reviewStatus[item.id] === 'modified' ? 'active' : ''}`}
                        onClick={() => handleReview(item.id, 'modified')}
                      >
                        <Edit size={16} />
                        Modify
                      </button>
                      <button 
                        className={`btn-reject ${reviewStatus[item.id] === 'rejected' ? 'active' : ''}`}
                        onClick={() => handleReview(item.id, 'rejected')}
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </div>

                    <div className="comment-section">
                      <div className="comment-input-wrapper">
                        <textarea
                          placeholder="Add reviewer comment..."
                          value={comments[item.id] || ''}
                          onChange={(e) => handleCommentChange(item.id, e.target.value)}
                          className="comment-input"
                          rows="2"
                        />
                      </div>
                      <button 
                        className="btn-submit-review"
                        onClick={() => handleSubmitReview(item.id)}
                        disabled={!reviewStatus[item.id]}
                      >
                        <Send size={16} />
                        Submit Review
                      </button>
                    </div>
                  </div>

                  {reviewStatus[item.id] && (
                    <div className="review-result">
                      <Shield size={16} />
                      <span>
                        {reviewStatus[item.id] === 'accepted' && '✅ Finding accepted. Ready for verification.'}
                        {reviewStatus[item.id] === 'modified' && '✏️ Finding requires modification. Please provide updated text.'}
                        {reviewStatus[item.id] === 'rejected' && '❌ Finding rejected. Please provide rationale.'}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Verification Summary */}
      <div className="verification-summary">
        <div className="summary-header">
          <h3>Verification Flow</h3>
        </div>
        <div className="flow-diagram">
          <div className="flow-item">
            <span className="flow-icon">🤖</span>
            <span className="flow-label">AI Result</span>
          </div>
          <span className="flow-arrow">+</span>
          <div className="flow-item">
            <span className="flow-icon">📄</span>
            <span className="flow-label">Evidence</span>
          </div>
          <span className="flow-arrow">+</span>
          <div className="flow-item">
            <span className="flow-icon">👤</span>
            <span className="flow-label">Reviewer Decision</span>
          </div>
          <span className="flow-arrow">=</span>
          <div className="flow-item verified">
            <span className="flow-icon">✅</span>
            <span className="flow-label">Verified Result</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewerAdjudication;