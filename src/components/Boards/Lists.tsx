import '../../styles/Board Styles/List.css';
import React, { useState } from "react";
import { useDrop } from 'react-dnd';
import Task from "./Tasks";
import { lists } from "../../utils/interface";
import { MdModeEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { ThemeSpecs } from '../../utils/theme';


interface ListProps {
  currentTheme: ThemeSpecs;
  list: lists;
  moveTask: (taskId: number, sourceListId: number, targetListId: number) => void;
  addTask: (listId: number, taskTitle: string) => void;
  deleteTask: (taskId: number, listId: number) => void;
  updateTask: (taskId: number, updatedTitle: string, due_date: string, description: string, completed: boolean) => void;
  socketRef: React.RefObject<WebSocket>;
}

const List: React.FC<ListProps> = ({ list, moveTask, addTask, deleteTask, updateTask, socketRef, currentTheme }) => {

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
    <div ref={drop} className={`list ${isOver ? 'hover' : ''}`}  style={{ backgroundColor: `${currentTheme['--list-background-color']}` }} >

      <div className='list_title_and_buttons' style={{ backgroundColor: `${currentTheme['--list-background-color']}` }} >
        <h3 className='list_title' style={{ color: currentTheme['--main-text-coloure'] }} >{list.name}</h3>
        <div className='list_buttons' style={{ color: currentTheme['--main-text-coloure'] }} >
          <MdModeEdit className='edit_list_icon' />
          <MdDeleteForever className='delete_list_icon' />
        </div>
      </div>
      <div className='margin_element' ></div>
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