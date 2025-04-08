import '../styles/Calendar.css';
import React, {  useState } from 'react';

interface CalendarProps { }

const Calendar: React.FC<CalendarProps> = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const renderDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const today = new Date();
  
    const days = [];
  
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar_day empty"></div>);
    }
  
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        today.getFullYear() === currentDate.getFullYear() &&
        today.getMonth() === currentDate.getMonth() &&
        today.getDate() === day;
  
      days.push(
        <div key={day} className={`calendar_day ${isToday ? 'today' : ''}`}>
          {day}
        </div>
      );
    }
  
    return days;
  };

  return (
    <div className="calendar_container">
      <div className="calendar_header">
        <button onClick={handlePrevMonth} className="calendar_nav_button">❮</button>
        <h2 className="calendar_month">
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </h2>
        <button onClick={handleNextMonth} className="calendar_nav_button">❯</button>
      </div>
      <div className="calendar_days_of_week">
        {daysOfWeek.map((day) => (
          <div key={day} className="calendar_day_of_week">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar_days">{renderDays()}</div>
    </div>
  );
};

export default Calendar;