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

const selectableYears = Array.from(
  { length: 11 },
  (_, index) => new Date().getFullYear() - 5 + index,
);

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
  const [displayDate, setDisplayDate] = useState(() => new Date());
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const today = useMemo(() => new Date(), []);
  const calendarDays = useMemo(
    () => buildCalendarDays(displayDate),
    [displayDate],
  );
  const displayMonth = displayDate.getMonth();
  const displayYear = displayDate.getFullYear();
  const isCurrentMonth =
    displayMonth === today.getMonth() && displayYear === today.getFullYear();
  const calendarTitle =
    mode === 'visitor' ? 'Visiting Calendar' : 'Hosting Calendar';
  const selectedDateLabel = selectedDay
    ? `${monthNames[displayMonth]} ${selectedDay}, ${displayYear}`
    : '';

  const moveMonth = (offset: number) => {
    setDisplayDate(
      (currentDate) =>
        new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1),
    );
    setSelectedDay(null);
    setPlanMessage('');
  };

  const selectMonth = (month: number) => {
    setDisplayDate((currentDate) => new Date(currentDate.getFullYear(), month, 1));
    setSelectedDay(null);
    setPlanMessage('');
  };

  const selectYear = (year: number) => {
    setDisplayDate((currentDate) => new Date(year, currentDate.getMonth(), 1));
    setSelectedDay(null);
    setPlanMessage('');
  };

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
      <h1>{calendarTitle}</h1>

      <section className="calendar dashboard-calendar" aria-label={calendarTitle}>
        <div className="calendar-header">
          <button
            type="button"
            className="calendar-nav-button"
            onClick={() => moveMonth(-1)}
            aria-label="Previous month"
          >
            ‹
          </button>
          <div className="calendar-month-picker">
            <button
              type="button"
              className="calendar-month-button"
              onClick={() => setIsPickerOpen((isOpen) => !isOpen)}
            >
              {monthNames[displayMonth]} {displayYear}
            </button>
            {isPickerOpen && (
              <div className="calendar-picker-panel">
                <div className="calendar-picker-column" aria-label="Select month">
                  {monthNames.map((month, index) => (
                    <button
                      type="button"
                      key={month}
                      className={index === displayMonth ? 'active' : ''}
                      onClick={() => selectMonth(index)}
                    >
                      {month}
                    </button>
                  ))}
                </div>
                <div className="calendar-picker-column" aria-label="Select year">
                  {selectableYears.map((year) => (
                    <button
                      type="button"
                      key={year}
                      className={year === displayYear ? 'active' : ''}
                      onClick={() => selectYear(year)}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            className="calendar-nav-button"
            onClick={() => moveMonth(1)}
            aria-label="Next month"
          >
            ›
          </button>
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
                  isCurrentMonth && day === today.getDate() ? 'current' : '',
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
