import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../exhibitorcss/ExhibitorSidebar.css";

export default function ExhibitorSidebar() {
  const navigate = useNavigate();

  // ✅ Check login status
  const isLoggedIn = !!localStorage.getItem("exhibitorToken");

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("exhibitorToken");
    localStorage.removeItem("exhibitorData");
    navigate("/exhibitorlogin");
  };

  return (
    <div className="text-center mb-4 fw-bold exhibitor-sidebar">
      <h3 className="brand-name">EventSphere Exhibitor</h3>
      <ul>
        <li>
          <Link to="/exhibitordashboard">
            <i className="bi bi-speedometer2 me-2"></i> Dashboard
          </Link>
        </li>

        {/* ✅ Show Register/Login only if NOT logged in */}
        {!isLoggedIn && (
          <>
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
          </>
        )}

        {/* ✅ Booth Booking — only if logged in */}
        {isLoggedIn && (
          <li>
            <Link to="/booking">
              <i className="bi bi-calendar-check me-2"></i> Booth Booking
            </Link>
          </li>
        )}

        {/* ✅ Profile — optional (show always or only when logged in) */}
        {isLoggedIn && (
  <>
    <li>
      <Link to="/exhibitorprofile">
        <i className="bi bi-person-circle me-2"></i> Profile
      </Link>
    </li>  {/* <-- Close this li */}

    <li>
  <span onClick={handleLogout} className="logout-link">
    <i className="bi bi-box-arrow-right me-2"></i> Logout
  </span>
</li>
  </>
)}


      </ul>
    </div>
  );
}
