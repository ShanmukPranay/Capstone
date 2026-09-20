import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  CheckCircle,
  Clock,
  FileText,
  Brain,
  Shield,
  Users,
  Loader2,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import toast from 'react-hot-toast';
import api from '../../services/api';
import './Analytics.css';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAnalytics();
      setData(res);
    } catch (err) {
      console.error('Analytics load failed:', err);
      toast.error('Could not load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="analytics-page">
        <div className="analytics-loading">
          <Loader2 size={32} className="spin" />
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="analytics-page">
        <div className="analytics-empty">
          <BarChart3 size={48} />
          <h3>No Analytics Yet</h3>
          <p>Upload documents and chat with them to generate analytics.</p>
        </div>
      </div>
    );
  }

  const { summary, monthly_trend, model_distribution, recent_queries, top_documents } = data;

  // Colors for model distribution
  const modelColors = ['#22c55e', '#f59e0b', '#3b82f6', '#8b5cf6'];

  // Metrics for stat cards
  const metrics = [
    { label: 'Documents', value: summary.total_documents, icon: FileText, color: '#4f46e5' },
    { label: 'Analyzed', value: summary.analyzed_documents, icon: CheckCircle, color: '#22c55e' },
    { label: 'Chunks', value: summary.total_chunks, icon: Brain, color: '#06b6d4' },
    { label: 'Chat Sessions', value: summary.total_chat_sessions, icon: Users, color: '#f59e0b' },
    { label: 'Queries Asked', value: summary.total_user_queries, icon: Clock, color: '#8b5cf6' },
    { label: 'Citations', value: summary.total_citations, icon: Shield, color: '#ef4444' },
    { label: 'Real LLM Answers', value: summary.real_llm_answers, icon: Brain, color: '#059669' },
    { label: 'Avg Confidence', value: `${summary.avg_confidence}%`, icon: TrendingUp, color: '#6366f1' },
  ];

  return (
    <div className="analytics-page">
      <div className="page-header">
        <div>
          <h1>Analytics Dashboard</h1>
          <p className="page-subtitle">Real-time metrics from your legal intelligence system</p>
        </div>
        <div className="header-actions">
          <button className="btn-refresh" onClick={loadAnalytics}>
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        {metrics.map((metric, idx) => (
          <div key={idx} className="metric-card">
            <div className="metric-header">
              <div className="metric-icon" style={{ background: `${metric.color}15`, color: metric.color }}>
                <metric.icon size={18} />
              </div>
            </div>
            <div className="metric-value">{metric.value}</div>
            <div className="metric-label">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Document Activity Trend */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3>Document Activity Trend</h3>
            <span className="chart-period">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthly_trend}>
              <defs>
                <linearGradient id="colorDocs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAnalyzed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9edf2" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="documents" stroke="#4f46e5" fill="url(#colorDocs)" strokeWidth={2} />
              <Area type="monotone" dataKey="analyzed" stroke="#22c55e" fill="url(#colorAnalyzed)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Model Usage */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>LLM Usage</h3>
            <span className="chart-period">By model</span>
          </div>
          {model_distribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={model_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {model_distribution.map((entry, idx) => (
                    <Cell key={idx} fill={modelColors[idx % modelColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-chart">No LLM calls yet</div>
          )}
        </div>

        {/* Top Documents */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Top Documents</h3>
            <span className="chart-period">By chunks</span>
          </div>
          {top_documents.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={top_documents} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e9edf2" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#94a3b8"
                  fontSize={11}
                  width={100}
                  tickFormatter={(v) => v.length > 12 ? v.slice(0, 12) + '...' : v}
                />
                <Tooltip />
                <Bar dataKey="chunks" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-chart">No documents yet</div>
          )}
        </div>

        {/* Recent Queries */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3>Recent Queries</h3>
            <span className="chart-period">Last {recent_queries.length} questions</span>
          </div>
          {recent_queries.length > 0 ? (
            <div className="queries-list">
              {recent_queries.slice().reverse().map((q, idx) => (
                <div key={q.id || idx} className="query-item">
                  <div className="query-icon">💬</div>
                  <div className="query-content">
                    <div className="query-text">{q.content}</div>
                    <div className="query-time">
                      {new Date(q.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-chart">No queries yet. Try asking something in the ChatBot!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;