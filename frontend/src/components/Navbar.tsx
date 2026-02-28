import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <div className="navbar-logo">InviteAFriend</div>
      </Link>
      <div className="navbar-links">
        <Link to="/logsign" className="btn btn-outline">
          Login/Signup
        </Link>
        <Link to="/tutorial" className="btn btn-outline">
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;