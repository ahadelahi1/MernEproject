import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import './css/ResetPassword.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const [pswd, setPswd] = useState("");
  const [cpswd, setCPswd] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Replace these with your actual imports
  const { token } = useParams();
   const nav = useNavigate();

  async function Reset() {
    try {
      if (pswd !== cpswd) {
        toast.error("Confirm Password must match with Password");
        return;
      }

      // Replace with your actual axios call
      await axios.post(`http://localhost:4000/api/user/reset/${token}`, {
        pswd: pswd
      }).then((res) => {
        toast.success(res.data.msg);
        nav("/login");
      }).catch((err) => {
        toast.error(err.response?.data?.msg || "Something went wrong");
      });

      // For demo purposes
      console.log("Password reset successfully");
      toast.success("Password reset successfully");

    } catch (error) {
      toast.error(error.response?.data?.msg || "Server Error");
    }
  }

  return (
    <div className="reset-password-wrapper">
      <ToastContainer />

      <div className="reset-password-container">
        {/* Left Side - Form Section */}
        <div className="reset-password-form-section">
          <div className="form-content">
            {/* Header */}
            <div className="reset-password-header">
              <div className="brand-icon">
                <i className="fas fa-lock"></i>
              </div>
              <h1 className="reset-password-title">Reset Password</h1>
              <p className="reset-password-subtitle">
                Create a new secure password for your account
              </p>
            </div>

            {/* Form */}
            <div className="reset-password-form">
              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-lock"></i>
                  New Password
                </label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control password-input"
                    placeholder="Enter your new password"
                    value={pswd}
                    onChange={(e) => setPswd(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-key"></i>
                  Confirm Password
                </label>
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control password-input"
                    placeholder="Confirm your new password"
                    value={cpswd}
                    onChange={(e) => setCPswd(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <i className={showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="reset-password-btn"
                onClick={Reset}
                disabled={!pswd || !cpswd}
              >
                <i className="fas fa-shield-alt"></i>
                Reset Password
              </button>
            </div>

            {/* Footer */}
            <div className="reset-password-footer">
              <p>
                Remembered your password? {" "}
                <a href="/login" className="login-link">Back to Login</a>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Visual Section */}
        <div className="reset-password-image-section">
          <div className="visual-container">
            {/* Floating Elements */}
            <div className="floating-elements">
              <div className="floating-card card-1">
                <i className="fas fa-shield-alt"></i>
                <span>Secure Process</span>
              </div>
              <div className="floating-card card-2">
                <i className="fas fa-key"></i>
                <span>New Password</span>
              </div>
              <div className="floating-card card-3">
                <i className="fas fa-check-circle"></i>
                <span>Verified Reset</span>
              </div>
              <div className="floating-card card-4">
                <i className="fas fa-user-shield"></i>
                <span>Account Safe</span>
              </div>
            </div>

            {/* Central Logo */}
            <div className="central-logo">
              <div className="logo-rings">
                <div className="ring ring-1"></div>
                <div className="ring ring-2"></div>
                <div className="ring ring-3"></div>
              </div>
              <div className="logo-circle">
                <i className="fas fa-shield-alt"></i>
              </div>
            </div>

            {/* Geometric Shapes */}
            <div className="geometric-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
              <div className="shape shape-4"></div>
            </div>

            {/* Content Overlay */}
            <div className="content-overlay">
              <div className="overlay-content">
                <h2>Secure Password Reset</h2>
                <p>
                  Your account security is our priority. Create a strong password
                  to protect your account from unauthorized access.
                </p>
                <div className="stats-row">
                  <div className="stat-item">
                    <span className="stat-number">256-bit</span>
                    <span className="stat-label">Encryption</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">Secure</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">Instant</span>
                    <span className="stat-label">Reset</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
