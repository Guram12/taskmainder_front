import '../../styles/Board Styles/TaskUpdateModal.css';
import React, {  useState } from 'react';
import { tasks } from '../../utils/interface';


interface TaskUpdateModalProps {
  task: tasks;
  onClose: () => void;
  onUpdate: (taskId: number, updatedTitle: string, due_date: string, description: string, completed: boolean) => void;
}



const TaskUpdateModal: React.FC<TaskUpdateModalProps> = ({ task, onClose, onUpdate }) => {
  const [updatedTitle, setUpdatedTitle] = useState<string>(task.title);
  const [updatedDescription, setUpdatedDescription] = useState<string>(task.description || '');
  const [updatedDueDate, setUpdatedDueDate] = useState<string>(task.due_date || '');

  const [updatedComplitedStatus, setUpdatedComplitedStatus] = useState<boolean>(task.completed);




  // useEffect(() => {
  //   console.log("selected tasktask", task);
  // }, [task]);

const handleUpdate = () => {
  if (updatedTitle.trim()) {
    onUpdate(
      task.id,
      updatedTitle,
      updatedDueDate, // Send null if due_date is empty
      updatedDescription,
      updatedComplitedStatus
    );
    onClose(); // Ensure this is called
  }
};

  const handleCancel = () => {
    onClose(); // Ensure this is called
  };

  return (
    <div className="task-update-modal">
      <div className="modal-content">
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
            checked={updatedComplitedStatus}
            onChange={(e) => setUpdatedComplitedStatus(e.target.checked)}
          />
        </label>
        <input
          type="date"
          value={updatedDueDate}
          onChange={(e) => setUpdatedDueDate(e.target.value)}
          placeholder="Due Date"
        />

        <div className="modal-actions">
          <button onClick={handleUpdate}>Update</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
export default TaskUpdateModal;