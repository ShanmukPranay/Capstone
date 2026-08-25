import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Brain,
  Database,
  FileText,
  Users,
  Shield,
  Bell,
  Globe,
  Save,
  RefreshCw,
  Sliders,
  Zap,
  Lock,
  Mail,
  UserCog,
  HardDrive,
  Cloud
} from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('llm');
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'llm', label: 'LLM Configuration', icon: Brain },
    { id: 'rag', label: 'RAG Configuration', icon: Database },
    { id: 'processing', label: 'Document Processing', icon: FileText },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="page-subtitle">Configure your legal intelligence system</p>
        </div>
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

      <div className="settings-container">
        {/* Sidebar Tabs */}
        <div className="settings-sidebar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="settings-content">
          {activeTab === 'llm' && (
            <div className="settings-section">
              <h3>LLM Configuration</h3>
              <p className="section-desc">Configure the language model settings for legal analysis</p>
              
              <div className="setting-group">
                <div className="setting-item">
                  <label>Model</label>
                  <select className="setting-select">
                    <option>GPT-4</option>
                    <option>Claude 3.5 Sonnet</option>
                    <option>Gemini 1.5 Pro</option>
                    <option selected>Llama 3 70B</option>
                    <option>Mistral Large</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Temperature</label>
                  <div className="slider-container">
                    <input type="range" min="0" max="1" step="0.1" defaultValue="0.2" className="setting-slider" />
                    <span className="slider-value">0.2</span>
                  </div>
                  <span className="setting-hint">Lower values produce more deterministic outputs</span>
                </div>

                <div className="setting-item">
                  <label>Max Tokens</label>
                  <input type="number" defaultValue="4096" className="setting-input" />
                  <span className="setting-hint">Maximum length of generated responses</span>
                </div>

                <div className="setting-item">
                  <label>Top P</label>
                  <div className="slider-container">
                    <input type="range" min="0" max="1" step="0.05" defaultValue="0.9" className="setting-slider" />
                    <span className="slider-value">0.9</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rag' && (
            <div className="settings-section">
              <h3>RAG Configuration</h3>
              <p className="section-desc">Configure retrieval-augmented generation settings</p>
              
              <div className="setting-group">
                <div className="setting-item">
                  <label>Embedding Model</label>
                  <select className="setting-select">
                    <option>text-embedding-ada-002</option>
                    <option selected>all-MiniLM-L6-v2</option>
                    <option>all-mpnet-base-v2</option>
                    <option>sentence-transformers/all-MiniLM-L12-v2</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Top-K Retrieval</label>
                  <input type="number" defaultValue="5" className="setting-input" />
                  <span className="setting-hint">Number of most relevant chunks to retrieve</span>
                </div>

                <div className="setting-item">
                  <label>Chunk Size</label>
                  <input type="number" defaultValue="500" className="setting-input" />
                  <span className="setting-hint">Number of characters per document chunk</span>
                </div>

                <div className="setting-item">
                  <label>Chunk Overlap</label>
                  <input type="number" defaultValue="50" className="setting-input" />
                  <span className="setting-hint">Overlap between consecutive chunks</span>
                </div>

                <div className="setting-item">
                  <label>Vector Database</label>
                  <select className="setting-select">
                    <option selected>Supabase Vector</option>
                    <option>Pinecone</option>
                    <option>Weaviate</option>
                    <option>Qdrant</option>
                    <option>Chroma</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'processing' && (
            <div className="settings-section">
              <h3>Document Processing</h3>
              <p className="section-desc">Configure document parsing and processing settings</p>
              
              <div className="setting-group">
                <div className="setting-item">
                  <label>OCR Enabled</label>
                  <div className="toggle-container">
                    <input type="checkbox" defaultChecked className="toggle-input" id="ocr-toggle" />
                    <label htmlFor="ocr-toggle" className="toggle-slider"></label>
                  </div>
                  <span className="setting-hint">Enable OCR for scanned documents</span>
                </div>

                <div className="setting-item">
                  <label>NER Models</label>
                  <select className="setting-select">
                    <option selected>spaCy (en_core_web_sm)</option>
                    <option>spaCy (en_core_web_md)</option>
                    <option>spaCy (en_core_web_lg)</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Language Detection</label>
                  <div className="toggle-container">
                    <input type="checkbox" defaultChecked className="toggle-input" id="lang-toggle" />
                    <label htmlFor="lang-toggle" className="toggle-slider"></label>
                  </div>
                  <span className="setting-hint">Automatically detect document language</span>
                </div>

                <div className="setting-item">
                  <label>Max File Size</label>
                  <select className="setting-select">
                    <option>10 MB</option>
                    <option selected>25 MB</option>
                    <option>50 MB</option>
                    <option>100 MB</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="settings-section">
              <h3>User Management</h3>
              <p className="section-desc">Manage users and their permissions</p>
              
              <div className="setting-group">
                <div className="user-list">
                  <div className="user-item">
                    <div className="user-info">
                      <span className="user-name">John Doe</span>
                      <span className="user-email">john.doe@example.com</span>
                    </div>
                    <span className="user-role admin">Admin</span>
                  </div>
                  <div className="user-item">
                    <div className="user-info">
                      <span className="user-name">Jane Smith</span>
                      <span className="user-email">jane.smith@example.com</span>
                    </div>
                    <span className="user-role reviewer">Reviewer</span>
                  </div>
                  <div className="user-item">
                    <div className="user-info">
                      <span className="user-name">Mike Johnson</span>
                      <span className="user-email">mike.johnson@example.com</span>
                    </div>
                    <span className="user-role viewer">Viewer</span>
                  </div>
                  <div className="user-item">
                    <div className="user-info">
                      <span className="user-name">Sarah Wilson</span>
                      <span className="user-email">sarah.wilson@example.com</span>
                    </div>
                    <span className="user-role reviewer">Reviewer</span>
                  </div>
                </div>
                <button className="btn-add-user">
                  <UserCog size={16} />
                  Add User
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h3>Security Settings</h3>
              <p className="section-desc">Configure security and privacy settings</p>
              
              <div className="setting-group">
                <div className="setting-item">
                  <label>Two-Factor Authentication</label>
                  <div className="toggle-container">
                    <input type="checkbox" className="toggle-input" id="2fa-toggle" />
                    <label htmlFor="2fa-toggle" className="toggle-slider"></label>
                  </div>
                </div>

                <div className="setting-item">
                  <label>Session Timeout</label>
                  <select className="setting-select">
                    <option>15 minutes</option>
                    <option selected>30 minutes</option>
                    <option>1 hour</option>
                    <option>2 hours</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Data Encryption</label>
                  <span className="setting-status enabled">✓ Enabled</span>
                </div>

                <div className="setting-item">
                  <label>API Key Rotation</label>
                  <select className="setting-select">
                    <option>Never</option>
                    <option selected>Every 30 days</option>
                    <option>Every 60 days</option>
                    <option>Every 90 days</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3>Notification Settings</h3>
              <p className="section-desc">Configure notification preferences</p>
              
              <div className="setting-group">
                <div className="setting-item">
                  <label>Analysis Complete</label>
                  <div className="toggle-container">
                    <input type="checkbox" defaultChecked className="toggle-input" id="notif-analysis" />
                    <label htmlFor="notif-analysis" className="toggle-slider"></label>
                  </div>
                </div>

                <div className="setting-item">
                  <label>Risk Detected</label>
                  <div className="toggle-container">
                    <input type="checkbox" defaultChecked className="toggle-input" id="notif-risk" />
                    <label htmlFor="notif-risk" className="toggle-slider"></label>
                  </div>
                </div>

                <div className="setting-item">
                  <label>Review Pending</label>
                  <div className="toggle-container">
                    <input type="checkbox" defaultChecked className="toggle-input" id="notif-review" />
                    <label htmlFor="notif-review" className="toggle-slider"></label>
                  </div>
                </div>

                <div className="setting-item">
                  <label>Daily Summary</label>
                  <div className="toggle-container">
                    <input type="checkbox" className="toggle-input" id="notif-summary" />
                    <label htmlFor="notif-summary" className="toggle-slider"></label>
                  </div>
                </div>

                <div className="setting-item">
                  <label>Email Notifications</label>
                  <div className="toggle-container">
                    <input type="checkbox" defaultChecked className="toggle-input" id="notif-email" />
                    <label htmlFor="notif-email" className="toggle-slider"></label>
                  </div>
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