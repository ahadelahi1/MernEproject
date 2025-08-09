import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import ExhibitorSidebar from "../components/ExhibitorSidebar";
import "../exhibitorcss/ExhibitorRegister.css";

export default function ExhibitorRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      toast.error("All fields are required!");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:4000/api/exhibitors/exhibitorreg", {
        ...formData,
      });

      toast.success("Registered successfully! Wait for admin approval.");
      setFormData({ name: "", email: "", password: "", phone: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exhibitor-page">
      {/* Sidebar */}
      {/* <ExhibitorSidebar /> */}

      {/* Main Content */}
      <main className="exhibitor-main">
        <div className="form-card">
          <h2 className="form-title">Exhibitor Registration</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 chars)"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </main>
    </div>
  );
}
