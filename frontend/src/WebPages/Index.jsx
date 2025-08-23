import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/bootstrap.min.css";
import "./css/font-awesome.min.css";
import "./css/elegant-icons.css";
import "./css/magnific-popup.css";
import "./css/slicknav.min.css";
import "./css/style.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link } from "react-router-dom";


const Index = () => {
  const [ongoing, setOngoing] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [popular, setPopular] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ⭐ Feedback states
  const [ratingModal, setRatingModal] = useState(false);
  const [ratingEvent, setRatingEvent] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");

  // TODO: login user ka ID yahan dalna hoga (localStorage ya context se le lo)
  const userId = "66c7a1f5d6a9a0abcdef1234"; 

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/expos/all");
        const events = res.data;
        const now = new Date();

        setOngoing(events.filter((e) =>
          new Date(e.startDate) <= now && new Date(e.endDate) >= now
        ));
        setUpcoming(events.filter((e) => new Date(e.startDate) > now));
        setPopular(events.filter((e) => e.theme?.toLowerCase() === "popular"));
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, []);

  const handleViewMore = async (eventId) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/expos/${eventId}/details`);
      setModalData(res.data);
      setSelectedEvent(eventId);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching event details:", err);
    }
  };

  const handleVisited = (event) => {
    setRatingEvent(event);
    setRatingModal(true);
  };

 // ⭐ Submit feedback to backend
const submitRating = async () => {
  try {
    const payload = {
      user: userId,             // user ki _id
      stars: rating,            // backend me "stars" field h
      comment: feedbackText || "No comment",
      event: ratingEvent._id    // event ki _id bhejna zaroori h
    };

    const res = await axios.post("http://localhost:4000/api/feedback/add", payload);

    alert(res.data.message || "Feedback submitted successfully");

    setRatingModal(false);
    setRating(0);
    setFeedbackText("");
  } catch (err) {
    console.error("Error submitting feedback:", err);
    alert("Failed to submit feedback");
  }
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
      <Link to="/">
        <img src="logo.png" alt="Logo" />
      </Link>
    </div>
    <div className="nav-menu">
      <nav className="mainmenu mobile-menu">
        <ul>
          <li className="active"><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contacts</Link></li>
        </ul>
      </nav>
    </div>
    {/* 👇 Login / Signup links */}
    <div className="auth-links">
      <Link to="/login" className="auth-link">Login</Link>
      <Link to="/signup" className="auth-link">Signup</Link>
    </div>
  </div>
</header>


      {/* Hero Section */}
      <section
        className="hero-section set-bg"
        style={{ backgroundImage: "url('hero.jpg')" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div className="hero-text">
                <span>5 to 9 May 2019, Mardavall Hotel, New York</span>
                <h2>
                  Change Your Mind
                  <br /> To Become Success
                </h2>
                <a href="#" className="primary-btn">
                  Buy Ticket
                </a>
              </div>
            </div>
            <div className="col-lg-5">
              <img src="hero-right.png" alt="Hero" />
            </div>
          </div>
        </div>
      </section>

      {/* Ongoing Events */}
      <section className="spad">
        <div className="container">
          <h2 className="text-center mb-5">Ongoing Events</h2>
          <div className="row">
            {ongoing.length > 0 ? ongoing.map((e) => renderCard(e, "ongoing")) : <p>No ongoing events</p>}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="spad bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Upcoming Events</h2>
          <div className="row">
            {upcoming.length > 0 ? upcoming.map((e) => renderCard(e, "upcoming")) : <p>No upcoming events</p>}
          </div>
        </div>
      </section>

      {/* Popular Events */}
      <section className="spad">
        <div className="container">
          <h2 className="text-center mb-5">Popular Events</h2>
          <div className="row">
            {popular.length > 0 ? popular.map((e) => renderCard(e, "popular")) : <p>No popular events</p>}
          </div>
        </div>
      </section>

      {/* Modal for Expo Details */}
      {showModal && modalData && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content" style={{ borderRadius: '15px', border: 'none' }}>
              <div className="modal-header text-white" style={{ background: 'linear-gradient(to right, #ee8425, #f9488b)', borderRadius: '15px 15px 0 0', border: 'none' }}>
                <h5 className="modal-title fw-bold">{modalData.title}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
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
                        {new Date(modalData.startDate).toLocaleDateString()} - {new Date(modalData.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Halls */}
                <h6 className="fw-bold mb-3 text-dark">🏛️ Exhibition Halls</h6>
                {modalData.halls?.length > 0 ? (
                  modalData.halls.map((hall) => (
                    <div key={hall._id} className="card mb-3" style={{ border: '1px solid #e0e0e0', borderRadius: '10px' }}>
                      <div className="card-header bg-white" style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0 fw-semibold text-dark">{hall.name}</h6>
                          <span className="badge bg-info rounded-pill px-3">
                            {hall.totalBooths} booths
                          </span>
                        </div>
                      </div>
                      <div className="card-body">
                        {hall.booths.length > 0 ? (
                          <div className="row g-2">
                            {hall.booths.map((booth) => (
                              <div key={booth._id} className="col-md-6">
                                <div className="p-3 rounded-3" style={{ background: 'linear-gradient(to right, #ee8425, #f9488b)' }}>
                                  <div className="d-flex align-items-center">
                                    <span className="badge bg-warning text-dark me-3 px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                      #{booth.boothNumber}
                                    </span>
                                    <div>
                                      <small className="text-muted">🏢 Exhibitor:</small>
                                      <div className="fw-medium text-dark" style={{ fontSize: '0.9rem' }}>
                                        {booth.exhibitor?.name || 'Not assigned'}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-3 text-muted">
                            <div style={{ fontSize: '2rem' }}>📭</div>
                            <small>No booked booths</small>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted">
                    <div style={{ fontSize: '3rem' }}>🏢</div>
                    <p className="mt-2 mb-0">No halls available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ⭐ Rating Modal */}
      {ratingModal && ratingEvent && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-md">
            <div className="modal-content p-4 text-center">
              <h5>Rate {ratingEvent.title}</h5>
              <div className="my-3">
                {[1,2,3,4,5].map((star) => (
                  <span 
                    key={star} 
                    style={{ fontSize: "2rem", cursor: "pointer", color: star <= rating ? "gold" : "#ccc" }}
                    onClick={() => setRating(star)}
                  >★</span>
                ))}
              </div>

              {/* Feedback textarea */}
              <textarea
                className="form-control mb-3"
                placeholder="Write your feedback..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              ></textarea>

              <button className="btn btn-primary" onClick={submitRating}>Submit Feedback</button>
              <button className="btn btn-secondary ms-2" onClick={() => setRatingModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer-section">
        <div className="container text-center">
          <p>
            &copy; 2025 EventSphere. All rights reserved | Designed by Future Waves
          </p>
        </div>
      </footer>
    </>
  );
};

export default Index;
