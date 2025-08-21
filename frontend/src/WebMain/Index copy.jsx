import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "font-awesome/css/font-awesome.min.css";
import "./index.css";

const App = () => {
  return (
    <div>
      {/* ======= Header/Navbar ======= */}
      <header className="header-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-3">
              <div className="logo">
                <a href="/">
                  <img src="img/logo.png" alt="logo" />
                </a>
              </div>
            </div>
            <div className="col-lg-9 col-md-9">
              <nav className="main-menu">
                <ul>
                  <li className="active"><a href="/">Home</a></li>
                  <li><a href="#about">About</a></li>
                  <li><a href="#schedule">Schedule</a></li>
                  <li><a href="#blog">Blog</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
              </nav>
            </div>
          </div>
          <div id="mobile-menu-wrap"></div>
        </div>
      </header>

      {/* ======= Hero/Banner Section ======= */}
      <section className="hero-section set-bg" style={{backgroundImage: "url('img/hero/hero-1.jpg')"}}>
        <div className="container">
          <div className="hero-text">
            <span>Conference</span>
            <h2>Business Conference 2025</h2>
            <a href="#schedule" className="primary-btn">View Schedule</a>
          </div>
        </div>
      </section>

      {/* ======= Schedule Section ======= */}
      <section id="schedule" className="schedule-section spad">
        <div className="container">
          <div className="section-title">
            <h2>Our Schedule</h2>
            <p>Here is the event schedule for our upcoming conference.</p>
          </div>

          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item">
              <a className="nav-link active" data-bs-toggle="tab" href="#tabs-1" role="tab">Day 1</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="tab" href="#tabs-2" role="tab">Day 2</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="tab" href="#tabs-3" role="tab">Day 3</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="tab" href="#tabs-4" role="tab">Day 4</a>
            </li>
          </ul>

          <div className="tab-content">
            {/* ===== Day 1 ===== */}
            <div className="tab-pane active" id="tabs-1" role="tabpanel">
              <div className="st-content">
                <div className="row">
                  <div className="col-lg-3">
                    <div className="sc-pic">
                      <img src="img/schedule/schedule-1.jpg" alt="" />
                    </div>
                  </div>
                  <div className="col-lg-5">
                    <div className="sc-text">
                      <h4>Dealing with Expert People</h4>
                      <ul>
                        <li><i className="fa fa-user"></i> John Smith</li>
                        <li><i className="fa fa-envelope"></i> john@Colorlib.com</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <ul className="sc-widget">
                      <li><i className="fa fa-clock-o"></i> 08:00 am - 10:00 AM</li>
                      <li><i className="fa fa-map-marker"></i> 59 Breanne Canyon Suite, USA</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== Day 2 ===== */}
            <div className="tab-pane" id="tabs-2" role="tabpanel">
              <div className="st-content">
                <div className="row">
                  <div className="col-lg-3">
                    <div className="sc-pic">
                      <img src="img/schedule/schedule-2.jpg" alt="" />
                    </div>
                  </div>
                  <div className="col-lg-5">
                    <div className="sc-text">
                      <h4>V7 Digital Photo Printing</h4>
                      <ul>
                        <li><i className="fa fa-user"></i> John Smith</li>
                        <li><i className="fa fa-envelope"></i> john@Colorlib.com</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <ul className="sc-widget">
                      <li><i className="fa fa-clock-o"></i> 10:30 am - 12:00 PM</li>
                      <li><i className="fa fa-map-marker"></i> 59 Breanne Canyon Suite, USA</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== Day 3 ===== */}
            <div className="tab-pane" id="tabs-3" role="tabpanel">
              <div className="st-content">
                <div className="row">
                  <div className="col-lg-3">
                    <div className="sc-pic">
                      <img src="img/schedule/schedule-3.jpg" alt="" />
                    </div>
                  </div>
                  <div className="col-lg-5">
                    <div className="sc-text">
                      <h4>Beyond The Naked Eye</h4>
                      <ul>
                        <li><i className="fa fa-user"></i> John Smith</li>
                        <li><i className="fa fa-envelope"></i> john@Colorlib.com</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <ul className="sc-widget">
                      <li><i className="fa fa-clock-o"></i> 01:00 pm - 03:00 PM</li>
                      <li><i className="fa fa-map-marker"></i> 59 Breanne Canyon Suite, USA</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== Day 4 ===== */}
            <div className="tab-pane" id="tabs-4" role="tabpanel">
              <div className="st-content">
                <div className="row">
                  <div className="col-lg-3">
                    <div className="sc-pic">
                      <img src="img/schedule/schedule-4.jpg" alt="" />
                    </div>
                  </div>
                  <div className="col-lg-5">
                    <div className="sc-text">
                      <h4>Modern Web Design</h4>
                      <ul>
                        <li><i className="fa fa-user"></i> John Smith</li>
                        <li><i className="fa fa-envelope"></i> john@Colorlib.com</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <ul className="sc-widget">
                      <li><i className="fa fa-clock-o"></i> 03:30 pm - 05:00 PM</li>
                      <li><i className="fa fa-map-marker"></i> 59 Breanne Canyon Suite, USA</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======= Footer ======= */}
      <footer className="footer-section">
        <div className="container text-center">
          <p>© 2025 Conference Template | Made with ❤️ in React</p>
        </div>
      </footer>
    </div>
  );
};

// Render
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
