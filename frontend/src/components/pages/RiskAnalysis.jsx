import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  Shield,
  ChevronDown,
  ChevronRight,
  Search,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import toast from 'react-hot-toast';
import api from '../../services/api';
import './RiskAnalysis.css';

const RiskAnalysis = () => {
  const [risks, setRisks] = useState([]);
  const [summary, setSummary] = useState({ total: 0, high: 0, medium: 0, low: 0, resolved: 0 });
  const [bySeverity, setBySeverity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRisks, setExpandedRisks] = useState({});

  useEffect(() => {
    loadRisks();
  }, []);

  const loadRisks = async () => {
    setIsLoading(true);
    try {
      const res = await api.getRisks();
      setRisks(res.risks || []);
      setSummary(res.summary || { total: 0, high: 0, medium: 0, low: 0, resolved: 0 });
      setBySeverity(res.by_severity || []);
    } catch (err) {
      console.error('Risks load failed:', err);
      toast.error('Could not load risks');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRisk = (id) => {
    setExpandedRisks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleResolve = async (riskId, e) => {
    e.stopPropagation();
    try {
      await api.resolveRisk(riskId);
      toast.success('Risk marked as resolved');
      // Update local state
      setRisks(prev => prev.map(r => r.id === riskId ? { ...r, is_resolved: true } : r));
      setSummary(prev => ({ ...prev, resolved: prev.resolved + 1 }));
    } catch (err) {
      toast.error('Could not resolve risk');
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#22c55e';
      default: return '#94a3b8';
    }
  };

  const filteredRisks = risks.filter(r => {
    const matchesSeverity =
      severityFilter === 'all' ||
      r.severity === severityFilter ||
      (severityFilter === 'resolved' && r.is_resolved);

    const matchesSearch =
      !searchQuery ||
      r.risk?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.evidence?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.document_name?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSeverity && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="risk-analysis-page">
        <div className="risk-loading">
          <Loader2 size={32} className="spin" />
          <p>Loading risks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="risk-analysis-page">
      <div className="page-header">
        <div>
          <h1>Risk Analysis</h1>
          <p className="page-subtitle">AI-detected legal risks with evidence-based assessment</p>
        </div>
        <button className="btn-refresh" onClick={loadRisks}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="risk-summary">
        <div className="summary-card high">
          <div className="summary-icon"><AlertTriangle size={24} /></div>
          <div className="summary-content">
            <span className="summary-number">{summary.high}</span>
            <span className="summary-label">High Risk</span>
          </div>
        </div>
        <div className="summary-card medium">
          <div className="summary-icon"><AlertTriangle size={24} /></div>
          <div className="summary-content">
            <span className="summary-number">{summary.medium}</span>
            <span className="summary-label">Medium Risk</span>
          </div>
        </div>
        <div className="summary-card low">
          <div className="summary-icon"><AlertTriangle size={24} /></div>
          <div className="summary-content">
            <span className="summary-number">{summary.low}</span>
            <span className="summary-label">Low Risk</span>
          </div>
        </div>
        <div className="summary-card total">
          <div className="summary-icon"><CheckCircle size={24} /></div>
          <div className="summary-content">
            <span className="summary-number">{summary.resolved}</span>
            <span className="summary-label">Resolved</span>
          </div>
        </div>
      </div>

      {/* Chart + Filter row */}
      <div className="chart-and-filter">
        <div className="chart-card-small">
          <h3>Severity Distribution</h3>
          {summary.total > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={bySeverity.filter(s => s.value > 0)}
                  cx="50%" cy="50%"
                  innerRadius={45} outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {bySeverity.filter(s => s.value > 0).map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-chart">No risks yet</div>
          )}
        </div>

        <div className="filter-panel">
          <div className="filter-group">
            <span>Filter by severity:</span>
            <div className="filter-buttons">
              {['all', 'high', 'medium', 'low', 'resolved'].map(f => (
                <button
                  key={f}
                  className={`filter-btn ${severityFilter === f ? 'active' : ''}`}
                  onClick={() => setSeverityFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="search-filter">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search risks, evidence, documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Risks List */}
      {filteredRisks.length === 0 ? (
        <div className="risk-empty">
          <Shield size={48} />
          <h3>{risks.length === 0 ? 'No Risks Detected Yet' : 'No matches'}</h3>
          <p>
            {risks.length === 0
              ? 'Run AI Analysis on a document to detect risks.'
              : 'Try a different filter or search.'}
          </p>
        </div>
      ) : (
        <div className="risks-list">
          {filteredRisks.map((risk) => (
            <div key={risk.id} className={`risk-card ${risk.severity} ${risk.is_resolved ? 'resolved' : ''}`}>
              <button className="risk-header" onClick={() => toggleRisk(risk.id)}>
                <div className="risk-left">
                  <span className={`severity-dot severity-${risk.severity}`}></span>
                  <div>
                    <span className="risk-title">{risk.risk?.slice(0, 100)}{risk.risk?.length > 100 ? '...' : ''}</span>
                    <div className="risk-meta">
                      {risk.document_name && <span>📄 {risk.document_name}</span>}
                      {risk.is_resolved && <span className="resolved-tag">✓ Resolved</span>}
                    </div>
                  </div>
                </div>
                <div className="risk-right">
                  <span className={`severity-badge badge-${risk.severity}`}>
                    {risk.severity?.toUpperCase()}
                  </span>
                  {expandedRisks[risk.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </div>
              </button>

              {expandedRisks[risk.id] && (
                <div className="risk-details">
                  <div className="detail-row">
                    <span className="detail-label">Full Description:</span>
                    <span className="detail-value">{risk.risk}</span>
                  </div>
                  {risk.evidence && (
                    <div className="detail-row">
                      <span className="detail-label">📎 Evidence from Document:</span>
                      <span className="detail-value evidence-quote">{risk.evidence}</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="detail-label">Document:</span>
                    <span className="detail-value">{risk.document_name} ({risk.document_id})</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Detected:</span>
                    <span className="detail-value">{new Date(risk.created_at).toLocaleString()}</span>
                  </div>
                  <div className="risk-actions">
                    {!risk.is_resolved && (
                      <button
                        className="btn-resolve"
                        onClick={(e) => handleResolve(risk.id, e)}
                      >
                        <CheckCircle size={14} /> Mark as Resolved
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="risk-disclaimer">
        <AlertTriangle size={16} />
        <p>Risk analysis is AI-generated. Consult legal counsel before making decisions based on these findings.</p>
      </div>
    </div>
  );
};

export default RiskAnalysis;