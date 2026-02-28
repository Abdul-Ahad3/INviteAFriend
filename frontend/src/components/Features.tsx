import React from 'react';
import '../App.css';

const features = [
  {
    title: 'Verified Stays',
    description:
      'Verified luxury and professional accommodations in the heart of Islamabad.',
  },
  {
    title: 'Secure Identity',
    description:
      'Every host and visitor undergoes rigorous manual and digital identity verification.',
  },
  {
    title: 'Strategic Matching',
    description:
      'We pair visitors with hosts in similar professional domains for meaningful networking.',
  },
  {
    title: 'Cultural Immersion',
    description:
      'Experience the local lifestyle, cuisine, and hospitality of the capital city.',
  },
];

const Features: React.FC = () => {
  return (
    <section className="features">
      {features.map((f) => (
        <div key={f.title} className="feature-card">
          <div className="feature-icon">📌</div>
          <h3>{f.title}</h3>
          <p>{f.description}</p>
        </div>
      ))}
    </section>
  );
};

export default Features;