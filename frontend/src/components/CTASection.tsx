import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const CTASection: React.FC = () => {
  return (
    <section className="cta-section">
      <h2>Ready to Experience Pakistani Hospitality?</h2>
      <Link to="/tutorial" className="btn large primary">
        Get Started Today
      </Link>
    </section>
  );
};

export default CTASection;