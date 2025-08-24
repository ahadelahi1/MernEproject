// src/register/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./css/Login.css";

export default function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

  async function LoginLogic() {
    try {
      setIsLoading(true);
      if (!email || !password) {
        toast.error("All fields are required");
        return;
      }
      const res = await axios.post("http://localhost:4000/api/user/login", {
        email,
        password,
      });
      const { user, token, msg } = res.data || {};
      if (user) {
        // normalize id key for frontend
        const normalizedUser = {
          id: user.id || user._id,
          name: user.name,
          email: user.email,
        };
        localStorage.setItem("UserInfo", JSON.stringify(normalizedUser));
      }
      if (token) {
        localStorage.setItem("AuthToken", token);
      }
      setemail("");
      setpassword("");
      toast.success(msg || "Logged in");
      nav("/");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    LoginLogic();
  };

  return (
    <div className="login-wrapper">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="toast-container"
      />

      <div className="login-container">
        {/* Left Side - Form Section */}
        <div className="login-form-section">
          <div className="form-content">
            {/* Header */}
            <div className="login-header">
              <div className="brand-icon">
                <i className="fas fa-lock"></i>
              </div>
              <h1 className="login-title">Welcome Back</h1>
              <p className="login-subtitle">Sign in to your account</p>
            </div>

            {/* Form */}
            <form className="login-form" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-envelope"></i>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  placeholder="Enter your email"
                  className="form-control"
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
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    placeholder="Enter your password"
                    className="form-control password-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="password-toggle"
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="forgot-password-container">
                <Link to="/fp" className="forgot-password-link">
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="login-btn"
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i>
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="login-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="register-link">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Visual Section */}
        <div className="login-image-section">
          {/* Floating Elements */}
          <div className="floating-elements">
            <div className="floating-card card-1">
              <i className="fas fa-shield-alt"></i>
              <span>Secure Login</span>
            </div>
            <div className="floating-card card-2">
              <i className="fas fa-users"></i>
              <span>10k+ Users</span>
            </div>
            <div className="floating-card card-3">
              <i className="fas fa-rocket"></i>
              <span>Fast & Easy</span>
            </div>
            <div className="floating-card card-4">
              <i className="fas fa-star"></i>
              <span>Top Rated</span>
            </div>
          </div>

          {/* Central Logo */}
          <div className="visual-container">
            <div className="central-logo">
              <div className="logo-rings">
                <div className="ring ring-1"></div>
                <div className="ring ring-2"></div>
                <div className="ring ring-3"></div>
              </div>
              <div className="logo-circle">
                <i className="fas fa-user-circle"></i>
              </div>
            </div>

            {/* Geometric Shapes */}
            <div className="geometric-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
              <div className="shape shape-4"></div>
            </div>
          </div>

          {/* Bottom Content */}
          <div className="content-overlay">
            <div className="overlay-content">
              <h2>Access Your Account</h2>
              <p>Sign in to access your personalized dashboard and manage your account with ease.</p>
              <div className="stats-row">
                <div className="stat-item">
                  <span className="stat-number">99%</span>
                  <span className="stat-label">Uptime</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Support</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">1M+</span>
                  <span className="stat-label">Logins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
