import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Brain,
  Database,
  FileText,
  Users,
  Shield,
  Bell,
  Save,
  RefreshCw,
  Zap,
  Lock,
  Mail,
  UserCog,
  HardDrive,
  Cloud,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('llm');
  const [saved, setSaved] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // LLM Settings
  const [llmSettings, setLlmSettings] = useState({
    model: 'llama3-70b',
    temperature: 0.2,
    maxTokens: 4096,
    topP: 0.9,
    apiKey: 'sk-••••••••••••••••'
  });

  // RAG Settings
  const [ragSettings, setRagSettings] = useState({
    embeddingModel: 'all-MiniLM-L6-v2',
    topK: 5,
    chunkSize: 500,
    chunkOverlap: 50,
    vectorDb: 'supabase'
  });

  // Processing Settings
  const [processingSettings, setProcessingSettings] = useState({
    ocrEnabled: true,
    nerModel: 'spacy_en_core_web_sm',
    languageDetection: true,
    maxFileSize: '25'
  });

  // User Management
  const [users, setUsers] = useState([
    { id: 1, name: 'B. Sathvika', email: 'sathvika@example.com', role: 'admin' },
    { id: 2, name: 'A.S. Pranay', email: 'pranay@example.com', role: 'reviewer' },
    { id: 3, name: 'K. Pavan', email: 'pavan@example.com', role: 'reviewer' },
    { id: 4, name: 'P. Mohana Priya', email: 'mohana@example.com', role: 'viewer' }
  ]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'viewer' });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    sessionTimeout: '30',
    encryption: true,
    apiRotation: '30'
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    analysisComplete: true,
    riskDetected: true,
    reviewPending: true,
    dailySummary: false,
    emailNotifications: true
  });

  const handleSave = () => {
    setSaved(true);
    toast.success('✅ Settings saved successfully!');
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    toast.success('🔄 Settings reset to default');
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error('Please fill in all fields');
      return;
    }
    setUsers([...users, { ...newUser, id: Date.now() }]);
    setNewUser({ name: '', email: '', role: 'viewer' });
    setShowAddUser(false);
    toast.success('✅ User added successfully');
  };

  const handleRemoveUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
    toast.success('User removed');
  };

  const getRoleBadge = (role) => {
    const colors = {
      'admin': 'role-admin',
      'reviewer': 'role-reviewer',
      'viewer': 'role-viewer'
    };
    return `role-badge ${colors[role] || 'role-viewer'}`;
  };

  // Toggle handlers
  const toggleOcr = () => {
    setProcessingSettings({ ...processingSettings, ocrEnabled: !processingSettings.ocrEnabled });
  };

  const toggleLanguageDetection = () => {
    setProcessingSettings({ ...processingSettings, languageDetection: !processingSettings.languageDetection });
  };

  const toggleTwoFactor = () => {
    setSecuritySettings({ ...securitySettings, twoFactor: !securitySettings.twoFactor });
  };

  const toggleNotification = (key) => {
    setNotificationSettings({ ...notificationSettings, [key]: !notificationSettings[key] });
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="page-subtitle">Configure your legal intelligence system</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline" onClick={handleReset}>
            <RefreshCw size={16} />
            Reset Defaults
          </button>
          <button className={`btn-save ${saved ? 'saved' : ''}`} onClick={handleSave}>
            {saved ? (
              <>
                <CheckCircle size={16} />
                Saved!
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <div className="settings-container">
        {/* Sidebar Tabs */}
        <div className="settings-sidebar">
          <button
            className={`settings-tab ${activeTab === 'llm' ? 'active' : ''}`}
            onClick={() => setActiveTab('llm')}
          >
            <Brain size={18} />
            <span>LLM Configuration</span>
          </button>
          <button
            className={`settings-tab ${activeTab === 'rag' ? 'active' : ''}`}
            onClick={() => setActiveTab('rag')}
          >
            <Database size={18} />
            <span>RAG Configuration</span>
          </button>
          <button
            className={`settings-tab ${activeTab === 'processing' ? 'active' : ''}`}
            onClick={() => setActiveTab('processing')}
          >
            <FileText size={18} />
            <span>Document Processing</span>
          </button>
          <button
            className={`settings-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} />
            <span>User Management</span>
          </button>
          <button
            className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={18} />
            <span>Security</span>
          </button>
          <button
            className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} />
            <span>Notifications</span>
          </button>
        </div>

        {/* Content */}
        <div className="settings-content">
          {/* LLM Configuration */}
          {activeTab === 'llm' && (
            <div className="settings-section">
              <h3>LLM Configuration</h3>
              <p className="section-desc">Configure the language model settings for legal analysis</p>
              
              <div className="setting-group">
                <div className="setting-item">
                  <label>Model</label>
                  <select 
                    className="setting-select"
                    value={llmSettings.model}
                    onChange={(e) => setLlmSettings({ ...llmSettings, model: e.target.value })}
                  >
                    <option value="gpt-4">GPT-4</option>
                    <option value="claude-3.5">Claude 3.5 Sonnet</option>
                    <option value="gemini-1.5">Gemini 1.5 Pro</option>
                    <option value="llama3-70b">Llama 3 70B</option>
                    <option value="mistral-large">Mistral Large</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Temperature</label>
                  <div className="slider-container">
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.1" 
                      value={llmSettings.temperature}
                      onChange={(e) => setLlmSettings({ ...llmSettings, temperature: parseFloat(e.target.value) })}
                      className="setting-slider" 
                    />
                    <span className="slider-value">{llmSettings.temperature}</span>
                  </div>
                  <span className="setting-hint">Lower values produce more deterministic outputs</span>
                </div>

                <div className="setting-item">
                  <label>Max Tokens</label>
                  <input 
                    type="number" 
                    value={llmSettings.maxTokens}
                    onChange={(e) => setLlmSettings({ ...llmSettings, maxTokens: parseInt(e.target.value) })}
                    className="setting-input" 
                  />
                  <span className="setting-hint">Maximum length of generated responses</span>
                </div>

                <div className="setting-item">
                  <label>Top P</label>
                  <div className="slider-container">
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.05" 
                      value={llmSettings.topP}
                      onChange={(e) => setLlmSettings({ ...llmSettings, topP: parseFloat(e.target.value) })}
                      className="setting-slider" 
                    />
                    <span className="slider-value">{llmSettings.topP}</span>
                  </div>
                </div>

                <div className="setting-item">
                  <label>API Key</label>
                  <div className="api-key-input">
                    <input 
                      type={showApiKey ? 'text' : 'password'}
                      value={llmSettings.apiKey}
                      onChange={(e) => setLlmSettings({ ...llmSettings, apiKey: e.target.value })}
                      className="setting-input api-key" 
                    />
                    <button 
                      className="api-key-toggle"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <span className="setting-hint">Your API key for the selected model</span>
                </div>
              </div>
            </div>
          )}

          {/* RAG Configuration */}
          {activeTab === 'rag' && (
            <div className="settings-section">
              <h3>RAG Configuration</h3>
              <p className="section-desc">Configure retrieval-augmented generation settings</p>
              
              <div className="setting-group">
                <div className="setting-item">
                  <label>Embedding Model</label>
                  <select 
                    className="setting-select"
                    value={ragSettings.embeddingModel}
                    onChange={(e) => setRagSettings({ ...ragSettings, embeddingModel: e.target.value })}
                  >
                    <option value="text-embedding-ada-002">text-embedding-ada-002</option>
                    <option value="all-MiniLM-L6-v2">all-MiniLM-L6-v2</option>
                    <option value="all-mpnet-base-v2">all-mpnet-base-v2</option>
                    <option value="all-MiniLM-L12-v2">all-MiniLM-L12-v2</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Top-K Retrieval</label>
                  <input 
                    type="number" 
                    value={ragSettings.topK}
                    onChange={(e) => setRagSettings({ ...ragSettings, topK: parseInt(e.target.value) })}
                    className="setting-input" 
                  />
                  <span className="setting-hint">Number of most relevant chunks to retrieve</span>
                </div>

                <div className="setting-item">
                  <label>Chunk Size</label>
                  <input 
                    type="number" 
                    value={ragSettings.chunkSize}
                    onChange={(e) => setRagSettings({ ...ragSettings, chunkSize: parseInt(e.target.value) })}
                    className="setting-input" 
                  />
                  <span className="setting-hint">Number of characters per document chunk</span>
                </div>

                <div className="setting-item">
                  <label>Chunk Overlap</label>
                  <input 
                    type="number" 
                    value={ragSettings.chunkOverlap}
                    onChange={(e) => setRagSettings({ ...ragSettings, chunkOverlap: parseInt(e.target.value) })}
                    className="setting-input" 
                  />
                  <span className="setting-hint">Overlap between consecutive chunks</span>
                </div>

                <div className="setting-item">
                  <label>Vector Database</label>
                  <select 
                    className="setting-select"
                    value={ragSettings.vectorDb}
                    onChange={(e) => setRagSettings({ ...ragSettings, vectorDb: e.target.value })}
                  >
                    <option value="supabase">Supabase Vector</option>
                    <option value="pinecone">Pinecone</option>
                    <option value="weaviate">Weaviate</option>
                    <option value="qdrant">Qdrant</option>
                    <option value="chroma">Chroma</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Document Processing - FIXED */}
          {activeTab === 'processing' && (
            <div className="settings-section">
              <h3>Document Processing</h3>
              <p className="section-desc">Configure document parsing and processing settings</p>
              
              <div className="setting-group">
                {/* OCR Enabled - Fixed Toggle */}
                <div className="setting-item toggle-item">
                  <label>OCR Enabled</label>
                  <div className="toggle-container" onClick={toggleOcr}>
                    <div className={`toggle-track ${processingSettings.ocrEnabled ? 'active' : ''}`}>
                      <div className={`toggle-thumb ${processingSettings.ocrEnabled ? 'active' : ''}`}></div>
                    </div>
                  </div>
                  <span className="setting-hint">{processingSettings.ocrEnabled ? 'Enabled' : 'Disabled'}</span>
                </div>

                <div className="setting-item">
                  <label>NER Models</label>
                  <select 
                    className="setting-select"
                    value={processingSettings.nerModel}
                    onChange={(e) => setProcessingSettings({ ...processingSettings, nerModel: e.target.value })}
                  >
                    <option value="spacy_en_core_web_sm">spaCy (en_core_web_sm)</option>
                    <option value="spacy_en_core_web_md">spaCy (en_core_web_md)</option>
                    <option value="spacy_en_core_web_lg">spaCy (en_core_web_lg)</option>
                  </select>
                </div>

                {/* Language Detection - Fixed Toggle */}
                <div className="setting-item toggle-item">
                  <label>Language Detection</label>
                  <div className="toggle-container" onClick={toggleLanguageDetection}>
                    <div className={`toggle-track ${processingSettings.languageDetection ? 'active' : ''}`}>
                      <div className={`toggle-thumb ${processingSettings.languageDetection ? 'active' : ''}`}></div>
                    </div>
                  </div>
                  <span className="setting-hint">{processingSettings.languageDetection ? 'Enabled' : 'Disabled'}</span>
                </div>

                <div className="setting-item">
                  <label>Max File Size (MB)</label>
                  <select 
                    className="setting-select"
                    value={processingSettings.maxFileSize}
                    onChange={(e) => setProcessingSettings({ ...processingSettings, maxFileSize: e.target.value })}
                  >
                    <option value="10">10 MB</option>
                    <option value="25">25 MB</option>
                    <option value="50">50 MB</option>
                    <option value="100">100 MB</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* User Management */}
          {activeTab === 'users' && (
            <div className="settings-section">
              <h3>User Management</h3>
              <p className="section-desc">Manage users and their permissions</p>
              
              <div className="setting-group">
                <div className="user-list">
                  {users.map((user) => (
                    <div key={user.id} className="user-item">
                      <div className="user-info">
                        <span className="user-name">{user.name}</span>
                        <span className="user-email">{user.email}</span>
                      </div>
                      <div className="user-actions">
                        <span className={getRoleBadge(user.role)}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                        {user.role !== 'admin' && (
                          <button 
                            className="user-remove"
                            onClick={() => handleRemoveUser(user.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {showAddUser ? (
                  <div className="add-user-form">
                    <input 
                      type="text" 
                      placeholder="Name" 
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="add-user-input"
                    />
                    <input 
                      type="email" 
                      placeholder="Email" 
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="add-user-input"
                    />
                    <select 
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="add-user-select"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="reviewer">Reviewer</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button className="add-user-confirm" onClick={handleAddUser}>
                      <CheckCircle size={16} />
                      Add
                    </button>
                    <button className="add-user-cancel" onClick={() => setShowAddUser(false)}>
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button className="btn-add-user" onClick={() => setShowAddUser(true)}>
                    <Plus size={16} />
                    Add User
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="settings-section">
              <h3>Security Settings</h3>
              <p className="section-desc">Configure security and privacy settings</p>
              
              <div className="setting-group">
                <div className="setting-item toggle-item">
                  <label>Two-Factor Authentication</label>
                  <div className="toggle-container" onClick={toggleTwoFactor}>
                    <div className={`toggle-track ${securitySettings.twoFactor ? 'active' : ''}`}>
                      <div className={`toggle-thumb ${securitySettings.twoFactor ? 'active' : ''}`}></div>
                    </div>
                  </div>
                  <span className="setting-hint">{securitySettings.twoFactor ? 'Enabled' : 'Disabled'}</span>
                </div>

                <div className="setting-item">
                  <label>Session Timeout (minutes)</label>
                  <select 
                    className="setting-select"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Data Encryption</label>
                  <span className="setting-status enabled">✓ Enabled</span>
                </div>

                <div className="setting-item">
                  <label>API Key Rotation (days)</label>
                  <select 
                    className="setting-select"
                    value={securitySettings.apiRotation}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, apiRotation: e.target.value })}
                  >
                    <option value="never">Never</option>
                    <option value="30">Every 30 days</option>
                    <option value="60">Every 60 days</option>
                    <option value="90">Every 90 days</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3>Notification Settings</h3>
              <p className="section-desc">Configure notification preferences</p>
              
              <div className="setting-group">
                <div className="setting-item toggle-item">
                  <label>Analysis Complete</label>
                  <div className="toggle-container" onClick={() => toggleNotification('analysisComplete')}>
                    <div className={`toggle-track ${notificationSettings.analysisComplete ? 'active' : ''}`}>
                      <div className={`toggle-thumb ${notificationSettings.analysisComplete ? 'active' : ''}`}></div>
                    </div>
                  </div>
                  <span className="setting-hint">{notificationSettings.analysisComplete ? 'Enabled' : 'Disabled'}</span>
                </div>

                <div className="setting-item toggle-item">
                  <label>Risk Detected</label>
                  <div className="toggle-container" onClick={() => toggleNotification('riskDetected')}>
                    <div className={`toggle-track ${notificationSettings.riskDetected ? 'active' : ''}`}>
                      <div className={`toggle-thumb ${notificationSettings.riskDetected ? 'active' : ''}`}></div>
                    </div>
                  </div>
                  <span className="setting-hint">{notificationSettings.riskDetected ? 'Enabled' : 'Disabled'}</span>
                </div>

                <div className="setting-item toggle-item">
                  <label>Review Pending</label>
                  <div className="toggle-container" onClick={() => toggleNotification('reviewPending')}>
                    <div className={`toggle-track ${notificationSettings.reviewPending ? 'active' : ''}`}>
                      <div className={`toggle-thumb ${notificationSettings.reviewPending ? 'active' : ''}`}></div>
                    </div>
                  </div>
                  <span className="setting-hint">{notificationSettings.reviewPending ? 'Enabled' : 'Disabled'}</span>
                </div>

                <div className="setting-item toggle-item">
                  <label>Daily Summary</label>
                  <div className="toggle-container" onClick={() => toggleNotification('dailySummary')}>
                    <div className={`toggle-track ${notificationSettings.dailySummary ? 'active' : ''}`}>
                      <div className={`toggle-thumb ${notificationSettings.dailySummary ? 'active' : ''}`}></div>
                    </div>
                  </div>
                  <span className="setting-hint">{notificationSettings.dailySummary ? 'Enabled' : 'Disabled'}</span>
                </div>

                <div className="setting-item toggle-item">
                  <label>Email Notifications</label>
                  <div className="toggle-container" onClick={() => toggleNotification('emailNotifications')}>
                    <div className={`toggle-track ${notificationSettings.emailNotifications ? 'active' : ''}`}>
                      <div className={`toggle-thumb ${notificationSettings.emailNotifications ? 'active' : ''}`}></div>
                    </div>
                  </div>
                  <span className="setting-hint">{notificationSettings.emailNotifications ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;