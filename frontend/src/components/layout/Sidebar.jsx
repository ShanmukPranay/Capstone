import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Brain,
  Search,
  Shield,
  AlertTriangle,
  Users,
  History,
  BarChart3,
  Settings,
  Scale,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/documents', icon: FileText, label: 'Documents' },
    { path: '/ai-analysis', icon: Brain, label: 'AI Analysis' },
    { path: '/rag-search', icon: Search, label: 'RAG Search' },
    { path: '/evidence', icon: Shield, label: 'Evidence' },
    { path: '/risk-analysis', icon: AlertTriangle, label: 'Risk Analysis' },
    { path: '/reviewer-adjudication', icon: Users, label: 'Reviewer Adjudication' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Scale size={28} />
          </div>
          {isOpen && (
            <div className="brand-text">
              <span className="brand-title">Evidence-Traceable</span>
              <span className="brand-subtitle">Information Extraction Platform</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''} ${!isOpen ? 'collapsed' : ''}`
              }
              title={!isOpen ? item.label : ''}
            >
              <item.icon size={20} className="nav-icon" />
              {isOpen && <span className="nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;