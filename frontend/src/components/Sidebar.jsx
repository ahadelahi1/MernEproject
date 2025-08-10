

import React from "react";
import { Link } from "react-router-dom";
import "../Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
  <h4 className="text-center mb-4 fw-bold brand-name">EventSphere Admin</h4>

  {/* Dashboard */}
  <Link to="/dashboard" className="sidebar-link">
    <i className="bi bi-speedometer2 me-2"></i> Dashboard
  </Link>

  {/* Manage Expos Dropdown */}
  <div className="dropdown-section">
    <input type="checkbox" id="expo-toggle" />
    <label htmlFor="expo-toggle" className="sidebar-link dropdown-label">
      <i className="bi bi-calendar-event me-2"></i> Manage Expos
      <i className="bi bi-chevron-down ms-auto"></i>
    </label>
    <div className="dropdown-content">
      <Link to="/expos/add" className="dropdown-item-custom">
        <i className="bi bi-plus-circle me-2"></i> Add Expo
      </Link>
      <Link to="/expos" className="dropdown-item-custom">
        <i className="bi bi-list-ul me-2"></i> Expo List
      </Link>
    </div>
  </div>
 

  {/* Manage Halls Dropdown */}
  <div className="dropdown-section">
    <input type="checkbox" id="hall-toggle" />
    <label htmlFor="hall-toggle" className="sidebar-link dropdown-label">
      <i className="bi bi-building me-2"></i> Manage Halls
      <i className="bi bi-chevron-down ms-auto"></i>
    </label>
    <div className="dropdown-content">
      <Link to="/halls/add" className="dropdown-item-custom">
        <i className="bi bi-plus-circle me-2"></i> Add Hall
      </Link>
      <Link to="/halls" className="dropdown-item-custom">
        <i className="bi bi-list-ul me-2"></i> Hall List
      </Link>
    </div>
  </div>


 <div className="dropdown-section">
    <input type="checkbox" id="booth-toggle" />
    <label htmlFor="booth-toggle" className="sidebar-link dropdown-label">
      <i className="bi bi-shop-window me-2"></i> Manage Booths
      <i className="bi bi-chevron-down ms-auto"></i>
    </label>
    <div className="dropdown-content">
      <Link to="/add-booth" className="dropdown-item-custom">
        <i className="bi bi-plus-circle me-2"></i> Add Booth
      </Link>
      <Link to="/booths" className="dropdown-item-custom">
        <i className="bi bi-list-ul me-2"></i> Booth List
      </Link>
    </div>
  </div>
  <Link to="/exhibitors" className="sidebar-link">
  <i className="bi bi-person-badge me-2"></i> Exhibitor List
</Link>
      <Link to="/visitors" className="sidebar-link">
        <i className="bi bi-people me-2"></i> Visitor List
      </Link>




</div>

  );
};

export default Sidebar;
