import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ExhibitorList = () => {
  const [exhibitors, setExhibitors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchExhibitors = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/exhibitors");
      setExhibitors(res.data);
    } catch (error) {
      toast.error("Failed to load exhibitors");
    }
  };

  useEffect(() => {
    fetchExhibitors();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await axios.put(`http://localhost:4000/api/exhibitors/${id}/status`, { 
        status: newStatus 
      });
      toast.success(`Status changed to ${newStatus}`);
      fetchExhibitors();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // Filter exhibitors based on search and status
  const filteredExhibitors = exhibitors.filter(exhibitor => {
    const matchesSearch = exhibitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exhibitor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || exhibitor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  return (
    <div className="expo-list-wrapper">
      {/* Header Section */}
      <div className="list-header">
        <div className="list-header-decoration"></div>
        <div className="list-header-content">
          <h1 className="list-heading">
            <span className="heading-icon">👥</span>
            Exhibitors Management
          </h1>
          <p className="list-subtitle">
            Manage and monitor all registered exhibitors
          </p>
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
            <span className="clear-icon">✕</span>
            Clear Filters
          </button>
        </div>

        <div className="filters-grid" style={{ gridTemplateColumns: '2fr 1fr 1fr' }}>
          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">🔍</span>
              Search Exhibitors
            </label>
            <div className="search-wrapper">
              <input
                type="text"
                className="filter-input search-input"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">📊</span>
              Status Filter
            </label>
            <select
              className="filter-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">📈</span>
              Results
            </label>
            <div className="results-count">
              <span className="count-icon">📊</span>
              {filteredExhibitors.length} exhibitors found
            </div>
          </div>
        </div>
      </div>

      {/* Cards Container */}
      <div className="mobile-cards-container" style={{ display: 'block' }}>
        {filteredExhibitors.length > 0 ? (
          filteredExhibitors.map((exhibitor, index) => (
            <div 
              className="mobile-card" 
              key={exhibitor._id}
              style={{ '--delay': `${index * 0.1}s` }}
            >
              <div className="mobile-card-header">
                <div className="mobile-image">
                  <div className="mobile-no-image">
                    <span className="mobile-no-image-icon">👤</span>
                  </div>
                </div>
                <div className="mobile-card-actions">
                  <button
                    className={`mobile-btn-edit ${
                      exhibitor.status === "active" ? "mobile-btn-delete" : ""
                    }`}
                    style={{
                      background: exhibitor.status === "active" 
                        ? "linear-gradient(135deg, #dc3545 0%, #c82333 100%)"
                        : "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                      boxShadow: exhibitor.status === "active"
                        ? "0 4px 12px rgba(220, 53, 69, 0.3)"
                        : "0 4px 12px rgba(40, 167, 69, 0.3)"
                    }}
                    onClick={() => toggleStatus(exhibitor._id, exhibitor.status)}
                    title={exhibitor.status === "active" ? "Deactivate" : "Activate"}
                  >
                    {exhibitor.status === "active" ? "⏸️" : "▶️"}
                  </button>
                </div>
              </div>

              <div className="mobile-card-content">
                <h3 className="mobile-card-title">{exhibitor.name}</h3>
                
                <div className="mobile-card-info">
                  <div className="mobile-info-item">
                    <span className="mobile-info-icon">✉️</span>
                    <span className="mobile-info-text">{exhibitor.email}</span>
                  </div>
                  
                  <div className="mobile-info-item">
                    <span className="mobile-info-icon">📞</span>
                    <span className="mobile-info-text">{exhibitor.phone}</span>
                  </div>
                  
                  <div className="mobile-info-item">
                    <span className="mobile-info-icon">📊</span>
                    <span 
                      className="mobile-theme-badge"
                      style={{
                        background: exhibitor.status === "active"
                          ? "linear-gradient(135deg, #28a745 0%, #20c997 100%)"
                          : "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                        color: "white"
                      }}
                    >
                      {exhibitor.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="mobile-empty-state">
            <span className="mobile-empty-icon">👥</span>
            <h3 className="mobile-empty-title">No Exhibitors Found</h3>
            <p className="mobile-empty-subtitle">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "No exhibitors have been registered yet"
              }
            </p>
            {(searchTerm || statusFilter !== "all") && (
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
    </div>
  );
};

export default ExhibitorList;