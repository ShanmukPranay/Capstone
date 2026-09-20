import React, { useState } from 'react';
import {
  History as HistoryIcon,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye
} from 'lucide-react';
import './History.css';

const History = () => {
  const [expandedVersions, setExpandedVersions] = useState({});
  const [dateFilter, setDateFilter] = useState('all');

  const historyItems = [
    {
      id: 1,
      document: 'Employment_Agreement.pdf',
      uploaded: '2024-01-15 10:30 AM',
      analyzed: '2024-01-15 10:45 AM',
      reviewer: 'John Doe',
      status: 'Verified',
      version: 'v2.1',
      changes: 'Updated termination clause based on reviewer feedback'
    },
    {
      id: 2,
      document: 'NDA_Agreement.pdf',
      uploaded: '2024-01-14 02:15 PM',
      analyzed: '2024-01-14 02:30 PM',
      reviewer: 'Jane Smith',
      status: 'Under Review',
      version: 'v1.3',
      changes: 'Added confidentiality provisions'
    },
    {
      id: 3,
      document: 'Rental_Agreement.pdf',
      uploaded: '2024-01-12 09:00 AM',
      analyzed: '2024-01-12 09:20 AM',
      reviewer: 'Mike Johnson',
      status: 'Analyzed',
      version: 'v1.0',
      changes: 'Initial analysis complete'
    },
    {
      id: 4,
      document: 'Service_Contract.pdf',
      uploaded: '2024-01-10 11:45 AM',
      analyzed: '2024-01-10 12:10 PM',
      reviewer: 'Sarah Wilson',
      status: 'Needs Attention',
      version: 'v2.0',
      changes: 'Revised payment terms'
    },
    {
      id: 5,
      document: 'Partnership_Agreement.pdf',
      uploaded: '2024-01-08 03:30 PM',
      analyzed: '2024-01-08 04:00 PM',
      reviewer: 'Robert Brown',
      status: 'Verified',
      version: 'v1.2',
      changes: 'Added dispute resolution clause'
    }
  ];

  const toggleVersion = (id) => {
    setExpandedVersions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Verified': 'badge-success',
      'Under Review': 'badge-warning',
      'Analyzed': 'badge-info',
      'Needs Attention': 'badge-danger'
    };
    return `status-badge ${colors[status] || 'badge-info'}`;
  };

  return (
    <div className="history-page">
      <div className="page-header">
        <div>
          <h1>Document History</h1>
          <p className="page-subtitle">Track document versions, analyses, and review status</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline">
            <Filter size={16} />
            Filter
          </button>
          <button className="btn-primary">
            <HistoryIcon size={16} />
            View All Versions
          </button>
        </div>
      </div>

      {/* Timeline Filter */}
      <div className="timeline-filter">
        <div className="filter-group">
          <span>Time period:</span>
          <button className={`filter-btn ${dateFilter === 'all' ? 'active' : ''}`} onClick={() => setDateFilter('all')}>All</button>
          <button className={`filter-btn ${dateFilter === 'week' ? 'active' : ''}`} onClick={() => setDateFilter('week')}>This Week</button>
          <button className={`filter-btn ${dateFilter === 'month' ? 'active' : ''}`} onClick={() => setDateFilter('month')}>This Month</button>
          <button className={`filter-btn ${dateFilter === 'quarter' ? 'active' : ''}`} onClick={() => setDateFilter('quarter')}>This Quarter</button>
        </div>
        <div className="search-filter">
          <Search size={16} />
          <input type="text" placeholder="Search history..." />
        </div>
      </div>

      {/* History Timeline */}
      <div className="history-timeline">
        {historyItems.map((item) => (
          <div key={item.id} className="timeline-item">
            <div className="timeline-marker">
              <div className={`marker-dot ${item.status.toLowerCase().replace(' ', '-')}`}></div>
              <div className="marker-line"></div>
            </div>
            <div className="timeline-content">
              <div className="content-header">
                <div className="header-left">
                  <FileText size={18} />
                  <span className="doc-name">{item.document}</span>
                  <span className="doc-version">{item.version}</span>
                </div>
                <div className="header-right">
                  <span className={getStatusBadge(item.status)}>{item.status}</span>
                  <button className="btn-expand" onClick={() => toggleVersion(item.id)}>
                    {expandedVersions[item.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              <div className="content-meta">
                <div className="meta-item">
                  <Clock size={14} />
                  <span>Uploaded: {item.uploaded}</span>
                </div>
                <div className="meta-item">
                  <Clock size={14} />
                  <span>Analyzed: {item.analyzed}</span>
                </div>
                <div className="meta-item">
                  <span className="reviewer-label">Reviewer:</span>
                  <span className="reviewer-name">{item.reviewer}</span>
                </div>
              </div>

              {expandedVersions[item.id] && (
                <div className="content-details">
                  <div className="detail-section">
                    <h4>Changes</h4>
                    <p>{item.changes}</p>
                  </div>
                  <div className="detail-section">
                    <h4>Actions</h4>
                    <div className="action-buttons">
                      <button className="btn-action">
                        <Eye size={14} />
                        View Document
                      </button>
                      <button className="btn-action">
                        <ExternalLink size={14} />
                        Compare Versions
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;