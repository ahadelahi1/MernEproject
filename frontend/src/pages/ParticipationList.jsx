import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../ExpoList.css";

const ShowParticipants = () => {
  const [halls, setHalls] = useState([]);
  const [search, setSearch] = useState("");
  const [hallNumber, setHallNumber] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHalls();
  }, [search, hallNumber]);

  const fetchHalls = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/halls/get", {
        params: { search, hallNumber },
      });

      // Populate booths with booked exhibitors
      const hallsData = await Promise.all(
        res.data.map(async (hall) => {
          const bookingsRes = await axios.get(
            `http://localhost:4000/api/expos/${hall.expoId._id}/details`
          );

          const hallDetails = bookingsRes.data.halls.find(
            (h) => h._id === hall._id
          );

          return {
            ...hall,
            booths: hallDetails ? hallDetails.booths : [],
          };
        })
      );

      setHalls(hallsData);
      setLoading(false);
    } catch (err) {
      toast.error("Error loading halls");
      console.error(err);
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setHallNumber("");
  };

  // Calculate statistics
  const totalHalls = halls.length;
  const totalBookedBooths = halls.reduce((acc, hall) => acc + hall.booths.length, 0);
  const totalExhibitors = halls.reduce((acc, hall) => {
    return acc + hall.booths.filter(booth => booth.exhibitor).length;
  }, 0);

  if (loading) {
    return (
      <div className="expo-list-wrapper">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <div className="text-center">
            <div className="spinner-border text-warning" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 fs-5 fw-semibold text-muted">Loading participants...</p>
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
            Exhibition Participants
          </h1>
          <p className="list-subtitle">
            View all exhibitors and their booth assignments across different halls
          </p>
        </div>
        <div className="header-actions">
          <div className="d-flex gap-2 flex-wrap">
            <span className="badge rounded-pill bg-gradient text-white px-3 py-2"
                  style={{ background: "linear-gradient(45deg,#28a745,#20c997)" }}>
              {totalHalls} Halls
            </span>
            <span className="badge rounded-pill bg-gradient text-white px-3 py-2"
                  style={{ background: "linear-gradient(45deg,#17a2b8,#138496)" }}>
              {totalBookedBooths} Booths
            </span>
            <span className="badge rounded-pill bg-gradient text-white px-3 py-2"
                  style={{ background: "linear-gradient(45deg,#ffc107,#ffb300)" }}>
              {totalExhibitors} Exhibitors
            </span>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-container">
        <div className="filters-header">
          <h3 className="filters-title">
            <span className="filter-icon">🔍</span>
            Search & Filter
          </h3>
          <button 
            className="btn-clear-filters"
            onClick={clearFilters}
          >
            <span className="clear-icon">✖</span>
            Clear Filters
          </button>
        </div>

        <div className="filters-grid" style={{ gridTemplateColumns: "2fr 1fr 1fr" }}>
          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">🎪</span>
              Search by Expo Title
            </label>
            <div className="search-wrapper">
              <input
                type="text"
                className="filter-input search-input"
                placeholder="Search expo titles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">🏛️</span>
              Hall Number
            </label>
            <input
              type="number"
              className="filter-input"
              placeholder="Enter hall number..."
              value={hallNumber}
              onChange={(e) => setHallNumber(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">📊</span>
              Quick Stats
            </label>
            <div className="d-flex align-items-center h-100">
              <div className="results-count">
                <span className="count-icon">📊</span>
                {totalHalls} Halls Found
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="table-container d-none d-md-block">
        <div className="table-wrapper">
          <table className="expo-table">
            <thead className="table-head">
              <tr>
                <th className="th-title">
                  <span className="th-icon">🎪</span>
                  Expo Title
                </th>
                <th className="th-location">
                  <span className="th-icon">🏛️</span>
                  Hall Number
                </th>
                <th className="th-date">
                  <span className="th-icon">🏢</span>
                  Booth Number
                </th>
                <th className="th-theme">
                  <span className="th-icon">👤</span>
                  Exhibitor Name
                </th>
                <th className="th-actions">
                  <span className="th-icon">📊</span>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="table-body">
              {halls.length > 0 ? (
                halls.map((hall, hallIndex) =>
                  hall.booths.length > 0 ? (
                    hall.booths.map((booth, boothIndex) => (
                      <tr key={`${hall._id}-${booth._id}`} className="table-row" 
                          style={{ "--delay": `${(hallIndex * hall.booths.length + boothIndex) * 0.1}s` }}>
                        <td>
                          <div className="title-container">
                            <span className="title-text">{hall.expoId?.title || "—"}</span>
                          </div>
                        </td>
                        <td>
                          <div className="location-container">
                            <span className="location-icon">🏛️</span>
                            <span className="location-text">Hall {hall.hallNumber}</span>
                          </div>
                        </td>
                        <td>
                          <div className="date-container">
                            <span className="date-text">Booth {booth.boothNumber}</span>
                          </div>
                        </td>
                        <td>
                          <div className="theme-container">
                            <span className="theme-badge">
                              {booth.exhibitor?.name || "—"}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <span className={`badge ${booth.exhibitor ? 'bg-success' : 'bg-secondary'} px-3 py-2`}>
                              {booth.exhibitor ? "✅ Booked" : "⭕ Empty"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr key={hall._id} className="table-row" 
                        style={{ "--delay": `${hallIndex * 0.1}s` }}>
                      <td>
                        <div className="title-container">
                          <span className="title-text">{hall.expoId?.title || "—"}</span>
                        </div>
                      </td>
                      <td>
                        <div className="location-container">
                          <span className="location-icon">🏛️</span>
                          <span className="location-text">Hall {hall.hallNumber}</span>
                        </div>
                      </td>
                      <td colSpan="3">
                        <div className="text-center py-3">
                          <div className="empty-icon" style={{ fontSize: "24px", opacity: "0.5" }}>📋</div>
                          <span className="text-muted fw-semibold">No booked booths in this hall</span>
                        </div>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr className="empty-row">
                  <td colSpan="5" className="empty-cell">
                    <div className="empty-state">
                      <div className="empty-icon">🔍</div>
                      <h3 className="empty-title">No Participants Found</h3>
                      <p className="empty-subtitle">
                        No halls match your search criteria. Try adjusting your filters or check back later.
                      </p>
                      <button 
                        className="btn-empty-action"
                        onClick={clearFilters}
                      >
                        <span>🔄</span>
                        Clear Filters
                      </button>
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
        {halls.length > 0 ? (
          halls.map((hall, hallIndex) => (
            <div key={hall._id} className="mb-4">
              {/* Hall Header Card */}
              <div className="mobile-card" 
                   style={{ 
                     background: "linear-gradient(135deg, #ffc107 0%, #ffed4a 100%)",
                     animation: `slideInUp 0.6s ease-out ${hallIndex * 0.1}s both`
                   }}>
                <div className="mobile-card-header">
                  <div className="mobile-card-content">
                    <h5 className="mobile-card-title text-dark mb-2">
                      🎪 {hall.expoId?.title || "Unknown Expo"}
                    </h5>
                    <div className="mobile-card-info">
                      <div className="mobile-info-item">
                        <span className="mobile-info-icon">🏛️</span>
                        <span className="mobile-info-text text-dark fw-bold">Hall {hall.hallNumber}</span>
                      </div>
                      <div className="mobile-info-item">
                        <span className="mobile-info-icon">🏢</span>
                        <span className="mobile-info-text text-dark fw-bold">
                          {hall.booths.length} booth{hall.booths.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booths Cards */}
              {hall.booths.length > 0 ? (
                hall.booths.map((booth, boothIndex) => (
                  <div key={booth._id} className="mobile-card" 
                       style={{ 
                         marginLeft: "20px",
                         animation: `slideInUp 0.6s ease-out ${(hallIndex * hall.booths.length + boothIndex) * 0.1 + 0.2}s both`
                       }}>
                    <div className="mobile-card-content">
                      <h6 className="mobile-card-title">
                        🏢 Booth {booth.boothNumber}
                      </h6>
                      <div className="mobile-card-info">
                        <div className="mobile-info-item">
                          <span className="mobile-info-icon">👤</span>
                          <span className="mobile-info-text">
                            {booth.exhibitor?.name || "No exhibitor assigned"}
                          </span>
                        </div>
                        <div className="mobile-info-item">
                          <span className="mobile-info-icon">📊</span>
                          <span className={`mobile-theme-badge ${booth.exhibitor ? 'bg-success text-white' : 'bg-secondary text-white'}`}>
                            {booth.exhibitor ? "✅ Booked" : "⭕ Available"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="mobile-card" 
                     style={{ 
                       marginLeft: "20px",
                       animation: `slideInUp 0.6s ease-out ${hallIndex * 0.1 + 0.2}s both`
                     }}>
                  <div className="mobile-empty-state py-3">
                    <div className="mobile-empty-icon" style={{ fontSize: "32px" }}>📋</div>
                    <h6 className="mobile-empty-title">No Booked Booths</h6>
                    <p className="mobile-empty-subtitle">This hall has no exhibitors registered yet.</p>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="mobile-empty-state">
            <div className="mobile-empty-icon">🔍</div>
            <h3 className="mobile-empty-title">No Participants Found</h3>
            <p className="mobile-empty-subtitle">
              No halls match your search criteria. Try adjusting your filters.
            </p>
            <button 
              className="mobile-btn-empty-action"
              onClick={clearFilters}
            >
              <span>🔄</span>
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Statistics Footer */}
      {halls.length > 0 && (
        <div className="filters-container mt-4">
          <div className="filters-header">
            <h3 className="filters-title">
              <span className="filter-icon">📊</span>
              Quick Statistics
            </h3>
          </div>
          <div className="row g-3">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <div className="h2 text-success mb-2">🏛️</div>
                  <h5 className="card-title text-success">{totalHalls}</h5>
                  <p className="card-text text-muted mb-0">Total Halls</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <div className="h2 text-info mb-2">🏢</div>
                  <h5 className="card-title text-info">{totalBookedBooths}</h5>
                  <p className="card-text text-muted mb-0">Booked Booths</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <div className="h2 text-warning mb-2">👥</div>
                  <h5 className="card-title text-warning">{totalExhibitors}</h5>
                  <p className="card-text text-muted mb-0">Active Exhibitors</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <div className="h2 text-primary mb-2">📈</div>
                  <h5 className="card-title text-primary">
                    {totalBookedBooths > 0 ? Math.round((totalExhibitors / totalBookedBooths) * 100) : 0}%
                  </h5>
                  <p className="card-text text-muted mb-0">Occupancy Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowParticipants;