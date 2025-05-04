import '../../styles/Board Styles/List.css';
import React, { useEffect, useState } from "react";
import { useDrop } from 'react-dnd';
import Task from "./Tasks";
import { lists } from "../../utils/interface";




interface ListProps {
  list: lists;
  moveTask: (taskId: number, sourceListId: number, targetListId: number) => void;
  addTask: (listId: number, taskTitle: string) => void;
  deleteTask: (taskId: number, listId: number) => void;
  updateTask: (taskId: number, updatedTitle: string, due_date: string, description: string, completed: boolean) => void;
  socketRef: React.RefObject<WebSocket>;
}

const List: React.FC<ListProps> = ({ list, moveTask, addTask, deleteTask, updateTask, socketRef }) => {

  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);

  const ItemTypes = {
    TASK: 'task',
  };

// ---------------------------------test --------------------------------
useEffect(() => {
  console.log(  'List component mounted');
  const handleSocketMessage = (event: MessageEvent) => {  
    const data = JSON.parse(event.data);
    if (data.action === 'reorder_task' && data.payload.list_id === list.id) {
      const updatedTasks = data.payload.task_order.map((taskId: number) =>
        list.tasks.find((task) => task.id === taskId)
      );
      list.tasks = updatedTasks.filter(Boolean);
    }
  }
  if (socketRef.current) {
    socketRef.current.addEventListener('message', handleSocketMessage);
  }
  return () => {
    if (socketRef.current) {
      socketRef.current.removeEventListener('message', handleSocketMessage);
    }
  }
}, [list.id, list.tasks, socketRef]);
  useEffect(() => {
    const handleSocketMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.action === 'reorder_task' && data.payload.list_id === list.id) {
        const updatedTasks = data.payload.task_order.map((taskId: number) =>
          list.tasks.find((task) => task.id === taskId)
        );
        list.tasks = updatedTasks.filter(Boolean);
      }
    };

    if (socketRef.current) {
      socketRef.current.addEventListener('message', handleSocketMessage);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.removeEventListener('message', handleSocketMessage);
      }
    };
}, []);
// ---------------------------------test --------------------------------

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


  const moveTaskWithinList = (draggedTaskId: number, targetTaskId: number, listId: number) => {
    const draggedTaskIndex = list.tasks.findIndex((task) => task.id === draggedTaskId);
    const targetTaskIndex = list.tasks.findIndex((task) => task.id === targetTaskId);

    if (draggedTaskIndex !== -1 && targetTaskIndex !== -1) {
      const updatedTasks = [...list.tasks];
      const [draggedTask] = updatedTasks.splice(draggedTaskIndex, 1);
      updatedTasks.splice(targetTaskIndex, 0, draggedTask);

      // Update the task order in the backend
      const taskOrder = updatedTasks.map((task) => task.id);
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            action: 'reorder_task',
            payload: { list_id: listId, task_order: taskOrder },
          })
        );
      }
    }
  };


  return (
    <div ref={drop} className={`list ${isOver ? 'hover' : ''}`}>
      <h3 className='list-title' >{list.name}</h3>
      {/* map and also sort  */}
      
      {list.tasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          deleteTask={deleteTask}
          updateTask={updateTask}
          moveTaskWithinList={moveTaskWithinList}
        />
      ))}

      {!isAddingTask ? (
        <button onClick={() => setIsAddingTask(true)}>Add Task</button>
      ) : (
        <div className='each_task'>
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