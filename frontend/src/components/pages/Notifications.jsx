import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  X,
  Trash2,
  CheckCheck,
  RefreshCw,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [dismissedIds, setDismissedIds] = useState(() => {
    try {
      const stored = localStorage.getItem('dismissedNotifications');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState(null);
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  // Persist dismissed
  useEffect(() => {
    // Merge with existing to never lose dismissed IDs
    try {
      const stored = JSON.parse(localStorage.getItem('dismissedNotifications') || '[]');
      const merged = [...new Set([...stored, ...dismissedIds])];
      localStorage.setItem('dismissedNotifications', JSON.stringify(merged));
    } catch {
      localStorage.setItem('dismissedNotifications', JSON.stringify(dismissedIds));
    }
  }, [dismissedIds]);

  // Load on mount + auto-refresh every 10s
  useEffect(() => {
    loadNotifications();

    intervalRef.current = setInterval(() => {
      loadNotifications(true); // silent refresh
    }, 10000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const loadNotifications = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      // Read dismissed IDs fresh from localStorage EVERY time
      let currentDismissed = [];
      try {
        const stored = localStorage.getItem('dismissedNotifications');
        currentDismissed = stored ? JSON.parse(stored) : [];
      } catch (err) {
        console.error('Failed to parse dismissed IDs:', err);
        currentDismissed = [];
      }

      const res = await api.getNotifications();
      const items = (res.notifications || []).filter(
        n => !currentDismissed.includes(n.id)
      );
      setNotifications(items);
      setDismissedIds(currentDismissed);
      setLastSync(new Date());
    } catch (err) {
      console.error('Notifications load failed:', err);
      if (!silent) toast.error('Could not load notifications');
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  const getIcon = (type, severity) => {
    if (severity === 'success') return <CheckCircle size={20} color="#22c55e" />;
    if (severity === 'danger') return <AlertTriangle size={20} color="#ef4444" />;
    if (severity === 'warning') return <AlertTriangle size={20} color="#f59e0b" />;
    if (type === 'document_uploaded') return <FileText size={20} color="#4f46e5" />;
    if (type === 'review_pending') return <Clock size={20} color="#f59e0b" />;
    return <Bell size={20} color="#4f46e5" />;
  };

  const getTypeClass = (severity) => {
    if (severity === 'success') return 'success';
    if (severity === 'danger') return 'danger';
    if (severity === 'warning') return 'warning';
    return 'info';
  };

  const handleDismiss = (id) => {
    setDismissedIds(prev => [...prev, id]);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClick = (n) => {
    if (n.link) navigate(n.link);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All marked as read');
  };

  const handleDeleteAll = () => {
    setDismissedIds(prev => [...prev, ...notifications.map(n => n.id)]);
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  const formatTime = (iso) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      const now = new Date();
      const diff = (now - d) / 1000;
      if (diff < 60) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
      return d.toLocaleDateString();
    } catch { return iso; }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-page">
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p className="page-subtitle">
            View all your notifications and updates
            {lastSync && (
              <span className="sync-info">
                {' · '}
                Auto-refresh · Updated {lastSync.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className="header-actions">
          <button className="btn-outline" onClick={() => loadNotifications(false)}>
            <RefreshCw size={16} />
            Refresh
          </button>
          {notifications.length > 0 && (
            <>
              <button className="btn-outline" onClick={handleMarkAllRead}>
                <CheckCheck size={16} />
                Mark All Read
              </button>
              <button className="btn-danger" onClick={handleDeleteAll}>
                <Trash2 size={16} />
                Delete All
              </button>
            </>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="notif-loading">
          <Loader2 size={32} className="spin" />
          <p>Loading notifications...</p>
        </div>
      )}

      {!isLoading && notifications.length === 0 && (
        <div className="notif-empty">
          <Bell size={48} />
          <h3>You're All Caught Up!</h3>
          <p>New notifications will appear here as they arrive.</p>
        </div>
      )}

      {!isLoading && notifications.length > 0 && (
        <div className="notifications-list">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`notification-item ${getTypeClass(n.severity)} ${n.read ? 'read' : ''}`}
            >
              <div className="notif-icon">
                {getIcon(n.type, n.severity)}
              </div>
              <div className="notif-content" onClick={() => handleClick(n)}>
                <div className="notif-title">{n.title}</div>
                <div className="notif-message">{n.message}</div>
                {!n.read && <span className="notif-badge">New</span>}
              </div>
              <div className="notif-meta">
                <span className="notif-time">{formatTime(n.timestamp)}</span>
                <button
                  className="notif-dismiss"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDismiss(n.id);
                  }}
                  aria-label="Dismiss"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;