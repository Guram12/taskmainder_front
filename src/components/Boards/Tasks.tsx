import '../../styles/Board Styles/Task.css';
import React, { useEffect, useState } from 'react';
import { tasks } from '../../utils/interface';
import { useDrag, useDrop } from 'react-dnd';
import { RiDeleteBin2Line } from "react-icons/ri";
import ConfirmationDialog from './ConfirmationDialog';
import TaskUpdateModal from './TaskUpdateModal';
import { BiMoveVertical } from "react-icons/bi"; // Import drag icon
import { ThemeSpecs } from '../../utils/theme';

interface TaskProps {
  task: tasks;
  deleteTask: (taskId: number, listId: number) => void;
  updateTask: (taskId: number, updatedTitle: string, due_date: string | null, description: string, completed: boolean) => void;
  moveTaskWithinList: (draggedTaskId: number, targetTaskId: number, listId: number) => void;
  currentTheme : ThemeSpecs;
}


const Task: React.FC<TaskProps> = ({ task, deleteTask, updateTask, moveTaskWithinList, currentTheme }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

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

  useEffect(() => {
    console.log('task due dates :', `${task.id} - ${task.due_date}`);
  }, [task]);

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

      {task.due_date ? (
        <p className='due_Date_p'>Due Date: {formatDate(task.due_date)}</p>
      ) : (
        <p className='due_Date_p'>No due date</p>
      )}

      {showUpdateModal && (
        <TaskUpdateModal
          task={task}
          onUpdate={updateTask}
          onClose={handle_update_modal_close}
          currentTheme={currentTheme}
        />
      )}
    </div>
  );
};

export default Task;