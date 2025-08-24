// src/WebPages/Index.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import './css/style.css'; // Import the new CSS file
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  const [ongoing, setOngoing] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // auth state (navbar)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("UserInfo")) || null;
    } catch {
      return null;
    }
  });

  // Feedback states
  const [ratingModal, setRatingModal] = useState(false);
  const [ratingEvent, setRatingEvent] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");

  const nav = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("http://localhost:4000/api/expos/all");
        const events = res.data;
        const now = new Date();

        const ongoingEvts = events.filter(
          (e) => new Date(e.startDate) <= now && new Date(e.endDate) >= now
        );
        const upcomingEvts = events.filter((e) => new Date(e.startDate) > now);

        setOngoing(ongoingEvts);
        setUpcoming(upcomingEvts);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleViewMore = async (eventId) => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/expos/${eventId}/details`
      );
      setModalData(res.data);
      setSelectedEvent(eventId);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching event details:", err);
    }
  };

  const handleVisited = (event) => {
    // login required
    if (!currentUser?.id) {
      alert("Please login to give feedback.");
      nav("/login");
      return;
    }
    setRatingEvent(event);
    setRatingModal(true);
  };

  const submitRating = async () => {
    if (!currentUser?.id) {
      alert("Please login first.");
      nav("/login");
      return;
    }
    if (!ratingEvent?._id || !rating) {
      alert("Please select stars before submitting.");
      return;
    }

    try {
      const payload = {
        rating,
        comment: feedbackText || "No comment",
        event: ratingEvent._id,
      };

      const token =
        localStorage.getItem("AuthToken") ||
        currentUser.token ||
        currentUser.jwt ||
        null;

      if (!token) {
        alert("Auth token missing, please login again.");
        nav("/login");
        return;
      }

      await axios.post("http://localhost:4000/api/feedback", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Feedback submitted successfully ✅");
      setRatingModal(false);
      setRating(0);
      setFeedbackText("");
    } catch (err) {
      console.error("Error submitting feedback:", err?.response?.data || err);
      alert(err?.response?.data?.message || "Failed to submit feedback");
    }
  };

  const logout = () => {
    localStorage.removeItem("UserInfo");
    localStorage.removeItem("AuthToken");
    setCurrentUser(null);
    nav("/login");
  };

  const renderCard = (event, type) => (
    <div className="event-card-wrapper" key={event._id}>
      <div className="event-card">
        <div className="event-image-container">
          <img
            src={`http://localhost:4000/uploads/${event.image}`}
            className="event-image"
            alt={event.title}
          />
          <div className="event-status-badge">
            {type === "ongoing" ? "🟢 Live" : "🔜 Soon"}
          </div>
        </div>
        <div className="event-content">
          <h3 className="event-title">{event.title}</h3>
          <div className="event-info">
            <div className="info-item">
              <i className="icon">📍</i>
              <span>{event.location}</span>
            </div>
            <div className="info-item">
              <i className="icon">📅</i>
              <span>
                {new Date(event.startDate).toLocaleDateString()} - {" "}
                {new Date(event.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div className="event-actions">
            {type === "ongoing" && (
              <label className="visited-checkbox">
                <input
                  type="checkbox"
                  onChange={() => handleVisited(event)}
                />
                <span className="checkmark"></span>
                Mark as Visited
              </label>
            )}
            <button
              className="btn-view-more"
              onClick={() => handleViewMore(event._id)}
            >
              View Details
              <i className="btn-icon">→</i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <Link to="/" className="logo-link">
                <div className="logo-icon">🎪</div>
                <span className="logo-text">EventSphere</span>
              </Link>
            </div>
            
            <nav className="nav-menu">
              <Link to="/" className="nav-link active">Home</Link>
              <Link to="/About" className="nav-link">About</Link>
              <Link to="/contact" className="nav-link">Contact</Link>
            </nav>

            <div className="auth-section">
              {currentUser ? (
                <div className="user-menu">
                  <span className="welcome-text">
                    Welcome, {currentUser.name || "User"}!
                  </span>
                  <button className="btn-logout" onClick={logout}>
                    Logout
                  </button>
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="btn-auth btn-login">
                    Login
                  </Link>
                  <Link to="/register" className="btn-auth btn-register">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-shape hero-shape-1"></div>
          <div className="hero-shape hero-shape-2"></div>
          <div className="hero-shape hero-shape-3"></div>
        </div>
        
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">
                <span>✨ Discover Amazing Events</span>
              </div>
              <h1 className="hero-title">
                Explore, Experience
                <span className="title-highlight">Excellence</span>
              </h1>
              <p className="hero-subtitle">
                Join thousands of visitors discovering incredible exhibitions, 
                connecting with innovators, and creating unforgettable memories.
              </p>
              <div className="hero-buttons">
                <a href="#events" className="btn-hero-primary">
                  Explore Events
                  <i className="btn-icon">🎯</i>
                </a>
                <Link to="/about" className="btn-hero-secondary">
                  Learn More
                </Link>
              </div>
            </div>
            
            <div className="hero-visual">
              <div className="hero-illustration">
                <div className="illustration-bg">
                  <div className="floating-element floating-1">🎪</div>
                  <div className="floating-element floating-2">🎨</div>
                  <div className="floating-element floating-3">🚀</div>
                  <div className="floating-element floating-4">⭐</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content" id="events">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading events...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Ongoing Events */}
            <section className="events-section">
              <div className="container">
                <div className="section-header">
                  <div className="section-title">
                    <h2>🎪 Ongoing Events</h2>
                    <p>Experience these amazing events happening right now</p>
                  </div>
                </div>
                
                <div className="events-grid">
                  {ongoing.length > 0 ? (
                    ongoing.map((e) => renderCard(e, "ongoing"))
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">📅</div>
                      <h3>No ongoing events at the moment</h3>
                      <p>Check back soon for exciting upcoming events!</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Upcoming Events */}
            <section className="events-section upcoming-section">
              <div className="container">
                <div className="section-header">
                  <div className="section-title">
                    <h2>🚀 Upcoming Events</h2>
                    <p>Don't miss out on these exciting future events</p>
                  </div>
                </div>
                
                <div className="events-grid">
                  {upcoming.length > 0 ? (
                    upcoming.map((e) => renderCard(e, "upcoming"))
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">🔮</div>
                      <h3>No upcoming events scheduled</h3>
                      <p>Stay tuned for announcements about future events!</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Event Details Modal */}
      {showModal && modalData && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{modalData.title}</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="modal-info-grid">
                <div className="modal-info-card">
                  <div className="info-label">📍 Location</div>
                  <div className="info-value">{modalData.location}</div>
                </div>
                <div className="modal-info-card">
                  <div className="info-label">📅 Duration</div>
                  <div className="info-value">
                    {new Date(modalData.startDate).toLocaleDateString()} - {" "}
                    {new Date(modalData.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="halls-section">
                <h3 className="halls-title">🏛️ Exhibition Halls</h3>
                {modalData.halls?.length > 0 ? (
                  <div className="halls-list">
                    {modalData.halls.map((hall) => (
                      <div key={hall._id} className="hall-card">
                        <div className="hall-header">
                          <h4 className="hall-name">{hall.name}</h4>
                          <span className="booths-count">{hall.totalBooths} booths</span>
                        </div>
                        <div className="booths-grid">
                          {hall.booths.length > 0 ? (
                            hall.booths.map((booth) => (
                              <div key={booth._id} className="booth-item">
                                <span className="booth-number">#{booth.boothNumber}</span>
                                <span className="exhibitor-name">
                                  {booth.exhibitor?.name || "Available"}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="no-booths">
                              <span>📭 No booths booked yet</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-halls">
                    <div className="empty-icon">🏢</div>
                    <p>No halls available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {ratingModal && ratingEvent && (
        <div className="modal-overlay" onClick={() => setRatingModal(false)}>
          <div className="rating-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rating-header">
              <h3>⭐ Rate Your Experience</h3>
              <p>{ratingEvent.title}</p>
            </div>
            
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`star ${star <= rating ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
            
            <div className="rating-feedback">
              {rating === 0 && "Click on stars to rate"}
              {rating === 1 && "Poor 😞"}
              {rating === 2 && "Fair 😐"}
              {rating === 3 && "Good 🙂"}
              {rating === 4 && "Very Good 😊"}
              {rating === 5 && "Excellent! 🎉"}
            </div>

            <textarea
              className="feedback-textarea"
              placeholder="Share your thoughts about this event... (optional)"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows="3"
            />

            <div className="rating-actions">
              <button className="btn-submit-rating" onClick={submitRating}>
                Submit Feedback
              </button>
              <button
                className="btn-cancel-rating"
                onClick={() => {
                  setRatingModal(false);
                  setRating(0);
                  setFeedbackText("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo-icon">🎪</div>
                <span className="logo-text">EventSphere</span>
              </div>
              <p className="footer-description">
                Discover amazing events and create unforgettable memories with EventSphere
              </p>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h4>Navigation</h4>
                <Link to="/">Home</Link>
                <Link to="/About">About Us</Link>
                <Link to="/contact">Contact</Link>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 EventSphere. All rights reserved | Designed with ❤️ by Future Waves</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;