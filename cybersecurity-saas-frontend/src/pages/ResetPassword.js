import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/axios";
import { useToast } from "../components/Toast";

function ResetPassword() {
  const { showToast } = useToast();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await api.post("/users/password-reset/verify/", { token });
        setIsValidToken(true);
      } catch (err) {
        setError("Invalid or expired reset link");
      } finally {
        setValidating(false);
      }
    };
    verifyToken();
  }, [token]);

  const validatePassword = (pwd) => {
    if (pwd.length < 14) {
      return "Password must be at least 14 characters long";
    }
    if (!/[A-Z]/.test(pwd)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(pwd)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(pwd)) {
      return "Password must contain at least one digit";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      return "Password must contain at least one special character";
    }
    if (/(.)\1\1/.test(pwd)) {
      return "Password cannot contain 3 or more consecutive identical characters";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      showToast(pwdError, "error");
      return;
    }

    if (password !== confirmPassword) {
      const msg = "Passwords do not match";
      setError(msg);
      showToast(msg, "error");
      return;
    }

    setLoading(true);
    try {
      await api.post("/users/password-reset/reset/", {
        token,
        new_password: password
      });
      setSuccess(true);
      showToast("Password reset successfully!", "success");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to reset password";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
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
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="loading-spinner"></div>
              <p style={{ color: '#9ca3af', marginTop: '1rem' }}>Verifying reset link...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
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
            <div className="login-error" style={{ textAlign: 'center' }}>
              <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: '48px', height: '48px', margin: '0 auto 1rem' }}>
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <h2 style={{ marginBottom: '0.5rem' }}>Invalid Link</h2>
              <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>{error || "This password reset link is invalid or has expired"}</p>
              <Link to="/forgot-password" className="login-submit" style={{ display: 'inline-block', textDecoration: 'none' }}>
                Request New Link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '8px',
              border: '1px solid #10b981'
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" style={{ width: '48px', height: '48px', margin: '0 auto 1rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 style={{ color: '#10b981', marginBottom: '1rem' }}>Password Reset Complete</h2>
              <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
                Your password has been successfully reset. You can now sign in with your new password.
              </p>
              <Link to="/login" className="login-submit" style={{ display: 'inline-block', textDecoration: 'none' }}>
                Sign In
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
          <h1>Create new password</h1>
          <p>Enter a new password for your account</p>
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
              <label htmlFor="password">New Password</label>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="password-field">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <div className="login-footer">
            <p>Need help? <Link to="/login">Contact support</Link></p>
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

export default ResetPassword;
