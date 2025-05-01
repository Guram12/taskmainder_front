import React, { useState } from "react";
import { useDrag, useDrop } from 'react-dnd';
import Task from "./Tasks";
import { lists } from "../../utils/interface";




const List: React.FC<{
  list: lists,
  moveTask: (taskId: number, sourceListId: number, targetListId: number) => void,
  addTask: (listId: number, taskTitle: string) => void
}> = ({ list, moveTask, addTask }) => {

  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);

  const ItemTypes = {
    TASK: 'task',
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item: { id: number, listId: number }) => {
      if (item.listId !== list.id) {
        moveTask(item.id, item.listId, list.id);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(list.id, newTaskTitle);
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  return (
    <div ref={drop} className={`list ${isOver ? 'hover' : ''}`}>
      <h3>{list.name}</h3>
      {list.tasks.map((task) => (
        <Task key={task.id} task={task} />
      ))}
      {!isAddingTask ? (
        <button onClick={() => setIsAddingTask(true)}>Add Task</button>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Task Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <button onClick={handleAddTask}>Add</button>
          <button onClick={() => setIsAddingTask(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default List;