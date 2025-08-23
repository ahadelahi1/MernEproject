import React, { useEffect, useState } from "react";
import axios from "axios";
import ExhibitorSidebar from "../components/ExhibitorSidebar";
import "../exhibitorcss/ExhibitorDashboard.css";

const ExhibitorDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    boothsBooked: 0,
    upcomingEvents: 0,
    status: "Inactive",
  });
  const [bookings, setBookings] = useState([]);
  const [exhibitorInfo, setExhibitorInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const storedData = localStorage.getItem("exhibitorData");
      if (storedData) {
        const exhibitor = JSON.parse(storedData);
        const exhibitorId = exhibitor._id;
        setExhibitorInfo(exhibitor);

        // Dashboard summary API
        const dashboardRes = await axios.get(`http://localhost:4000/api/exhibitors/${exhibitorId}/dashboard`);
        setDashboardData(dashboardRes.data);

        // Bookings API
        const bookingsRes = await axios.get(`http://localhost:4000/api/book/bookBooth/${exhibitorId}`);
        setBookings(bookingsRes.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  const handleLogout = () => {
    localStorage.removeItem("exhibitorData");
    window.location.href = "/login";
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'linear-gradient(to right, #10b981, #059669)';
      case 'pending': return 'linear-gradient(to right, #f59e0b, #d97706)';
      case 'inactive': return 'linear-gradient(to right, #ef4444, #dc2626)';
      default: return 'linear-gradient(to right, #6b7280, #4b5563)';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="exhibitor-page">
        <ExhibitorSidebar />
        <main className="exhibitor-main">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="exhibitor-page">
      <ExhibitorSidebar />
      <main className="exhibitor-main">
        {/* Compact Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-title">
              <div className="title-accent"></div>
              <div>
                <h1>Welcome, {exhibitorInfo.companyName || 'Exhibitor'}!</h1>
                <p>Exhibition Dashboard</p>
              </div>
            </div>
            <div className="header-actions">
              <button
                className="btn-refresh"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <span className="btn-icon">{refreshing ? '🔄' : '📊'}</span>
                {refreshing ? 'Loading...' : 'Refresh'}
              </button>
              <button className="btn-logout" onClick={handleLogout}>
                <span className="btn-icon">🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="dashboard-main">
          {/* Stats Grid - Compact */}
          <div className="stats-grid">
            <div className="stat-card stat-card-blue">
              <div className="stat-icon">🏪</div>
              <div className="stat-content">
                <h3>Booths</h3>
                <div className="stat-value">{dashboardData.boothsBooked}</div>
              </div>
            </div>

            <div className="stat-card stat-card-green">
              <div className="stat-icon">🎭</div>
              <div className="stat-content">
                <h3>Events</h3>
                <div className="stat-value">{dashboardData.upcomingEvents}</div>
              </div>
            </div>

            <div className="stat-card stat-card-orange">
              <div className="stat-icon">✨</div>
              <div className="stat-content">
                <h3>Status</h3>
                <div
                  className="status-badge"
                  style={{ background: getStatusColor(dashboardData.status) }}
                >
                  {dashboardData.status}
                </div>
              </div>
            </div>

            <div className="stat-card stat-card-purple">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>Revenue</h3>
                <div className="stat-value">₨{(dashboardData.boothsBooked * 25).toLocaleString()}K</div>
              </div>
            </div>
          </div>

          {/* Activity Grid - Responsive */}
          <div className="activity-grid">
            {/* Recent Bookings Card */}
            <div className="activity-card">
              <h3>
                <div className="card-accent green"></div>
                Recent Bookings
              </h3>
              <div className="activity-content">
                {bookings.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <p>No bookings yet</p>
                    <button className="cta-btn">Book Now</button>
                  </div>
                ) : (
                  <>
                    {bookings.slice(0, 3).map((booking, index) => (
                      <div key={booking._id} className="activity-item green">
                        <div className="booking-info">
                          <strong>{booking.boothId?.name || `Booth #${index + 1}`}</strong>
                          <br />
                          <small>{booking.eventId?.title || "Event Name"}</small>
                        </div>
                        <div className="activity-badge green">
                          {formatDate(booking.bookingDate || booking.eventId?.date)}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="activity-card">
              <h3>
                <div className="card-accent purple"></div>
                Quick Actions
              </h3>
              <div className="activity-content">
                <div className="activity-item blue">
                  <span>📋 Book New Booth</span>
                  <div className="activity-badge blue">Action</div>
                </div>
                <div className="activity-item orange">
                  <span>👤 Update Profile</span>
                  <div className="activity-badge orange">Manage</div>
                </div>
                <div className="activity-item purple">
                  <span>🎪 Browse Events</span>
                  <div className="activity-badge purple">Explore</div>
                </div>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="activity-card full-width">
              <h3>
                <div className="card-accent green"></div>
                Recent Activity
              </h3>
              <div className="activity-content">
                <div className="activity-item green">
                  <span>✅ Booth booking confirmed for Tech Expo 2024</span>
                  <div className="activity-badge green">2h ago</div>
                </div>
                <div className="activity-item blue">
                  <span>💰 Payment received - ₨25,000</span>
                  <div className="activity-badge blue">1d ago</div>
                </div>
                <div className="activity-item orange">
                  <span>📝 Profile updated successfully</span>
                  <div className="activity-badge orange">3d ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExhibitorDashboard;
