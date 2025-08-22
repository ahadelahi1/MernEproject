import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css';

const Dashboard = () => {
  const [expos, setExpos] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [exhibitors, setExhibitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Expos
      const exposResponse = await axios.get("http://localhost:4000/api/expos/all");
      setExpos(exposResponse.data);

      // Fetch Visitors
      const visitorsResponse = await axios.get("http://localhost:4000/api/user/visitors");
      setVisitors(visitorsResponse.data);

      // Fetch Exhibitors
      const exhibitorsResponse = await axios.get("http://localhost:4000/api/exhibitors");
      setExhibitors(exhibitorsResponse.data);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const refreshData = () => {
    fetchData();
  };

  const stats = [
    {
      title: "Total Events",
      value: expos.length,
      icon: "📅",
      colorClass: "stat-card-blue"
    },
    {
      title: "Ongoing Events", 
      value: getOngoingEvents().length,
      icon: "🎯",
      colorClass: "stat-card-green"
    },
    {
      title: "Upcoming Events",
      value: getUpcomingEvents().length,
      icon: "⏰", 
      colorClass: "stat-card-orange"
    },
    {
      title: "Total Visitors",
      value: visitors.length.toLocaleString(),
      icon: "👥",
      colorClass: "stat-card-purple"
    },
    {
      title: "Total Exhibitors",
      value: exhibitors.length,
      icon: "🏢",
      colorClass: "stat-card-red"
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <div className="title-accent"></div>
            <h1>Dashboard Overview</h1>
          </div>
          <div className="header-actions">
            <button onClick={refreshData} className="btn-refresh" disabled={loading}>
              <svg className="btn-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Refresh
            </button>
            <button onClick={handleLogout} className="btn-logout">
              <svg className="btn-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h2>Welcome back, Admin! 👋</h2>
          <p>Here's what's happening with your events today</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {loading ? (
            Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="stat-card skeleton">
                <div className="stat-icon skeleton-icon"></div>
                <div className="stat-content">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-value"></div>
                </div>
              </div>
            ))
          ) : (
            stats.map((stat, index) => (
              <div key={index} className={`stat-card ${stat.colorClass}`}>
                <div className="stat-icon">
                  <span>{stat.icon}</span>
                </div>
                <div className="stat-content">
                  <h3>{stat.title}</h3>
                  <p className="stat-value">{stat.value}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Activity Cards */}
        <div className="activity-grid">
          <div className="activity-card">
            <h3>
              <span className="card-accent green"></span>
              Event Status
            </h3>
            <div className="activity-content">
              <div className="activity-item green">
                <span>Active Events</span>
                <span className="activity-badge green">{getOngoingEvents().length}</span>
              </div>
              <div className="activity-item orange">
                <span>Upcoming Events</span>
                <span className="activity-badge orange">{getUpcomingEvents().length}</span>
              </div>
            </div>
          </div>

          <div className="activity-card">
            <h3>
              <span className="card-accent purple"></span>
              Performance
            </h3>
            <div className="activity-content">
              <div className="activity-item purple">
                <span>Total Participants</span>
                <span className="activity-badge purple">
                  {(visitors.length + exhibitors.length).toLocaleString()}
                </span>
              </div>
              <div className="activity-item blue">
                <span>Average per Event</span>
                <span className="activity-badge blue">
                  {expos.length > 0 ? Math.round((visitors.length + exhibitors.length) / expos.length) : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;