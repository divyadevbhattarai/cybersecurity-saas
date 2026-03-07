import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/axios";
import { useToast } from "../components/Toast";

function ForgotPassword() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post("/users/password-reset/request/", { email });
      setSuccess(true);
      showToast("Password reset link sent! Check your email.", "success");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to process request";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="login-page">
        <div className="login-left">
          <div className="login-branding">
            <Link to="/" className="login-logo">
              <svg viewBox="0 0 40 40" fill="none">
                <defs>
                  <linearGradient id="loginLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#f87171" />
                  </linearGradient>
                </defs>
                <path
                  d="M20 2L4 10v12c0 9.94 7.16 17.9 16 20 8.84-2.1 16-10.06 16-20V10L20 2z"
                  fill="url(#loginLogoGrad)"
                  opacity="0.15"
                />
                <path
                  d="M20 4.5L7 11.5v10c0 7.95 5.77 14.32 13 16 7.23-1.68 13-8.05 13-16v-10L20 4.5z"
                  stroke="url(#loginLogoGrad)"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M20 12v12M12 16l8 4 8-4"
                  stroke="url(#loginLogoGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="20" cy="18" r="3" fill="url(#loginLogoGrad)" />
              </svg>
              <span>CyberShield</span>
            </Link>
          </div>
        </div>
        
        <div className="login-right">
          <div className="login-form-container">
            <div className="success-message" style={{
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '8px',
              border: '1px solid #10b981'
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" style={{ width: '48px', height: '48px', margin: '0 auto 1rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 style={{ color: '#10b981', marginBottom: '1rem' }}>Check your email</h2>
              <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
                If an account exists with this email, you will receive a password reset link shortly.
              </p>
              <Link to="/login" className="login-submit" style={{ display: 'inline-block', textDecoration: 'none' }}>
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-branding">
          <Link to="/" className="login-logo">
            <svg viewBox="0 0 40 40" fill="none">
              <defs>
                <linearGradient id="loginLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f87171" />
                </linearGradient>
              </defs>
              <path
                d="M20 2L4 10v12c0 9.94 7.16 17.9 16 20 8.84-2.1 16-10.06 16-20V10L20 2z"
                fill="url(#loginLogoGrad)"
                opacity="0.15"
              />
              <path
                d="M20 4.5L7 11.5v10c0 7.95 5.77 14.32 13 16 7.23-1.68 13-8.05 13-16v-10L20 4.5z"
                stroke="url(#loginLogoGrad)"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M20 12v12M12 16l8 4 8-4"
                stroke="url(#loginLogoGrad)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="20" cy="18" r="3" fill="url(#loginLogoGrad)" />
            </svg>
            <span>CyberShield</span>
          </Link>
          <h1>Reset your password</h1>
          <p>Enter your email address and we'll send you a link to reset your password</p>
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-form-container">
          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div className="form-field">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="login-footer">
            <p>Remember your password? <Link to="/login">Sign in</Link></p>
          </div>
          
          <Link to="/" className="back-home">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
