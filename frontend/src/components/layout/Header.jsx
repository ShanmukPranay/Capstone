import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  ChevronDown,
  LogOut,
  Settings as SettingsIcon,
  UserCircle,
  AlertTriangle,
  User,
  HelpCircle,
  Shield,
  X,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ toggleSidebar, onLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  // Current user - Team Lead
  const currentUser = {
    name: 'B. Sathvika',
    role: 'Team Lead',
    initial: 'BS'
  };

  // Notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Analysis Complete',
      message: 'Employment_Agreement.pdf analysis is complete',
      time: '2 min ago',
      read: false,
      icon: <CheckCircle size={16} color="#22c55e" />
    },
    {
      id: 2,
      title: 'New Risk Detected',
      message: 'High risk detected in NDA_Agreement.pdf',
      time: '15 min ago',
      read: false,
      icon: <AlertTriangle size={16} color="#ef4444" />
    },
    {
      id: 3,
      title: 'Review Pending',
      message: '3 items waiting for reviewer adjudication',
      time: '1 hour ago',
      read: true,
      icon: <Clock size={16} color="#f59e0b" />
    },
    {
      id: 4,
      title: 'Document Uploaded',
      message: 'Service_Contract.pdf has been uploaded',
      time: '2 hours ago',
      read: true,
      icon: <FileText size={16} color="#4f46e5" />
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogoutClick = () => {
    setShowProfileMenu(false);
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    if (onLogout) {
      onLogout();
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleProfileClick = () => {
    setShowProfileMenu(false);
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    setShowProfileMenu(false);
    navigate('/settings');
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
  };

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

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Navigate to Notifications page
  const handleViewAllNotifications = () => {
    setShowNotifications(false);
    navigate('/notifications');
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <Menu size={22} />
          </button>
          <div className="header-search">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search documents, clauses, evidence..." 
              className="search-input"
            />
            <kbd className="search-shortcut">⌘K</kbd>
          </div>
        </div>

        <div className="header-right">
          <div className="header-notifications">
            <button className="notif-btn" onClick={toggleNotifications}>
              <Bell size={20} />
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>

            {showNotifications && (
              <div className="notif-dropdown">
                <div className="notif-header">
                  <span className="notif-title">Notifications</span>
                  {unreadCount > 0 && (
                    <button className="notif-mark-all" onClick={markAllAsRead}>
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="notif-list">
                  {notifications.length === 0 ? (
                    <div className="notif-empty">
                      <Bell size={32} />
                      <p>No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`notif-item ${notif.read ? 'read' : 'unread'}`}
                        onClick={() => markAsRead(notif.id)}
                      >
                        <div className="notif-icon">{notif.icon}</div>
                        <div className="notif-content">
                          <div className="notif-title-text">{notif.title}</div>
                          <div className="notif-message">{notif.message}</div>
                          <div className="notif-time">{notif.time}</div>
                        </div>
                        <button 
                          className="notif-close"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearNotification(notif.id);
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <div className="notif-footer">
                  <button 
                    className="notif-view-all" 
                    onClick={handleViewAllNotifications}
                  >
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="header-profile">
            <button 
              className="profile-btn" 
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
            >
              <div className="profile-avatar">
                <span className="avatar-text">{currentUser.initial}</span>
              </div>
              <span className="profile-name">{currentUser.name}</span>
              <ChevronDown size={16} className="profile-chevron" />
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    <span className="avatar-text">{currentUser.initial}</span>
                  </div>
                  <div className="dropdown-user-info">
                    <span className="dropdown-user-name">{currentUser.name}</span>
                    <span className="dropdown-user-role">{currentUser.role}</span>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <div className="dropdown-item" onClick={handleProfileClick}>
                  <UserCircle size={16} />
                  <span>My Profile</span>
                </div>
                <div className="dropdown-item" onClick={handleSettingsClick}>
                  <SettingsIcon size={16} />
                  <span>Settings</span>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item logout" onClick={handleLogoutClick}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="logout-modal-overlay" onClick={handleLogoutCancel}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="logout-modal-icon">
              <AlertTriangle size={40} />
            </div>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout? You will be redirected to the login page.</p>
            <div className="logout-modal-actions">
              <button className="logout-modal-btn cancel" onClick={handleLogoutCancel}>
                No
              </button>
              <button className="logout-modal-btn confirm" onClick={handleLogoutConfirm}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;