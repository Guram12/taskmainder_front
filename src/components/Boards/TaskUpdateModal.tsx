import '../../styles/Board Styles/TaskUpdateModal.css';
import React, { useState } from 'react';
import { tasks } from '../../utils/interface';
import { ThemeSpecs } from '../../utils/theme';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { ProfileData } from '../../utils/interface';
import Select from 'react-select';
import { RiDeleteBin2Line } from "react-icons/ri";
import ConfirmationDialog from './ConfirmationDialog';
import Avatar from '@mui/material/Avatar';
import getAvatarStyles from '../../utils/SetRandomColor';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { GrFormCheckmark } from "react-icons/gr";
import { HiXMark } from "react-icons/hi2";
import { MdOutlineSubtitles } from "react-icons/md";


interface TaskUpdateModalProps {
  task: tasks;
  onClose: () => void;
  updateTask: (taskId: number, updatedTitle: string, due_date: string | null, description: string, completed: boolean, task_associated_users_id: number[], priority: 'green' | 'orange' | 'red' | null,) => void;
  deleteTask: (taskId: number, listId: number) => void;
  currentTheme: ThemeSpecs;
  allCurrentBoardUsers: ProfileData[];
  associatedUsers: ProfileData[];

}

const TaskUpdateModal: React.FC<TaskUpdateModalProps> = ({ task, onClose, updateTask, deleteTask, currentTheme, allCurrentBoardUsers, associatedUsers }) => {
  const [updatedTitle, setUpdatedTitle] = useState<string>(task.title);
  const [isTitleUpdating, setIsTitleUpdating] = useState<boolean>(false);

  const [updatedDescription, setUpdatedDescription] = useState<string>(task.description || '');
  const [isDescriptionUpdating, setIsDescriptionUpdating] = useState<boolean>(false);




  const [updatedDueDate, setUpdatedDueDate] = useState<Dayjs | null>(task.due_date ? dayjs(task.due_date.split('T')[0]) : null); // Use Dayjs for date
  const [updatedDueTime, setUpdatedDueTime] = useState<Dayjs | null>(task.due_date ? dayjs(task.due_date) : null); // Use Dayjs for time
  const [updatedCompletedStatus, setUpdatedCompletedStatus] = useState<boolean>(task.completed);

  const [updatedPriority, setUpdatedPriority] = useState<'green' | 'orange' | 'red' | null>(task.priority || null);

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
        selectedUsers,
        updatedPriority,
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

  const handleClearAssociatedUsers = () => {
    setSelectedUsers([]);
  }
  // ========================================= delete task ========================================

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

  // ================================================   input  click functions =======================================
  const handleCancelTitleUpdate = () => {
    setIsTitleUpdating(false);
    setUpdatedTitle(task.title);
  };

  const handleCancelDescriptionUpdate = () => {
    setIsDescriptionUpdating(false);
    setUpdatedDescription(task.description || '');
    console.log("cancel description update");
  };

  // =====================   Custom slotProps for MUI pickers to apply theme styles =============================
  const pickerSlotProps = {
    textField: {
      InputProps: {
        style: {
          backgroundColor: currentTheme['--background-color'],
          color: currentTheme['--main-text-coloure'],
        },
      },
      InputLabelProps: {
        style: {
          color: currentTheme['--main-text-coloure'],
        },
      },
      sx: {
        '& .MuiOutlinedInput-root': {
          backgroundColor: currentTheme['--background-color'],
          color: currentTheme['--main-text-coloure'],
        },
        '& .MuiInputLabel-root': {
          color: currentTheme['--main-text-coloure'],
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: currentTheme['--main-text-coloure'],
        },
        // Style the icons in the input
        '& .MuiSvgIcon-root': {
          color: currentTheme['--main-text-coloure'],
        },
      },
    },
    popper: {
      sx: {
        '& .MuiPaper-root': {
          backgroundColor: currentTheme['--background-color'],
          color: currentTheme['--main-text-coloure'],
        },
        '& .MuiPickersDay-root': {
          color: currentTheme['--main-text-coloure'],
        },
        '& .MuiDayCalendar-weekDayLabel': {
          color: currentTheme['--main-text-coloure'],
        },
        '& .MuiSvgIcon-root': {
          color: currentTheme['--main-text-coloure'],
        },
        '& .MuiClockNumber-root': {
          color: currentTheme['--main-text-coloure'],
        },
        '& .MuiPickersToolbar-root': {
          backgroundColor: currentTheme['--background-color'],
          color: currentTheme['--main-text-coloure'],
        },
        '& .MuiPickersToolbarText-root': {
          color: currentTheme['--main-text-coloure'],
        },
        '& .MuiTypography-root': {
          color: currentTheme['--main-text-coloure'],
        },

      },
    },

  };

  //===================== Custom styles for react-select based on currentTheme  =============================
  const selectStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: currentTheme['--background-color'],
      color: currentTheme['--main-text-coloure'],
      borderColor: currentTheme['--main-text-coloure'],
      boxShadow: 'none',
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: currentTheme['--background-color'],
      color: currentTheme['--main-text-coloure'],
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? currentTheme['--main-text-coloure']
        : currentTheme['--background-color'],
      color: state.isFocused
        ? currentTheme['--background-color']
        : currentTheme['--main-text-coloure'],
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: currentTheme['--main-text-coloure'],
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: currentTheme['--main-text-coloure'],
      color: currentTheme['--background-color'],
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: currentTheme['--background-color'],
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: currentTheme['--background-color'],
      ':hover': {
        backgroundColor: currentTheme['--main-text-coloure'],
        color: currentTheme['--background-color'],
      },
    }),
    input: (provided: any) => ({
      ...provided,
      color: currentTheme['--main-text-coloure'],
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: currentTheme['--main-text-coloure'],
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: currentTheme['--main-text-coloure'],
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      backgroundColor: currentTheme['--main-text-coloure'],
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      color: currentTheme['--main-text-coloure'],
    }),
  };

  return (
    <div className="task-update-modal">
      <div className="modal-content" style={{ backgroundColor: currentTheme['--background-color'] }}>
        <div className='inputs_container' >
          <h3 className='update_task_header' >Update Task</h3>
          {isTitleUpdating ? (
            <div className='task_title_input_container'>
              <input
                type="text"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
                placeholder="Task Title"
                className='task_title_input'
                style={{
                  backgroundColor: currentTheme['--background-color'],
                  color: currentTheme['--main-text-coloure'],
                  borderColor: currentTheme['--border-color'],
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
              <GrFormCheckmark className='title_checkmark_icon' onClick={() => {
                setIsTitleUpdating(false);
              }} />
              <HiXMark className='title_close_icon' onClick={handleCancelTitleUpdate} />
            </div>
          ) : (
            <div className='task_title_input_container title_cursor' onClick={() => setIsTitleUpdating(true)} style={{ borderColor: currentTheme['--border-color'] }}>
              <MdOutlineSubtitles className='title_icon' style={{ color: currentTheme['--main-text-coloure'] }} />
              <p className='title_text' style={{ color: currentTheme['--main-text-coloure'] }}>{updatedTitle}</p>
            </div>
          )}

          {/* Description Input container*/}
          <div className='description_container' >
            {isDescriptionUpdating ? (
              <div className='description_textarea_container' >

                <textarea
                  className='description_textarea'
                  value={updatedDescription}
                  onChange={(e) => setUpdatedDescription(e.target.value)}
                  placeholder="Task Description"
                  style={{
                    backgroundColor: currentTheme['--background-color'],
                    color: currentTheme['--main-text-coloure'],
                    borderColor: currentTheme['--border-color'],
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                />
                <GrFormCheckmark className='title_checkmark_icon' onClick={() => setIsDescriptionUpdating(false)} />
                <HiXMark className='title_close_icon' onClick={handleCancelDescriptionUpdate} />
              </div>

            ) : (
              <div
                className='description_text'
                style={{ color: currentTheme['--main-text-coloure'], borderColor: currentTheme['--border-color'] }}
                onClick={() => setIsDescriptionUpdating(true)}
              >
                {updatedDescription === '' ? 'Add a description...' : updatedDescription}
              </div>
            )}
          </div>



          <label>
            Completed:
            <input
              type="checkbox"
              checked={updatedCompletedStatus}
              onChange={(e) => setUpdatedCompletedStatus(e.target.checked)}
            />
          </label>
        </div>

        {/* Priority Input */}
        <div className="priority-input">
          <label>Priority:</label>
          <select
            value={updatedPriority || ''}
            onChange={(e) => setUpdatedPriority(e.target.value as 'green' | 'orange' | 'red' | null)}
          >
            <option value="">None</option>
            <option value="green">Low</option>
            <option value="orange">Medium</option>
            <option value="red">High</option>
          </select>
        </div>


        <div className="date-time-inputs">
          <LocalizationProvider dateAdapter={AdapterDayjs}   >
            {/* Date Picker */}
            <DatePicker
              label="Select Date"
              value={updatedDueDate}
              onChange={(newValue) => setUpdatedDueDate(newValue)}
              disablePast
              views={['year', 'month', 'day']}
              slotProps={pickerSlotProps}
            />
            {/* Time Picker */}
            <DesktopTimePicker
              label="Select Time"
              value={updatedDueTime}
              onChange={(newValue) => setUpdatedDueTime(newValue)}
              views={['hours', 'minutes']}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
              slotProps={pickerSlotProps}
            />
          </LocalizationProvider>
        </div>


        <button onClick={handleClearDueDate} style={{ backgroundColor: 'red', color: 'white' }}>
          Clear Due Date
        </button>




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
            styles={selectStyles}
          />
        </div>

        {/* Previously asociated users */}
        {
          associatedUsers.length > 0 && (
            <div className="previously-associated-users">
              <h4 className='prev_as_users_h4' >Previously Associated Users:</h4>
              <div className="associated-users">
                {associatedUsers.map((user) => (
                  // Add key to the fragment
                  <React.Fragment key={user.id}>
                    {user.profile_picture ? (
                      <img
                        src={user.profile_picture}
                        alt={user.username}
                        className="associated-user-image"
                        title={user.username}
                      />
                    ) : (
                      <Avatar
                        style={{
                          backgroundColor: getAvatarStyles(user.username.charAt(0)).backgroundColor,
                          color: getAvatarStyles(user.username.charAt(0)).color
                        }}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </Avatar>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )
        }

        <button onClick={handleClearAssociatedUsers}>
          Clear Associated Users
        </button>

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