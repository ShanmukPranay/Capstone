import React, { useState, useEffect } from 'react';
import {
  FileText, Brain, MessageSquare, Sparkles, AlertTriangle,
  CheckCircle, XCircle, RefreshCw, Loader2, Clock, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import './History.css';

const History = () => {
  const [events, setEvents] = useState([]);
  const [summary, setSummary] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const res = await api.getHistory();
      setEvents(res.events || []);
      setSummary(res.summary || {});
    } catch (err) {
      console.error('History load failed:', err);
      toast.error('Could not load history');
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'document_uploaded': return <FileText size={16} />;
      case 'document_analyzed': return <Brain size={16} />;
      case 'query_asked': return <MessageSquare size={16} />;
      case 'ai_answered': return <Sparkles size={16} />;
      case 'risk_detected': return <AlertTriangle size={16} />;
      case 'review_approved': return <CheckCircle size={16} />;
      case 'review_rejected': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getCategoryLabel = (type) => {
    if (type.startsWith('document')) return 'Document';
    if (type.startsWith('query') || type.startsWith('ai_')) return 'AI';
    if (type.startsWith('risk')) return 'Risk';
    if (type.startsWith('review')) return 'Review';
    return 'Other';
  };

  const getCategoryColor = (type) => {
    if (type.startsWith('document')) return '#6366f1';
    if (type.startsWith('query') || type.startsWith('ai_')) return '#06b6d4';
    if (type.startsWith('risk')) return '#ef4444';
    if (type.startsWith('review_')) return '#8b5cf6';
    return '#94a3b8';
  };

  const formatTime = (iso) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      const now = new Date();
      const diff = (now - d) / 1000;
      if (diff < 60) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
      return d.toLocaleDateString();
    } catch {
      return iso;
    }
  };

  const filteredEvents = events.filter(e => {
    const matchesType =
      filterType === 'all' ||
      e.type === filterType ||
      (filterType === 'documents' && e.type.startsWith('document_')) ||
      (filterType === 'ai' && (e.type.startsWith('query') || e.type.startsWith('ai_'))) ||
      (filterType === 'risks' && e.type.startsWith('risk_')) ||
      (filterType === 'reviews' && e.type.startsWith('review_'));

    const matchesSearch =
      !searchQuery ||
      e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  // Group events by date
  const grouped = filteredEvents.reduce((acc, e) => {
    const d = new Date(e.timestamp);
    const key = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {});

  return (
    <div className="history-page">
      <div className="page-header">
        <div>
          <h1>Activity History</h1>
          <p className="page-subtitle">Complete audit trail of your legal AI platform activity</p>
        </div>
        <button className="btn-refresh" onClick={loadHistory} disabled={isLoading}>
          <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="history-summary">
        <div className="hs-card">
          <FileText size={18} />
          <div>
            <span className="hs-num">{summary.documents || 0}</span>
            <span className="hs-lbl">Documents</span>
          </div>
        </div>
        <div className="hs-card">
          <MessageSquare size={18} />
          <div>
            <span className="hs-num">{summary.queries || 0}</span>
            <span className="hs-lbl">Queries</span>
          </div>
        </div>
        <div className="hs-card">
          <Sparkles size={18} />
          <div>
            <span className="hs-num">{summary.ai_answers || 0}</span>
            <span className="hs-lbl">AI Answers</span>
          </div>
        </div>
        <div className="hs-card">
          <AlertTriangle size={18} />
          <div>
            <span className="hs-num">{summary.risks_detected || 0}</span>
            <span className="hs-lbl">Risks</span>
          </div>
        </div>
        <div className="hs-card">
          <CheckCircle size={18} />
          <div>
            <span className="hs-num">{summary.reviews || 0}</span>
            <span className="hs-lbl">Reviews</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="history-filters">
        <div className="history-filter-group">
          <Filter size={14} />
          {['all', 'documents', 'ai', 'risks', 'reviews'].map(f => (
            <button
              key={f}
              className={`history-filter-btn ${filterType === f ? 'active' : ''}`}
              onClick={() => setFilterType(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <input
          className="history-search"
          type="text"
          placeholder="Search history..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Timeline */}
      {isLoading && (
        <div className="history-loading">
          <Loader2 size={32} className="spin" />
          <p>Loading activity...</p>
        </div>
      )}

      {!isLoading && filteredEvents.length === 0 && (
        <div className="history-empty">
          <Clock size={48} />
          <h3>No Activity Yet</h3>
          <p>Upload documents, ask questions, and run analysis to see history here.</p>
        </div>
      )}

      {!isLoading && filteredEvents.length > 0 && (
        <div className="history-timeline">
          {Object.entries(grouped).map(([date, dayEvents]) => (
            <div key={date} className="history-day">
              <div className="history-date">{date}</div>
              <div className="history-events">
                {dayEvents.map((e, i) => (
                  <div key={e.id} className="history-event">
                    <div
                      className="he-icon"
                      style={{ background: `${e.color}15`, color: e.color }}
                    >
                      {getIcon(e.type)}
                    </div>
                    <div className="he-content">
                      <div className="he-title">{e.title}</div>
                      {e.description && (
                        <div className="he-desc">{e.description}</div>
                      )}
                      <div className="he-meta">
                        <span
                          className="he-category"
                          style={{ background: `${getCategoryColor(e.type)}15`, color: getCategoryColor(e.type) }}
                        >
                          {getCategoryLabel(e.type)}
                        </span>
                        <span className="he-time">· {formatTime(e.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;