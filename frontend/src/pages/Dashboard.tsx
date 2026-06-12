import React from 'react';

type DashboardProps = {
  mode: 'visitor' | 'host';
};

const Dashboard: React.FC<DashboardProps> = ({ mode }) => {
  return (
    <div className="page dashboard">
      <h1>{mode === 'visitor' ? 'Visitor Dashboard' : 'Host Dashboard'}</h1>
      <div className="dashboard-panel">
        <h2>{mode === 'visitor' ? 'Visitor Mode' : 'Host Mode'}</h2>
        <p>
          {mode === 'visitor'
            ? 'Browse your planned stays, trip details, and host connections.'
            : 'Manage guest requests, hosting availability, and visitor details.'}
        </p>
      </div>
      <div className="calendar">Calendar</div>
    </div>
  );
};

export default Dashboard;
