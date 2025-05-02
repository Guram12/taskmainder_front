import '../../styles/Board Styles/Task.css';
import React, { useState } from 'react';
import { tasks } from '../../utils/interface';
import { useDrag } from 'react-dnd';
import { RiDeleteBin2Line } from "react-icons/ri";
import ConfirmationDialog from './ConfirmationDialog';
import TaskUpdateModal from './TaskUpdateModal';


interface TaskProps {
  task: tasks;
  deleteTask: (taskId: number, listId: number) => void;
  updateTask: (taskId: number, updatedTitle: string, due_date: string, description: string, completed: boolean) => void;

}

const Task: React.FC<TaskProps> = ({ task, deleteTask, updateTask }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const ItemTypes = {
    TASK: 'task',
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { id: task.id, listId: task.list },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
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
    <div className='each_task' ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }} >
      <div onClick={handleTaskClick}>
        {task.title}
        <button className='delete_task_button' onClick={handleDelete}><RiDeleteBin2Line className='delete_icon' /></button>
        {showDialog && (
          <ConfirmationDialog
            message={`Are you sure you want to delete the task "${task.title}"?`}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
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