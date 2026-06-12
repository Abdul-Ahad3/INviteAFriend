import React, { useMemo, useState } from 'react';

type DashboardMode = 'visitor' | 'host';

type DashboardProps = {
  mode: DashboardMode;
};

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
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [planMessage, setPlanMessage] = useState('');
  const today = useMemo(() => new Date(), []);
  const calendarDays = useMemo(() => buildCalendarDays(today), [today]);
  const currentDate = today.getDate();
  const calendarTitle =
    mode === 'visitor' ? 'Visiting Calendar' : 'Hosting Calendar';
  const selectedDateLabel = selectedDay
    ? `${monthNames[today.getMonth()]} ${selectedDay}, ${today.getFullYear()}`
    : '';

  const selectCalendarDay = (day: number) => {
    setSelectedDay(day);
    setPlanMessage('');
  };

  const beginVisitPlan = () => {
    if (!selectedDateLabel) {
      return;
    }

    setPlanMessage(`Ready to plan a visit for ${selectedDateLabel}.`);
  };

  return (
    <div className="page dashboard">
      <h1>Dashboard</h1>

      <section className="calendar dashboard-calendar" aria-label={calendarTitle}>
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
          {calendarDays.map((day, index) =>
            day ? (
              <button
                type="button"
                key={`${day}-${index}`}
                className={[
                  'calendar-day',
                  day === currentDate ? 'current' : '',
                  day === selectedDay ? 'selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => selectCalendarDay(day)}
              >
                {day}
              </button>
            ) : (
              <span
                key={`blank-${index}`}
                className="calendar-day calendar-day-empty"
              />
            ),
          )}
        </div>
        {mode === 'visitor' && (
          <div className="calendar-actions">
            {selectedDateLabel && (
              <span className="calendar-selection">{selectedDateLabel}</span>
            )}
            {planMessage && (
              <span className="calendar-selection">{planMessage}</span>
            )}
            <button
              type="button"
              className="btn primary"
              disabled={!selectedDay}
              onClick={beginVisitPlan}
            >
              Plan Visit
            </button>
          </div>
        )}
      </section>

      <div className="dashboard-sections">
        {mode === 'visitor' ? (
          <>
            <section className="dashboard-panel dashboard-section">
              <h2>Offers</h2>
              <p>
                Matching host offers, seasonal stays, and verified residence
                recommendations will appear here.
              </p>
            </section>
            <section className="dashboard-panel dashboard-section">
              <h2>News</h2>
              <p>Updates about meetups, community visits, and host availability.</p>
            </section>
            <section className="dashboard-panel dashboard-section">
              <h2>Previous Visits</h2>
              <p>Your completed stays and past host connections will appear here.</p>
            </section>
            <section className="dashboard-panel dashboard-section">
              <h2>Famous Resorts</h2>
              <p>Featured places and local travel recommendations will appear here.</p>
            </section>
          </>
        ) : (
          <>
            <section className="dashboard-panel dashboard-section">
              <h2>Visit Requests</h2>
              <p>
                Visitor requests will appear here once someone asks to stay at
                your residence.
              </p>
            </section>
            <section className="dashboard-panel dashboard-section">
              <h2>Offers</h2>
              <p>Your active hosting offers and open room availability will appear here.</p>
            </section>
            <section className="dashboard-panel dashboard-section">
              <h2>News</h2>
              <p>Host updates, safety notices, and platform announcements will appear here.</p>
            </section>
            <section className="dashboard-panel dashboard-section">
              <h2>Previous Hostings</h2>
              <p>Your completed hosting history and visitor feedback will appear here.</p>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
