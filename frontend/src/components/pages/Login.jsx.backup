import React, { useState } from 'react';
import { Scale, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-grid">
        {/* Left Side - Brand */}
        <div className="login-brand">
          <div className="brand-content">
            <div className="brand-icon-large">
              <Scale size={44} />
            </div>
            <h1 className="brand-title">Evidence-Traceable<br />Information Extraction<br />Platform</h1>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-container">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to access your legal intelligence dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>
                <Mail size={16} />
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Lock size={16} />
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
              <ArrowRight size={18} />
            </button>

            <div className="divider">
              <span>or</span>
            </div>

            <button 
              type="button" 
              className="btn-demo" 
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              <Sparkles size={16} />
              Continue as Demo User
            </button>
          </form>

          <p className="demo-disclaimer">
            ⚡ Demo version — All data is simulated for project demonstration
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;