import '../../styles/Board Styles/Task.css';
import React, { useState } from 'react';
import { tasks } from '../../utils/interface';
import { useDrag } from 'react-dnd';
import { RiDeleteBin2Line } from "react-icons/ri";
import ConfirmationDialog from './ConfirmationDialog';



interface TaskProps {
  task: tasks;
  deleteTask: (taskId: number, listId: number) => void;
}

const Task: React.FC<TaskProps> = ({ task, deleteTask }) => {
  const [showDialog, setShowDialog] = useState(false);

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

  return (
    <div className='each_task' ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {task.title}
      <button className='delete_task_button' onClick={handleDelete}><RiDeleteBin2Line  className='delete_icon'/></button>
      {showDialog && (
        <ConfirmationDialog
          message={`Are you sure you want to delete the task "${task.title}"?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default Task;