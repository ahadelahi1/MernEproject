import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Sidebar.css";

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking on overlay
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking on a link
  const handleLinkClick = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      {isMobile && (
        <button 
          className="sidebar-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle Menu"
        >
          <i className={`bi ${isMobileMenuOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && (
        <div 
          className={`sidebar-overlay ${isMobileMenuOpen ? 'show' : ''}`}
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isMobile && isMobileMenuOpen ? 'show' : ''}`}>
        <h4 className="text-center mb-4 fw-bold brand-name">EventSphere Admin</h4>

        {/* Dashboard */}
        <Link 
          to="/dashboard" 
          className="sidebar-link"
          onClick={handleLinkClick}
        >
          <i className="bi bi-speedometer2 me-2"></i> 
          <span>Dashboard</span>
        </Link>

        {/* Manage Event */}
        <div className="dropdown-section">
          <input type="checkbox" id="expo-toggle" />
          <label htmlFor="expo-toggle" className="sidebar-link dropdown-label">
            <div className="d-flex align-items-center">
              <i className="bi bi-calendar-event me-2"></i> 
              <span>Manage Event</span>
            </div>
            <i className="bi bi-chevron-down ms-auto"></i>
          </label>
          <div className="dropdown-content">
            <Link 
              to="/expos/add" 
              className="dropdown-item-custom"
              onClick={handleLinkClick}
            >
              <i className="bi bi-plus-circle me-2"></i> 
              <span>Add Event</span>
            </Link>
            <Link 
              to="/expos" 
              className="dropdown-item-custom"
              onClick={handleLinkClick}
            >
              <i className="bi bi-list-ul me-2"></i> 
              <span>Event List</span>
            </Link>
          </div>
        </div>

        {/* Manage Halls */}
        <div className="dropdown-section">
          <input type="checkbox" id="hall-toggle" />
          <label htmlFor="hall-toggle" className="sidebar-link dropdown-label">
            <div className="d-flex align-items-center">
              <i className="bi bi-building me-2"></i> 
              <span>Manage Halls</span>
            </div>
            <i className="bi bi-chevron-down ms-auto"></i>
          </label>
          <div className="dropdown-content">
            <Link 
              to="/halls/add" 
              className="dropdown-item-custom"
              onClick={handleLinkClick}
            >
              <i className="bi bi-plus-circle me-2"></i> 
              <span>Add Hall</span>
            </Link>
            <Link 
              to="/halls" 
              className="dropdown-item-custom"
              onClick={handleLinkClick}
            >
              <i className="bi bi-list-ul me-2"></i> 
              <span>Hall List</span>
            </Link>
          </div>
        </div>

        {/* Manage Booths */}
        <div className="dropdown-section">
          <input type="checkbox" id="booth-toggle" />
          <label htmlFor="booth-toggle" className="sidebar-link dropdown-label">
            <div className="d-flex align-items-center">
              <i className="bi bi-shop-window me-2"></i> 
              <span>Manage Booths</span>
            </div>
            <i className="bi bi-chevron-down ms-auto"></i>
          </label>
          <div className="dropdown-content">
            <Link 
              to="/booths" 
              className="dropdown-item-custom"
              onClick={handleLinkClick}
            >
              <i className="bi bi-list-ul me-2"></i> 
              <span>Booth List</span>
            </Link>
          </div>
        </div>

        {/* Manage Participation */}
        <Link 
          to="/participation" 
          className="sidebar-link"
          onClick={handleLinkClick}
        >
          <i className="bi bi-person-check me-2"></i> 
          <span>Participation List</span>
        </Link>

        {/* Exhibitors */}
        <Link 
          to="/exhibitors" 
          className="sidebar-link"
          onClick={handleLinkClick}
        >
          <i className="bi bi-person-badge me-2"></i> 
          <span>Exhibitor List</span>
        </Link>

        {/* Visitors */}
        <Link 
          to="/visitors" 
          className="sidebar-link"
          onClick={handleLinkClick}
        >
          <i className="bi bi-people me-2"></i> 
          <span>Visitor List</span>
        </Link>
      </div>
    </>
  );
};

export default Sidebar;