import React from 'react';
import { Link } from 'react-router-dom';
import logo from './/img/logo.png';
import '../WebMain/css/style.css'

const Header = () => {
  return (
    <header className="header-section">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>
        <div className="nav-menu">
          <nav className="mainmenu mobile-menu">
            <ul>
              <li className="active"><Link to="/">Home</Link></li>
              <li><Link to="/about-us">About</Link></li>
              <li><Link to="/contact">Contacts</Link></li>
            </ul>
          </nav>
          <Link to="#" className="primary-btn top-btn">
            <i className="fa fa-ticket"></i> Ticket
          </Link>
        </div>
        <div id="mobile-menu-wrap"></div>
      </div>
    </header>
  );
};

export default Header;