import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import ExhibitorSidebar from "../components/ExhibitorSidebar";
import "../exhibitorcss/BoothBooking.css";

export default function BoothBooking() {
  const [expos, setExpos] = useState([]);
  const [selectedExpo, setSelectedExpo] = useState(null);
  const [booths, setBooths] = useState([]);
  const [id, setId] = useState("");

  const [formData, setFormData] = useState({
    boothIds: [],
    bookingDate: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const animatedComponents = makeAnimated();

  useEffect(() => {
    let exhibitorData = JSON.parse(localStorage.getItem("exhibitorData"));
    if (exhibitorData?._id) {
      setId(exhibitorData._id);
    }

    axios
      .get("http://localhost:4000/api/expos/all")
      .then((res) => setExpos(res.data))
      .catch(() => toast.error("Error fetching events"));
  }, []);

  const handleExpoClick = async (expoId) => {
    try {
      const expoRes = await axios.get(`http://localhost:4000/api/expos/${expoId}`);
      setSelectedExpo(expoRes.data);

      const boothsRes = await axios.get(`http://localhost:4000/api/booths/by-expo/${expoId}`);

      const availableBooths = boothsRes.data
        .filter((b) => b.availability === "Available")
        .map((b) => ({
          value: b._id,
          label: `${b.stallNumber} - ${b.name}`,
        }));

      setBooths(availableBooths);

      setFormData({
        boothIds: [],
        bookingDate: expoRes.data.startDate?.split("T")[0] || "",
        description: `Booth booking for ${expoRes.data.title} at ${expoRes.data.location}`,
      });

      setTimeout(() => {
        const formElement = document.querySelector(".booking-form-section");
        if (formElement) {
          formElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    } catch {
      toast.error("Error loading event details");
    }
  };

  const handleBoothChange = (selectedOptions) => {
    setFormData({
      ...formData,
      boothIds: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.boothIds.length === 0 || !formData.bookingDate) {
      toast.error("Please select booth(s) and date!");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:4000/api/book/bookBooth", {
        eventId: selectedExpo._id,
        exhibitorId: id,
        boothIds: formData.boothIds,
        bookingDate: formData.bookingDate,
        description: formData.description,
      });

      toast.success("🎉 Booths booked successfully!");

      setFormData({
        boothIds: [],
        bookingDate: "",
        description: "",
      });
      setSelectedExpo(null);
      setBooths([]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForm = () => {
    setSelectedExpo(null);
    setBooths([]);
    setFormData({
      boothIds: [],
      bookingDate: "",
      description: "",
    });
  };

  return (
    <div className="exhibitor-page">
      <ExhibitorSidebar />

      <main className="exhibitor-main">
        {/* Header - Now properly positioned at the very top */}
        <div className="page-header">
          <div className="header-content">
            <div className="header-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h1 className="events-heading">
              <span className="heading-icon">📅</span>
              Upcoming Events
            </h1>
            <p className="header-subtitle">
              Discover and book booths for upcoming exhibitions and conferences
            </p>
          </div>
        </div>

        {/* Events Container */}
        <div className="events-container">
          {/* Events Grid */}
          <div className="expo-cards-grid">
            {expos.map((expo) => (
              <div
                key={expo._id}
                className={`expo-card ${
                  selectedExpo?._id === expo._id ? "active" : ""
                }`}
                onClick={() => handleExpoClick(expo._id)}
              >
                <div className="card-image-container">
                  {expo.image ? (
                    <img
                      src={`http://localhost:4000/uploads/${expo.image}`}
                      alt={expo.title}
                      className="expo-card-img"
                    />
                  ) : (
                    <div className="expo-card-placeholder">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21,15 16,10 5,21" />
                      </svg>
                      <span>No Image</span>
                    </div>
                  )}
                  <div className="card-overlay">
                    <span className="click-hint">Click to book</span>
                  </div>
                </div>

                <div className="expo-card-content">
                  <h3 className="card-title">{expo.title}</h3>
                  <div className="card-details">
                    <div className="card-detail">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span className="expo-date">
                        {new Date(expo.startDate).toLocaleDateString()} -{" "}
                        {new Date(expo.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="card-detail">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span className="expo-location">{expo.location}</span>
                    </div>
                  </div>
                  <div className="card-status">
                    <span className="status-badge">Available</span>
                  </div>
                  <button className="book-booth-btn">
                    Book Booth
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Booking Form */}
          {selectedExpo && (
            <div className="booking-form-section">
              <div className="form-header">
                <div className="form-header-content">
                  <div>
                    <h2 className="form-title">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 2L2 7h20L12 2z" />
                        <path d="M2 7v7c0 5 5 9 10 9s10-4 10-9V7" />
                      </svg>
                      Book Booth
                    </h2>
                    <p className="form-subtitle">{selectedExpo.title}</p>
                  </div>
                  <button className="close-btn" onClick={handleCloseForm}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Event Info */}
              <div className="event-info">
                <div className="info-grid">
                  <div className="info-item">
                    <p className="info-label">Event</p>
                    <p className="info-value">{selectedExpo.title}</p>
                  </div>
                  <div className="info-item">
                    <p className="info-label">Date</p>
                    <p className="info-value">
                      {new Date(selectedExpo.startDate).toLocaleDateString()} -{" "}
                      {new Date(selectedExpo.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="info-item">
                    <p className="info-label">Location</p>
                    <p className="info-value">{selectedExpo.location}</p>
                  </div>
                </div>
              </div>

              {/* Booking Form Content */}
              <div className="booking-form-content">
                <form className="booking-form" onSubmit={handleSubmit}>
                  <div className="form-section">
                    <label className="form-label">Select Booth(s)</label>
                    <Select
                      isMulti
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      options={booths}
                      onChange={handleBoothChange}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>

                  <div className="form-section">
                    <label className="form-label">Booking Date</label>
                    <input
                      type="date"
                      name="bookingDate"
                      value={formData.bookingDate}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-section">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      className="form-textarea"
                      placeholder="Enter booking description..."
                    />
                  </div>

                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="loading-spinner"></div>
                        Booking...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
