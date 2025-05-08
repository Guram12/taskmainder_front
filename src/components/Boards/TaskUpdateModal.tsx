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
import { ProfileData } from '../../utils/interface';
import Select from 'react-select';
import { RiDeleteBin2Line } from "react-icons/ri";
import ConfirmationDialog from './ConfirmationDialog';





interface TaskUpdateModalProps {
  task: tasks;
  onClose: () => void;
  updateTask: (taskId: number, updatedTitle: string, due_date: string | null, description: string, completed: boolean, task_associated_users_id: number[]) => void;
  deleteTask: (taskId: number, listId: number) => void;
  currentTheme: ThemeSpecs;
  allCurrentBoardUsers: ProfileData[];
  associatedUsers: ProfileData[];

}

const TaskUpdateModal: React.FC<TaskUpdateModalProps> = ({ task, onClose, updateTask, deleteTask, currentTheme, allCurrentBoardUsers, associatedUsers }) => {
  const [updatedTitle, setUpdatedTitle] = useState<string>(task.title);
  const [updatedDescription, setUpdatedDescription] = useState<string>(task.description || '');
  const [updatedDueDate, setUpdatedDueDate] = useState<Dayjs | null>(task.due_date ? dayjs(task.due_date.split('T')[0]) : null); // Use Dayjs for date
  const [updatedDueTime, setUpdatedDueTime] = useState<Dayjs | null>(task.due_date ? dayjs(task.due_date) : null); // Use Dayjs for time
  const [updatedCompletedStatus, setUpdatedCompletedStatus] = useState<boolean>(task.completed);

  const [showDialog, setShowDialog] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState<number[]>(
    associatedUsers.map((user) => user.id) // Initialize with existing associated user IDs
  );


  const handleUpdate = () => {
    if (updatedTitle.trim()) {
      const combinedDueDateTime =
        updatedDueDate && updatedDueTime
          ? dayjs(`${updatedDueDate.format('YYYY-MM-DD')}T${updatedDueTime.format('HH:mm')}`).toISOString()
          : updatedDueDate
            ? `${updatedDueDate.format('YYYY-MM-DD')}T00:00:00Z`
            : null;

      updateTask(
        task.id,
        updatedTitle,
        combinedDueDateTime,
        updatedDescription,
        updatedCompletedStatus,
        selectedUsers // Pass the selected user IDs
      );
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


  // ========================================= delete taask ========================================

  const handleDelete = () => {
    setShowDialog(true);
  };

  const confirmDelete = () => {
    deleteTask(task.id, task.list);
    setShowDialog(false);
  };

  const cancelDelete = () => {
    setShowDialog(false);
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


        <button onClick={handleClearDueDate} style={{ backgroundColor: 'red', color: 'white' }}>
          Clear Due Date
        </button>


        {/* Previously asociated users */}
        {
          associatedUsers.length > 0 && (
            <div className="previously-associated-users">
              <h4 className='prev_as_users_h4' >Previously Associated Users:</h4>
              <div className="associated-users">
                {associatedUsers.map((user) => (
                  <img
                    key={user.id}
                    src={user.profile_picture}
                    alt={user.username}
                    className="associated-user-image"
                    title={user.username} // Tooltip with username
                  />
                ))}
              </div>
            </div>
          )
        }

        {/* User Select Input */}
        <div className="user-select">
          <label  >Select Associated Users:</label>
          <Select
            isMulti
            options={allCurrentBoardUsers.map((user) => ({
              value: user.id,
              label: user.username,
            }))}
            value={selectedUsers.map((id) => {
              const user = allCurrentBoardUsers.find((user) => user.id === id);
              return user ? { value: user.id, label: user.username } : null;
            }).filter(Boolean)} // Filter out null values
            onChange={(selectedOptions) => {
              if (selectedOptions) {
                const userIds = selectedOptions
                  .filter((option): option is { value: number; label: string } => option !== null)
                  .map((option) => option.value);
                setSelectedUsers(userIds);
              } else {
                setSelectedUsers([]); // Handle the case where no options are selected
              }
            }}
            placeholder="Select users..."
          />
        </div>


        <div className="modal-actions">
          <button className='delete_task_button' onClick={handleDelete}>
            <RiDeleteBin2Line className='delete_icon' />
          </button>
          {showDialog && (
            <ConfirmationDialog
              message={`Are you sure you want to delete the task "${task.title}"?`}
              onConfirm={confirmDelete}
              onCancel={cancelDelete}
            />
          )}
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