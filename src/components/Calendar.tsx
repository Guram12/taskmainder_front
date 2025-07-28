import '../styles/Calendar.css';
import React, { useEffect, useState } from 'react';
import { board } from '../utils/interface';
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { ThemeSpecs } from '../utils/theme';
import { FaClipboardList } from "react-icons/fa";
import { IoMdListBox } from "react-icons/io";
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { Helmet } from "react-helmet";


interface CalendarProps {
  boards: board[];
  currentTheme: ThemeSpecs;
  fetchBoards: () => Promise<void>;
}

interface TaskInfo {
  taskTitle: string;
  boardName: string;
  listName: string;
  dueDate?: string | null;
  priority: 'green' | 'orange' | 'red' | null;
}

const Calendar: React.FC<CalendarProps> = ({ boards, currentTheme, fetchBoards }) => {
  const { t } = useTranslation();


  const months = [
    t('january'), t('february'), t('march'), t('april'),
    t('may'), t('june'), t('july'), t('august'),
    t('september'), t('october'), t('november'), t('december')
  ];

  const daysOfWeek = [
    t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')
  ];


  const [highlightedDays, setHighlightedDays] = useState<Record<number, number[]>>({});
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [tasksForSelectedDay, setTasksForSelectedDay] = useState<{ boardName: string; lists: Record<string, TaskInfo[]> }[]>([]);

  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());


  const [showCalendarTooltip, setShowCalendarTooltip] = useState<boolean>(false);




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
  const handleDayClick = (monthIndex: number, dayNumber: number, isHighlighted: boolean) => {
    if (!isHighlighted) {
      setShowCalendarTooltip(true);
      setTimeout(() => {
        setShowCalendarTooltip(false);
      }, 3000);
      return;
    }

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
                dueDate: task.due_date,
                priority: task.priority,
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
            <div key={day} className="calendar_day_header" style={{ color: currentTheme["--main-text-coloure"] }}>
              {day}
            </div>
          ))}

          {Array.from({ length: firstDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="calendar_empty_day"></div>
          ))}

          {days.map((day) => {
            const dayNumber = day.getDate();
            const isHighlighted = highlightedDays[monthIndex]?.includes(dayNumber);

            // Check if this day is today
            const isToday =
              day.getDate() === new Date().getDate() &&
              day.getMonth() === new Date().getMonth() &&
              day.getFullYear() === new Date().getFullYear();

            return (
              <div
                key={day.toISOString()}
                className={`calendar_day ${isHighlighted ? 'highlighted_day' : ''}`}
                onClick={() => handleDayClick(monthIndex, dayNumber, isHighlighted)}
                style={
                  isToday
                    ? { border: `2px solid ${currentTheme['--border-color']}` }
                    : undefined
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

  // ================================================= render priority styles ==========================================

  const priorityStyles = {
    green: { backgroundColor: '#15cf8a' },
    orange: { backgroundColor: '#fcc603' },
    red: { backgroundColor: '#d60000' },
  };

  const getPriorityStyle = (priority: 'green' | 'orange' | 'red' | null) => {
    return priority ? priorityStyles[priority] : {};
  };




  return (
    <>
      <Helmet>
        <title>Calendar | DailyDoer</title>
        <meta name="description" content="View all your tasks and due dates in a yearly calendar. Stay organized and never miss a deadline with DailyDoer's calendar view." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://dailydoer.space/mainpage/calendar" />
      </Helmet>

      <div className="main_calendar_container"
        style={{
          backgroundColor: currentTheme['--background-color']
        }}
      >
        <div className="calendar_year_controls">
          < MdOutlineKeyboardDoubleArrowLeft onClick={() => handleYearChange('prev')} style={{ color: currentTheme["--main-text-coloure"] }} className='year_change_arrow_icon' />
          <h2 className='currentyear_h2' style={{ color: currentTheme["--main-text-coloure"] }} >{currentYear}</h2>
          <MdOutlineKeyboardDoubleArrowRight onClick={() => handleYearChange('next')} style={{ color: currentTheme["--main-text-coloure"] }} className='year_change_arrow_icon' />
          <div className="calendar_tooltip_cont">

            <Tooltip
              title={t('no_tasks_due_on_this_day')}
              placement="right"
              color={currentTheme["--list-background-color"]}
              styles={{
                body: {
                  color: currentTheme["--main-text-coloure"],
                  background: currentTheme["--list-background-color"],
                },
              }}
              open={showCalendarTooltip}
            >
              <span style={{ marginLeft: 8, cursor: 'pointer', fontSize: 18, color: currentTheme["--main-text-coloure"] }}>🛈</span>
            </Tooltip>
          </div>
        </div>

        <div className="yearly_calendar">
          {months.map((_, index) => renderMonth(index))}
        </div>

        {selectedDay && (
          <div className="modal_overlay" onClick={closeModal}>
            <div
              className="selected_day_info"
              style={{ backgroundColor: `${currentTheme['--list-background-color']}` }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ color: currentTheme['--main-text-coloure'] }} >{t('tasks_for')} {selectedDay} {t('tvis')}</h3>

              {tasksForSelectedDay.length > 0 && (
                <div className="selected_day_container_list">
                  {tasksForSelectedDay.map((board, boardIndex) => (
                    <div key={boardIndex} className="selected_day_task_container" style={{ borderColor: currentTheme['--border-color'] }}>
                      <div className="selected_day_task_board_container" style={{ backgroundColor: `${currentTheme['--list-background-color']}` }}>
                        <div className="selected_day_task_board">
                          <FaClipboardList />
                          <h2 className='selected_day_boardname_h2'>{board.boardName}</h2>
                        </div>
                      </div>
                      {Object.entries(board.lists).map(([listName, tasks], listIndex) => (
                        <div key={listIndex} className="selected_day_task_list" style={{ borderColor: currentTheme['--border-color'] }}>
                          <div className='selected_day_icon_list_h2' style={{ backgroundColor: `${currentTheme['--list-background-color']}` }}>
                            <IoMdListBox />
                            <h3 className='selected_day_h2' >{listName}</h3>
                          </div>

                          {tasks.map((task, taskIndex) => (
                            <div key={taskIndex} className="selected_day_each_task" style={{ backgroundColor: currentTheme['--task-background-color'] }}>
                              {task.priority && (
                                <div className='selected_day_each_task_priority' style={getPriorityStyle(task.priority)}>  </div>
                              )}
                              <p className='selected_day_each_task_title' style={{ color: currentTheme['--main-text-coloure'] }} >{task.taskTitle}</p>
                              <p className='selected_day_each_task_due_date' style={{ color: currentTheme['--due-date-color'] }}>
                                {t('due_date')}
                                {task.dueDate ? new Date(task.dueDate).toLocaleTimeString([],
                                  { hour: '2-digit', minute: '2-digit' }) : ''}
                              </p>
                            </div>
                          ))}

                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              <button onClick={closeModal} className='selected_day_close_button'>{t('close')}</button>
            </div>
          </div>
        )}
      </div>
    </>

  );
};

export default Calendar;