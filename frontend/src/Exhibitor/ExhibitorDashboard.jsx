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

  useEffect(() => {
    const storedData = localStorage.getItem("exhibitorData");

    if (storedData) {
      const exhibitor = JSON.parse(storedData);
      const exhibitorId = exhibitor._id;

      // Dashboard summary API
      axios.get(`http://localhost:4000/api/exhibitors/${exhibitorId}/dashboard`)
        .then(res => setDashboardData(res.data))
        .catch(err => console.log(err));

      // Bookings API
      axios.get(`http://localhost:4000/api/book/bookBooth/${exhibitorId}`)
        .then(res => setBookings(res.data))
        .catch(err => console.log(err));
    }
  }, []);

  return (
    <div className="exhibitor-page">
      <ExhibitorSidebar />

      <main className="exhibitor-main">
        <h1 className="dashboard-title">Welcome, Exhibitor!</h1>

        <div className="dashboard-cards">
          {/* Top Row */}
          <div className="dashboard-card-row">
            <div className="dashboard-card">
              <h2>Booths Booked</h2>
              <p className="card-number booths">{dashboardData.boothsBooked}</p>
            </div>

            <div className="dashboard-card">
              <h2>Profile Status</h2>
              <p className="card-number status">{dashboardData.status}</p>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="dashboard-card-row">
            <div className="dashboard-card scrollable-card">
              <h2>Upcoming Events</h2>
              <p className="card-number events">{dashboardData.upcomingEvents}</p>
            </div>

            <div className="dashboard-card scrollable-card">
              <h2>Recent Bookings</h2>
              {bookings.length === 0 ? (
                <p>No bookings yet</p>
              ) : (
                <ul className="booking-list">
                  {bookings.map(booking => (
                    <li key={booking._id}>
                      Booth: {booking.boothId?.name || "N/A"} <br />
                      Event: {booking.eventId?.title || "N/A"} <br />
                      Date: {new Date(booking.bookingDate || booking.eventId?.date).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExhibitorDashboard;
