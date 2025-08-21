import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/bootstrap.min.css";
import "./css/font-awesome.min.css";
import "./css/elegant-icons.css";
import "./css/magnific-popup.css";
import "./css/slicknav.min.css";
import "./css/style.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Index = () => {
  const [ongoing, setOngoing] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [popular, setPopular] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
            <span className="text-success d-block mb-2">
              ✅ Already Visited
            </span>
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
      {/* Header */}
      <header className="header-section">
        <div className="container">
          <div className="logo">
            <a href="/">
              <img src="logo.png" alt="Logo" />
            </a>
          </div>
          <div className="nav-menu">
            <nav className="mainmenu mobile-menu">
              <ul>
                <li className="active"><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>

                <li><a href="/contact">Contacts</a></li>
              </ul>
            </nav>
            <a href="#" className="primary-btn top-btn">
              <i className="fa fa-ticket"></i> Ticket
            </a>
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

{/* Modal */}
{showModal && modalData && (
  <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-lg">
      <div className="modal-content p-4">
        <div className="modal-header">
          <h5 className="modal-title">{modalData.title} - Details</h5>
          <button className="close" onClick={() => setShowModal(false)}>×</button>
        </div>
        <div className="modal-body">
          <p><b>Location:</b> {modalData.location}</p>
          <p><b>Dates:</b> {new Date(modalData.startDate).toLocaleDateString()} - {new Date(modalData.endDate).toLocaleDateString()}</p>

          <h6>🏛 Halls:</h6>
          {modalData.halls?.length > 0 ? (
            modalData.halls.map((hall) => (
              <div key={hall._id} className="mb-3">
                <p><b>{hall.name}</b> ({hall.totalBooths} booths)</p>
                {hall.booths.length > 0 ? (
                  <ul>
                    {hall.booths.map((booth) => (
                      <li key={booth._id}>
                        Booth #{booth.boothNumber} - 🏢 Exhibitor: {booth.exhibitor?.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No booked booths in this hall</p>
                )}
              </div>
            ))
          ) : (
            <p>No halls found</p>
          )}
        </div>
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
