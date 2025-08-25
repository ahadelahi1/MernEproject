import React, { useState } from 'react';
import './css/ForgetPassword.css';
import axios from "axios"; 
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  async function Forgot_Password() {
    // Note: Replace this with your actual axios implementation
    try {
      const response = await axios.post("http://localhost:4000/api/user/forgot", {
        e: email
      }).then((a)=>{
       toast.success(a.data.msg)
      }).catch((a)=>{
        toast.error(a.data.msg)
      });

      // For demo purposes - replace with your toast implementation
      console.log("Password reset link sent to:", email);
      setEmail("");
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="forgot-password-wrapper">
      {/* Note: Add your ToastContainer here */}

      <div className="forgot-password-container">
        {/* Left Side - Form Section */}
        <div className="forgot-password-form-section">
          <div className="form-content">
            {/* Header */}
            <div className="forgot-password-header">
              <div className="brand-icon">
                <i className="fas fa-key"></i>
              </div>
              <h1 className="forgot-password-title">Forgot Password?</h1>
              <p className="forgot-password-subtitle">
                Don't worry! Enter your email and we'll send you a reset link
              </p>
            </div>

            {/* Form */}
            <div className="forgot-password-form">
              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-envelope"></i>
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="button"
                className="forgot-password-btn"
                onClick={Forgot_Password}
                disabled={!email}
              >
                <i className="fas fa-paper-plane"></i>
                Send Reset Link
              </button>
            </div>

            {/* Footer */}
            <div className="forgot-password-footer">
              <p>
                Remember your password? {" "}
                <a href="/login" className="login-link">Back to Login</a>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Visual Section */}
        <div className="forgot-password-image-section">
          <div className="visual-container">
            {/* Floating Elements */}
            <div className="floating-elements">
              <div className="floating-card card-1">
                <i className="fas fa-shield-alt"></i>
                <span>Secure Reset</span>
              </div>
              <div className="floating-card card-2">
                <i className="fas fa-clock"></i>
                <span>Quick Process</span>
              </div>
              <div className="floating-card card-3">
                <i className="fas fa-envelope"></i>
                <span>Email Verification</span>
              </div>
              <div className="floating-card card-4">
                <i className="fas fa-lock"></i>
                <span>Safe & Secure</span>
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
                <i className="fas fa-key"></i>
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
                <h2>Password Recovery Made Easy</h2>
                <p>
                  We understand that forgetting passwords happens. Our secure reset process
                  ensures you can quickly regain access to your account.
                </p>
                <div className="stats-row">
                  <div className="stat-item">
                    <span className="stat-number">2 min</span>
                    <span className="stat-label">Average Time</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">Secure</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">24/7</span>
                    <span className="stat-label">Available</span>
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
