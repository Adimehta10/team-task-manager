import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      toast.success('Account created! Welcome to TaskFlow 🎉');
      navigate('/projects');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-left-logo">🚀</div>
          <h1>Get Started Free</h1>
          <p>Join thousands of teams already using TaskFlow to ship projects faster.</p>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">✅</div>
              <span>Free to use, no credit card needed</span>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">⚡</div>
              <span>Set up in under 2 minutes</span>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">🔒</div>
              <span>Secure JWT authentication</span>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">🌐</div>
              <span>Access from anywhere, anytime</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right" style={{ position: 'relative' }}>
        <button className="theme-toggle auth-theme-btn" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Create your account</h2>
            <p>Start managing your team's tasks today</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Aditya Kumar"
                required
              />
            </div>
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
                placeholder="Min. 6 characters"
                required
              />
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : '→ Create Account'}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}