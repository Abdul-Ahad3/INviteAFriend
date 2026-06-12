import React, { useState } from 'react';
import { Link } from 'react-router-dom';

type VisitRequest = {
  id: number;
  visitDate: string;
  destination: string;
  lengthOfStay: string;
  purpose: string;
  guestCount: string;
  hostPreference: string;
  message: string;
  status?: string;
};

const getStoredVisitRequests = (): VisitRequest[] => {
  try {
    return JSON.parse(localStorage.getItem('visitRequests') || '[]');
  } catch {
    return [];
  }
};

const getVisitDayCount = (request: VisitRequest) =>
  Math.max(Number.parseInt(request.lengthOfStay, 10) || 1, 1);

const formatReadableDate = (dateValue: string) => {
  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateValue || 'No date selected';
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'long',
  }).format(date);
};

const Visits: React.FC = () => {
  const [visits, setVisits] = useState<VisitRequest[]>(getStoredVisitRequests);

  const cancelVisit = (visitId: number) => {
    const nextVisits = visits.filter((visit) => visit.id !== visitId);
    setVisits(nextVisits);
    localStorage.setItem('visitRequests', JSON.stringify(nextVisits));
  };

  return (
    <main className="page visits-page">
      <div className="profile-header">
        <h1>Planned Visits</h1>
        <p>Review the details of every visit request you have planned.</p>
      </div>

      <div className="visits-detail-list">
        {visits.length > 0 ? (
          visits.map((visit) => (
            <article key={visit.id} className="dashboard-panel visit-detail-card">
              <div className="profile-section-heading">
                <h2>{visit.purpose}</h2>
                <span className="profile-chip">
                  {visit.status || 'pending'}
                </span>
              </div>

              <div className="visit-detail-grid">
                <div>
                  <span>Date</span>
                  <strong>{formatReadableDate(visit.visitDate)}</strong>
                </div>
                <div>
                  <span>Destination</span>
                  <strong>{visit.destination || 'Not provided'}</strong>
                </div>
                <div>
                  <span>Duration</span>
                  <strong>
                    {getVisitDayCount(visit)} day
                    {getVisitDayCount(visit) === 1 ? '' : 's'}
                  </strong>
                </div>
                <div>
                  <span>Guests</span>
                  <strong>{visit.guestCount || '1'}</strong>
                </div>
                <div>
                  <span>Host Preference</span>
                  <strong>{visit.hostPreference || 'No preference added'}</strong>
                </div>
              </div>

              <div className="visit-message">
                <span>Message to Hosts</span>
                <p>{visit.message || 'No message added.'}</p>
              </div>

              <div className="visit-detail-actions">
                <Link
                  to={`/plan-visit?visitId=${visit.id}`}
                  className="btn btn-outline"
                >
                  Edit Visit
                </Link>
                <button
                  type="button"
                  className="btn btn-outline danger"
                  onClick={() => cancelVisit(visit.id)}
                >
                  Cancel Visit
                </button>
              </div>
            </article>
          ))
        ) : (
          <section className="dashboard-panel visit-detail-card">
            <h2>No Planned Visits</h2>
            <p>Your planned visit requests will appear here.</p>
          </section>
        )}
      </div>

      <div className="profile-actions">
        <Link to="/dashboard" className="btn btn-outline">
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
};

export default Visits;
