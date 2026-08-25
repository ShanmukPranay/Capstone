import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Brain,
  Shield,
  Users,
  Download,
  Calendar
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import './Analytics.css';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');

  const metrics = [
    { label: 'Extraction Accuracy', value: '94.2%', icon: Brain, color: '#4f46e5', trend: '+2.1%', trendUp: true },
    { label: 'Evidence Coverage', value: '91.7%', icon: Shield, color: '#7c3aed', trend: '+1.8%', trendUp: true },
    { label: 'Risk Detection Rate', value: '87.3%', icon: AlertTriangle, color: '#ef4444', trend: '-0.5%', trendUp: false },
    { label: 'Reviewer Acceptance', value: '89.5%', icon: Users, color: '#22c55e', trend: '+3.2%', trendUp: true },
    { label: 'Avg Processing Time', value: '2.4m', icon: Clock, color: '#f59e0b', trend: '-0.3m', trendUp: true },
    { label: 'Documents Processed', value: '156', icon: FileText, color: '#06b6d4', trend: '+12%', trendUp: true }
  ];

  const performanceData = [
    { week: 'Week 1', accuracy: 88, coverage: 82, precision: 85 },
    { week: 'Week 2', accuracy: 90, coverage: 85, precision: 87 },
    { week: 'Week 3', accuracy: 92, coverage: 88, precision: 89 },
    { week: 'Week 4', accuracy: 94, coverage: 91, precision: 92 }
  ];

  const riskDistribution = [
    { name: 'Contractual', value: 35, color: '#4f46e5' },
    { name: 'Compliance', value: 25, color: '#7c3aed' },
    { name: 'IP', value: 20, color: '#06b6d4' },
    { name: 'Employment', value: 12, color: '#f59e0b' },
    { name: 'Other', value: 8, color: '#22c55e' }
  ];

  const dailyData = [
    { day: 'Mon', docs: 12, time: 2.8 },
    { day: 'Tue', docs: 18, time: 2.3 },
    { day: 'Wed', docs: 14, time: 2.5 },
    { day: 'Thu', docs: 22, time: 2.1 },
    { day: 'Fri', docs: 16, time: 2.4 }
  ];

  const reviewOutcomes = [
    { name: 'Accepted', value: 89, color: '#22c55e' },
    { name: 'Modified', value: 7, color: '#f59e0b' },
    { name: 'Rejected', value: 4, color: '#ef4444' }
  ];

  return (
    <div className="analytics-page">
      <div className="page-header">
        <div>
          <h1>Analytics Dashboard</h1>
          <p className="page-subtitle">Performance metrics and insights for your legal intelligence system</p>
        </div>
        <div className="header-actions">
          <div className="time-selector">
            <button className={`time-btn ${timeRange === 'week' ? 'active' : ''}`} onClick={() => setTimeRange('week')}>Week</button>
            <button className={`time-btn ${timeRange === 'month' ? 'active' : ''}`} onClick={() => setTimeRange('month')}>Month</button>
            <button className={`time-btn ${timeRange === 'quarter' ? 'active' : ''}`} onClick={() => setTimeRange('quarter')}>Quarter</button>
          </div>
          <button className="btn-export">
            <Download size={16} />
            Export Report
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
              <span className={`metric-trend ${metric.trendUp ? 'positive' : 'negative'}`}>
                {metric.trend}
              </span>
            </div>
            <div className="metric-value">{metric.value}</div>
            <div className="metric-label">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Performance Trends */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3>Performance Trends</h3>
            <span className="chart-period">Last 4 weeks</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9edf2" />
              <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} domain={[70, 100]} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="accuracy" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.1} />
              <Area type="monotone" dataKey="coverage" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.1} />
              <Area type="monotone" dataKey="precision" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Risk Distribution</h3>
            <span className="chart-period">By category</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {riskDistribution.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Review Outcomes */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Review Outcomes</h3>
            <span className="chart-period">Adjudication results</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={reviewOutcomes}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {reviewOutcomes.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Processing */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3>Daily Processing Volume</h3>
            <span className="chart-period">This week</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9edf2" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="docs" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Documents" />
              <Line yAxisId="right" type="monotone" dataKey="time" stroke="#ef4444" strokeWidth={2.5} name="Avg Time (min)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="disclaimer-box">
        <div className="disclaimer-icon">📊</div>
        <div className="disclaimer-content">
          <h4>Demo / Sample Metrics</h4>
          <p>These metrics are generated from sample data for demonstration purposes and do not represent real experimental results.</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;