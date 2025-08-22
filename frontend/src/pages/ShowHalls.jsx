import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../ExpoList.css";

const ShowHalls = () => {
  const [halls, setHalls] = useState([]);
  const [search, setSearch] = useState("");
  const [hallNumber, setHallNumber] = useState("");

  useEffect(() => {
    fetchHalls();
  }, [search, hallNumber]);

  const fetchHalls = () => {
    axios
      .get("http://localhost:4000/api/halls/get", {
        params: { search, hallNumber }
      })
      .then((res) => setHalls(res.data))
      .catch(() => toast.error("Error loading halls"));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this hall?")) {
      axios.delete(`http://localhost:4000/api/halls/delete/${id}`)
        .then(() => {
          toast.success("Hall deleted successfully");
          fetchHalls();
        })
        .catch(() => toast.error("Error deleting hall"));
    }
  };

  const clearFilters = () => {
    setSearch("");
    setHallNumber("");
  };

  return (
    <div className="expo-list-wrapper">
      {/* Header Section */}
      <div className="list-header">
        <div className="list-header-decoration"></div>
        <div className="list-header-content">
          <h2 className="list-heading">
            <span className="heading-icon">🏢</span>
            Hall Management
          </h2>
          <p className="list-subtitle">
            Manage and organize your exhibition halls
          </p>
        </div>
        <div className="header-actions">
          <Link to="/halls/add" className="btn-add">
            <span className="btn-icon">➕</span>
            Add New Hall
          </Link>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-container">
        <div className="filters-header">
          <h3 className="filters-title">
            <span className="filter-icon">🔍</span>
            Search & Filter
          </h3>
          <button className="btn-clear-filters" onClick={clearFilters}>
            <span className="clear-icon">🗑️</span>
            Clear All
          </button>
        </div>
        
        <div className="filters-grid">
          {/* Search Input */}
          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">🔎</span>
              Search by Event Title
            </label>
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Search by expo title..."
                className="filter-input search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          {/* Hall Number Filter */}
          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">🏢</span>
              Filter by Hall Number
            </label>
            <input
              type="number"
              placeholder="Enter hall number..."
              className="filter-input"
              value={hallNumber}
              onChange={(e) => setHallNumber(e.target.value)}
            />
          </div>

          {/* Empty column for grid layout consistency */}
          <div className="filter-group"></div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <div className="results-count">
          <span className="count-icon">📊</span>
          <span className="count-text">
            {halls.length} {halls.length === 1 ? 'Hall' : 'Halls'} Found
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="table-container">
        <div className="table-wrapper">
          <table className="expo-table">
            <thead className="table-head">
              <tr>
                <th className="th-title">
                  <span className="th-icon">🏢</span>
                  Hall Number
                </th>
                <th className="th-location">
                  <span className="th-icon">📊</span>
                  Booth Count
                </th>
                <th className="th-description">
                  <span className="th-icon">📝</span>
                  Event Title
                </th>
                <th className="th-actions">
                  <span className="th-icon">⚙️</span>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="table-body">
              {halls.length > 0 ? (
                halls.map((hall, index) => (
                  <tr key={hall._id} className="table-row" style={{ '--delay': `${index * 0.1}s` }}>
                    <td className="td-title">
                      <div className="title-container">
                        <span className="title-text">Hall {hall.hallNumber}</span>
                      </div>
                    </td>
                    <td className="td-location">
                      <div className="location-container">
                        <span className="location-icon">📊</span>
                        <span className="location-text">{hall.numberOfBooths} Booths</span>
                      </div>
                    </td>
                    <td className="td-description">
                      <div className="description-container">
                        <span className="description-text">
                          {hall.expoId?.title || "No Event Assigned"}
                        </span>
                      </div>
                    </td>
                    <td className="td-actions">
                      <div className="action-buttons">
                        <Link
                          to={`/halls/edit/${hall._id}`}
                          className="btn-edit"
                          title="Edit Hall"
                        >
                          <span className="action-icon">✏️</span>
                        </Link>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(hall._id)}
                          title="Delete Hall"
                        >
                          <span className="action-icon">🗑️</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="empty-row">
                  <td colSpan="4" className="empty-cell">
                    <div className="empty-state">
                      <div className="empty-icon">🏢</div>
                      <div className="empty-title">No Halls Found</div>
                      <div className="empty-subtitle">
                        {search || hallNumber
                          ? "Try adjusting your filters to find more halls"
                          : "Start by adding your first exhibition hall"}
                      </div>
                      <Link to="/halls/add" className="btn-empty-action">
                        <span className="btn-icon">➕</span>
                        Add First Hall
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShowHalls;