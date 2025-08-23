import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, } from 'react-router-dom';

import ExhibitorSidebar from "../components/ExhibitorSidebar";
import "../exhibitorcss/ExhibitorLogin.css";

export default function ExhibitorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required!");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("http://localhost:4000/api/exhibitors/exhibitorlogin", {
        email,
        password,
      });

      const { token, exhibitor, message } = response.data;

      localStorage.setItem("exhibitorToken", token);
      localStorage.setItem("exhibitorData", JSON.stringify(exhibitor));

      toast.success(message);

      window.location.href = "/exhibitordashboard";

    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  return (
  <div className="exhibitor-page">
    <ExhibitorSidebar />

    <main className="exhibitor-main">
      <div className="form-card">
        <h2 className="form-title">Exhibitor Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <br />
       <div style={{ marginTop: "10px", textAlign: "right" }}>
   {/* <Link  style={{
    color: "#007bff",
    textDecoration: "none",
    fontSize: "0.9rem"
  }}className="mt-3" to="/">Forget Password</Link> */}

</div>

        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </main>
  </div>
);

}
