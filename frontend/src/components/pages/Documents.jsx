import React, { useState, useCallback } from 'react';
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
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';
import './Documents.css';

const Documents = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [processingStatus, setProcessingStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const validFiles = acceptedFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: (file.size / 1024).toFixed(1),
      type: file.type,
      status: 'uploaded',
      uploadedAt: new Date().toLocaleString(),
      pages: Math.floor(Math.random() * 15) + 5,
      extractedText: 'Available'
    }));

    setUploadedFiles(prev => [...prev, ...validFiles]);
    toast.success(`${validFiles.length} file(s) uploaded successfully`);

    validFiles.forEach(file => {
      setTimeout(() => startProcessing(file.id), 1000);
    });
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
    setIsProcessing(true);
    setProcessingStatus(fileId);
    
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
        setIsProcessing(false);
        setUploadedFiles(prev =>
          prev.map(f =>
            f.id === fileId
              ? { ...f, status: 'analyzed', processingComplete: true }
              : f
          )
        );
        toast.success('Analysis complete!');
      }
    }, 1500);
  };

  const removeFile = (id) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
    toast.success('File removed');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'analyzed': return <CheckCircle size={16} className="status-icon success" />;
      case 'processing': return <Clock size={16} className="status-icon processing" />;
      default: return <AlertCircle size={16} className="status-icon pending" />;
    }
  };

  return (
    <div className="documents-page">
      <div className="page-header">
        <div>
          <h1>Documents</h1>
          <p className="page-subtitle">Upload and manage legal documents for AI analysis</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline">
            <Filter size={16} />
            Filter
          </button>
          <button className="btn-primary">
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
          <button className="btn-browse">Browse Files</button>
        </div>
      </div>

      {processingStatus && isProcessing && (
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
            <span>{uploadedFiles.length} files</span>
          </div>
          <div className="file-items">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="file-item">
                <div className="file-info">
                  <div className="file-icon">
                    <FileText size={24} />
                  </div>
                  <div className="file-details">
                    <span className="file-name">{file.name}</span>
                    <div className="file-meta">
                      <span>{file.pages} pages</span>
                      <span>•</span>
                      <span>{file.size} KB</span>
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
                  {file.status === 'analyzed' && (
                    <button className="btn-analyze">Start AI Analysis</button>
                  )}
                  <button className="btn-remove" onClick={() => removeFile(file.id)}>
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;