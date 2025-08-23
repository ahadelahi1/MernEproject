import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await axios.post("http://localhost:4000/api/admin/login", { 
        email, 
        password 
      });
      localStorage.setItem("adminToken", res.data.token);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      {/* Background Elements */}
      <div className="login-background">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>

      {/* Login Container */}
      <div className="login-container">
        <div className="login-card">
          {/* Header Section */}
          <div className="login-header">
            <div className="login-icon">
              <span className="admin-icon">👑</span>
            </div>
            <h1 className="login-title">Admin Portal</h1>
            <p className="login-subtitle">Sign in to access the dashboard</p>
          </div>

          {/* Form Section */}
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📧</span>
                Email Address
              </label>
              <div className="input-wrapper">
                <input 
                  type="email" 
                  className="form-input"
                  placeholder="Enter your email address"
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                <span className="input-icon">📧</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🔒</span>
                Password
              </label>
              <div className="input-wrapper">
                <input 
                  type="password" 
                  className="form-input"
                  placeholder="Enter your password"
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <span className="input-icon">🔒</span>
              </div>
            </div>

            <button 
              type="submit" 
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Signing In...
                </>
              ) : (
                <>
                  <span className="button-icon">🚀</span>
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <p className="footer-text">
              <span className="security-icon">🔐</span>
              Secure Admin Access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;