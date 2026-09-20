import React, { useState } from 'react';
import { Scale, Mail, Lock, ArrowRight, Sparkles, UserPlus, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './Login.css';

const Login = ({ onLogin }) => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.login(email, password);
        if (res.status === 'success' && res.user) {
          toast.success(`Welcome back, ${res.user.full_name || res.user.email}!`);
          onLogin(res.user);
        } else {
          throw new Error('Login failed');
        }
      } else {
        if (!email || !password || !fullName) {
          throw new Error('Please fill in all fields');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        const res = await api.signup(email, password, fullName, organization);
        if (res.status === 'success' && res.user) {
          toast.success(`Account created! Welcome, ${res.user.full_name}`);
          onLogin(res.user);
        } else {
          throw new Error('Signup failed');
        }
      }
    } catch (err) {
      let cleanMsg = err.message || 'Something went wrong';
      try {
        const match = cleanMsg.match(/\{.*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          cleanMsg = parsed.detail || cleanMsg;
        }
      } catch { /* keep original */ }
      setError(cleanMsg);
      toast.error(cleanMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-grid">
        <div className="login-brand">
          <div className="brand-content">
            <div className="brand-icon-large">
              <Scale size={44} />
            </div>
            <h1 className="brand-title">
              Evidence-Traceable<br />
              Information Extraction<br />
              Platform
            </h1>
          </div>
        </div>

        <div className="login-form-container">
          <div className="login-header">
            <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            <p>
              {mode === 'login'
                ? 'Sign in to access your legal intelligence dashboard'
                : 'Sign up to start analyzing legal documents'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {mode === 'signup' && (
              <>
                <div className="form-group">
                  <label><Sparkles size={16} />Full Name</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label><Sparkles size={16} />Organization</label>
                  <input
                    type="text"
                    placeholder="Company / University"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label><Mail size={16} />Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label><Lock size={16} />Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={mode === 'signup' ? 6 : undefined}
              />
            </div>

            {error && (
              <div className="login-error" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px', background: '#fef2f2',
                border: '1px solid #fecaca', borderRadius: 8,
                color: '#dc2626', fontSize: 13, marginBottom: 12,
              }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}

            {mode === 'login' && (
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  Remember me
                </label>
                <a href="#forgot" className="forgot-link">Forgot password?</a>
              </div>
            )}

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? (
                <span>Loading...</span>
              ) : mode === 'login' ? (
                <>Sign In <ArrowRight size={16} /></>
              ) : (
                <>Create Account <UserPlus size={16} /></>
              )}
            </button>

            <div className="login-divider"><span>or</span></div>

            {mode === 'login' ? (
              <button type="button" className="demo-btn" onClick={() => switchMode('signup')}>
                <UserPlus size={18} /> Create a New Account
              </button>
            ) : (
              <button type="button" className="demo-btn" onClick={() => switchMode('login')}>
                <ArrowRight size={18} /> Already have an account? Sign In
              </button>
            )}
          </form>

          <div className="login-footer">
            ⚡ Powered by Supabase Auth · OpenRouter LLM
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;