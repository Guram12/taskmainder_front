import '../styles/Calendar.css';
import React, { useEffect, useState } from 'react';
import { board } from '../utils/interface';

interface CalendarProps {
  boards: board[];
}

interface TaskInfo {
  taskTitle: string;
  boardName: string;
  listName: string;
}

const Calendar: React.FC<CalendarProps> = ({ boards }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const [highlightedDays, setHighlightedDays] = useState<Record<number, number[]>>({});
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [tasksForSelectedDay, setTasksForSelectedDay] = useState<TaskInfo[]>([]);

  // Extract due dates from boards and organize them by month
  useEffect(() => {
    const dueDates: Record<number, number[]> = {};

    boards.forEach((board) => {
      board.lists.forEach((list) => {
        list.tasks.forEach((task) => {
          if (task.due_date) {
            const dueDate = new Date(task.due_date);
            const month = dueDate.getMonth();
            const day = dueDate.getDate();

            if (!dueDates[month]) {
              dueDates[month] = [];
            }

            if (!dueDates[month].includes(day)) {
              dueDates[month].push(day);
            }
          }
        });
      });
    });

    setHighlightedDays(dueDates);
  }, [boards]);

  const generateDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const handleDayClick = (monthIndex: number, dayNumber: number) => {
    const currentYear = new Date().getFullYear();
    const selectedDate = new Date(currentYear, monthIndex, dayNumber);

    const tasks: TaskInfo[] = [];
    boards.forEach((board) => {
      board.lists.forEach((list) => {
        list.tasks.forEach((task) => {
          if (task.due_date) {
            const dueDate = new Date(task.due_date);
            if (
              dueDate.getFullYear() === selectedDate.getFullYear() &&
              dueDate.getMonth() === selectedDate.getMonth() &&
              dueDate.getDate() === selectedDate.getDate()
            ) {
              tasks.push({
                taskTitle: task.title,
                boardName: board.name,
                listName: list.name,
              });
            }
          }
        });
      });
    });

    setSelectedDay(`${months[monthIndex]} ${dayNumber}, ${currentYear}`);
    setTasksForSelectedDay(tasks);
  };

  const closeModal = () => {
    setSelectedDay(null);
    setTasksForSelectedDay([]);
  };

  const renderMonth = (monthIndex: number) => {
    const currentYear = new Date().getFullYear();
    const days = generateDaysInMonth(currentYear, monthIndex);

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

          {Array.from({ length: firstDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="calendar_empty_day"></div>
          ))}

          {days.map((day) => {
            const dayNumber = day.getDate();
            const isHighlighted =
              highlightedDays[monthIndex]?.includes(dayNumber);

            return (
              <div
                key={day.toISOString()}
                className={`calendar_day ${isHighlighted ? 'highlighted_day' : ''}`}
                onClick={() =>
                  isHighlighted && handleDayClick(monthIndex, dayNumber)
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

      {selectedDay && (
        <div className="modal_overlay" onClick={closeModal}>
          <div
            className="selected_day_info"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <h3>Tasks for {selectedDay}</h3>
            {tasksForSelectedDay.length > 0 ? (
              <ul>
                {tasksForSelectedDay.map((task, index) => (
                  <li key={index}>
                    <strong>Task:</strong> {task.taskTitle} <br />
                    <strong>Board:</strong> {task.boardName} <br />
                    <strong>List:</strong> {task.listName}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tasks due on this day.</p>
            )}
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;