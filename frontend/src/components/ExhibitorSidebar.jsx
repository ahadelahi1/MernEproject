import React from "react";
import { Link } from "react-router-dom";
import "../exhibitorcss/ExhibitorSidebar.css";

export default function ExhibitorSidebar() {
  return (
    <div className=" text-center mb-4 fw-bold exhibitor-sidebar">
      <h3 className= "brand-name"> EventSphere Exhibitor</h3>
      <ul>
        <li>
          <Link to="/exhibitordashboard">
            <i className="bi bi-speedometer2 me-2"></i> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/exhibitorreg">
            <i className="bi bi-pencil-square me-2"></i> Register
          </Link>
        </li>
        <li>
          <Link to="/exhibitorlogin">
            <i className="bi bi-box-arrow-in-right me-2"></i> Login
          </Link>
        </li>
        <li>
          <Link to="/booking">
            <i className="bi bi-calendar-check me-2"></i> Booth Booking
          </Link>
        </li>
        <li>
          <Link to="/exhibitorprofile">
            <i className="bi bi-person-circle me-2"></i> Profile
          </Link>
        </li>
      </ul>
    </div>
  );
}
