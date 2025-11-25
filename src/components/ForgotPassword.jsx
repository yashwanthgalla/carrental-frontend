import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ForgotPassword.css";

const ForgotPassword = ({ onClose, onBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("http://localhost:8082/api/auth/send-otp-forgot-password", {
        email,
      });

      setShowOtpInput(true);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setShowPasswordInput(true);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:8082/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      setSuccess(true);
      setTimeout(() => {
        onBackToLogin();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    if (!showOtpInput) {
      handleSendOtp(e);
    } else if (!showPasswordInput) {
      handleVerifyOtp(e);
    } else {
      handleResetPassword(e);
    }
  };

  return (
    <div className="forgot-password-overlay">
      <div className="forgot-password-modal">
        <div className="forgot-password-header">
          <div className="forgot-password-title-container">
            <img src="/logo/ferrari-logo.png" alt="Ferrari Logo" className="ferrari-logo" />
            <h2 className="forgot-password-title">Reset Password</h2>
          </div>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="forgot-password-body">
          <form className="forgot-password-form" onSubmit={handleSubmit}>
            {!showOtpInput && (
              <>
                <p className="instruction-text">
                  Enter your email address and we'll send you an OTP to reset your password.
                </p>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </>
            )}

            {showOtpInput && !showPasswordInput && (
              <div className="form-group otp-group">
                <label className="form-label">Enter OTP</label>
                <input
                  type="text"
                  className="form-control otp-input"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  required
                  autoFocus
                />
                <p className="otp-info">📧 OTP sent to {email}</p>
              </div>
            )}

            {showPasswordInput && (
              <>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <button 
              type="submit" 
              className="reset-button" 
              disabled={loading}
            >
              {loading 
                ? "Processing..." 
                : !showOtpInput 
                  ? "Send OTP" 
                  : !showPasswordInput 
                    ? "Verify OTP" 
                    : "Reset Password"
              }
            </button>

            {showOtpInput && !showPasswordInput && (
              <button 
                type="button" 
                className="resend-otp-btn" 
                onClick={handleSendOtp}
                disabled={loading}
              >
                Resend OTP
              </button>
            )}

            {success && (
              <p className="success-msg">
                Password reset successful! ✅ Redirecting to login...
              </p>
            )}
            {error && <p className="error-msg">{error}</p>}
          </form>

          <div className="forgot-password-footer">
            <p className="back-to-login">
              Remember your password?{" "}
              <span onClick={onBackToLogin}>
                Back to Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
