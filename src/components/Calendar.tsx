import React, { useState } from 'react';
import '../styles/Calendar.css';

const Calendar: React.FC = () => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Define the type for highlightedDays
  const highlightedDays: Record<number, number[]> = {
    0: [1, 15], // Highlight January 1st and 15th
    1: [14], // Highlight February 14th
    2: [8, 20], // Highlight March 8th and 20th
    // Add more months and days as needed
  };

  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const generateDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const renderMonth = (monthIndex: number) => {
    const currentYear = new Date().getFullYear();
    const days = generateDaysInMonth(currentYear, monthIndex);

    // Get the first day of the month to calculate padding
    const firstDayOfWeek = days[0].getDay();

    return (
      <div className="calendar_month" key={monthIndex}>
        <h3>{months[monthIndex]}</h3>
        <div className="calendar_grid">
          {daysOfWeek.map((day) => (
            <div key={day} className="calendar_day_header">
              {day}
            </div>
          ))}

          {/* Add empty divs for padding */}
          {Array.from({ length: firstDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="calendar_empty_day"></div>
          ))}

          {/* Render days */}
          {days.map((day) => {
            const dayNumber = day.getDate();
            const isHighlighted =
              highlightedDays[monthIndex]?.includes(dayNumber);

            return (
              <div
                key={day.toISOString()}
                className={`calendar_day ${
                  isHighlighted ? 'highlighted_day' : ''
                }`}
                onClick={() =>
                  isHighlighted &&
                  setSelectedDay(
                    `${months[monthIndex]} ${dayNumber}, ${currentYear}`
                  )
                }
              >
                {dayNumber}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="yearly_calendar">
      {months.map((_, index) => renderMonth(index))}

      {/* Display selected day information */}
      {selectedDay && (
        <div className="selected_day_info">
          <p>You selected: {selectedDay}</p>
        </div>
      )}
    </div>
  );
};

export default Calendar;