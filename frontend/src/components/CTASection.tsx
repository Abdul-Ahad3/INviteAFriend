import React from 'react';
import '../App.css';

const CTASection: React.FC = () => {
  return (
    <section className="cta-section">
      <h2>Ready to Experience Pakistani Hospitality?</h2>
      <a href="#get-started" className="btn large primary">
        Get Started Today
      </a>
    </section>
  );
};

export default CTASection;