import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <Link to="/" className="header-logo">
        <div className="header-logo">InviteAFriend</div>
      </Link>
      <div className="header-links">
        <Link to="/logsign" className="btn btn-outline">
          Login/Signup
        </Link>
        <Link to="/tutorial" className="btn btn-outline">
          Get Started
        </Link>
      </div>
    </header>
  );
};

export default Header;