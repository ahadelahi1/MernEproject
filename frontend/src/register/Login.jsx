import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import './css/Login.css';

export default function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();

  async function LoginLogic() {
    try {
      if (!email || !password) {
        toast.error("All fields are required");
        return;
      }

      const res = await axios.post("http://localhost:4000/api/user/login", {
        email,
        password
      });

      setemail("");
      setpassword("");
      localStorage.setItem("UserInfo", JSON.stringify(res.data.user));
      toast.success(res.data.msg);
      nav("/register");
    } catch (error) {
      toast.error(error.response?.data.msg || "Login failed");
    }
  }

  return (
    <>
      <div className="login-wrapper">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="custom-toast"
        />

        <div className="login-container">
          {/* Left Side - Form */}
          <div className="login-form-section">
            <div className="form-content">
              {/* Header */}
              <div className="login-header">
                <div className="brand-icon">
                  <i className="fas fa-sign-in-alt"></i>
                </div>
                <h1 className="login-title">Welcome Back</h1>
                <p className="login-subtitle">Sign in to your account to continue</p>
              </div>

              {/* Form */}
              <form className="login-form" onSubmit={(e) => { e.preventDefault(); LoginLogic(); }}>
                {/* Email Field */}
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
                    onChange={(e) => setemail(e.target.value)}
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-lock"></i>
                    Password
                  </label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control password-input"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setpassword(e.target.value)}
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

                {/* Forgot Password Link */}
                <div className="forgot-password-container">
                  <Link to="/fp" className="forgot-password-link">
                    Forgot your password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button type="submit" className="login-btn">
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In
                </button>
              </form>

              {/* Footer */}
              <div className="login-footer">
                <p>Don't have an account? <Link to="/register" className="register-link">Create one here</Link></p>
              </div>
            </div>
          </div>

          {/* Right Side - Modern Visual */}
          <div className="login-image-section">
            <div className="visual-container">
              {/* Floating Elements */}
              <div className="floating-elements">
                <div className="floating-card card-1">
                  <i className="fas fa-shield-alt"></i>
                  <span>Secure Login</span>
                </div>
                <div className="floating-card card-2">
                  <i className="fas fa-users"></i>
                  <span>Join 10k+ Users</span>
                </div>
                <div className="floating-card card-3">
                  <i className="fas fa-rocket"></i>
                  <span>Fast & Easy</span>
                </div>
                <div className="floating-card card-4">
                  <i className="fas fa-star"></i>
                  <span>Premium Features</span>
                </div>
              </div>

              {/* Central Logo/Icon */}
              <div className="central-logo">
                <div className="logo-circle">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="logo-rings">
                  <div className="ring ring-1"></div>
                  <div className="ring ring-2"></div>
                  <div className="ring ring-3"></div>
                </div>
              </div>

              {/* Background Geometric Shapes */}
              <div className="geometric-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
                <div className="shape shape-4"></div>
              </div>

              {/* Content Overlay */}
              <div className="content-overlay">
                <div className="overlay-content">
                  <h2>Welcome to Our Platform</h2>
                  <p>Experience seamless login and unlock amazing features designed for modern users.</p>
                  <div className="stats-row">
                    <div className="stat-item">
                      <span className="stat-number">10k+</span>
                      <span className="stat-label">Active Users</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">99.9%</span>
                      <span className="stat-label">Uptime</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">24/7</span>
                      <span className="stat-label">Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
