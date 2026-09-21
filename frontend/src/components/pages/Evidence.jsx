import React, { useState, useEffect } from 'react';
import {
  Shield,
  CheckCircle,
  FileText,
  Link,
  Search,
  ChevronDown,
  ChevronRight,
  Loader2,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import './Evidence.css';

const Evidence = () => {
  const [evidence, setEvidence] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadEvidence();
  }, []);

  const loadEvidence = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAllEvidence();
      const items = res.evidence || [];
      // Deduplicate by message_id to avoid showing same citation 3x
      const seen = new Set();
      const unique = items.filter(e => {
        if (seen.has(e.message_id)) return false;
        seen.add(e.message_id);
        return true;
      });
      setEvidence(unique);

      if (unique.length > 0) {
        toast.success(`Loaded ${unique.length} unique citations`);
      } else {
        toast.success('No evidence yet. Ask questions in the ChatBot to generate citations.');
      }
    } catch (err) {
      console.error('Failed to load evidence:', err);
      toast.error('Could not load evidence');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItem = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getStrengthBadge = (similarity) => {
    if (similarity >= 0.4) return { cls: 'badge-strong', label: 'Strong' };
    if (similarity >= 0.25) return { cls: 'badge-medium', label: 'Medium' };
    return { cls: 'badge-weak', label: 'Weak' };
  };

  const isRealLLM = (model) => model && model !== 'mock';

  const filteredEvidence = evidence.filter(e =>
    !searchQuery ||
    e.answer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const avgConfidence = evidence.length > 0
    ? Math.round(evidence.reduce((s, e) => s + (e.confidence || 0), 0) / evidence.length)
    : 0;

  const realLLMCount = evidence.filter(e => isRealLLM(e.model_used)).length;

  return (
    <div className="evidence-page">
      <div className="page-header">
        <div>
          <h1>Evidence Traceability</h1>
          <p className="page-subtitle">All AI-generated answers with source evidence from your documents</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <Shield size={16} />
            <div>
              <div className="stat-value">{evidence.length}</div>
              <div className="stat-label">Citations</div>
            </div>
          </div>
          <div className="stat-item">
            <CheckCircle size={16} />
            <div>
              <div className="stat-value">{avgConfidence}%</div>
              <div className="stat-label">Avg Confidence</div>
            </div>
          </div>
          <div className="stat-item">
            <Link size={16} />
            <div>
              <div className="stat-value">{realLLMCount}</div>
              <div className="stat-label">Real LLM</div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="evidence-toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search answers or excerpts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="btn-refresh" onClick={loadEvidence} disabled={isLoading}>
          <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
          Refresh
        </button>
      </div>

      {isLoading && (
        <div className="evidence-loading">
          <Loader2 size={32} className="spin" />
          <p>Loading evidence...</p>
        </div>
      )}

      {!isLoading && filteredEvidence.length === 0 && (
        <div className="evidence-empty">
          <Shield size={48} />
          <h3>No Evidence Yet</h3>
          <p>
            {evidence.length === 0
              ? 'Ask questions in the ChatBot to generate evidence-backed answers.'
              : 'No results match your search.'}
          </p>
        </div>
      )}

      {!isLoading && filteredEvidence.length > 0 && (
        <div className="evidence-list">
          {filteredEvidence.map((item, idx) => {
            const isExpanded = expandedItems[item.message_id] || false;
            const { cls, label } = getStrengthBadge(item.similarity);

            return (
              <div key={`${item.message_id}-${idx}`} className="evidence-card">
                <div className="evidence-card-header" onClick={() => toggleItem(item.message_id)}>
                  <div className="evidence-card-icon">
                    <FileText size={18} />
                  </div>
                  <div className="evidence-card-title">
                    <div className="evidence-card-answer">{item.answer?.slice(0, 140)}{item.answer?.length > 140 ? '...' : ''}</div>
                    <div className="evidence-card-meta">
                      <span className={`strength-badge ${cls}`}>{label}</span>
                      <span>Chunk #{item.chunk_index ?? '-'}</span>
                      <span>·</span>
                      <span>Similarity: {((item.similarity || 0) * 100).toFixed(1)}%</span>
                      <span>·</span>
                      <span>Confidence: {item.confidence || 0}%</span>
                      <span>·</span>
                      <span className={isRealLLM(item.model_used) ? 'model-real' : 'model-mock'}>
                        {isRealLLM(item.model_used) ? '🧠 Real LLM' : '🔸 Mock'}
                      </span>
                    </div>
                  </div>
                  <div className="evidence-card-toggle">
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="evidence-card-body">
                    <div className="evidence-row">
                      <strong>Full Answer:</strong>
                      <p>{item.answer}</p>
                    </div>
                    <div className="evidence-row">
                      <strong>Source Excerpt:</strong>
                      <p className="excerpt">{item.excerpt || '(no excerpt)'}</p>
                    </div>
                    <div className="evidence-row">
                      <strong>Document ID:</strong>
                      <code>{item.document_id}</code>
                    </div>
                    <div className="evidence-row">
                      <strong>Chunk ID:</strong>
                      <code>{item.chunk_id}</code>
                    </div>
                    <div className="evidence-row">
                      <strong>Model Used:</strong>
                      <code>{item.model_used || 'N/A'}</code>
                    </div>
                    <div className="evidence-row">
                      <strong>Timestamp:</strong>
                      <span>{new Date(item.created_at).toLocaleString()}</span>
                    </div>
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

export default Evidence;