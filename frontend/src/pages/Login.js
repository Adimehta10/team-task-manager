import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/projects');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-left-logo">⚡</div>
          <h1>TaskFlow</h1>
          <p>The modern way to manage your team's tasks and projects efficiently.</p>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">📋</div>
              <span>Kanban boards for visual task management</span>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">👥</div>
              <span>Role-based team collaboration</span>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">📊</div>
              <span>Real-time analytics dashboard</span>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">🔔</div>
              <span>Overdue task alerts and tracking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right" style={{ position: 'relative' }}>
        <button className="theme-toggle auth-theme-btn" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Welcome back</h2>
            <p>Sign in to your TaskFlow account to continue</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : '→ Sign In'}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account? <Link to="/signup">Create one free</Link>
          </div>
        </div>
      </div>
    </div>
  );
}