import '../../styles/Board Styles/Task.css';
import React, { useState } from 'react';
import { tasks } from '../../utils/interface';
import { useDrag ,useDrop } from 'react-dnd';
import { RiDeleteBin2Line } from "react-icons/ri";
import ConfirmationDialog from './ConfirmationDialog';
import TaskUpdateModal from './TaskUpdateModal';
import { BiMoveVertical } from "react-icons/bi"; // Import drag icon


interface TaskProps {
  task: tasks;
  deleteTask: (taskId: number, listId: number) => void;
  updateTask: (taskId: number, updatedTitle: string, due_date: string, description: string, completed: boolean) => void;
  moveTaskWithinList: (draggedTaskId: number, targetTaskId: number, listId: number) => void;
}

const Task: React.FC<TaskProps> = ({ task, deleteTask, updateTask , moveTaskWithinList}) => {
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
    hover: (draggedTask: { id: number; listId: number }) => {
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


  return (
    <div
      className={`each_task ${isDragging || isDraggingReorder ? 'dragging' : ''}`}
      ref={(node) => drag(drop(node))}
      style={{ opacity: isDragging || isDraggingReorder ? 0.5 : 1 }}
    >
      <div onClick={handleTaskClick} className='conteiner_for_editClick'>
        {task.title}
        {showDialog && (
          <ConfirmationDialog
            message={`Are you sure you want to delete the task "${task.title}"?`}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
      </div>
      <button className='delete_task_button' onClick={handleDelete}>
        <RiDeleteBin2Line className='delete_icon' />
      </button>
      <div ref={dragReorder} className="drag_handle">
        <BiMoveVertical />
      </div>
      {showUpdateModal && (
        <TaskUpdateModal
          task={task}
          onUpdate={updateTask}
          onClose={handle_update_modal_close}
        />
      )}
    </div>
  );
};

export default Task;