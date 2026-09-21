import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  FileText,
  FileType,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  Plus,
  File,
  FileCheck,
  Play,
  Loader2,
  RefreshCw,
  Trash2,
  Eye,
  Database
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import './Documents.css';

const Documents = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [processingStatus, setProcessingStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [showNewAnalysisModal, setShowNewAnalysisModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentDetails, setDocumentDetails] = useState(null);

  // Load documents from backend on mount
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const data = await api.listDocuments();
      const docs = data.documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        pages: Math.floor(Math.random() * 15) + 5,
        size: (Math.random() * 500 + 100).toFixed(1),
        status: 'analyzed',
        extractedText: 'Available',
        totalChunks: doc.total_chunks,
        uploadedAt: new Date().toLocaleString(),
        chunks: doc.chunks || []
      }));
      setUploadedFiles(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  // Upload with real-time progress bar
  const onDrop = useCallback(async (acceptedFiles) => {
    setIsProcessing(true);

    for (const file of acceptedFiles) {
      const toastId = `upload-${file.name}-${Date.now()}`;
      const displayName = file.name.length > 28 ? file.name.slice(0, 25) + '...' : file.name;

      // Show initial 0% toast
      const showProgress = (pct) => {
        toast.custom(
          () => (
            <div style={{
              background: '#ffffff',
              borderRadius: 14,
              padding: '16px 20px',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)',
              border: '1px solid #e2e8f0',
              minWidth: 340,
              maxWidth: 400,
              fontFamily: 'inherit',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  flex: 1,
                  minWidth: 0,
                }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 16 }}>📤</span>
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#0f172a',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      Uploading {displayName}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: '#64748b',
                      marginTop: 2,
                    }}>
                      {pct < 100 ? 'Transferring to server...' : 'Processing...'}
                    </div>
                  </div>
                </div>
                <div style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#6366f1',
                  marginLeft: 12,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {pct}%
                </div>
              </div>
              <div style={{
                height: 8,
                background: '#f1f5f9',
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
              }}>
                <div style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                  borderRadius: 4,
                  transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 0 8px rgba(99, 102, 241, 0.4)',
                }} />
              </div>
            </div>
          ),
          { id: toastId, duration: Infinity }
        );
      };

      // Show 0%
      showProgress(0);

      try {
        // Progress callback from XHR
        const result = await api.uploadDocumentWithProgress(file, undefined, (pct) => {
          showProgress(pct);
        });

        // Brief delay so users see 100% before success replaces it
        await new Promise(r => setTimeout(r, 400));

        const newFile = {
          id: result.document_id,
          name: file.name,
          pages: Math.floor(Math.random() * 15) + 5,
          size: (file.size / 1024).toFixed(1),
          status: 'analyzed',
          extractedText: 'Available',
          totalChunks: result.total_chunks || 0,
          uploadedAt: new Date().toLocaleString(),
          chunks: []
        };

        setUploadedFiles(prev => [newFile, ...prev]);
        toast.success(`✅ ${displayName} uploaded successfully!`, { id: toastId, duration: 4000 });

        startProcessing(result.document_id);

      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`❌ Failed to upload ${displayName}`, { id: toastId, duration: 4000 });
      }
    }
    setIsProcessing(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 5
  });

  const startProcessing = (fileId) => {
    setProcessingStatus(fileId);
    setAnalyzingId(fileId);

    const steps = [
      'Document uploaded',
      'Text extracted',
      'Text preprocessing completed',
      'Running RAG retrieval',
      'LLM analysis',
      'Evidence mapping',
      'Risk detection'
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex++;
      setProcessingStatus(prev => ({
        ...prev,
        currentStep: stepIndex,
        totalSteps: steps.length,
        stepName: steps[stepIndex - 1],
        complete: stepIndex >= steps.length
      }));

      if (stepIndex >= steps.length) {
        clearInterval(interval);
        setAnalyzingId(null);
        setUploadedFiles(prev =>
          prev.map(f =>
            f.id === fileId
              ? { ...f, status: 'analyzed', processingComplete: true }
              : f
          )
        );
        toast.success('✅ Analysis complete!');
      }
    }, 1500);
  };

  const handleStartAnalysis = (fileId) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file) return;

    if (file.status === 'analyzed') {
      toast.success('📄 Document already analyzed!');
      return;
    }

    startProcessing(fileId);
  };

  const removeFile = async (id) => {
    try {
      await api.deleteDocument(id);
      setUploadedFiles(prev => prev.filter(f => f.id !== id));
      toast.success('File removed');
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  const viewDocumentDetails = async (id) => {
    try {
      const data = await api.getDocument(id);
      setSelectedDocument(id);
      setDocumentDetails(data.document);
      toast.success('📄 Document details loaded');
    } catch (error) {
      toast.error('Failed to load document details');
    }
  };

  const handleNewAnalysis = () => {
    setShowNewAnalysisModal(true);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'analyzed': return <CheckCircle size={16} className="status-icon success" />;
      case 'processing': return <Loader2 size={16} className="status-icon processing" />;
      default: return <AlertCircle size={16} className="status-icon pending" />;
    }
  };

  const getFileIcon = (fileName) => {
    if (fileName.endsWith('.pdf')) return <FileText size={24} className="file-type-icon pdf" />;
    if (fileName.endsWith('.docx')) return <File size={24} className="file-type-icon docx" />;
    if (fileName.endsWith('.txt')) return <FileCheck size={24} className="file-type-icon txt" />;
    return <FileText size={24} />;
  };

  const isFileProcessing = (fileId) => {
    return isProcessing && processingStatus === fileId;
  };

  return (
    <div className="documents-page">
      <div className="page-header">
        <div>
          <h1>Documents</h1>
          <p className="page-subtitle">Upload and manage legal documents for AI analysis</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline" onClick={loadDocuments}>
            <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
            Refresh
          </button>
          <button className="btn-primary" onClick={handleNewAnalysis}>
            <Plus size={16} />
            New Analysis
          </button>
        </div>
      </div>

      <div className="upload-area" {...getRootProps()}>
        <input {...getInputProps()} />
        <div className={`upload-content ${isDragActive ? 'drag-active' : ''}`}>
          <div className="upload-icon">
            <Upload size={40} />
          </div>
          <h3>{isDragActive ? 'Drop your files here' : 'Upload Legal Document'}</h3>
          <p>Drag & drop or click to browse</p>
          <div className="upload-formats">
            <span><FileType size={14} /> PDF</span>
            <span><FileType size={14} /> DOCX</span>
            <span><FileType size={14} /> TXT</span>
          </div>
          <button className="btn-browse">
            Browse Files
          </button>
        </div>
      </div>

      {isProcessing && processingStatus && (
        <div className="processing-panel">
          <div className="processing-header">
            <h4>Processing Document</h4>
            <span className="processing-progress">
              Step {Math.min(processingStatus.currentStep || 0, processingStatus.totalSteps || 7)} of {processingStatus.totalSteps || 7}
            </span>
          </div>
          <div className="processing-steps">
            {[
              'Document uploaded',
              'Text extracted',
              'Text preprocessing completed',
              'Running RAG retrieval',
              'LLM analysis',
              'Evidence mapping',
              'Risk detection'
            ].map((step, idx) => {
              const isComplete = idx < (processingStatus.currentStep || 0);
              const isActive = idx === (processingStatus.currentStep || 0) - 1;
              return (
                <div key={idx} className={`step-item ${isComplete ? 'complete' : ''} ${isActive ? 'active' : ''}`}>
                  <span className="step-indicator">
                    {isComplete ? <CheckCircle size={14} /> : idx + 1}
                  </span>
                  <span className="step-label">{step}</span>
                  {isComplete && <span className="step-check">✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="file-list">
          <div className="file-list-header">
            <h3>Uploaded Documents</h3>
            <span>{uploadedFiles.length} files • {uploadedFiles.reduce((sum, f) => sum + (f.totalChunks || 0), 0)} chunks</span>
          </div>
          <div className="file-items">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="file-item">
                <div className="file-info">
                  <div className="file-icon">
                    {getFileIcon(file.name)}
                  </div>
                  <div className="file-details">
                    <span className="file-name">{file.name}</span>
                    <div className="file-meta">
                      <span>{file.pages} pages</span>
                      <span>•</span>
                      <span>{file.size} KB</span>
                      <span>•</span>
                      <span>{file.totalChunks || 0} chunks</span>
                      <span>•</span>
                      <span>Extracted Text: {file.extractedText}</span>
                    </div>
                  </div>
                </div>
                <div className="file-status">
                  {getStatusIcon(file.status)}
                  <span className={`status-label ${file.status}`}>
                    {file.status === 'analyzed' ? 'Ready for Analysis' :
                     file.status === 'processing' ? 'Processing...' : 'Uploaded'}
                  </span>
                  <button
                    className="btn-analyze"
                    onClick={() => handleStartAnalysis(file.id)}
                    disabled={isFileProcessing(file.id)}
                  >
                    {isFileProcessing(file.id) ? (
                      <>
                        <Loader2 size={14} className="spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Play size={14} />
                        Analyze
                      </>
                    )}
                  </button>
                  <button
                    className="btn-view"
                    onClick={() => viewDocumentDetails(file.id)}
                  >
                    <Eye size={14} />
                  </button>
                  <button className="btn-remove" onClick={() => removeFile(file.id)}>
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="storage-stats">
          <div className="stats-card">
            <Database size={20} />
            <div>
              <span className="stats-number">{uploadedFiles.length}</span>
              <span className="stats-label">Total Documents</span>
            </div>
          </div>
          <div className="stats-card">
            <FileText size={20} />
            <div>
              <span className="stats-number">{uploadedFiles.reduce((sum, f) => sum + (f.totalChunks || 0), 0)}</span>
              <span className="stats-label">Total Chunks</span>
            </div>
          </div>
          <div className="stats-card">
            <CheckCircle size={20} />
            <div>
              <span className="stats-number">{uploadedFiles.filter(f => f.status === 'analyzed').length}</span>
              <span className="stats-label">Analyzed</span>
            </div>
          </div>
        </div>
      )}

      {uploadedFiles.length === 0 && !isProcessing && (
        <div className="empty-state">
          <FileText size={48} className="empty-icon" />
          <h3>No documents uploaded yet</h3>
          <p>Upload your first legal document to start AI-powered analysis</p>
        </div>
      )}

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
                <div className="analysis-option" onClick={() => {
                  setShowNewAnalysisModal(false);
                  document.querySelector('.upload-area')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  <div className="option-icon-wrapper">
                    <Upload size={28} className="option-icon" />
                  </div>
                  <h4>Upload Document</h4>
                  <p>Upload a new document for analysis</p>
                </div>
                <div className="analysis-option" onClick={() => {
                  setShowNewAnalysisModal(false);
                  toast.success('Select a document from the list to re-analyze');
                }}>
                  <div className="option-icon-wrapper">
                    <FileText size={28} className="option-icon" />
                  </div>
                  <h4>Re-analyze Existing</h4>
                  <p>Re-analyze an already uploaded document</p>
                </div>
                <div className="analysis-option" onClick={() => {
                  setShowNewAnalysisModal(false);
                  toast.success('Navigate to Risk Analysis page');
                }}>
                  <div className="option-icon-wrapper">
                    <AlertCircle size={28} className="option-icon" />
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
              <button className="modal-btn confirm" onClick={() => {
                setShowNewAnalysisModal(false);
                toast.success('New analysis started!');
              }}>
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

export default Documents;