import '../../styles/Board Styles/TaskUpdateModal.css';
import React, { useState, useEffect } from 'react';
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
import ConfirmationDialog from './ConfirmationDialog';
import Avatar from '@mui/material/Avatar';
import getAvatarStyles from '../../utils/SetRandomColor';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { GrFormCheckmark } from "react-icons/gr";
import { HiXMark } from "react-icons/hi2";
import { MdOutlineSubtitles } from "react-icons/md";
import { MdOutlineRemoveCircleOutline } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { PiTextAlignLeft } from "react-icons/pi";


interface TaskUpdateModalProps {
  task: tasks;
  onClose: () => void;
  updateTask: (taskId: number, updatedTitle: string, due_date: string | null, description: string, completed: boolean, task_associated_users_id: number[], priority: 'green' | 'orange' | 'red' | null,) => void;
  deleteTask: (taskId: number, listId: number) => void;
  currentTheme: ThemeSpecs;
  allCurrentBoardUsers: ProfileData[];
  associatedUsers: ProfileData[];
  setUpdatingTaskId: (updatingTaskId: number | null) => void;

}

const TaskUpdateModal: React.FC<TaskUpdateModalProps> = ({
  task,
  onClose,
  updateTask,
  deleteTask,
  currentTheme,
  allCurrentBoardUsers,
  associatedUsers,
  setUpdatingTaskId,
}) => {

  const [updatedTitle, setUpdatedTitle] = useState<string>(task.title);
  const [isTitleUpdating, setIsTitleUpdating] = useState<boolean>(false);

  const [updatedDescription, setUpdatedDescription] = useState<string>(task.description || '');
  const [isDescriptionUpdating, setIsDescriptionUpdating] = useState<boolean>(false);

  const [caracter_limit, setCaracter_limit] = useState(1000 - updatedTitle.length);



  const [updatedDueDate, setUpdatedDueDate] = useState<Dayjs | null>(task.due_date ? dayjs(task.due_date.split('T')[0]) : null); // Use Dayjs for date
  const [updatedDueTime, setUpdatedDueTime] = useState<Dayjs | null>(task.due_date ? dayjs(task.due_date) : null); // Use Dayjs for time
  const [updatedCompletedStatus, setUpdatedCompletedStatus] = useState<boolean>(task.completed);

  const [updatedPriority, setUpdatedPriority] = useState<'green' | 'orange' | 'red' | null>(task.priority || null);

  const [showDialog, setShowDialog] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState<number[]>(
    associatedUsers.map((user) => user.id) // Initialize with existing associated user IDs
  );


  const handleUpdate = () => {
    if (updatedTitle.trim() === '') {
      return;
    }

    setUpdatingTaskId(task.id);
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
  // ======================================= cancel update if title is empty =========================================
  const handle_save_title_click = () => {
    if (updatedTitle.trim() === '') {
      return;
    }
    setIsTitleUpdating(false);
  }

  // ===================================================================================================================
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
          borderColor: currentTheme['--border-color'],
        },
      },
      InputLabelProps: {
        style: {
          color: currentTheme['--main-text-coloure'],
        },
      },
      sx: {
        width: '180px',
        '& .MuiInputLabel-root': {
          color: currentTheme['--main-text-coloure'],
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: currentTheme['--main-text-coloure'],
        },
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
      width: '100%',
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

  // ============================================ show caracter length ================================


  useEffect(() => {
    setCaracter_limit(1000 - updatedTitle.length);
  }, [updatedTitle]);


  return (
    <div className="task-update-modal">
      <div className="modal-content" style={{ backgroundColor: currentTheme['--background-color'] }}>
        <div className='inputs_container' >
          <h3 className='update_task_header' >Update Task</h3>
          <div className='sistle_and_titleicon_container'>
            <MdOutlineSubtitles className='title_icon' style={{ color: currentTheme['--main-text-coloure'] }} />
            <h3 className='title_p' style={{ color: currentTheme['--main-text-coloure'] }}>Title</h3>
            <p className='title_char_limit' style={{ color: currentTheme['--due-date-color'] }}
              onClick={() => setCaracter_limit(1000 - updatedTitle.length)}
            >( {caracter_limit} characters left)</p>
          </div>
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
                  borderColor: caracter_limit === 1000 ? 'red' : currentTheme['--border-color'],
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  ['--placeholder-color']: currentTheme['--due-date-color']
                } as React.CSSProperties}
              />
              <GrFormCheckmark
                className='title_checkmark_icon'
                onClick={() => handle_save_title_click()}
                style={{ cursor: caracter_limit === 1000 ? 'not-allowed' : 'pointer' }}
              />
              <HiXMark className='title_close_icon' onClick={handleCancelTitleUpdate} />
            </div>
          ) : (

            <div className='task_title_input_container title_cursor' onClick={() => setIsTitleUpdating(true)} style={{ borderColor: currentTheme['--border-color'] }}>
              <p className='title_text' style={{ color: currentTheme['--main-text-coloure'] }}>{updatedTitle}</p>
            </div>

          )}

          {/* Description Input container*/}
          <div className='description_container' >
            <div className='description_main_cont'>
              <PiTextAlignLeft className='title_icon' style={{ color: currentTheme['--main-text-coloure'] }} />
              <h3 className='title_p' style={{ color: currentTheme['--main-text-coloure'] }}>Description </h3>
            </div>
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
                    ['--placeholder-color']: currentTheme['--due-date-color']
                  } as React.CSSProperties}
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

        </div>




        {/* Priority Input */}
        <div className="priority_container"
          style={{ borderColor: currentTheme['--border-color'] }}
        >
          <p className='priority_p' > Priority:</p>
          <div
            className='each_priority none'
            onClick={() => setUpdatedPriority(null)}
            style={{
              borderWidth: updatedPriority === null ? '2px' : '1px',
              borderStyle: 'solid',
              borderColor: updatedPriority !== null ? currentTheme['--border-color'] : currentTheme['--main-text-coloure'],
              color: currentTheme['--main-text-coloure'],
            }}
          >
            No priority
          </div>
          <div
            className='each_priority low'
            onClick={() => setUpdatedPriority('green')}
            style={{
              borderWidth: updatedPriority === 'green' ? '2px' : 'none',
              borderStyle: updatedPriority === 'green' ? 'solid' : undefined,
              borderColor: currentTheme['--main-text-coloure'],
            }}
          >Low</div>
          <div
            className='each_priority medium'
            onClick={() => setUpdatedPriority('orange')}
            style={{
              borderWidth: updatedPriority === 'orange' ? '2px' : 'none',
              borderStyle: updatedPriority === 'orange' ? 'solid' : undefined,
              borderColor: currentTheme['--main-text-coloure'],
            }}
          >Medium</div>
          <div
            className='each_priority high'
            onClick={() => setUpdatedPriority('red')}
            style={{
              borderWidth: updatedPriority === 'red' ? '2px' : 'none',
              borderStyle: updatedPriority === 'red' ? 'solid' : undefined,
              borderColor: currentTheme['--main-text-coloure'],
            }}
          >High</div>

        </div>


        <div className="date-time-inputs">
          <div className='picker_container' >
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

          <div className='clear_date_container' >
            <button onClick={handleClearDueDate} className='clear_date_button'
              style={{
                borderColor: currentTheme['--border-color'],
                color: currentTheme['--main-text-coloure'],
              }}
            >
              <MdOutlineRemoveCircleOutline className='remove_date_icon' />
              Clear Due Date
            </button>
          </div>
        </div>






        {/* User Select Input */}
        <div className="user-select">
          <p className='asociate_users_p'  >Asociate Users To Task</p>
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
        {associatedUsers.length > 0 && (
          <div className="previously-associated-users">
            <div className='prev_as_users_header' style={{ color: currentTheme['--main-text-coloure'] }} >
              <div className='icon_as_users_cont' >
                <FaUser className='as_users_icon' />
                <h4 className='prev_as_users_h4' >Associated Users :</h4>
              </div>
              <button
                onClick={handleClearAssociatedUsers}
                style={{
                  borderColor: currentTheme['--border-color'],
                  color: currentTheme['--main-text-coloure'],
                }}
                className='clear_associated_users_button'
              >
                <MdOutlineRemoveCircleOutline className='remove_date_icon' />
                Clear All Associated Users
              </button>
            </div>
            <div className="associated_users_cont">
              {associatedUsers.map((user) => (
                // Add key to the fragment
                <React.Fragment key={user.id}>
                  {user.profile_picture ? (
                    <div className='associated_user_img_child_container'
                      style={{ borderColor: currentTheme['--border-color'] }}
                    >

                      <img
                        src={user.profile_picture}
                        alt={user.username}
                        className="associated-user-image"
                        title={user.username}
                      />
                      <p>{user.username}</p>
                    </div>
                  ) : (
                    <div className='associated_user_img_child_container'
                      style={{ borderColor: currentTheme['--border-color'] }}
                    >

                      <Avatar
                        style={{
                          backgroundColor: getAvatarStyles(user.username.charAt(0)).backgroundColor,
                          color: getAvatarStyles(user.username.charAt(0)).color,
                          width: '30px',
                          height: '30px',
                        }}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <p>{user.username}</p>
                    </div>

                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )
        }


        <label className="completed-label" style={{ color: currentTheme['--main-text-coloure'] }}>
          Completed:
          <span className="custom-checkbox-container">
            <input
              type="checkbox"
              checked={updatedCompletedStatus}
              onChange={(e) => setUpdatedCompletedStatus(e.target.checked)}
              className="custom-checkbox"
              style={{ accentColor: currentTheme['--main-text-coloure'] }} // fallback for browsers that support accent-color
            />
            <span
              className="checkmark"
              style={{
                borderColor: currentTheme['--border-color'],
                backgroundColor: updatedCompletedStatus
                  ? currentTheme['--main-text-coloure']
                  : currentTheme['--background-color'],
                color: updatedCompletedStatus
                  ? currentTheme['--background-color']
                  : currentTheme['--main-text-coloure'],
                boxShadow: updatedCompletedStatus
                  ? `0 0 8px 2px ${currentTheme['--main-text-coloure']}55`
                  : 'none',
              }}
            >
              {updatedCompletedStatus ? <GrFormCheckmark /> : ''}
            </span>
          </span>
        </label>



        <div className="modal-actions">
          <div className='delete_and_save_task_button' >
            <button className='delete_task_button' onClick={handleDelete} style={{
              backgroundColor: currentTheme['--background-color'],
              borderColor: currentTheme['--border-color'],
            }}>
              delete task
              <MdDeleteForever className='delete_icon'
                style={{ color: currentTheme['--main-text-coloure'] }}
              />
            </button>
            <div className='save_task_button_container' >
              <button
                className='save_task_button'
                style={{
                  backgroundColor: currentTheme['--task-background-color'],
                  borderColor: currentTheme['--border-color'],
                  cursor: updatedTitle.trim() === '' ? 'not-allowed' : 'pointer',
                }}
                onClick={handleUpdate}
              >
                Save
              </button>
              <button
                className='cancel_task_update_button'
                onClick={handleCancel}
                style={{
                  backgroundColor: currentTheme['--task-background-color'],
                  borderColor: currentTheme['--border-color'],
                }}
              >
                Cancel
              </button>
            </div>
          </div>


          {showDialog && (
            <ConfirmationDialog
              message={`Are you sure you want to delete the task "${task.title}"?`}
              onConfirm={confirmDelete}
              onCancel={cancelDelete}
              currentTheme={currentTheme}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default TaskUpdateModal;