import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>INVITE A GLOBAL FRIEND</h1>
        <p>
          Experience legendary Pakistani hospitality. Stay with verified local AI
          professionals in authentic homes while engaging with the world's most
          promising tech ecosystem.
        </p>
        <div className="hero-buttons">
          <Link to="/logsign" className="btn primary">
            Apply To Visit
          </Link>
          <Link to="/" className="btn secondary">
            List Your Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;