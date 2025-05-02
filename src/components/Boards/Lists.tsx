import '../../styles/Board Styles/List.css';
import React, { useState } from "react";
import { useDrop } from 'react-dnd';
import Task from "./Tasks";
import { lists } from "../../utils/interface";




interface ListProps {
  list: lists;
  moveTask: (taskId: number, sourceListId: number, targetListId: number) => void;
  addTask: (listId: number, taskTitle: string) => void;
  deleteTask: (taskId: number, listId: number) => void;
  updateTask: (taskId: number, updatedTitle: string, due_date: string, description: string, completed: boolean) => void;
}

const List: React.FC<ListProps> = ({ list, moveTask, addTask, deleteTask, updateTask }) => {

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
      <h3 className='list-title' >{list.name}</h3>
      {list.tasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          deleteTask={deleteTask}
          updateTask={updateTask}
        />
      ))}

      {!isAddingTask ? (
        <button onClick={() => setIsAddingTask(true)}>Add Task</button>
      ) : (
        <div className='each_task' >
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