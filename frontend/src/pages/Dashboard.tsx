import React, { useMemo, useState } from 'react';

type DashboardMode = 'visitor' | 'host';

type AccommodationRequest = {
  id: number;
  visitorName: string;
  location: string;
  dates: string;
  note: string;
  status: 'pending' | 'approved';
};

type DashboardProps = {
  mode: DashboardMode;
};

const initialRequests: AccommodationRequest[] = [
  {
    id: 1,
    visitorName: 'Ayesha Khan',
    location: 'Islamabad',
    dates: 'June 18-21',
    note: 'Looking for a quiet room with Wi-Fi near the tech meetup venue.',
    status: 'pending',
  },
  {
    id: 2,
    visitorName: 'Daniel Reed',
    location: 'Rawalpindi',
    dates: 'June 24-26',
    note: 'Visiting for founder meetings and would appreciate a work desk.',
    status: 'pending',
  },
];

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const buildCalendarDays = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
};

const Dashboard: React.FC<DashboardProps> = ({ mode }) => {
  const [requests, setRequests] =
    useState<AccommodationRequest[]>(initialRequests);
  const [requestForm, setRequestForm] = useState({
    location: '',
    dates: '',
    note: '',
  });
  const today = useMemo(() => new Date(), []);
  const calendarDays = useMemo(() => buildCalendarDays(today), [today]);
  const currentDate = today.getDate();
  const calendarTitle =
    mode === 'visitor' ? 'Visiting Calendar' : 'Hosting Calendar';

  const submitRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!requestForm.location || !requestForm.dates || !requestForm.note) {
      return;
    }

    setRequests((currentRequests) => [
      {
        id: Date.now(),
        visitorName: 'You',
        location: requestForm.location,
        dates: requestForm.dates,
        note: requestForm.note,
        status: 'pending',
      },
      ...currentRequests,
    ]);
    setRequestForm({ location: '', dates: '', note: '' });
  };

  const approveRequest = (requestId: number) => {
    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === requestId ? { ...request, status: 'approved' } : request,
      ),
    );
  };

  return (
    <div className="page dashboard">
      <h1>Dashboard</h1>

      <div className="dashboard-grid">
        <section className="dashboard-panel">
          {mode === 'visitor' ? (
            <>
              <h2>Send Accommodation Request</h2>
              <p>
                Ask verified hosts for a stay. Trip planning details can come
                later; this is only the first accommodation request.
              </p>
              <form className="request-form" onSubmit={submitRequest}>
                <label>
                  Preferred Location
                  <input
                    type="text"
                    value={requestForm.location}
                    onChange={(event) =>
                      setRequestForm((currentForm) => ({
                        ...currentForm,
                        location: event.target.value,
                      }))
                    }
                    placeholder="Islamabad, F-7"
                    required
                  />
                </label>
                <label>
                  Dates
                  <input
                    type="text"
                    value={requestForm.dates}
                    onChange={(event) =>
                      setRequestForm((currentForm) => ({
                        ...currentForm,
                        dates: event.target.value,
                      }))
                    }
                    placeholder="June 18-21"
                    required
                  />
                </label>
                <label className="request-wide-field">
                  Message to Host
                  <textarea
                    value={requestForm.note}
                    onChange={(event) =>
                      setRequestForm((currentForm) => ({
                        ...currentForm,
                        note: event.target.value,
                      }))
                    }
                    placeholder="Briefly explain who you are and what kind of stay you need."
                    required
                  />
                </label>
                <button type="submit" className="btn primary">
                  Send Request
                </button>
              </form>
            </>
          ) : (
            <>
              <h2>Incoming Accommodation Requests</h2>
              <p>
                Review visitor requests and approve the ones you are comfortable
                hosting at your residence.
              </p>
              <div className="request-list">
                {requests.map((request) => (
                  <article key={request.id} className="request-card">
                    <div>
                      <h3>{request.visitorName}</h3>
                      <p>
                        {request.location} - {request.dates}
                      </p>
                      <p>{request.note}</p>
                    </div>
                    <button
                      type="button"
                      className={`btn btn-outline ${
                        request.status === 'approved' ? 'active' : ''
                      }`}
                      onClick={() => approveRequest(request.id)}
                      disabled={request.status === 'approved'}
                    >
                      {request.status === 'approved' ? 'Approved' : 'Allow'}
                    </button>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="calendar" aria-label={calendarTitle}>
          <div className="calendar-header">
            <h2>{calendarTitle}</h2>
            <span>
              {monthNames[today.getMonth()]} {today.getFullYear()}
            </span>
          </div>
          <div className="calendar-grid calendar-weekdays">
            {weekDays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="calendar-grid">
            {calendarDays.map((day, index) => (
              <span
                key={`${day || 'blank'}-${index}`}
                className={
                  day === currentDate ? 'calendar-day current' : 'calendar-day'
                }
              >
                {day}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
