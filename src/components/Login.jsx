import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import ForgotPassword from "./ForgotPassword";

const Login = ({ onClose, onSignupClick, onLoginSuccess }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState("ROLE_USER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    // Add body class to prevent scrolling
    document.body.classList.add('modal-open');
    
    // Cleanup function to remove body class when component unmounts
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("http://localhost:8082/api/auth/send-otp-login", {
        email,
        password,
        role,
      });

      setShowOtpInput(true);
      setOtpSent(true);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid login credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8082/api/auth/verify-otp-login", {
        email,
        otp,
        role,
      });

      localStorage.setItem("role", res.data.role || role);
      localStorage.setItem("email", res.data.email || email);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      setShowSuccess(true);
      onLoginSuccess(res.data.role || role);

      setTimeout(() => {
        if ((res.data.role || role) === "ROLE_ADMIN") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
          window.location.reload();
        }
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowForgotPassword(true);
  };

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  if (showForgotPassword) {
    return (
      <ForgotPassword 
        onClose={handleCloseForgotPassword} 
        onBackToLogin={handleBackToLogin}
      />
    );
  }

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <div className="login-header">
          <div className="login-title-container">
            <img src="/logo/ferrari-logo.png" alt="Ferrari Logo" className="ferrari-logo" />
            <h2 className="login-title">Ferrari Rentals Login</h2>
          </div>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="login-body">
          <form className="login-form" onSubmit={showOtpInput ? handleVerifyOtp : handleSendOtp}>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-control"
                required
                disabled={showOtpInput}
              >
                <option value="ROLE_USER">User</option>
                <option value="ROLE_ADMIN">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={showOtpInput}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={showOtpInput}
              />
            </div>

            {showOtpInput && (
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
                <p className="otp-info">📧 OTP sent to your email</p>
              </div>
            )}

            {!showOtpInput && (
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
            )}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? (showOtpInput ? "Verifying..." : "Sending OTP...") : (showOtpInput ? "Verify OTP & Login" : "Send OTP")}
            </button>

            {showOtpInput && (
              <button 
                type="button" 
                className="resend-otp-btn" 
                onClick={handleSendOtp}
                disabled={loading}
              >
                Resend OTP
              </button>
            )}

            {showSuccess && (
              <p className="success-msg">Login Successful ✅ Redirecting...</p>
            )}
            {error && <p className="error-msg">{error}</p>}
          </form>

          <div className="login-footer">
            <a href="#" className="forgot-password" onClick={handleForgotPasswordClick}>
              Forgot Password?
            </a>
            <p className="signup-link">
              Don't have an account?{" "}
              <span
                onClick={onSignupClick}
                style={{ color: "#dc143c", cursor: "pointer", fontWeight: "bold" }}
              >
                Sign Up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
