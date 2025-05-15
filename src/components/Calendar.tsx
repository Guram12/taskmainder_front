import '../styles/Calendar.css';
import React, { useEffect, useState } from 'react';
import { board } from '../utils/interface';
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { ThemeSpecs } from '../utils/theme';
import { FaClipboardList } from "react-icons/fa";
import { IoMdListBox } from "react-icons/io";



interface CalendarProps {
  boards: board[];
  currentTheme: ThemeSpecs;
  fetchBoards: () => Promise<void>;
}

interface TaskInfo {
  taskTitle: string;
  boardName: string;
  listName: string;
}

const Calendar: React.FC<CalendarProps> = ({ boards, currentTheme, fetchBoards }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const [highlightedDays, setHighlightedDays] = useState<Record<number, number[]>>({});
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [tasksForSelectedDay, setTasksForSelectedDay] = useState<{ boardName: string; lists: Record<string, TaskInfo[]> }[]>([]);

  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());



  useEffect(() => {
    const fetchData = async () => {
      await fetchBoards();
    };
    fetchData();
    console.log('Fetched boards data');
  }, []);

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

            if (dueDate.getFullYear() === currentYear) { // Only include tasks for the current year
              if (!dueDates[month]) {
                dueDates[month] = [];
              }

              if (!dueDates[month].includes(day)) {
                dueDates[month].push(day);
              }
            }
          }
        });
      });
    });

    setHighlightedDays(dueDates);
  }, [boards, currentYear]);

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
    const selectedDate = new Date(currentYear, monthIndex, dayNumber);

    const tasksByBoard: Record<string, { boardName: string; lists: Record<string, TaskInfo[]> }> = {};

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
              if (!tasksByBoard[board.name]) {
                tasksByBoard[board.name] = { boardName: board.name, lists: {} };
              }

              if (!tasksByBoard[board.name].lists[list.name]) {
                tasksByBoard[board.name].lists[list.name] = [];
              }

              tasksByBoard[board.name].lists[list.name].push({
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
    setTasksForSelectedDay(Object.values(tasksByBoard));
  };

  const closeModal = () => {
    setSelectedDay(null);
    setTasksForSelectedDay([]);
  };

  const renderMonth = (monthIndex: number) => {
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

  const handleYearChange = (direction: 'prev' | 'next') => {
    setCurrentYear((prevYear) => (direction === 'prev' ? prevYear - 1 : prevYear + 1));
  };

  return (
    <div className="main_calendar_container">
      <div className="calendar_year_controls">
        < MdOutlineKeyboardDoubleArrowLeft onClick={() => handleYearChange('prev')} className='year_change_arrow_icon' />
        <h2 className='currentyear_h2' >{currentYear}</h2>
        <MdOutlineKeyboardDoubleArrowRight onClick={() => handleYearChange('next')} className='year_change_arrow_icon' />
      </div>

      <div className="yearly_calendar">
        {months.map((_, index) => renderMonth(index))}
      </div>

      {selectedDay && (
        <div className="modal_overlay" onClick={closeModal}>
          <div
            className="selected_day_info"
            style={{ backgroundColor: `${currentTheme['--list-background-color']}` }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <h3>Tasks for {selectedDay}</h3>

            {tasksForSelectedDay.length > 0 ? (
              <div className="selected_day_container_list">
                {tasksForSelectedDay.map((board, boardIndex) => (
                  <div key={boardIndex} className="selected_day_task_container">
                    <div className="selected_day_task_board_container" style={{ backgroundColor: `${currentTheme['--list-background-color']}` }}>
                      <div className="selected_day_task_board">
                        <FaClipboardList />
                        <h2 className='selected_day_boardname_h2'>{board.boardName}</h2>

                      </div>
                    </div>
                    {Object.entries(board.lists).map(([listName, tasks], listIndex) => (
                      <div key={listIndex} className="selected_day_task_list" style={{ backgroundColor: `${currentTheme['--list-background-color']}` }}>
                        <div className='selected_day_icon_list_h2' style={{ backgroundColor: `${currentTheme['--list-background-color']}` }}>
                          <IoMdListBox />
                          <h3 className='selected_day_h2' >{listName}</h3>
                        </div>

                        {tasks.map((task, taskIndex) => (
                          <div key={taskIndex} className="selected_day_each_task">
                            {task.taskTitle}
                          </div>
                        ))}

                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <p>No tasks due on this day.</p>
            )}
            <button onClick={closeModal} className='selected_day_close_button'>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;