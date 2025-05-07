import '../../styles/Board Styles/TaskUpdateModal.css';
import React, { useState } from 'react';
import { tasks } from '../../utils/interface';
import { ThemeSpecs } from '../../utils/theme';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';






interface TaskUpdateModalProps {
  task: tasks;
  onClose: () => void;
  onUpdate: (taskId: number, updatedTitle: string, due_date: string | null, description: string, completed: boolean) => void;
  currentTheme: ThemeSpecs;
}

const TaskUpdateModal: React.FC<TaskUpdateModalProps> = ({ task, onClose, onUpdate, currentTheme }) => {
  const [updatedTitle, setUpdatedTitle] = useState<string>(task.title);
  const [updatedDescription, setUpdatedDescription] = useState<string>(task.description || '');
  const [updatedDueDate, setUpdatedDueDate] = useState<Dayjs | null>(
    task.due_date ? dayjs(task.due_date.split('T')[0]) : null
  ); // Use Dayjs for date
  const [updatedDueTime, setUpdatedDueTime] = useState<Dayjs | null>(
    task.due_date ? dayjs(task.due_date) : null
  ); // Use Dayjs for time
  const [updatedCompletedStatus, setUpdatedCompletedStatus] = useState<boolean>(task.completed);

  const handleUpdate = () => {
    if (updatedTitle.trim()) {
      const combinedDueDateTime =
        updatedDueDate && updatedDueTime
          ? dayjs(`${updatedDueDate.format('YYYY-MM-DD')}T${updatedDueTime.format('HH:mm')}`).toISOString() // Combine date and time
          : updatedDueDate
          ? `${updatedDueDate.format('YYYY-MM-DD')}T00:00:00Z`
          : null; // Send null if due date is cleared
      onUpdate(task.id, updatedTitle, combinedDueDateTime, updatedDescription, updatedCompletedStatus);
      onClose();
    }
  };

  const handleClearDueDate = () => {
    setUpdatedDueDate(null);
    setUpdatedDueTime(null);
  };

  const handleCancel = () => {
    onClose();
  };



  
  return (
    <div className="task-update-modal">
      <div className="modal-content" style={{ backgroundColor: currentTheme['--background-color'] }}>
        <h3>Update Task</h3>
        <input
          type="text"
          value={updatedTitle}
          onChange={(e) => setUpdatedTitle(e.target.value)}
          placeholder="Task Title"
        />
        <textarea
          value={updatedDescription}
          onChange={(e) => setUpdatedDescription(e.target.value)}
          placeholder="Task Description"
        />
        <label>
          Completed:
          <input
            type="checkbox"
            checked={updatedCompletedStatus}
            onChange={(e) => setUpdatedCompletedStatus(e.target.checked)}
          />
        </label>
        <div className="date-time-inputs">
          <LocalizationProvider dateAdapter={AdapterDayjs}   >
            {/* Date Picker */}
            <DatePicker
              label="Select Date"
              value={updatedDueDate}
              onChange={(newValue) => setUpdatedDueDate(newValue)}
              disablePast
              views={['year', 'month', 'day']}
              
            />
            {/* Time Picker */}
            <TimePicker
              label="Select Time"
              value={updatedDueTime}
              onChange={(newValue) => setUpdatedDueTime(newValue)}
              views={['hours', 'minutes']}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
            />
          </LocalizationProvider>
        </div>
        <div className="modal-actions">
          <button onClick={handleClearDueDate} style={{ backgroundColor: 'red', color: 'white' }}>
            Clear Due Date
          </button>
          <div>
            <button onClick={handleUpdate}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskUpdateModal;