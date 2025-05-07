import '../../styles/Board Styles/Task.css';
import React, { useEffect, useState } from 'react';
import { tasks } from '../../utils/interface';
import { useDrag, useDrop } from 'react-dnd';
import { RiDeleteBin2Line } from "react-icons/ri";
import ConfirmationDialog from './ConfirmationDialog';
import TaskUpdateModal from './TaskUpdateModal';
import { BiMoveVertical } from "react-icons/bi"; // Import drag icon
import { ThemeSpecs } from '../../utils/theme';
import { ThemeProvider } from '@mui/material/styles';
import generateCustomTheme from '../../utils/CustomTheme';
import { ProfileData } from '../../utils/interface';




interface TaskProps {
  task: tasks;
  deleteTask: (taskId: number, listId: number) => void;
  updateTask: (taskId: number, updatedTitle: string, due_date: string | null, description: string, completed: boolean, task_associated_users_id: number[]) => void;
  moveTaskWithinList: (draggedTaskId: number, targetTaskId: number, listId: number) => void;
  currentTheme: ThemeSpecs;
  allCurrentBoardUsers: ProfileData[];

}


const Task: React.FC<TaskProps> = ({ task, deleteTask, updateTask, moveTaskWithinList, currentTheme, allCurrentBoardUsers }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [associatedUsers, setAssociatedUsers] = useState<ProfileData[]>([]);


  useEffect(() => {
    console.log(" asociate users ", task.task_associated_users_id);
  }, [task])

  useEffect(() => {
    console.log("associatedUsers", associatedUsers);
  }, [associatedUsers])



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

  const ItemTypes = {
    TASK: 'task',
    REORDER: 'reorder', // New type for reordering
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { id: task.id, listId: task.list },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop({
    accept: ItemTypes.REORDER,
    drop: (draggedTask: { id: number; listId: number }) => {
      if (draggedTask.id !== task.id) {
        moveTaskWithinList(draggedTask.id, task.id, task.list);
      }
    },
  });

  const [{ isDraggingReorder }, dragReorder] = useDrag(() => ({
    type: ItemTypes.REORDER,
    item: { id: task.id, listId: task.list },
    collect: (monitor) => ({
      isDraggingReorder: !!monitor.isDragging(),
    }),
  }));



  // =======================================    delete task functions   ======================================


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

    // Format the date to exclude the year and include hours and minutes
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
    }).format(date);

    // Extract hours and minutes
    const hours = date.getHours().toString().padStart(2, '0'); // Ensure 2-digit format
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${formattedDate}, ${hours}:${minutes}`;
  };


  // =======================================  set custom theme for MUI inputs   ==========================================


  const MUI_Theme = generateCustomTheme(currentTheme);


  return (
    <div
      className={`each_task ${isDragging || isDraggingReorder ? 'dragging' : ''}`}
      ref={(node) => drag(drop(node))}
      style={{ opacity: isDragging || isDraggingReorder ? 0.5 : 1 }}
      data-task-id={task.id} // Add this line

    >
      <div className='task_content_and_icons_container' >
        <div onClick={handleTaskClick} className='conteiner_for_editClick'>
          <p className='task_title'>
            {task.title}   id-{task.id}
          </p>
          {showDialog && (
            <ConfirmationDialog
              message={`Are you sure you want to delete the task "${task.title}"?`}
              onConfirm={confirmDelete}
              onCancel={cancelDelete}
            />
          )}
        </div>

        <>
          <button className='delete_task_button' onClick={handleDelete}>
            <RiDeleteBin2Line className='delete_icon' />
          </button>

          <div ref={dragReorder} className="drag_handle">
            <BiMoveVertical />
          </div>
        </>
      </div>


      <div className='task_description_and_due_date_container' >
        {task.due_date ? (
          <p className='due_Date_p'>Due Date: {formatDate(task.due_date)}</p>
        ) : (
          <p className='due_Date_p'>No due date</p>
        )}

        <div className='associated_users_imgs_container'>
          {associatedUsers.length > 0 ? (
            associatedUsers.map((user) => (
              <img
                key={user.id}
                src={user.profile_picture}
                alt={user.username}
                className='associated_user_image'
                title={user.username} // Tooltip with username
              />
            ))
          ) : (
            <p className='no_associated_users_p' >No associated users</p> // Fallback if no associated users
          )}
        </div>

      </div>


      {showUpdateModal && (
        <ThemeProvider theme={MUI_Theme}>
          <TaskUpdateModal
            task={task}
            updateTask={updateTask}
            onClose={handle_update_modal_close}
            currentTheme={currentTheme}
            allCurrentBoardUsers={allCurrentBoardUsers}
            associatedUsers={associatedUsers} 
          />
        </ThemeProvider>
      )}
    </div>
  );
};

export default Task;