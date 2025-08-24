// src/pages/AboutUs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";





const AboutUs = () => {
  // Auth state matching Index component
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("UserInfo")) || null;
    } catch {
      return null;
    }
  });

   // Contact modal states
  const [contactModal, setContactModal] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const nav = useNavigate();

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

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) {
      alert("Please enter your email address");
      return;
    }
    alert("Thank you for subscribing to our newsletter! 🎉");
    setNewsletterEmail("");
  };

  const teamMembers = [
    { id: 1, name: "Sarah Johnson", role: "Event Director", image: "member-1.jpg" },
    { id: 2, name: "Michael Chen", role: "Operations Manager", image: "member-2.jpg" },
    { id: 3, name: "Emma Davis", role: "Marketing Lead", image: "member-3.jpg" },
    { id: 4, name: "David Rodriguez", role: "Technical Lead", image: "member-4.jpg" },
    { id: 5, name: "Lisa Wang", role: "Partnership Manager", image: "member-5.jpg" },
    { id: 6, name: "James Wilson", role: "Customer Success", image: "member-6.jpg" },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Amanda Foster",
      role: "Event Organizer",
      image: "testimonial-1.jpg",
      quote: "EventSphere has revolutionized how we manage and discover events. The platform is intuitive and incredibly powerful."
    },
    {
      id: 2,
      name: "Robert Kim",
      role: "Exhibition Manager",
      image: "testimonial-2.jpg",
      quote: "The best event discovery platform I've used. It connects exhibitors with the right audience effortlessly."
    },
    {
      id: 3,
      name: "Maria González",
      role: "Business Owner",
      image: "testimonial-3.jpg",
      quote: "Thanks to EventSphere, we've discovered amazing networking opportunities and grown our business significantly."
    }
  ];

  return (
    <>
      {/* Header - Same as Index */}
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
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li className="active">
                  <Link to="/about">About</Link>
                </li>
                <li>
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
                <span className="user-greeting">
                  👋 {currentUser.name || "User"}
                </span>
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

      {/* Hero Section */}
      <section className="about-hero-section">
        <div className="about-hero-overlay"></div>
        <div className="container">
          <div className="about-hero-content">
            <div className="about-breadcrumb">
              {/* <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator">→</span>
              <span className="breadcrumb-current">About Us</span> */}
            </div>
            <h1 className="about-hero-title">Discover Our Story</h1>
            <p className="about-hero-subtitle">
              We're passionate about connecting people through extraordinary events and experiences
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-main-section spad">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="about-content">
                <div className="section-badge">Our Mission</div>
                <h2 className="section-title">Building Connections Through Amazing Events</h2>
                <p className="about-description">
                  EventSphere is your ultimate gateway to discovering, attending, and creating unforgettable experiences. 
                  We believe that great events have the power to bring people together, spark innovation, and create lasting memories.
                </p>
                <p className="about-description">
                  Since our founding, we've been dedicated to revolutionizing how people discover and engage with events. 
                  Our platform connects event organizers with enthusiastic attendees, creating a vibrant ecosystem of experiences.
                </p>
                <div className="about-features">
                  <div className="feature-item">
                    <div className="feature-icon">🎯</div>
                    <div className="feature-text">
                      <h4>Targeted Discovery</h4>
                      <p>Find events perfectly matched to your interests</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">🤝</div>
                    <div className="feature-text">
                      <h4>Community Building</h4>
                      <p>Connect with like-minded individuals and professionals</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">⭐</div>
                    <div className="feature-text">
                      <h4>Quality Assurance</h4>
                      <p>Curated events with verified ratings and reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-image-container">
                <div className="about-main-image">
                  <img src='../img/about-us.jpg' alt="About EventSphere" />
                  <div className="image-overlay">
                    <div className="stats-card">
                      <div className="stat-item">
                        <div className="stat-number">10K+</div>
                        <div className="stat-label">Events Hosted</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number">50K+</div>
                        <div className="stat-label">Happy Users</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     

      {/* Journey Section */}
      <section className="journey-section spad">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Our Journey</div>
            <h2 className="section-title">From Vision to Reality</h2>
          </div>

          <div className="journey-timeline">
            <div className="timeline-item">
              <div className="timeline-year">2020</div>
              <div className="timeline-content">
                <h4>The Beginning</h4>
                <p>Started with a vision to revolutionize event discovery and connect communities through meaningful experiences.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2021</div>
              <div className="timeline-content">
                <h4>Platform Launch</h4>
                <p>Officially launched EventSphere with core features for event discovery, registration, and community building.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2022</div>
              <div className="timeline-content">
                <h4>Growth & Expansion</h4>
                <p>Expanded to multiple cities and introduced advanced matching algorithms for personalized event recommendations.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2023</div>
              <div className="timeline-content">
                <h4>Innovation Hub</h4>
                <p>Launched virtual event capabilities and AI-powered insights, becoming the go-to platform for hybrid experiences.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2024</div>
              <div className="timeline-content">
                <h4>Community Focus</h4>
                <p>Introduced community-driven features, enhanced user feedback systems, and expanded our global reach.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section spad bg-light">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Our Values</div>
            <h2 className="section-title">What Drives Us Forward</h2>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🎪</div>
              <h3 className="value-title">Experience First</h3>
              <p className="value-description">
                Every decision we make is centered around creating exceptional experiences for our users and event organizers.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌟</div>
              <h3 className="value-title">Quality & Trust</h3>
              <p className="value-description">
                We maintain the highest standards in event curation and platform security to earn and keep your trust.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🚀</div>
              <h3 className="value-title">Innovation</h3>
              <p className="value-description">
                We continuously evolve our platform with cutting-edge technology to stay ahead of industry trends.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h3 className="value-title">Community</h3>
              <p className="value-description">
                Building meaningful connections and fostering vibrant communities is at the heart of everything we do.
              </p>
            </div>
          </div>
        </div>
      </section>


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

















      {/* Enhanced Footer - Same as Index */}
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
                <li>   {/* intercept footer contact link as well */}
                                  <Link
                                    to="/contact"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setContactModal(true);
                                    }}
                                  >
                                    Contact
                                  </Link></li>
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
              <p className="footer-copyright">
                &copy; 2025 EventSphere. All rights reserved.
              </p>
              <div className="footer-made-with">
                Made with <span className="heart-icon">❤️</span> by Future Waves
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default AboutUs;