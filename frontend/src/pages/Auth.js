import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Auth() {

  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [toggling, setToggling] = useState(false);

  // OTP STATES
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [tempUserData, setTempUserData] = useState(null);

  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleToggle = () => {

    setToggling(true);

    setTimeout(() => {

      setIsLogin(!isLogin);

      setForm({
        name: '',
        email: '',
        password: '',
      });

      setOtp('');
      setShowOtpInput(false);

      setToggling(false);

    }, 300);
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      // LOGIN
      if (isLogin) {

        await login(form.email, form.password);

        toast.success('Welcome back! 👋');

        navigate('/projects');

      } else {

        // PASSWORD CHECK
        if (form.password.length < 6) {

          toast.error('Password min 6 chars');

          setLoading(false);

          return;
        }

        // STEP 1 → SEND OTP
        if (!showOtpInput) {

          const response = await fetch(
            'http://localhost:5000/api/auth/send-otp',
            {
              method: 'POST',

              headers: {
                'Content-Type': 'application/json',
              },

             body: JSON.stringify({
  name: form.name,
  email: form.email,
  password: form.password,
}),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message);
          }

          setTempUserData(form);

          toast.success('OTP sent to your email');

          setShowOtpInput(true);

          setLoading(false);

          return;
        }

        // STEP 2 → VERIFY OTP
        const verifyResponse = await fetch(
          'http://localhost:5000/api/auth/verify-otp',
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify({
              email: tempUserData.email,
              otp,
            }),
          }
        );

        const verifyData = await verifyResponse.json();

        if (!verifyResponse.ok) {
          throw new Error(verifyData.message);
        }

        // SUCCESS
        toast.success('Account verified successfully 🎉');

        // AUTO LOGIN
        await login(
          tempUserData.email,
          tempUserData.password
        );

        // RESET OTP
        setOtp('');
        setShowOtpInput(false);

        // OPEN DASHBOARD
        navigate('/projects');

      }

    } catch (err) {

      toast.error(
        err.message ||
        err.response?.data?.message ||
        'Something went wrong'
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className={`auth-root ${theme}`}>

      {/* Animated background orbs */}
      <div className="auth-orb auth-orb-1"></div>
      <div className="auth-orb auth-orb-2"></div>
      <div className="auth-orb auth-orb-3"></div>

      {/* Theme toggle */}
      <button
        className="auth-theme-pill"
        onClick={toggleTheme}
      >
        {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
      </button>

      <div className="auth-scene">

        {/* LEFT */}
        <div className="auth-brand">

          <div className="brand-logo-3d">
            <div className="logo-cube">
              <div className="cube-face cube-front">⚡</div>
              <div className="cube-face cube-back">⚡</div>
              <div className="cube-face cube-left"></div>
              <div className="cube-face cube-right"></div>
              <div className="cube-face cube-top"></div>
              <div className="cube-face cube-bottom"></div>
            </div>
          </div>

          <h1 className="brand-name">TaskFlow</h1>

          <p className="brand-tagline">
            Where teams get things done
          </p>

          <div className="brand-features">

            {[
              { icon: '📋', text: 'Kanban task boards' },
              { icon: '👥', text: 'Team collaboration' },
              { icon: '📊', text: 'Live analytics' },
              { icon: '🔒', text: 'Secure & fast' },
            ].map((f, i) => (

              <div
                className="brand-feature"
                key={i}
                style={{
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                <span className="brand-feature-icon">
                  {f.icon}
                </span>

                <span>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Floating cards */}
          <div className="floating-card fc-1">
            <div className="fc-dot fc-green"></div>
            <span>Design System</span>
            <span className="fc-badge">Done</span>
          </div>

          <div className="floating-card fc-2">
            <div className="fc-dot fc-yellow"></div>
            <span>API Integration</span>
            <span className="fc-badge fc-badge-prog">
              In Progress
            </span>
          </div>

          <div className="floating-card fc-3">
            <div className="fc-dot fc-purple"></div>
            <span>3 tasks due today</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="auth-form-wrap">

          <div className={`auth-card-3d ${toggling ? 'card-toggling' : ''}`}>

            {/* TOGGLE */}
            <div className="jelly-toggle-wrap">

              <div
                className={`jelly-toggle ${isLogin ? 'jelly-left' : 'jelly-right'}`}
                onClick={handleToggle}
              >

                <div className="jelly-knob"></div>

                <span className={`jelly-label jelly-label-left ${isLogin ? 'jelly-active' : ''}`}>
                  Sign In
                </span>

                <span className={`jelly-label jelly-label-right ${!isLogin ? 'jelly-active' : ''}`}>
                  Sign Up
                </span>

              </div>
            </div>

            {/* HEADER */}
            <div className="auth-form-header">

              <h2>
                {isLogin ? 'Welcome back' : 'Create account'}
              </h2>

              <p>
                {isLogin
                  ? 'Sign in to continue to TaskFlow'
                  : 'Start managing tasks for free'}
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="auth-form">

              {!isLogin && (
                <div className="af-group">

                  <label>Full Name</label>

                  <div className="af-input-wrap">

                    <span className="af-icon">👤</span>

                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Aditya Kumar"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="af-group">

                <label>Email Address</label>

                <div className="af-input-wrap">

                  <span className="af-icon">✉️</span>

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    required
                  />
                </div>
              </div>

              <div className="af-group">

                <label>Password</label>

                <div className="af-input-wrap">

                  <span className="af-icon">🔒</span>

                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder={
                      isLogin
                        ? 'Your password'
                        : 'Min. 6 characters'
                    }
                    required
                  />
                </div>
              </div>

              {/* OTP INPUT */}
              {showOtpInput && (

                <div className="af-group">

                  <label>OTP Verification</label>

                  <div className="af-input-wrap">

                    <span className="af-icon">🔐</span>

                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                className="af-submit"
                disabled={loading}
              >

                {loading ? (

                  <span className="af-spinner"></span>

                ) : (

                  <>
                    {showOtpInput
                      ? 'Verify OTP →'
                      : isLogin
                        ? 'Sign In →'
                        : 'Create Account →'}
                  </>
                )}
              </button>
            </form>

            {/* SWITCH */}
            <p className="auth-switch-text">

              {isLogin
                ? "Don't have an account?"
                : 'Already have an account?'}

              <button
                className="auth-switch-btn"
                onClick={handleToggle}
              >
                {isLogin
                  ? ' Sign up free'
                  : ' Sign in'}
              </button>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}