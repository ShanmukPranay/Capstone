import React, { useState, useEffect } from 'react';
import {
  CheckCircle, XCircle, Clock, AlertCircle, RefreshCw,
  Loader2, ChevronDown, ChevronRight, Shield, Plus
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import './ReviewerAdjudication.css';

const ReviewerAdjudication = () => {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, needs_changes: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [expandedId, setExpandedId] = useState(null);
  const [comments, setComments] = useState({});
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => { loadReviews(); }, []);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const res = await api.getReviews();
      setReviews(res.reviews || []);
      setSummary(res.summary || { total: 0, pending: 0, approved: 0, rejected: 0, needs_changes: 0 });
    } catch (err) {
      console.error('Reviews load failed:', err);
      toast.error('Could not load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignAll = async () => {
    setIsAssigning(true);
    try {
      const res = await api.assignAllReviews();
      toast.success(`Assigned ${res.assigned} risks for review`);
      await loadReviews();
    } catch (err) {
      toast.error('Could not assign reviews');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleDecision = async (reviewId, status) => {
    try {
      await api.updateReview(reviewId, status, status, comments[reviewId] || '');
      toast.success(`Review ${status}`);
      setComments(prev => ({ ...prev, [reviewId]: '' }));
      await loadReviews();
    } catch (err) {
      toast.error('Could not update review');
    }
  };

  const filteredReviews = statusFilter === 'all'
    ? reviews
    : reviews.filter(r => r.status === statusFilter);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle size={16} />;
      case 'rejected': return <XCircle size={16} />;
      case 'needs_changes': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="reviewer-page">
      <div className="page-header">
        <div>
          <h1>Reviewer Adjudication</h1>
          <p className="page-subtitle">Human-in-the-loop verification of AI-detected risks</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={loadReviews} disabled={isLoading}>
            <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
            Refresh
          </button>
          <button className="btn-primary" onClick={handleAssignAll} disabled={isAssigning}>
            <Plus size={14} />
            Assign All Risks
          </button>
        </div>
      </div>

      <div className="review-summary">
        <div className="sum-card pending">
          <Clock size={20} />
          <span className="num">{summary.pending}</span>
          <span className="lbl">Pending</span>
        </div>
        <div className="sum-card approved">
          <CheckCircle size={20} />
          <span className="num">{summary.approved}</span>
          <span className="lbl">Approved</span>
        </div>
        <div className="sum-card rejected">
          <XCircle size={20} />
          <span className="num">{summary.rejected}</span>
          <span className="lbl">Rejected</span>
        </div>
        <div className="sum-card changes">
          <AlertCircle size={20} />
          <span className="num">{summary.needs_changes}</span>
          <span className="lbl">Needs Changes</span>
        </div>
      </div>

      <div className="filter-bar">
        {['pending', 'approved', 'rejected', 'needs_changes', 'all'].map(f => (
          <button
            key={f}
            className={`filter-btn ${statusFilter === f ? 'active' : ''}`}
            onClick={() => setStatusFilter(f)}
          >
            {f.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="loading-state">
          <Loader2 size={32} className="spin" />
          <p>Loading reviews...</p>
        </div>
      )}

      {!isLoading && filteredReviews.length === 0 && (
        <div className="empty-state">
          <Shield size={48} />
          <h3>No Reviews Yet</h3>
          <p>
            {reviews.length === 0
              ? 'Click "Assign All Risks" to send AI-detected risks for review.'
              : 'No reviews match the current filter.'}
          </p>
        </div>
      )}

      {!isLoading && filteredReviews.length > 0 && (
        <div className="reviews-list">
          {filteredReviews.map(r => {
            const expanded = expandedId === r.id;
            return (
              <div key={r.id} className={`review-card status-${r.status}`}>
                <div className="review-header" onClick={() => setExpandedId(expanded ? null : r.id)}>
                  <div className="review-status-icon">{getStatusIcon(r.status)}</div>
                  <div className="review-content">
                    <div className="review-title">
                      <span className={`sev-dot sev-${r.severity}`}></span>
                      {r.risk?.slice(0, 120) || 'Risk not found'}
                      {r.risk?.length > 120 ? '...' : ''}
                    </div>
                    <div className="review-meta">
                      <span>📄 {r.document_name}</span>
                      <span>·</span>
                      <span className={`status-badge status-${r.status}`}>
                        {r.status.replace('_', ' ')}
                      </span>
                      {r.severity && (
                        <>
                          <span>·</span>
                          <span className={`sev-label sev-${r.severity}`}>
                            {r.severity.toUpperCase()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="review-toggle">
                    {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </div>
                </div>

                {expanded && (
                  <div className="review-body">
                    <div className="review-row">
                      <strong>Risk Description:</strong>
                      <p>{r.risk}</p>
                    </div>
                    {r.evidence && (
                      <div className="review-row">
                        <strong>Evidence from Document:</strong>
                        <p className="excerpt">{r.evidence}</p>
                      </div>
                    )}
                    <div className="review-row">
                      <strong>Document ID:</strong>
                      <code>{r.document_id}</code>
                    </div>
                    <div className="review-row">
                      <strong>Assigned At:</strong>
                      <span>{new Date(r.created_at).toLocaleString()}</span>
                    </div>

                    {r.status === 'pending' && (
                      <>
                        <div className="review-comment-row">
                          <textarea
                            placeholder="Add comments (optional)..."
                            value={comments[r.id] || ''}
                            onChange={(e) => setComments(prev => ({ ...prev, [r.id]: e.target.value }))}
                            rows={2}
                          />
                        </div>
                        <div className="review-actions">
                          <button className="btn-approve" onClick={() => handleDecision(r.id, 'approved')}>
                            <CheckCircle size={14} /> Approve
                          </button>
                          <button className="btn-reject" onClick={() => handleDecision(r.id, 'rejected')}>
                            <XCircle size={14} /> Reject
                          </button>
                          <button className="btn-changes" onClick={() => handleDecision(r.id, 'needs_changes')}>
                            <AlertCircle size={14} /> Request Changes
                          </button>
                        </div>
                      </>
                    )}

                    {r.status !== 'pending' && r.comments && (
                      <div className="review-row">
                        <strong>Reviewer Comments:</strong>
                        <p>{r.comments}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewerAdjudication;