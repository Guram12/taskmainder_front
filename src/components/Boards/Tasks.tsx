import '../../styles/Board Styles/Task.css';
import React, { useEffect, useState } from 'react';
import { tasks } from '../../utils/interface';
import TaskUpdateModal from './TaskUpdateModal';
import { BiMoveVertical } from "react-icons/bi"; // Import drag icon
import { ThemeSpecs } from '../../utils/theme';
import { ThemeProvider } from '@mui/material/styles';
import generateCustomTheme from '../../utils/CustomTheme';
import { ProfileData } from '../../utils/interface';
import { MdModeEdit } from "react-icons/md";
import { MdRadioButtonChecked } from "react-icons/md";
import { MdRadioButtonUnchecked } from "react-icons/md";
import Avatar from '@mui/material/Avatar'; // Import Avatar from Material-UI
import getAvatarStyles from '../../utils/SetRandomColor';
import { useDraggable } from '@dnd-kit/core';
import { RxDragHandleDots2 } from "react-icons/rx";
import ReactDOM from 'react-dom';
import SkeletonEachTask from './SkeletonEachTask';
import { PiTextAlignLeft } from "react-icons/pi";
import PuffLoader from 'react-spinners/PuffLoader';
import { useTranslation } from 'react-i18next';


interface TaskProps {
  task: tasks;
  deleteTask: (taskId: number, listId: number) => void;
  updateTask: (taskId: number, updatedTitle: string, due_date: string | null, description: string, completed: boolean, task_associated_users_id: number[], priority: 'green' | 'orange' | 'red' | null,) => void;
  currentTheme: ThemeSpecs;
  allCurrentBoardUsers: ProfileData[];
  dndListId: number;
  setUpdatingTaskId: (updatingTaskId: number | null) => void;
  updatingTaskId: number | null;
  setCompletingTaskId: (completingTaskId: number | null) => void;
  completingTaskId: number | null;
}


const Task: React.FC<TaskProps> = ({ task,
  deleteTask,
  updateTask,
  currentTheme,
  allCurrentBoardUsers,
  dndListId,
  setUpdatingTaskId,
  updatingTaskId,
  setCompletingTaskId,
  completingTaskId,
}) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [associatedUsers, setAssociatedUsers] = useState<ProfileData[]>([]);

  const { t } = useTranslation();


  useEffect(() => {
    const filterAssociatedUsers = () => {
      if (Array.isArray(task.task_associated_users_id)) {
        const filteredUsers = allCurrentBoardUsers.filter((user) =>
          task.task_associated_users_id.includes(user.id)
        );
        setAssociatedUsers(filteredUsers);
      }
    };

    filterAssociatedUsers();
  }, [task.task_associated_users_id, allCurrentBoardUsers]);

  // =======================================    delete task functions   ======================================

  const handleTaskClick = () => {
    setShowUpdateModal(true);
    console.log("clicked");
  };

  const handle_update_modal_close = () => {
    setShowUpdateModal(false);

  }



  // =======================================  format date ==========================================

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return ''; // Return an empty string if no due_date
    const date = new Date(dateString);

    // Get month name using translation
    const monthNames = [
      t('january'), t('february'), t('march'), t('april'),
      t('may'), t('june'), t('july'), t('august'),
      t('september'), t('october'), t('november'), t('december')
    ];

    const monthName = monthNames[date.getMonth()];
    const day = date.getDate();

    // Extract hours and minutes
    const hours = date.getHours().toString().padStart(2, '0'); // Ensure 2-digit format
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${monthName} ${day}, ${hours}:${minutes}`;
  };


  // =======================================  set custom theme for MUI inputs   ==========================================
  const MUI_Theme = generateCustomTheme(currentTheme);



  // =======================================  render priority styles   ==========================================

  const priorityStyles = {
    green: { backgroundColor: '#15cf8a' },
    orange: { backgroundColor: '#fcc603' },
    red: { backgroundColor: '#d60000' },
  };

  const getPriorityStyle = (priority: 'green' | 'orange' | 'red' | null) => {
    return priority ? priorityStyles[priority] : {};
  };

  // =======================================   change task complition   ==========================================


  const handleCompletionToggle = (currenttask: tasks) => {
    updateTask(task.id, currenttask.title, currenttask.due_date, currenttask.description, !currenttask.completed, currenttask.task_associated_users_id, currenttask.priority);
  };


  // DND-KIT: Make this task draggable
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { dndListId }, // dndListId should be a number (list.id)
  });



  return (
    <>
      {updatingTaskId === task.id ? (
        <SkeletonEachTask currentTheme={currentTheme} />
      )
        :
        (
          <div
            className={`each_task ${isDragging ? 'dragging' : ''}`}
            ref={setNodeRef}
            style={{
              opacity: isDragging ? 0.5 : 1,
              backgroundColor: currentTheme['--task-background-color'],
              color: currentTheme['--main-text-coloure'],
            }}
            data-task-id={task.id}
          >
            <div
              className='task_complition_checkbox_container'
              style={{ borderColor: currentTheme['--border-color'] }}
            >
              <div className='completed_task_icon_cont' >
                {completingTaskId === task.id ? (
                  <div className='completing_task_loader_container'>

                    <PuffLoader
                      className='completing_task_loader'
                      color={currentTheme['--main-text-coloure']}
                      size={15}
                    />
                  </div>

                ) : (
                  < >
                    {task.completed ? (
                      <MdRadioButtonChecked
                        className='completed_task_icon'
                        onClick={() => {
                          handleCompletionToggle(task);
                          setCompletingTaskId(task.id);
                        }}
                      />
                    ) : (
                      <MdRadioButtonUnchecked
                        className='not_completed_task_icon'
                        onClick={() => {
                          handleCompletionToggle(task);
                          setCompletingTaskId(task.id);
                        }}
                      />
                    )}
                  </>
                )}

                {task.description && (
                  <PiTextAlignLeft className='task_description_icon' title='Task Description' />
                )}
              </div>


              {task.priority && (
                <div onClick={handleTaskClick} className={`priority_div  ${task.description ? '' : 'move_if_description'}`} style={getPriorityStyle(task.priority)} />
              )}

              <div className='edit_drag_icon_container'>
                <MdModeEdit className='edit_task_icon' onClick={handleTaskClick} />
                <div className='drag_bouth_handlers_container'>

                  {/* ============  for reordering  tasks within list =======================*/}
                  <div className='reorder_container' >
                    <BiMoveVertical className='reorder_icon'
                      style={{
                        color: currentTheme['--main-text-coloure'],
                        cursor: 'ns-resize',
                        transition: 'color 0.3s ease',
                      }}
                    />
                  </div>

                  {/*============= for drag and drop from list to list =======================*/}
                  <div
                    className="drag_handle"
                    {...listeners}
                    {...attributes}
                    style={{ cursor: 'grab', touchAction: 'none' }} // touchAction: 'none' helps on mobile
                  >
                    <RxDragHandleDots2 className='drag_icon' />
                  </div>
                </div>
              </div>
            </div>

            <div className={`conteiner_for_task_title ${task.completed ? 'task_completed' : ''}`} onClick={handleTaskClick} >
              <p className='task_title'>{task.title}</p>
            </div>


            <div className='task_description_and_due_date_container' >
              {task.due_date ? (
                <p className='due_Date_p' style={{ color: currentTheme["--due-date-color"] }}>{t("task_due_date")} {formatDate(task.due_date)}</p>
              ) : (
                <p className='due_Date_p' style={{ color: currentTheme["--due-date-color"] }}>{t("no_due_date")}</p>
              )}

              <div className='associated_users_imgs_container'>
                {associatedUsers.length > 0 ? (
                  associatedUsers.map((user) => (
                    <div key={user.id} className='associated_user_img_container'>
                      {user.profile_picture ? (

                        <img
                          key={user.id}
                          src={user.profile_picture}
                          alt={user.username}
                          className='associated_user_image'
                          title={user.username}
                        />


                      ) : (
                        <Avatar
                          key={user.id}
                          sx={{
                            width: 20,
                            height: 20,
                            fontSize: '0.75rem',
                            backgroundColor: getAvatarStyles(user.username.charAt(0)).backgroundColor,
                            color: getAvatarStyles(user.username.charAt(0)).color,
                          }}
                          className='associated_user_image'
                          title={user.username}
                        >
                          {user.username.charAt(0).toUpperCase()}
                        </Avatar>
                      )}
                    </div>
                  ))
                ) : (
                  <p className='no_associated_users_p' style={{ color: currentTheme["--due-date-color"] }} >{t("no_associated_users")}</p> // Fallback if no associated users
                )}
              </div>

            </div>


            {showUpdateModal && ReactDOM.createPortal(
              <ThemeProvider theme={MUI_Theme}>
                <TaskUpdateModal
                  task={task}
                  updateTask={updateTask}
                  onClose={handle_update_modal_close}
                  currentTheme={currentTheme}
                  allCurrentBoardUsers={allCurrentBoardUsers}
                  associatedUsers={associatedUsers}
                  deleteTask={deleteTask}
                  setUpdatingTaskId={setUpdatingTaskId}
                />
              </ThemeProvider>,
              document.body
            )}
          </div>
        )}

    </>

  );
};

export default React.memo(Task);