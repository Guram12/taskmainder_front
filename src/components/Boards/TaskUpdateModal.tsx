import '../../styles/Board Styles/TaskUpdateModal.css';
import React, { useState } from 'react';
import { tasks } from '../../utils/interface';
import { ThemeSpecs } from '../../utils/theme';



interface TaskUpdateModalProps {
  task: tasks;
  onClose: () => void;
  onUpdate: (taskId: number, updatedTitle: string, due_date: string | null, description: string, completed: boolean) => void;
  currentTheme: ThemeSpecs;
}
const TaskUpdateModal: React.FC<TaskUpdateModalProps> = ({ task, onClose, onUpdate, currentTheme }) => {
  const [updatedTitle, setUpdatedTitle] = useState<string>(task.title);
  const [updatedDescription, setUpdatedDescription] = useState<string>(task.description || '');
  const [updatedDueDate, setUpdatedDueDate] = useState<string>(task.due_date ? task.due_date.split('T')[0] : ''); // Extract date
  const [updatedDueTime, setUpdatedDueTime] = useState<string>(task.due_date ? task.due_date.split('T')[1]?.slice(0, 5) : ''); // Extract time
  const [updatedCompletedStatus, setUpdatedCompletedStatus] = useState<boolean>(task.completed);




  const handleUpdate = () => {
    if (updatedTitle.trim()) {
      const combinedDueDateTime = updatedDueDate && updatedDueTime
        ? new Date(`${updatedDueDate}T${updatedDueTime}`).toISOString() // Convert to ISO string in local timezone
        : updatedDueDate ? `${updatedDueDate}T00:00:00Z` : null; // Send null if due date is cleared
      onUpdate(task.id, updatedTitle, combinedDueDateTime, updatedDescription, updatedCompletedStatus);
      onClose();
    }
  };

  const handleClearDueDate = () => {
    setUpdatedDueDate('');
    setUpdatedDueTime('');
  };

  const handleCancel = () => {
    onClose();
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
          <label>
            Due Date:
            <input
              type="date"
              value={updatedDueDate}
              onChange={(e) => setUpdatedDueDate(e.target.value)}
            />
          </label>
          <label>
            Due Time:
            <input
              type="time"
              value={updatedDueTime}
              onChange={(e) => setUpdatedDueTime(e.target.value)}
            />
          </label>
        </div>
        <div className="modal-actions">
          <button onClick={handleClearDueDate} style={{ backgroundColor: 'red', color: 'white' }}>
            Clear Due Date
          </button>
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