import React, { useState } from 'react';
import {
  FileText,
  Brain,
  Shield,
  AlertTriangle,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Download,
  Plus,
  X,
  File,
  FileSpreadsheet,
  Upload,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import {
  LineChart,
  Line,
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
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import './Dashboard.css';

const Dashboard = () => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showNewAnalysisModal, setShowNewAnalysisModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState(null);

  const [stats] = useState([
    { label: 'Total Documents', value: '12', icon: FileText, color: '#4f46e5', change: '+2 this week' },
    { label: 'Analyzed Documents', value: '8', icon: Brain, color: '#7c3aed', change: '67% of total' },
    { label: 'Extracted Clauses', value: '146', icon: Shield, color: '#06b6d4', change: '+12 from last week' },
    { label: 'Detected Risks', value: '23', icon: AlertTriangle, color: '#ef4444', change: '3 high priority' },
    { label: 'Pending Reviews', value: '7', icon: Users, color: '#f59e0b', change: 'Awaiting adjudication' },
    { label: 'Verified Results', value: '91', icon: CheckCircle, color: '#22c55e', change: '94% accuracy' },
  ]);

  const [documents] = useState([
    { name: 'Employment_Agreement.pdf', type: 'Employment', status: 'Verified', risks: 2, date: '2024-01-15' },
    { name: 'NDA_Agreement.pdf', type: 'Confidentiality', status: 'Under Review', risks: 4, date: '2024-01-14' },
    { name: 'Rental_Agreement.pdf', type: 'Contract', status: 'Analyzed', risks: 1, date: '2024-01-12' },
    { name: 'Service_Contract.pdf', type: 'Service', status: 'Needs Attention', risks: 5, date: '2024-01-10' },
    { name: 'Partnership_Agreement.pdf', type: 'Partnership', status: 'Under Review', risks: 3, date: '2024-01-08' },
  ]);

  const [chartData] = useState([
    { month: 'Oct', documents: 4, analyzed: 3 },
    { month: 'Nov', documents: 7, analyzed: 5 },
    { month: 'Dec', documents: 5, analyzed: 4 },
    { month: 'Jan', documents: 12, analyzed: 8 },
  ]);

  const [riskData] = useState([
    { name: 'High', value: 3, color: '#ef4444' },
    { name: 'Medium', value: 8, color: '#f59e0b' },
    { name: 'Low', value: 12, color: '#22c55e' },
  ]);

  const getStatusBadge = (status) => {
    const colors = {
      'Verified': 'badge-success',
      'Under Review': 'badge-warning',
      'Analyzed': 'badge-info',
      'Needs Attention': 'badge-danger'
    };
    return `status-badge ${colors[status] || 'badge-info'}`;
  };

  // Export as PDF
  const exportAsPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let y = 20;

    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(2);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229);
    doc.setFont('helvetica', 'bold');
    doc.text('Evidence-Traceable', margin, y + 2);
    y += 8;

    doc.setFontSize(13);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text('Information Extraction Platform', margin, y + 2);
    y += 10;

    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text('Intelligence Report', margin, y);
    y += 10;

    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
    doc.text(`Report ID: LEGAL-${Date.now().toString().slice(-6)}`, pageWidth - margin - 30, y);
    y += 8;

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text('Executive Summary', margin, y);
    y += 8;

    const colWidth = (pageWidth - margin * 2) / 3;
    const statPairs = [
      [stats[0], stats[1]],
      [stats[2], stats[3]],
      [stats[4], stats[5]]
    ];

    statPairs.forEach((pair, colIndex) => {
      const x = margin + colIndex * colWidth;
      let localY = y;
      
      pair.forEach((stat) => {
        doc.setFontSize(16);
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text(stat.value, x, localY);
        localY += 6;
        
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'normal');
        doc.text(stat.label, x, localY);
        localY += 4;
        
        doc.setFontSize(7);
        const isPositive = stat.change.startsWith('+');
        doc.setTextColor(isPositive ? 34 : 239, isPositive ? 197 : 68, isPositive ? 94 : 68);
        doc.text(stat.change, x, localY);
        localY += 8;
      });
    });

    y += 48;

    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text('Risk Distribution', margin, y);
    y += 8;

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'bold');
    doc.text('Risk Level', margin, y);
    doc.text('Count', margin + 40, y);
    doc.text('Percentage', margin + 70, y);
    y += 6;

    const totalRisks = riskData.reduce((sum, item) => sum + item.value, 0);
    riskData.forEach((item) => {
      const percentage = ((item.value / totalRisks) * 100).toFixed(1);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      doc.text(item.name, margin, y);
      doc.text(item.value.toString(), margin + 40, y);
      doc.text(`${percentage}%`, margin + 70, y);
      y += 6;
    });

    y += 8;

    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text('Recent Documents', margin, y);
    y += 8;

    const headers = ['Document', 'Type', 'Status', 'Risks', 'Date'];
    const colSizes = [45, 25, 25, 15, 30];
    let xPos = margin;

    doc.setFillColor(79, 70, 229);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');

    headers.forEach((header, i) => {
      doc.rect(xPos, y - 4, colSizes[i], 7, 'F');
      doc.text(header, xPos + 2, y + 1);
      xPos += colSizes[i];
    });
    y += 6;

    documents.forEach((docItem, idx) => {
      const rowData = [
        docItem.name.length > 15 ? docItem.name.substring(0, 13) + '..' : docItem.name,
        docItem.type,
        docItem.status,
        docItem.risks.toString(),
        docItem.date
      ];

      xPos = margin;
      const isEven = idx % 2 === 0;
      doc.setFillColor(isEven ? 248 : 255, isEven ? 250 : 255, isEven ? 252 : 255);
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');

      rowData.forEach((data, i) => {
        doc.rect(xPos, y - 3, colSizes[i], 6.5, 'F');
        doc.text(data, xPos + 2, y + 1.5);
        xPos += colSizes[i];
      });
      y += 7;

      if (y > pageHeight - 30) {
        doc.addPage();
        y = 20;
      }
    });

    y += 10;

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'This report is auto-generated by Evidence-Traceable Information Extraction Platform.',
      margin,
      y
    );
    y += 4;
    doc.text(
      '© 2024 Evidence-Traceable - All Rights Reserved | Confidential',
      margin,
      y
    );

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth - margin - 20,
        pageHeight - 10
      );
    }

    doc.save(`Legal_Report_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  // Export as CSV
  const exportAsCSV = () => {
    let csv = 'Document,Type,Status,Risks,Last Analyzed\n';
    
    documents.forEach(doc => {
      csv += `${doc.name},${doc.type},${doc.status},${doc.risks},${doc.date}\n`;
    });

    csv += '\n\nSummary Statistics\n';
    csv += `Total Documents,${stats[0].value}\n`;
    csv += `Analyzed Documents,${stats[1].value}\n`;
    csv += `Extracted Clauses,${stats[2].value}\n`;
    csv += `Detected Risks,${stats[3].value}\n`;
    csv += `Pending Reviews,${stats[4].value}\n`;
    csv += `Verified Results,${stats[5].value}\n`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Legal_Report_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export as Excel
  const exportAsExcel = () => {
    let excel = 'Document\tType\tStatus\tRisks\tLast Analyzed\n';
    
    documents.forEach(doc => {
      excel += `${doc.name}\t${doc.type}\t${doc.status}\t${doc.risks}\t${doc.date}\n`;
    });

    excel += '\n\nSummary Statistics\n';
    excel += `Total Documents\t${stats[0].value}\n`;
    excel += `Analyzed Documents\t${stats[1].value}\n`;
    excel += `Extracted Clauses\t${stats[2].value}\n`;
    excel += `Detected Risks\t${stats[3].value}\n`;
    excel += `Pending Reviews\t${stats[4].value}\n`;
    excel += `Verified Results\t${stats[5].value}\n`;

    const blob = new Blob([excel], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Legal_Report_${new Date().toISOString().slice(0,10)}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportReport = () => {
    setShowExportModal(true);
  };

  const handleExportConfirm = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      setIsExporting(false);
      setShowExportModal(false);
      
      switch(exportFormat) {
        case 'pdf':
          exportAsPDF();
          toast.success('Report exported as PDF');
          break;
        case 'csv':
          exportAsCSV();
          toast.success('Report exported as CSV');
          break;
        case 'excel':
          exportAsExcel();
          toast.success('Report exported as Excel');
          break;
        default:
          toast.error('Unknown format selected');
      }
    }, 1500);
  };

  const handleNewAnalysis = () => {
    setShowNewAnalysisModal(true);
    setSelectedAnalysisType(null);
  };

  const handleAnalysisOptionClick = (type) => {
    setSelectedAnalysisType(type);
  };

  const handleNewAnalysisConfirm = () => {
    if (!selectedAnalysisType) {
      toast.error('Please select an analysis type');
      return;
    }
    
    setShowNewAnalysisModal(false);
    
    const typeNames = {
      'upload': 'Upload Document',
      'reanalyze': 'Re-analyze Existing',
      'risk': 'Risk Assessment'
    };
    
    toast.success(`${typeNames[selectedAnalysisType]} started!`);
    setSelectedAnalysisType(null);
  };

  const getFormatIcon = () => {
    switch(exportFormat) {
      case 'pdf':
        return <File size={20} />;
      case 'csv':
        return <FileText size={20} />;
      case 'excel':
        return <FileSpreadsheet size={20} />;
      default:
        return <File size={20} />;
    }
  };

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Overview of your legal intelligence platform</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline" onClick={handleExportReport}>
            <Download size={16} />
            Export Report
          </button>
          <button className="btn-primary" onClick={handleNewAnalysis}>
            <Plus size={16} />
            New Analysis
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                <stat.icon size={20} />
              </div>
              <span className="stat-change">{stat.change}</span>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
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
              <Area 
                type="monotone" 
                dataKey="documents" 
                stroke="#4f46e5" 
                fill="#4f46e5" 
                fillOpacity={0.1}
              />
              <Area 
                type="monotone" 
                dataKey="analyzed" 
                stroke="#7c3aed" 
                fill="#7c3aed" 
                fillOpacity={0.1}
              />
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
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {riskData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
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
            {documents.map((doc, idx) => (
              <tr key={idx}>
                <td className="doc-name">
                  <FileText size={16} />
                  {doc.name}
                </td>
                <td>{doc.type}</td>
                <td>
                  <span className={getStatusBadge(doc.status)}>{doc.status}</span>
                </td>
                <td>{doc.risks}</td>
                <td>{doc.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Export Report Modal */}
      {showExportModal && (
        <div className="modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Export Report</h3>
              <button className="modal-close" onClick={() => setShowExportModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-description">Choose the format to export your report:</p>
              <div className="export-options">
                <label className={`export-option ${exportFormat === 'pdf' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="exportFormat"
                    value="pdf"
                    checked={exportFormat === 'pdf'}
                    onChange={(e) => setExportFormat(e.target.value)}
                  />
                  <span className="option-label">PDF</span>
                  <span className="option-desc">Professional PDF document</span>
                </label>
                <label className={`export-option ${exportFormat === 'csv' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="exportFormat"
                    value="csv"
                    checked={exportFormat === 'csv'}
                    onChange={(e) => setExportFormat(e.target.value)}
                  />
                  <span className="option-label">CSV</span>
                  <span className="option-desc">Comma Separated Values</span>
                </label>
                <label className={`export-option ${exportFormat === 'excel' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="exportFormat"
                    value="excel"
                    checked={exportFormat === 'excel'}
                    onChange={(e) => setExportFormat(e.target.value)}
                  />
                  <span className="option-label">Excel</span>
                  <span className="option-desc">Microsoft Excel compatible</span>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel" onClick={() => setShowExportModal(false)}>
                Cancel
              </button>
              <button className="modal-btn confirm" onClick={handleExportConfirm} disabled={isExporting}>
                {isExporting ? (
                  <>
                    <span className="spinner-small"></span>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    Export {getFormatIcon()}
                  </>
                )}
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
              <button className="modal-close" onClick={() => setShowNewAnalysisModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-description">Start a new AI-powered legal document analysis.</p>
              <div className="new-analysis-options">
                <div 
                  className={`analysis-option ${selectedAnalysisType === 'upload' ? 'selected' : ''}`}
                  onClick={() => handleAnalysisOptionClick('upload')}
                >
                  <div className="option-icon-wrapper">
                    <Upload size={28} className="option-icon" />
                  </div>
                  <h4>Upload Document</h4>
                  <p>Upload a new document for analysis</p>
                </div>
                <div 
                  className={`analysis-option ${selectedAnalysisType === 'reanalyze' ? 'selected' : ''}`}
                  onClick={() => handleAnalysisOptionClick('reanalyze')}
                >
                  <div className="option-icon-wrapper">
                    <RefreshCw size={28} className="option-icon" />
                  </div>
                  <h4>Re-analyze Existing</h4>
                  <p>Re-analyze an already uploaded document</p>
                </div>
                <div 
                  className={`analysis-option ${selectedAnalysisType === 'risk' ? 'selected' : ''}`}
                  onClick={() => handleAnalysisOptionClick('risk')}
                >
                  <div className="option-icon-wrapper">
                    <BarChart3 size={28} className="option-icon" />
                  </div>
                  <h4>Risk Assessment</h4>
                  <p>Run a new risk assessment report</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel" onClick={() => setShowNewAnalysisModal(false)}>
                Cancel
              </button>
              <button 
                className="modal-btn confirm" 
                onClick={handleNewAnalysisConfirm}
                disabled={!selectedAnalysisType}
              >
                <Plus size={16} />
                Start Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;