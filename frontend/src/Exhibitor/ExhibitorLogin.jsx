import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      const res = await axios.post("http://localhost:4000/api/exhibitors/exhibitorlogin", {
        email,
        password,
      }).then((a)=>{
        toast.success(a.data.message);
        // Redirect to Exhibitor Dashboard
        window.location.href = "/exhibitordashboard";
      }).catch((a)=>{
        toast.error(a.data.message);

      });

      // Backend should return exhibitor data with status
   
      
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid email or password");
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
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </main>
  </div>
);

}
