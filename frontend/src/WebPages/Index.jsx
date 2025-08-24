// src/WebPages/Index.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/bootstrap.min.css";
import "./css/font-awesome.min.css";
import "./css/elegant-icons.css";
import "./css/magnific-popup.css";
import "./css/slicknav.min.css";
import "./css/style.css";

import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  const [ongoing, setOngoing] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [popular, setPopular] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Contact modal states
  const [contactModal, setContactModal] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

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
    const fetchEventsAndPopular = async () => {
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

        // popular = avg rating >= 4
        try {
          const fb = await axios.get("http://localhost:4000/api/expos/popular");
          const list = fb.data || [];
          const totals = {}; // {eventId: {sum, count}}
          list.forEach((f) => {
            const id = f.event?._id || f.event; // populated or raw id
            if (!id) return;
            if (!totals[id]) totals[id] = { sum: 0, count: 0 };
            totals[id].sum += Number(f.rating || 0);
            totals[id].count += 1;
          });
          const avg = Object.fromEntries(
            Object.entries(totals).map(([k, v]) => [k, v.sum / v.count])
          );
          const popularEvts = events.filter((e) => (avg[e._id] || 0) >= 4);
          setPopular(popularEvts);
        } catch {
          setPopular([]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchEventsAndPopular();
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
        rating, // correct key
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

  // Contact form submit
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      alert("Please fill all fields before sending.");
      return;
    }

    setIsSending(true);
    try {
      // Try backend endpoint first (you should have a server route to accept this)
      await axios.post("http://localhost:4000/api/contact", {
        name: contactName,
        email: contactEmail,
        message: contactMessage,
      });

      alert("Message sent successfully. We'll get back to you soon 👌");
      setContactModal(false);
      setContactName("");
      setContactEmail("");
      setContactMessage("");
    } catch (err) {
      console.error("Contact send failed:", err);
      // Fallback: open user's email client with prefilled content
      const subject = encodeURIComponent("Contact from EventSphere website");
      const body = encodeURIComponent(
        `Name: ${contactName}\nEmail: ${contactEmail}\n\nMessage:\n${contactMessage}`
      );
      window.location.href = `mailto:info@eventsphere.com?subject=${subject}&body=${body}`;
    } finally {
      setIsSending(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("UserInfo");
    localStorage.removeItem("AuthToken");
    setCurrentUser(null);
    nav("/login");
  };

  const renderCard = (event, type) => (
    <div className="col-lg-4 col-md-6 mb-4" key={event._id}>
      <div className="card shadow-sm border-0">
        <img
          src={`http://localhost:4000/uploads/${event.image}`}
          className="card-img-top"
          alt={event.title}
        />
        <div className="card-body text-center">
          <h5 className="card-title">{event.title}</h5>
          <p className="card-text">
            📍 {event.location} <br />
            🗓 {new Date(event.startDate).toLocaleDateString()} -{" "}
            {new Date(event.endDate).toLocaleDateString()}
          </p>
          {type === "ongoing" && (
            <div className="mb-2">
              <input
                type="checkbox"
                id={`visited-${event._id}`}
                onChange={() => handleVisited(event)}
              />
              <label htmlFor={`visited-${event._id}`} className="ms-2">
                Mark as Visited
              </label>
            </div>
          )}
          <button
            className="btn-top primary-btn"
            onClick={() => handleViewMore(event._id)}
          >
            View More
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="header-section">
        <div className="container header-container">
          <div className="logo">
            <Link to="/" className="custom-logo">
              <div className="logo-icon">ES</div>
              <div className="logo-text">
                Event<span className="highlight">Sphere</span>
              </div>
            </Link>
          </div>

          <div className="nav-menu">
            <nav className="mainmenu mobile-menu">
              <ul>
                <li className="active">
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/About">About</Link>
                </li>
                <li>
                  {/* intercept navigation and open contact modal instead */}
                  <Link
                    to="/contact"
                    onClick={(e) => {
                      e.preventDefault();
                      setContactModal(true);
                    }}
                  >
                    Contacts
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="auth-links">
            {currentUser ? (
              <>
                <span className="user-greeting">👋 {currentUser.name || "User"}</span>
                <button
                  className="auth-link"
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="auth-link">
                  Login
                </Link>
                <Link to="/register" className="auth-link">
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        className="hero-section set-bg"
        style={{ backgroundImage: "url('hero.jpg')" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div className="hero-text">
                <span>Discover Amazing Events Happening Around You</span>
                <h2>
                  Your Gateway To
                  <br /> Extraordinary Events
                </h2>
                 <br /> 
                <a href="#ongoing-events" className="primary-btn">
                  Explore Events
                </a>
              </div>
            </div>
            <div className="col-lg-5"></div>
          </div>
        </div>
      </section>

      {/* Ongoing */}
      <section className="spad" id="ongoing-events">
        <div className="container">
          <h2 className="text-center mb-5">🔥 Ongoing Events</h2>
          <div className="row">
            {ongoing.length > 0 ? (
              ongoing.map((e) => renderCard(e, "ongoing"))
            ) : (
              <div className="col-12">
                <div className="text-center py-5">
                  <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📅</div>
                  <h4 className="text-muted">No ongoing events at the moment</h4>
                  <p className="text-muted">Check back soon for exciting events!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming */}
      <section className="spad bg-light">
        <div className="container">
          <h2 className="text-center mb-5">⏰ Upcoming Events</h2>
          <div className="row">
            {upcoming.length > 0 ? (
              upcoming.map((e) => renderCard(e, "upcoming"))
            ) : (
              <div className="col-12">
                <div className="text-center py-5">
                  <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🚀</div>
                  <h4 className="text-muted">No upcoming events scheduled</h4>
                  <p className="text-muted">Stay tuned for amazing events coming your way!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular */}
      <section className="spad">
        <div className="container">
          <h2 className="text-center mb-5">⭐ Popular Events</h2>
          <div className="row">
            {popular.length > 0 ? (
              popular.map((e) => renderCard(e, "popular"))
            ) : (
              <div className="col-12">
                <div className="text-center py-5">
                  <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🌟</div>
                  <h4 className="text-muted">No popular events yet</h4>
                  <p className="text-muted">Be the first to rate and make events popular!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal for Expo Details */}
      {showModal && modalData && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div
              className="modal-content"
              style={{ borderRadius: "15px", border: "none" }}
            >
              <div
                className="modal-header text-white"
                style={{
                  background: "linear-gradient(to right, #ee8425, #f9488b)",
                  borderRadius: "15px 15px 0 0",
                  border: "none",
                }}
              >
                <h5 className="modal-title fw-bold">{modalData.title}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3 mb-3">
                      <strong className="text-primary">📍 Location:</strong>
                      <div className="mt-1">{modalData.location}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3 mb-3">
                      <strong className="text-success">📅 Dates:</strong>
                      <div className="mt-1">
                        {new Date(modalData.startDate).toLocaleDateString()} -{" "}
                        {new Date(modalData.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Halls */}
                <h6 className="fw-bold mb-3 text-dark">🏛️ Exhibition Halls</h6>
                {modalData.halls?.length > 0 ? (
                  modalData.halls.map((hall) => (
                    <div
                      key={hall._id}
                      className="card mb-3"
                      style={{ border: "1px solid #e0e0e0", borderRadius: "10px" }}
                    >
                      <div
                        className="card-header bg-white"
                        style={{ borderBottom: "1px solid #f0f0f0" }}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0 fw-semibold text-dark">{hall.name}</h6>
                          <span className="badge bg-info rounded-pill px-3">{hall.totalBooths} booths</span>
                        </div>
                      </div>
                      <div className="card-body">
                        {hall.booths.length > 0 ? (
                          <div className="row g-2">
                            {hall.booths.map((booth) => (
                              <div key={booth._id} className="col-md-6">
                                <div
                                  className="p-3 rounded-3"
                                  style={{
                                    background:
                                      "linear-gradient(to right, #ee8425, #f9488b)",
                                  }}
                                >
                                  <div className="d-flex align-items-center">
                                    <span
                                      className="badge bg-warning text-dark me-3 px-2 py-1"
                                      style={{ fontSize: "0.75rem" }}
                                    >
                                      #{booth.boothNumber}
                                    </span>
                                    <div>
                                      <small className="text-muted">🏢 Exhibitor:</small>
                                      <div className="fw-medium text-dark" style={{ fontSize: "0.9rem" }}>
                                        {booth.exhibitor?.name || "Not assigned"}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-3 text-muted">
                            <div style={{ fontSize: "2rem" }}>📭</div>
                            <small>No booked booths</small>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted">
                    <div style={{ fontSize: "3rem" }}>🏢</div>
                    <p className="mt-2 mb-0">No halls available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Rating Modal */}
      {ratingModal && ratingEvent && (
        <div
          className="modal fade show d-block rating-modal"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="rating-modal-header">
                <div className="rating-modal-icon">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <h5>Rate Your Experience</h5>
                <p className="rating-modal-subtitle">How was your visit to {ratingEvent.title}?</p>
              </div>

              <div className="rating-modal-body">
                <div className="rating-stars-container">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`rating-star ${star <= rating ? 'filled' : 'empty'}`}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <div className="feedback-section">
                  <textarea
                    className="feedback-textarea"
                    placeholder="Share your thoughts about this event... (optional)"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                  />
                </div>

                <div className="rating-modal-actions">
                  <button className="rating-submit-btn" onClick={submitRating}>
                    Submit Rating
                  </button>
                  <button
                    className="rating-cancel-btn"
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
          </div>
        </div>
      )}

      {/* Contact Modal (opened when user clicks Contact links) */}
      {/* Contact Modal (opened when user clicks Contact links) */}
{contactModal && (
  <div className="modal fade show d-block" style={{ 
    backgroundColor: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(8px)",
    zIndex: 1050
  }}>
    <div className="modal-dialog modal-md" style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      margin: "0 auto",
      padding: "1rem"
    }}>
      <div className="modal-content" style={{ 
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        border: "none",
        borderRadius: "24px",
        boxShadow: "0 25px 60px rgba(0, 0, 0, 0.15)",
        overflow: "hidden",
        position: "relative",
        animation: "modalFadeIn 0.3s ease-out"
      }}>
        {/* Gradient top border */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "6px",
          background: "linear-gradient(90deg, #ee8425, #f9488b, #8b5cf6, #3b82f6)",
          backgroundSize: "200% 100%",
          animation: "gradientShift 3s ease-in-out infinite"
        }}></div>
        
        <div className="modal-header" style={{
          textAlign: "center",
          padding: "2.5rem 2rem 1rem",
          background: "linear-gradient(135deg, rgba(238, 132, 37, 0.05), rgba(249, 72, 139, 0.05))",
          position: "relative",
          border: "none"
        }}>
          {/* Contact Icon */}
          <div style={{
            width: "80px",
            height: "80px",
            background: "linear-gradient(135deg, #ee8425, #f9488b)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            boxShadow: "0 8px 30px rgba(238, 132, 37, 0.3)",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{
              position: "absolute",
              top: "-50%",
              left: "-50%",
              width: "200%",
              height: "200%",
              background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)",
              transform: "rotate(45deg)",
              animation: "iconShine 2s ease-in-out infinite"
            }}></div>
            <svg width="35" height="35" fill="white" viewBox="0 0 24 24" style={{ zIndex: 1, position: "relative" }}>
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
          
          <h5 className="modal-title" style={{
            color: "#2c3e50",
            fontWeight: "700",
            fontSize: "1.8rem",
            marginBottom: "0.5rem",
            background: "linear-gradient(135deg, #2c3e50, #34495e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>Contact Us</h5>
          
          <p style={{
            color: "#6c757d",
            fontSize: "1rem",
            fontWeight: "500",
            marginBottom: "0"
          }}>We'd love to hear from you!</p>
          
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setContactModal(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(108, 117, 125, 0.1)",
              border: "2px solid rgba(108, 117, 125, 0.2)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              color: "#6c757d",
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(108, 117, 125, 0.2)";
              e.target.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(108, 117, 125, 0.1)";
              e.target.style.transform = "scale(1)";
            }}
          ></button>
        </div>
        
        <div className="modal-body" style={{
          padding: "1.5rem 2rem 2.5rem"
        }}>
          <form onSubmit={handleContactSubmit}>
            <div className="mb-3">
              <label className="form-label" style={{
                color: "#495057",
                fontWeight: "600",
                fontSize: "15px",
                marginBottom: "8px",
                display: "block"
              }}>Your Name</label>
              <input
                type="text"
                className="form-control"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Full name"
                required
                style={{
                  border: "2px solid #e9ecef",
                  borderRadius: "16px",
                  padding: "16px 20px",
                  fontSize: "15px",
                  fontFamily: "inherit",
                  lineHeight: "1.6",
                  transition: "all 0.3s ease",
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(10px)",
                  width: "100%"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#ee8425";
                  e.target.style.boxShadow = "0 0 0 4px rgba(238, 132, 37, 0.1)";
                  e.target.style.background = "white";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e9ecef";
                  e.target.style.boxShadow = "none";
                  e.target.style.background = "rgba(255, 255, 255, 0.8)";
                }}
              />
            </div>
             
            <div className="mb-3">
              <label className="form-label" style={{
                color: "#495057",
                fontWeight: "600",
                fontSize: "15px",
                marginBottom: "8px",
                display: "block"
              }}>Your Email</label>
              <input
                type="email"
                className="form-control"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="name@example.com"
                required
                style={{
                  border: "2px solid #e9ecef",
                  borderRadius: "16px",
                  padding: "16px 20px",
                  fontSize: "15px",
                  fontFamily: "inherit",
                  lineHeight: "1.6",
                  transition: "all 0.3s ease",
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(10px)",
                  width: "100%"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#ee8425";
                  e.target.style.boxShadow = "0 0 0 4px rgba(238, 132, 37, 0.1)";
                  e.target.style.background = "white";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e9ecef";
                  e.target.style.boxShadow = "none";
                  e.target.style.background = "rgba(255, 255, 255, 0.8)";
                }}
              />
            </div>
             
            <div className="mb-3">
              <label className="form-label" style={{
                color: "#495057",
                fontWeight: "600",
                fontSize: "15px",
                marginBottom: "8px",
                display: "block"
              }}>Message</label>
              <textarea
                className="form-control"
                rows={5}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Type your message here..."
                required
                style={{
                  border: "2px solid #e9ecef",
                  borderRadius: "16px",
                  padding: "16px 20px",
                  fontSize: "15px",
                  fontFamily: "inherit",
                  lineHeight: "1.6",
                  transition: "all 0.3s ease",
                  resize: "vertical",
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(10px)",
                  width: "100%",
                  minHeight: "120px"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#ee8425";
                  e.target.style.boxShadow = "0 0 0 4px rgba(238, 132, 37, 0.1)";
                  e.target.style.background = "white";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e9ecef";
                  e.target.style.boxShadow = "none";
                  e.target.style.background = "rgba(255, 255, 255, 0.8)";
                }}
              />
            </div>
             
            <div style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              marginTop: "2rem"
            }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setContactModal(false)}
                style={{
                  background: "rgba(108, 117, 125, 0.1)",
                  color: "#6c757d",
                  border: "2px solid rgba(108, 117, 125, 0.2)",
                  padding: "12px 28px",
                  borderRadius: "50px",
                  fontWeight: "600",
                  fontSize: "15px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  minWidth: "120px"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(108, 117, 125, 0.2)";
                  e.target.style.borderColor = "rgba(108, 117, 125, 0.4)";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(108, 117, 125, 0.1)";
                  e.target.style.borderColor = "rgba(108, 117, 125, 0.2)";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isSending}
                style={{
                  background: "linear-gradient(135deg, #ee8425, #f9488b)",
                  color: "white",
                  border: "none",
                  padding: "14px 32px",
                  borderRadius: "50px",
                  fontWeight: "700",
                  fontSize: "15px",
                  cursor: isSending ? "not-allowed" : "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 8px 25px rgba(238, 132, 37, 0.3)",
                  position: "relative",
                  overflow: "hidden",
                  minWidth: "140px",
                  opacity: isSending ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isSending) {
                    e.target.style.transform = "translateY(-3px)";
                    e.target.style.boxShadow = "0 12px 35px rgba(238, 132, 37, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSending) {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 8px 25px rgba(238, 132, 37, 0.3)";
                  }
                }}
              >
                {isSending ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite"
                    }}></div>
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
)}

{/* Add these keyframes to your CSS or in a style tag */}
<style jsx>{`
  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  @keyframes iconShine {
    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
    100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`}</style>

      {/* Enhanced Footer */}
      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section-item footer-logo-section">
              <div className="footer-logo">
                <div className="footer-logo-icon">ES</div>
                <div className="footer-logo-text">EventSphere</div>
              </div>
              <p className="footer-description">
                Your ultimate destination for discovering, attending, and rating amazing events. Connect with exhibitors, explore venues, and create unforgettable experiences.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link" title="Facebook">
                  <i className="fa fa-facebook"></i>
                </a>
                <a href="#" className="social-link" title="Twitter">
                  <i className="fa fa-twitter"></i>
                </a>
                <a href="#" className="social-link" title="Instagram">
                  <i className="fa fa-instagram"></i>
                </a>
                <a href="#" className="social-link" title="LinkedIn">
                  <i className="fa fa-linkedin"></i>
                </a>
              </div>
            </div>

            <div className="footer-section-item">
              <h4 className="footer-section-title">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li>
                  {/* intercept footer contact link as well */}
                  <Link
                    to="/contact"
                    onClick={(e) => {
                      e.preventDefault();
                      setContactModal(true);
                    }}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="footer-section-item">
              <h4 className="footer-section-title">Get In Touch</h4>
              <div className="footer-contact-item">
                <i className="fa fa-map-marker footer-contact-icon"></i>
                <div>
                  <strong>Address:</strong>
                  123 Event Street, Karachi
                  Sindh, Pakistan
                </div>
              </div>
              <div className="footer-contact-item">
                <i className="fa fa-phone footer-contact-icon"></i>
                <div>
                  <strong>Phone:</strong>
                  +92 300 1234567
                </div>
              </div>
              <div className="footer-contact-item">
                <i className="fa fa-envelope footer-contact-icon"></i>
                <div>
                  <strong>Email:</strong>
                  info@eventsphere.com
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p className="footer-copyright">&copy; 2025 EventSphere. All rights reserved.</p>
              <div className="footer-made-with">Made with <span className="heart-icon">❤️</span> by Future Waves</div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Index;
