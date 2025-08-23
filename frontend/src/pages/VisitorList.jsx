import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../ExpoList.css";

const VisitorList = () => {
  const [visitors, setVisitors] = useState([]);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("all");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/user/visitors", {
        params: { search, gender, sort }
      });
      setVisitors(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load visitors");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [search, gender, sort]);

  const clearFilters = () => {
    setSearch("");
    setGender("all");
    setSort("");
  };

  // Calculate statistics
  const totalVisitors = visitors.length;
  const maleVisitors = visitors.filter(v => v.gender === "male").length;
  const femaleVisitors = visitors.filter(v => v.gender === "female").length;
  const avgAge = visitors.length > 0 
    ? Math.round(visitors.reduce((acc, v) => acc + (v.age || 0), 0) / visitors.filter(v => v.age).length) 
    : 0;

  if (loading) {
    return (
      <div className="expo-list-wrapper">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <div className="text-center">
            <div className="spinner-border text-warning" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 fs-5 fw-semibold text-muted">Loading visitors...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="expo-list-wrapper">
      {/* Header Section */}
      <div className="list-header">
        <div className="list-header-decoration"></div>
        <div className="list-header-content">
          <h1 className="list-heading">
            <span className="heading-icon">👥</span>
            Visitor Management
          </h1>
          <p className="list-subtitle">
            View and manage all registered exhibition visitors
          </p>
        </div>
        <div className="header-actions">
          <div className="d-flex gap-2 flex-wrap">
            <span className="badge rounded-pill bg-gradient text-white px-3 py-2"
                  style={{ background: "linear-gradient(45deg,#ffc107,#ffb300)" }}>
              {totalVisitors} Total Visitors
            </span>
            <span className="badge rounded-pill bg-gradient text-white px-3 py-2"
                  style={{ background: "linear-gradient(45deg,#007bff,#0056b3)" }}>
              👨 {maleVisitors} Male
            </span>
            <span className="badge rounded-pill bg-gradient text-white px-3 py-2"
                  style={{ background: "linear-gradient(45deg,#e83e8c,#d91a72)" }}>
              👩 {femaleVisitors} Female
            </span>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-container">
        <div className="filters-header">
          <h3 className="filters-title">
            <span className="filter-icon">🔍</span>
            Search & Filter Visitors
          </h3>
          <button 
            className="btn-clear-filters"
            onClick={clearFilters}
          >
            <span className="clear-icon">✖</span>
            Clear All Filters
          </button>
        </div>

        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">🔍</span>
              Search by Name
            </label>
            <div className="search-wrapper">
              <input
                type="text"
                className="filter-input search-input"
                placeholder="Enter visitor name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">⚧</span>
              Filter by Gender
            </label>
            <select
              className="filter-input"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="all">All Genders</option>
              <option value="male">👨 Male</option>
              <option value="female">👩 Female</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">📊</span>
              Sort by Age
            </label>
            <select
              className="filter-input"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Default Order</option>
              <option value="asc">🔺 Age (Low to High)</option>
              <option value="desc">🔻 Age (High to Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <div className="results-count">
          <span className="count-icon">📊</span>
          Showing {visitors.length} visitor{visitors.length !== 1 ? 's' : ''}
          {search && ` matching "${search}"`}
          {gender !== "all" && ` (${gender})`}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="table-container d-none d-md-block">
        <div className="table-wrapper">
          <table className="expo-table">
            <thead className="table-head">
              <tr>
                <th className="th-title">
                  <span className="th-icon">👤</span>
                  Visitor Name
                </th>
                <th className="th-location">
                  <span className="th-icon">📧</span>
                  Email Address
                </th>
                <th className="th-date">
                  <span className="th-icon">🎂</span>
                  Age
                </th>
                <th className="th-description">
                  <span className="th-icon">🏠</span>
                  Address
                </th>
                <th className="th-theme">
                  <span className="th-icon">⚧</span>
                  Gender
                </th>
                <th className="th-actions">
                  <span className="th-icon">📊</span>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="table-body">
              {visitors.length > 0 ? (
                visitors.map((visitor, index) => (
                  <tr key={visitor._id} className="table-row" 
                      style={{ "--delay": `${index * 0.1}s` }}>
                    <td>
                      <div className="title-container">
                        <span className="title-text">{visitor.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="location-container">
                        <span className="location-icon">📧</span>
                        <span className="location-text">{visitor.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="date-container">
                        <span className="date-text">
                          {visitor.age ? `${visitor.age} years` : "—"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="description-container">
                        <span className="description-text">
                          {visitor.address || "Not provided"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="theme-container">
                        <span className={`theme-badge ${
                          visitor.gender === 'male' ? 'bg-primary' : 
                          visitor.gender === 'female' ? 'bg-pink' : 'bg-secondary'
                        }`} style={{
                          background: visitor.gender === 'male' 
                            ? "linear-gradient(135deg, #007bff 0%, #0056b3 100%)" 
                            : visitor.gender === 'female'
                            ? "linear-gradient(135deg, #e83e8c 0%, #d91a72 100%)"
                            : "linear-gradient(135deg, #6c757d 0%, #545b62 100%)"
                        }}>
                          {visitor.gender === 'male' ? '👨 Male' : 
                           visitor.gender === 'female' ? '👩 Female' : 
                           '⚧ Not specified'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <span className="badge bg-success px-3 py-2">
                          ✅ Registered
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="empty-row">
                  <td colSpan="6" className="empty-cell">
                    <div className="empty-state">
                      <div className="empty-icon">👥</div>
                      <h3 className="empty-title">No Visitors Found</h3>
                      <p className="empty-subtitle">
                        {search || gender !== "all" ? 
                          "No visitors match your current filters. Try adjusting your search criteria." :
                          "No visitors have registered yet. Check back later for updates."
                        }
                      </p>
                      {(search || gender !== "all") && (
                        <button 
                          className="btn-empty-action"
                          onClick={clearFilters}
                        >
                          <span>🔄</span>
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="mobile-cards-container d-block d-md-none">
        {visitors.length > 0 ? (
          visitors.map((visitor, index) => (
            <div key={visitor._id} className="mobile-card" 
                 style={{ animation: `slideInUp 0.6s ease-out ${index * 0.1}s both` }}>
              <div className="mobile-card-header">
                <div className="mobile-card-content">
                  <h5 className="mobile-card-title">
                    👤 {visitor.name}
                  </h5>
                  <div className="mobile-card-info">
                    <div className="mobile-info-item">
                      <span className="mobile-info-icon">📧</span>
                      <span className="mobile-info-text">{visitor.email}</span>
                    </div>
                    <div className="mobile-info-item">
                      <span className="mobile-info-icon">🎂</span>
                      <span className="mobile-info-text">
                        {visitor.age ? `${visitor.age} years old` : "Age not provided"}
                      </span>
                    </div>
                    <div className="mobile-info-item">
                      <span className="mobile-info-icon">🏠</span>
                      <span className="mobile-info-text">
                        {visitor.address || "Address not provided"}
                      </span>
                    </div>
                    <div className="mobile-info-item">
                      <span className="mobile-info-icon">⚧</span>
                      <span className={`mobile-theme-badge ${
                        visitor.gender === 'male' ? 'text-primary' : 
                        visitor.gender === 'female' ? 'text-danger' : 'text-secondary'
                      }`} style={{
                        background: visitor.gender === 'male' 
                          ? "rgba(0, 123, 255, 0.1)" 
                          : visitor.gender === 'female'
                          ? "rgba(232, 62, 140, 0.1)"
                          : "rgba(108, 117, 125, 0.1)"
                      }}>
                        {visitor.gender === 'male' ? '👨 Male' : 
                         visitor.gender === 'female' ? '👩 Female' : 
                         '⚧ Not specified'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mobile-card-actions">
                  <span className="badge bg-success px-2 py-1" style={{ fontSize: "10px" }}>
                    ✅ Registered
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="mobile-empty-state">
            <div className="mobile-empty-icon">👥</div>
            <h3 className="mobile-empty-title">No Visitors Found</h3>
            <p className="mobile-empty-subtitle">
              {search || gender !== "all" ? 
                "No visitors match your current filters." :
                "No visitors have registered yet."
              }
            </p>
            {(search || gender !== "all") && (
              <button 
                className="mobile-btn-empty-action"
                onClick={clearFilters}
              >
                <span>🔄</span>
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Statistics Dashboard */}
      {visitors.length > 0 && (
        <div className="filters-container mt-4">
          <div className="filters-header">
            <h3 className="filters-title">
              <span className="filter-icon">📊</span>
              Visitor Statistics
            </h3>
          </div>
          <div className="row g-3">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <div className="h2 text-warning mb-2">👥</div>
                  <h5 className="card-title text-warning">{totalVisitors}</h5>
                  <p className="card-text text-muted mb-0">Total Visitors</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <div className="h2 text-primary mb-2">👨</div>
                  <h5 className="card-title text-primary">{maleVisitors}</h5>
                  <p className="card-text text-muted mb-0">Male Visitors</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <div className="h2 mb-2" style={{ color: "#e83e8c" }}>👩</div>
                  <h5 className="card-title" style={{ color: "#e83e8c" }}>{femaleVisitors}</h5>
                  <p className="card-text text-muted mb-0">Female Visitors</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <div className="h2 text-info mb-2">📊</div>
                  <h5 className="card-title text-info">{avgAge || "—"}</h5>
                  <p className="card-text text-muted mb-0">Average Age</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorList;