import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../ExpoList.css";

const ExpoList = () => {
  const [expos, setExpos] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [theme, setTheme] = useState("");

  const fetchExpos = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/expos/all", {
        params: { search, startDate, endDate, theme }
      });
      setExpos(res.data);
    } catch (error) {
      toast.error("Error fetching expos");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expo?")) {
      try {
        await axios.delete(`http://localhost:4000/api/expos/${id}`);
        toast.success("Expo deleted successfully");
        fetchExpos();
      } catch (error) {
        toast.error("Error deleting expo");
      }
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setTheme("");
  };

  useEffect(() => {
    fetchExpos();
  }, [search, startDate, endDate, theme]);

  return (
    <div className="expo-list-wrapper">
      {/* Header Section */}
      <div className="list-header">
        <div className="list-header-decoration"></div>
        <div className="list-header-content">
          <h2 className="list-heading">
            <span className="heading-icon">📋</span>
            Event Management
          </h2>
          <p className="list-subtitle">
            Manage and organize your exhibitions and events
          </p>
        </div>
        <div className="header-actions">
          <Link to="/expos/add" className="btn-add">
            <span className="btn-icon">➕</span>
            Add New Event
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
              Search Events
            </label>
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Search by title..."
                className="filter-input search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          {/* Date Range */}
          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">📅</span>
              Date Range
            </label>
            <div className="date-range">
              <input
                type="date"
                className="filter-input date-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="From date"
              />
              <span className="date-separator">→</span>
              <input
                type="date"
                className="filter-input date-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="To date"
              />
            </div>
          </div>

          {/* Theme Filter */}
          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">🎨</span>
              Filter by Theme
            </label>
            <input
              type="text"
              placeholder="Enter theme..."
              className="filter-input"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <div className="results-count">
          <span className="count-icon">📊</span>
          <span className="count-text">
            {expos.length} {expos.length === 1 ? 'Event' : 'Events'} Found
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="table-container">
        <div className="table-wrapper">
          <table className="expo-table">
            <thead className="table-head">
              <tr>
                <th className="th-image">
                  <span className="th-icon">🖼️</span>
                  Image
                </th>
                <th className="th-title">
                  <span className="th-icon">📝</span>
                  Title
                </th>
                <th className="th-location">
                  <span className="th-icon">📍</span>
                  Location
                </th>
                <th className="th-date">
                  <span className="th-icon">📅</span>
                  Start Date
                </th>
                <th className="th-date">
                  <span className="th-icon">📅</span>
                  End Date
                </th>
                <th className="th-theme">
                  <span className="th-icon">🎨</span>
                  Theme
                </th>
                <th className="th-description">
                  <span className="th-icon">📄</span>
                  Description
                </th>
                <th className="th-actions">
                  <span className="th-icon">⚙️</span>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="table-body">
              {expos.length > 0 ? (
                expos.map((expo, index) => (
                  <tr key={expo._id} className="table-row" style={{ '--delay': `${index * 0.1}s` }}>
                    <td className="td-image">
                      {expo.image ? (
                        <div className="image-container">
                          <img
                            src={`http://localhost:4000/uploads/${expo.image}`}
                            alt={expo.title}
                            className="expo-image"
                          />
                          <div className="image-overlay">
                            <span className="overlay-text">View</span>
                          </div>
                        </div>
                      ) : (
                        <div className="no-image">
                          <span className="no-image-icon">🖼️</span>
                          <span className="no-image-text">No Image</span>
                        </div>
                      )}
                    </td>
                    <td className="td-title">
                      <div className="title-container">
                        <span className="title-text">{expo.title}</span>
                      </div>
                    </td>
                    <td className="td-location">
                      <div className="location-container">
                        <span className="location-icon">📍</span>
                        <span className="location-text">{expo.location}</span>
                      </div>
                    </td>
                    <td className="td-date">
                      <div className="date-container">
                        <span className="date-text">
                          {new Date(expo.startDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="td-date">
                      <div className="date-container">
                        <span className="date-text">
                          {new Date(expo.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="td-theme">
                      <div className="theme-container">
                        <span className="theme-badge">{expo.theme}</span>
                      </div>
                    </td>
                    <td className="td-description">
                      <div className="description-container">
                        <span className="description-text">{expo.description}</span>
                      </div>
                    </td>
                    <td className="td-actions">
                      <div className="action-buttons">
                        <Link
                          to={`/expos/edit/${expo._id}`}
                          className="btn-edit"
                          title="Edit Event"
                        >
                          <span className="action-icon">✏️</span>
                        </Link>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(expo._id)}
                          title="Delete Event"
                        >
                          <span className="action-icon">🗑️</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="empty-row">
                  <td colSpan="8" className="empty-cell">
                    <div className="empty-state">
                      <div className="empty-icon">📭</div>
                      <div className="empty-title">No Events Found</div>
                      <div className="empty-subtitle">
                        {search || startDate || endDate || theme
                          ? "Try adjusting your filters to find more events"
                          : "Start by adding your first event"}
                      </div>
                      <Link to="/expos/add" className="btn-empty-action">
                        <span className="btn-icon">➕</span>
                        Add First Event
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

export default ExpoList;