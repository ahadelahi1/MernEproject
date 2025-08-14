import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css';

const Dashboard = () => {
  const [expos, setExpos] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [exhibitors, setExhibitors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Expos
    axios.get("http://localhost:4000/api/expos/all")
      .then(res => setExpos(res.data))
      .catch(() => console.error("Failed to load expos"));

    // Fetch Visitors
    axios.get("http://localhost:4000/api/users/visitors")
      .then(res => setVisitors(res.data))
      .catch(() => console.error("Failed to load visitors"));

    // Fetch Exhibitors
    axios.get("http://localhost:4000/api/exhibitors")
      .then(res => setExhibitors(res.data))
      .catch(() => console.error("Failed to load exhibitors"));
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const getOngoingEvents = () => {
    return expos.filter(expo => expo.startDate <= today && expo.endDate >= today);
  };

  const getUpcomingEvents = () => {
    return expos.filter(expo => expo.startDate > today);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  return (
    <div className="dashboard-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="dashboard-heading">Dashboard Overview</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="dashboard-card shadow-sm">
            <h5>Total Event</h5>
            <p className="stat-value">{expos.length}</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="dashboard-card shadow-sm">
            <h5>Ongoing Events</h5>
            <p className="stat-value">{getOngoingEvents().length}</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="dashboard-card shadow-sm">
            <h5>Upcoming Events</h5>
            <p className="stat-value">{getUpcomingEvents().length}</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="dashboard-card shadow-sm">
            <h5>Total Visitors</h5>
            <p className="stat-value">{visitors.length}</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="dashboard-card shadow-sm">
            <h5>Total Exhibitors</h5>
            <p className="stat-value">{exhibitors.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
