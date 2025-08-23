import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../ExpoList.css";

const ShowBooths = () => {
  const [hallData, setHallData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedHall, setSelectedHall] = useState("All");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchBooths = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/booths/all");
      const booths = res.data;

      // Group booths by hall
      const grouped = booths.reduce((acc, booth) => {
        const hallName =
          booth.hall?.name || booth.hall?.hallNumber || "Unknown Hall";
        if (!acc[hallName]) acc[hallName] = [];
        acc[hallName].push(booth);
        return acc;
      }, {});

      setHallData(grouped);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load booths");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooths();
  }, []);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setSelectedHall("All");
  };

  if (loading)
    return (
      <div className="expo-list-wrapper">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <div className="text-center">
            <div className="spinner-border text-warning" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 fs-5 fw-semibold text-muted">Loading booths...</p>
          </div>
        </div>
      </div>
    );

  const halls = Object.keys(hallData);

  // Calculate total booths for display
  const filteredHalls = Object.entries(hallData).filter(([hallName]) => 
    selectedHall === "All" || selectedHall === hallName
  );

  const totalBooths = filteredHalls.reduce((total, [, booths]) => {
    const filteredBooths = booths.filter((booth) => {
      const matchesSearch = booth.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || 
        (statusFilter === "Available" && booth.availability === "Available") ||
        (statusFilter === "Booked" && booth.availability !== "Available");
      return matchesSearch && matchesStatus;
    });
    return total + filteredBooths.length;
  }, 0);

  return (
    <div className="expo-list-wrapper">
      {/* Header Section */}
      <div className="list-header">
        <div className="list-header-decoration"></div>
        <div className="list-header-content">
          <h1 className="list-heading">
            <span className="heading-icon">🏛️</span>
            Exhibition Booths
          </h1>
          <p className="list-subtitle">
            Manage and view all exhibition booths across different halls
          </p>
        </div>
        <div className="header-actions">
          <span className="badge rounded-pill bg-gradient text-white px-4 py-2 fs-5"
                style={{ background: "linear-gradient(45deg,#4e54c8,#8f94fb)" }}>
            {totalBooths} Total Booths
          </span>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-container">
        <div className="filters-header">
          <h3 className="filters-title">
            <span className="filter-icon">🔍</span>
            Filter Booths
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
              Search Booths
            </label>
            <div className="search-wrapper">
              <input
                type="text"
                className="filter-input search-input"
                placeholder="Search by booth name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">📊</span>
              Availability Status
            </label>
            <select
              className="filter-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Booths</option>
              <option value="Available">Available Only</option>
              <option value="Booked">Booked Only</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">🏛️</span>
              Select Hall
            </label>
            <select
              className="filter-input"
              value={selectedHall}
              onChange={(e) => setSelectedHall(e.target.value)}
            >
              <option value="All">All Halls</option>
              {halls.map((hall) => (
                <option key={hall} value={hall}>
                  {hall}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <div className="results-count">
          <span className="count-icon">📊</span>
          Showing {totalBooths} booth{totalBooths !== 1 ? 's' : ''}
          {selectedHall !== "All" && ` in ${selectedHall}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      </div>

      {/* Empty State */}
      {halls.length === 0 && (
        <div className="table-container">
          <div className="empty-row">
            <div className="empty-cell">
              <div className="empty-state">
                <div className="empty-icon">🏛️</div>
                <h3 className="empty-title">No Booths Available</h3>
                <p className="empty-subtitle">
                  There are currently no exhibition booths to display. Please check back later or contact the administrator.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Halls Display */}
      {filteredHalls.map(([hallName, booths]) => {
        // Apply filters
        let filteredBooths = booths.filter((booth) =>
          booth.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (statusFilter === "Available") {
          filteredBooths = filteredBooths.filter(
            (booth) => booth.availability === "Available"
          );
        } else if (statusFilter === "Booked") {
          filteredBooths = filteredBooths.filter(
            (booth) => booth.availability !== "Available"
          );
        }

        // Split into available/booked
        const availableBooths = filteredBooths.filter(
          (booth) => booth.availability === "Available"
        );
        const bookedBooths = filteredBooths.filter(
          (booth) => booth.availability !== "Available"
        );

        if (filteredBooths.length === 0) return null;

        return (
          <div key={hallName} className="table-container mb-5">
            {/* Hall Header */}
            <div className="list-header mb-0" style={{ borderRadius: "20px 20px 0 0", marginBottom: "0" }}>
              <div className="list-header-decoration"></div>
              <div className="list-header-content">
                <h2 className="list-heading" style={{ fontSize: "28px", margin: "0" }}>
                  <span className="heading-icon">🏛️</span>
                  Hall {hallName}
                </h2>
                <p className="list-subtitle" style={{ margin: "0" }}>
                  {filteredBooths.length} booth{filteredBooths.length !== 1 ? 's' : ''} • 
                  {availableBooths.length} available • 
                  {bookedBooths.length} booked
                </p>
              </div>
              <div className="header-actions">
                <span className="badge rounded-pill bg-gradient text-white px-3 py-2 fs-6"
                      style={{ background: "linear-gradient(45deg,#4e54c8,#8f94fb)" }}>
                  {filteredBooths.length} Booths
                </span>
              </div>
            </div>

            {/* Desktop View - Two Column Layout */}
            <div className="table-wrapper d-none d-lg-block">
              <div className="row g-4 p-4">
                {/* Available Booths */}
                <div className="col-6">
                  <div className="card shadow-lg border-0 h-100" style={{ borderRadius: "16px" }}>
                    <div className="card-header bg-transparent border-0 pb-0">
                      <h5 className="fw-bold text-success mb-3 d-flex align-items-center gap-2">
                        <span>✅</span>
                        Available Booths ({availableBooths.length})
                      </h5>
                    </div>
                    <div className="card-body">
                      {availableBooths.length === 0 ? (
                        <div className="text-center py-4">
                          <div className="empty-icon" style={{ fontSize: "48px", opacity: "0.3" }}>📋</div>
                          <p className="text-muted mt-2">No available booths</p>
                        </div>
                      ) : (
                        <div className="row g-3">
                          {availableBooths.map((booth, index) => (
                            <div key={booth._id} className="col-6 col-xl-4">
                              <div
                                className="booth-card p-3 text-center shadow-sm"
                                style={{ 
                                  background: "linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%)", 
                                  borderRadius: "12px",
                                  border: "2px solid rgba(40, 167, 69, 0.1)",
                                  transition: "all 0.3s ease",
                                  cursor: "pointer",
                                  animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.transform = "translateY(-5px)";
                                  e.target.style.boxShadow = "0 8px 25px rgba(40, 167, 69, 0.2)";
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.transform = "translateY(0)";
                                  e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                                }}
                              >
                                <h6 className="fw-bold mb-2 text-dark">{booth.name}</h6>
                                <span className="badge text-success fw-bold px-3 py-2" 
                                      style={{ 
                                        background: "rgba(40, 167, 69, 0.15)",
                                        borderRadius: "20px",
                                        fontSize: "12px"
                                      }}>
                                  Available
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Booked Booths */}
                <div className="col-6">
                  <div className="card shadow-lg border-0 h-100" style={{ borderRadius: "16px" }}>
                    <div className="card-header bg-transparent border-0 pb-0">
                      <h5 className="fw-bold text-danger mb-3 d-flex align-items-center gap-2">
                        <span>❌</span>
                        Booked Booths ({bookedBooths.length})
                      </h5>
                    </div>
                    <div className="card-body">
                      {bookedBooths.length === 0 ? (
                        <div className="text-center py-4">
                          <div className="empty-icon" style={{ fontSize: "48px", opacity: "0.3" }}>📋</div>
                          <p className="text-muted mt-2">No booked booths</p>
                        </div>
                      ) : (
                        <div className="row g-3">
                          {bookedBooths.map((booth, index) => (
                            <div key={booth._id} className="col-6 col-xl-4">
                              <div
                                className="booth-card p-3 text-center shadow-sm"
                                style={{ 
                                  background: "linear-gradient(135deg, #fdeaea 0%, #fef0f0 100%)", 
                                  borderRadius: "12px",
                                  border: "2px solid rgba(220, 53, 69, 0.1)",
                                  transition: "all 0.3s ease",
                                  cursor: "pointer",
                                  animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.transform = "translateY(-5px)";
                                  e.target.style.boxShadow = "0 8px 25px rgba(220, 53, 69, 0.2)";
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.transform = "translateY(0)";
                                  e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                                }}
                              >
                                <h6 className="fw-bold mb-2 text-dark">{booth.name}</h6>
                                <span className="badge text-danger fw-bold px-3 py-2" 
                                      style={{ 
                                        background: "rgba(220, 53, 69, 0.15)",
                                        borderRadius: "20px",
                                        fontSize: "12px"
                                      }}>
                                  Booked
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile View - Cards */}
            <div className="mobile-cards-container d-block d-lg-none">
              <div className="p-3">
                {/* Available Booths Mobile */}
                <div className="mb-4">
                  <h5 className="fw-bold text-success mb-3 d-flex align-items-center gap-2">
                    <span>✅</span>
                    Available Booths ({availableBooths.length})
                  </h5>
                  {availableBooths.length === 0 ? (
                    <div className="mobile-empty-state">
                      <div className="mobile-empty-icon">📋</div>
                      <h6 className="mobile-empty-title">No Available Booths</h6>
                      <p className="mobile-empty-subtitle">All booths in this hall are currently booked.</p>
                    </div>
                  ) : (
                    <div className="row g-2">
                      {availableBooths.map((booth, index) => (
                        <div key={booth._id} className="col-6 col-sm-4">
                          <div
                            className="mobile-card p-3 text-center"
                            style={{ 
                              background: "linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%)",
                              border: "2px solid rgba(40, 167, 69, 0.1)",
                              animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
                            }}
                          >
                            <h6 className="fw-bold mb-2 text-dark" style={{ fontSize: "14px" }}>{booth.name}</h6>
                            <span className="mobile-theme-badge" 
                                  style={{ 
                                    background: "rgba(40, 167, 69, 0.15)",
                                    color: "#28a745",
                                    fontSize: "11px"
                                  }}>
                              Available
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Booked Booths Mobile */}
                <div>
                  <h5 className="fw-bold text-danger mb-3 d-flex align-items-center gap-2">
                    <span>❌</span>
                    Booked Booths ({bookedBooths.length})
                  </h5>
                  {bookedBooths.length === 0 ? (
                    <div className="mobile-empty-state">
                      <div className="mobile-empty-icon">📋</div>
                      <h6 className="mobile-empty-title">No Booked Booths</h6>
                      <p className="mobile-empty-subtitle">All booths in this hall are available for booking.</p>
                    </div>
                  ) : (
                    <div className="row g-2">
                      {bookedBooths.map((booth, index) => (
                        <div key={booth._id} className="col-6 col-sm-4">
                          <div
                            className="mobile-card p-3 text-center"
                            style={{ 
                              background: "linear-gradient(135deg, #fdeaea 0%, #fef0f0 100%)",
                              border: "2px solid rgba(220, 53, 69, 0.1)",
                              animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
                            }}
                          >
                            <h6 className="fw-bold mb-2 text-dark" style={{ fontSize: "14px" }}>{booth.name}</h6>
                            <span className="mobile-theme-badge" 
                                  style={{ 
                                    background: "rgba(220, 53, 69, 0.15)",
                                    color: "#dc3545",
                                    fontSize: "11px"
                                  }}>
                              Booked
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* No Results State */}
      {totalBooths === 0 && halls.length > 0 && (
        <div className="table-container">
          <div className="empty-row">
            <div className="empty-cell">
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3 className="empty-title">No Booths Match Your Filters</h3>
                <p className="empty-subtitle">
                  Try adjusting your search criteria or clearing the filters to see more results.
                </p>
                <button 
                  className="btn-empty-action"
                  onClick={clearFilters}
                >
                  <span>🔄</span>
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowBooths;