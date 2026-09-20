import React, { useState, useEffect } from 'react';
import {
  FileText, Brain, Shield, AlertTriangle, Users, CheckCircle,
  Download, Plus, X, File, FileSpreadsheet, Upload, RefreshCw, BarChart3
} from 'lucide-react';
import {
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import api from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showNewAnalysisModal, setShowNewAnalysisModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState(null);

  const [stats, setStats] = useState([
    { label: 'Total Documents', value: '...', icon: FileText, color: '#4f46e5', change: 'Loading...' },
    { label: 'Analyzed Documents', value: '...', icon: Brain, color: '#7c3aed', change: 'Loading...' },
    { label: 'Extracted Clauses', value: '...', icon: Shield, color: '#06b6d4', change: 'Loading...' },
    { label: 'Detected Risks', value: '...', icon: AlertTriangle, color: '#ef4444', change: 'Loading...' },
    { label: 'Pending Reviews', value: '...', icon: Users, color: '#f59e0b', change: 'Loading...' },
    { label: 'Verified Results', value: '...', icon: CheckCircle, color: '#22c55e', change: 'Loading...' },
  ]);

  const [documents, setDocuments] = useState([]);
  const [chartData, setChartData] = useState([
    { month: 'Oct', documents: 0, analyzed: 0 },
    { month: 'Nov', documents: 0, analyzed: 0 },
    { month: 'Dec', documents: 0, analyzed: 0 },
    { month: 'Jan', documents: 0, analyzed: 0 },
  ]);
  const [riskData, setRiskData] = useState([
    { name: 'High', value: 0, color: '#ef4444' },
    { name: 'Medium', value: 0, color: '#f59e0b' },
    { name: 'Low', value: 0, color: '#22c55e' },
  ]);

  // Fetch real data from backend
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.listDocuments();
        const docs = res.documents || [];

        const totalDocs = docs.length;
        const analyzedDocs = docs.filter(d => d.status === 'analyzed').length;
        const totalChunks = docs.reduce((s, d) => s + (d.total_chunks || 0), 0);

        setStats([
          { label: 'Total Documents', value: String(totalDocs), icon: FileText, color: '#4f46e5', change: 'All time' },
          { label: 'Analyzed Documents', value: String(analyzedDocs), icon: Brain, color: '#7c3aed', change: totalDocs > 0 ? Math.round((analyzedDocs / totalDocs) * 100) + '% of total' : '0%' },
          { label: 'Extracted Clauses', value: String(totalChunks), icon: Shield, color: '#06b6d4', change: 'From chunks' },
          { label: 'Detected Risks', value: '0', icon: AlertTriangle, color: '#ef4444', change: 'Not analyzed' },
          { label: 'Pending Reviews', value: '0', icon: Users, color: '#f59e0b', change: 'No reviews yet' },
          { label: 'Verified Results', value: String(analyzedDocs), icon: CheckCircle, color: '#22c55e', change: 'Verified' },
        ]);

        setDocuments(docs.slice(0, 5).map(d => ({
          name: d.name,
          type: d.document_type || 'Legal',
          status: d.status === 'analyzed' ? 'Verified' : (d.status === 'processing' ? 'Under Review' : 'Analyzed'),
          risks: 0,
          date: new Date(d.created_at).toISOString().slice(0, 10),
        })));

        toast.success('Dashboard loaded');
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        toast.error('Could not load dashboard data');
      }
    };
    load();
  }, []);

  const getStatusBadge = (status) => {
    const colors = {
      'Verified': 'badge-success',
      'Under Review': 'badge-warning',
      'Analyzed': 'badge-info',
      'Needs Attention': 'badge-danger',
    };
    return `status-badge ${colors[status] || 'badge-info'}`;
  };

  // Simple export functions
  const exportAsPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const margin = 20;
    let y = 20;
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229);
    doc.text('Evidence-Traceable', margin, y);
    y += 10;
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text('Intelligence Report', margin, y);
    y += 10;
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
    y += 15;

    stats.forEach((s) => {
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(`${s.label}: ${s.value}`, margin, y);
      y += 8;
    });

    doc.save(`Legal_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportAsCSV = () => {
    let csv = 'Document,Type,Status,Risks,Last Analyzed\n';
    documents.forEach(d => { csv += `${d.name},${d.type},${d.status},${d.risks},${d.date}\n`; });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Legal_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsExcel = () => {
    let xls = 'Document\tType\tStatus\tRisks\tLast Analyzed\n';
    documents.forEach(d => { xls += `${d.name}\t${d.type}\t${d.status}\t${d.risks}\t${d.date}\n`; });
    const blob = new Blob([xls], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Legal_Report_${new Date().toISOString().slice(0, 10)}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportConfirm = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setShowExportModal(false);
      if (exportFormat === 'pdf') { exportAsPDF(); toast.success('Exported PDF'); }
      else if (exportFormat === 'csv') { exportAsCSV(); toast.success('Exported CSV'); }
      else { exportAsExcel(); toast.success('Exported Excel'); }
    }, 800);
  };

  const handleNewAnalysisConfirm = () => {
    if (!selectedAnalysisType) { toast.error('Select an analysis type'); return; }
    setShowNewAnalysisModal(false);
    toast.success('Analysis started!');
    setSelectedAnalysisType(null);
  };

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Overview of your legal intelligence platform</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline" onClick={() => setShowExportModal(true)}>
            <Download size={16} /> Export Report
          </button>
          <button className="btn-primary" onClick={() => setShowNewAnalysisModal(true)}>
            <Plus size={16} /> New Analysis
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: `${s.color}15`, color: s.color }}>
                <s.icon size={20} />
              </div>
              <span className="stat-change">{s.change}</span>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Document Analysis Trend</h3>
            <span className="chart-period">Last 4 months</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9edf2" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="documents" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.1} />
              <Area type="monotone" dataKey="analyzed" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Risk Distribution</h3>
            <span className="chart-period">By severity</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={riskData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                {riskData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="recent-docs">
        <div className="section-header">
          <h3>Recent Documents</h3>
          <button className="view-all-btn">View All</button>
        </div>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Document</th>
              <th>Type</th>
              <th>Status</th>
              <th>Risks</th>
              <th>Last Analyzed</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                  No documents yet. Upload your first document to get started.
                </td>
              </tr>
            ) : (
              documents.map((doc, i) => (
                <tr key={i}>
                  <td className="doc-name">
                    <FileText size={16} />
                    {doc.name}
                  </td>
                  <td>{doc.type}</td>
                  <td><span className={getStatusBadge(doc.status)}>{doc.status}</span></td>
                  <td>{doc.risks}</td>
                  <td>{doc.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Export Report</h3>
              <button className="modal-close" onClick={() => setShowExportModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <p className="modal-description">Choose format:</p>
              <div className="export-options">
                {['pdf', 'csv', 'excel'].map(f => (
                  <label key={f} className={`export-option ${exportFormat === f ? 'selected' : ''}`}>
                    <input type="radio" name="fmt" value={f} checked={exportFormat === f} onChange={(e) => setExportFormat(e.target.value)} />
                    <span className="option-label">{f.toUpperCase()}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel" onClick={() => setShowExportModal(false)}>Cancel</button>
              <button className="modal-btn confirm" onClick={handleExportConfirm} disabled={isExporting}>
                {isExporting ? 'Exporting...' : <><Download size={16} /> Export</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Analysis Modal */}
      {showNewAnalysisModal && (
        <div className="modal-overlay" onClick={() => setShowNewAnalysisModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Start New Analysis</h3>
              <button className="modal-close" onClick={() => setShowNewAnalysisModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="new-analysis-options">
                {[
                  { id: 'upload', icon: Upload, title: 'Upload Document', desc: 'Upload a new document for analysis' },
                  { id: 'reanalyze', icon: RefreshCw, title: 'Re-analyze', desc: 'Re-analyze an existing document' },
                  { id: 'risk', icon: BarChart3, title: 'Risk Assessment', desc: 'Run a new risk assessment' },
                ].map(opt => (
                  <div
                    key={opt.id}
                    className={`analysis-option ${selectedAnalysisType === opt.id ? 'selected' : ''}`}
                    onClick={() => setSelectedAnalysisType(opt.id)}
                  >
                    <div className="option-icon-wrapper"><opt.icon size={28} /></div>
                    <h4>{opt.title}</h4>
                    <p>{opt.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel" onClick={() => setShowNewAnalysisModal(false)}>Cancel</button>
              <button className="modal-btn confirm" onClick={handleNewAnalysisConfirm} disabled={!selectedAnalysisType}>
                <Plus size={16} /> Start
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;