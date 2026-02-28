import React from 'react';
import '../App.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">InviteAFriend</div>
      <div className="navbar-links">
        <a href="#apply" className="btn">
          Apply To Visit
        </a>
        <a href="#list" className="btn btn-outline">
          List Your Home
        </a>
      </div>
    </nav>
  );
};

export default Navbar;