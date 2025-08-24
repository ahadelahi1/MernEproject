import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/RegisterData.css'; // Import your updated CSS file

function RegisterData() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [age, setage] = useState("");
  const [gender, setgender] = useState("");
  const [role, setrole] = useState("");
  const [address, setaddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submitfunc = async (e) => {
    e.preventDefault();

    const nameRegex = /^[a-zA-Z]{2,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;

    if (!name || !email || !password || !age || !gender || !role || !address) {
      toast.error("All fields are required");
      return;
    }

    if (!nameRegex.test(name)) {
      toast.error("Invalid name. Only alphabets, 2-15 characters.");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Invalid email format.");
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error("Password must be strong (8+ chars, uppercase, lowercase, number, symbol)");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/api/user/register", {
        name,
        email,
        password,
        age,
        gender,
        role,
        address,
      });
      toast.success(res.data.msg || "Data Registered successfully");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="register-wrapper">
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
      />

      <div className="form-container">
        {/* Left Side - Form Section */}
        <div className="register-form-section">
          <div className="form-content">
            {/* Header Section */}
            <div className="form-header">
              <div className="brand-icon">
                <i className="fas fa-user-plus"></i>
              </div>
              <h1 className="form-title">Create Account</h1>
              <p className="form-subtitle">Join us today and get started with your journey</p>
            </div>

            {/* Form Section */}
            <form onSubmit={submitfunc} className="register-form">
              {/* Name and Age Row */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-user"></i>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-calendar-alt"></i>
                    Age
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter your age"
                    value={age}
                    onChange={(e) => setage(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
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

              {/* Password */}
              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-lock"></i>
                  Password
                </label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control password-input"
                    placeholder="Create a strong password"
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
                <div className="password-hint">
                  Password must contain uppercase, lowercase, number & special character
                </div>
              </div>

              {/* Gender and Role Row */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-venus-mars"></i>
                    Gender
                  </label>
                  <select
                    className="form-control select-control"
                    value={gender}
                    onChange={(e) => setgender(e.target.value)}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-user-tag"></i>
                    Role
                  </label>
                  <select
                    className="form-control select-control"
                    value={role}
                    onChange={(e) => setrole(e.target.value)}
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="visitor">Visitor</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="vendor">Vendor</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-map-marker-alt"></i>
                  Address
                </label>
                <textarea
                  className="form-control textarea-control"
                  placeholder="Enter your complete address"
                  value={address}
                  onChange={(e) => setaddress(e.target.value)}
                  rows="3"
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <button type="submit" className="submit-btn">
                <i className="fas fa-user-plus"></i>
                Create Account
              </button>
            </form>

            {/* Footer */}
            
          </div>
        </div>

        {/* Right Side - Modern Visual Section */}
        <div className="register-image-section">
          <div className="visual-container">
            {/* Floating Cards */}
            <div className="floating-elements">
              <div className="floating-card card-1">
                <i className="fas fa-shield-alt"></i>
                <span>Secure & Safe</span>
              </div>
              <div className="floating-card card-2">
                <i className="fas fa-users"></i>
                <span>Join Community</span>
              </div>
              <div className="floating-card card-3">
                <i className="fas fa-rocket"></i>
                <span>Get Started</span>
              </div>
              <div className="floating-card card-4">
                <i className="fas fa-star"></i>
                <span>Premium Features</span>
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
                <i className="fas fa-user-plus"></i>
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

          {/* Content Overlay */}
          <div className="content-overlay">
            <div className="overlay-content">
              <h2>Welcome to Our Platform</h2>
              <p>Join thousands of users who trust us with their digital journey. Experience secure, fast, and reliable service.</p>

              <div className="stats-row">
                <div className="stat-item">
                  <span className="stat-number">10K+</span>
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
  );
}

export default RegisterData;
