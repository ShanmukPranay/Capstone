import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import Documents from './components/pages/Documents';
import AIAnalysis from './components/pages/AIAnalysis';
import RAGSearch from './components/pages/RAGSearch';
import Evidence from './components/pages/Evidence';
import RiskAnalysis from './components/pages/RiskAnalysis';
import ReviewerAdjudication from './components/pages/ReviewerAdjudication';
import History from './components/pages/History';
import Analytics from './components/pages/Analytics';
import Settings from './components/pages/Settings';
import Notifications from './components/pages/Notifications';
import ChatBot from './components/common/ChatBot';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('authToken', 'user_logged_in');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <div className="loading-text">
            <h2>Evidence-Traceable</h2>
            <p>Information Extraction Platform</p>
            <span className="loading-sub">Loading your dashboard...</span>
          </div>
          <div className="loading-progress">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="app-container">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} onLogout={handleLogout} />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/ai-analysis" element={<AIAnalysis />} />
              <Route path="/rag-search" element={<RAGSearch />} />
              <Route path="/evidence" element={<Evidence />} />
              <Route path="/risk-analysis" element={<RiskAnalysis />} />
              <Route path="/reviewer-adjudication" element={<ReviewerAdjudication />} />
              <Route path="/history" element={<History />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </div>
        <Toaster position="top-right" />
        <ChatBot />
      </div>
    </Router>
  );
}

export default App;