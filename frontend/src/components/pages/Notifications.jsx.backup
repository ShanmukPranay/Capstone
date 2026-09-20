import React, { useState } from 'react';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  X,
  Trash2,
  CheckCheck
} from 'lucide-react';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Analysis Complete',
      message: 'Employment_Agreement.pdf analysis is complete. All clauses have been extracted successfully.',
      time: '2024-01-15 10:30 AM',
      read: false,
      type: 'success',
      icon: <CheckCircle size={20} color="#22c55e" />
    },
    {
      id: 2,
      title: 'New Risk Detected',
      message: 'High risk detected in NDA_Agreement.pdf. Please review the confidentiality clause.',
      time: '2024-01-15 10:15 AM',
      read: false,
      type: 'danger',
      icon: <AlertTriangle size={20} color="#ef4444" />
    },
    {
      id: 3,
      title: 'Review Pending',
      message: '3 items waiting for reviewer adjudication in Employment_Agreement.pdf.',
      time: '2024-01-15 09:00 AM',
      read: true,
      type: 'warning',
      icon: <Clock size={20} color="#f59e0b" />
    },
    {
      id: 4,
      title: 'Document Uploaded',
      message: 'Service_Contract.pdf has been uploaded successfully. Ready for analysis.',
      time: '2024-01-14 04:30 PM',
      read: true,
      type: 'info',
      icon: <FileText size={20} color="#4f46e5" />
    },
    {
      id: 5,
      title: 'Analysis Complete',
      message: 'NDA_Agreement.pdf analysis is complete. 12 clauses extracted.',
      time: '2024-01-14 02:00 PM',
      read: true,
      type: 'success',
      icon: <CheckCircle size={20} color="#22c55e" />
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const deleteAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-page">
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p className="page-subtitle">View all your notifications and updates</p>
        </div>
        <div className="header-actions">
          {unreadCount > 0 && (
            <button className="btn-outline" onClick={markAllAsRead}>
              <CheckCheck size={16} />
              Mark All Read
            </button>
          )}
          {notifications.length > 0 && (
            <button className="btn-danger" onClick={deleteAll}>
              <Trash2 size={16} />
              Delete All
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <Bell size={64} />
          <h3>No Notifications</h3>
          <p>You're all caught up! No new notifications at this time.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`notif-card ${notif.read ? 'read' : 'unread'}`}
              onClick={() => markAsRead(notif.id)}
            >
              <div className="notif-card-icon">{notif.icon}</div>
              <div className="notif-card-content">
                <div className="notif-card-header">
                  <span className="notif-card-title">{notif.title}</span>
                  <span className="notif-card-time">{notif.time}</span>
                </div>
                <p className="notif-card-message">{notif.message}</p>
                {!notif.read && (
                  <span className="notif-card-badge">New</span>
                )}
              </div>
              <button 
                className="notif-card-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notif.id);
                }}
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;