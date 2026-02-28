import React from 'react';
import '../App.css';

const stats = [
  { label: 'Participating Countries', value: '7+' },
  { label: 'Verified Hosts', value: '6+' },
  { label: 'Planned Stays', value: '1.2k' },
  { label: 'Tech Sectors', value: '4' },
];

const Stats: React.FC = () => {
  return (
    <section className="stats">
      {stats.map((s) => (
        <div key={s.label} className="stat-item">
          <div className="stat-value">{s.value}</div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </section>
  );
};

export default Stats;