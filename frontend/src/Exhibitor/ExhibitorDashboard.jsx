import React from "react";
import ExhibitorSidebar from "../components/ExhibitorSidebar";
import "../exhibitorcss/ExhibitorDashboard.css";



const ExhibitorDashboard = () => {
  return (
    <div className="exhibitor-page">
      {/* Replace custom sidebar div with imported component */}
      <ExhibitorSidebar />

      {/* Main content */}
      <main className="exhibitor-main">
        <h1 className="dashboard-title">Welcome, Exhibitor!</h1>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h2>Booths Booked</h2>
            <p className="card-number booths">3</p>
          </div>
          <div className="dashboard-card">
            <h2>Upcoming Events</h2>
            <p className="card-number events">2</p>
          </div>
          <div className="dashboard-card">
            <h2>Profile Status</h2>
            <p className="card-number status">Active</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExhibitorDashboard;
