import '../../styles/Board Styles/List.css';
import React, { useState } from "react";
import { useDrop } from 'react-dnd';
import Task from "./Tasks";
import { lists } from "../../utils/interface";
import { MdModeEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { ThemeSpecs } from '../../utils/theme';
import { GrFormCheckmark } from "react-icons/gr";
import { HiOutlineXMark } from "react-icons/hi2";
import ConfirmationDialog from './ConfirmationDialog';
import { ProfileData } from '../../utils/interface';



interface ListProps {
  currentTheme: ThemeSpecs;
  list: lists;
  moveTask: (taskId: number, sourceListId: number, targetListId: number) => void;
  addTask: (listId: number, taskTitle: string) => void;
  deleteTask: (taskId: number, listId: number) => void;
  updateTask: (taskId: number, updatedTitle: string, due_date: string | null, description: string, completed: boolean, task_associated_users_id: number[]) => void;
  socketRef: React.RefObject<WebSocket>;
  deleteList: (listId: number) => void;
  updateListName: (listId: number, newName: string) => void;
  allCurrentBoardUsers: ProfileData[];
}

const List: React.FC<ListProps> = ({ list, moveTask, addTask, deleteTask, updateTask, socketRef, currentTheme, deleteList, updateListName, allCurrentBoardUsers }) => {

  const [isListEditing, setIsListEditing] = useState<boolean>(false);
  const [newListName, setNewListName] = useState<string>(list.name);
  const [isListDeleting, setIsListDeleting] = useState<boolean>(false);

  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);




  // =========================================u=====  drag and drop ==========================================
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

  // ==========================================  move task inside list ==========================================

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



  // ================================================ delete list ==========================================
  const handle_delete_list_click = () => {
    setIsListDeleting(true);
  }

  const confirmDelete = () => {
    deleteList(list.id);
    setIsListDeleting(false);
  };

  const cancelListDelete = () => {
    setIsListDeleting(false);
  };

  // ================================================ update list  name ==========================================

  const [listInputNameErrorMessage, setlistInputNameErrorMessage] = useState<string>(''); // State for error message

  const handleUpdateListName = () => {
    if (newListName.trim().length < 2) {
      setlistInputNameErrorMessage('List name must be at least 3 characters long.');
      return;
    }
    // if user push enter key than update the list name

    setlistInputNameErrorMessage(''); // Clear the error message if validation passes
    updateListName(list.id, newListName);
    setIsListEditing(false);
  };


  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleUpdateListName();
    }
  }


  return (
    <div ref={drop} className={`list ${isOver ? 'hover' : ''}`} style={{ backgroundColor: `${currentTheme['--list-background-color']}` }} >

      <div className='list_title_and_buttons' style={{ backgroundColor: `${currentTheme['--list-background-color']}` }} >
        {isListEditing ? (
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            style={{
              border: listInputNameErrorMessage ? '1px solid red' : '1px solid #ccc',
              outline: listInputNameErrorMessage ? 'none' : '',
            }}
            onKeyDown={handleKeyDown}
            placeholder="List Name"
          />
        ) : (
          <h3 className='list_title' style={{ color: currentTheme['--main-text-coloure'] }} onClick={() => setIsListEditing(true)} >{list.name}</h3>
        )}
        <div className='list_buttons' style={{ color: currentTheme['--main-text-coloure'] }} >
          {isListEditing ? (
            <>
              <GrFormCheckmark className='edit_list_icon' onClick={() => handleUpdateListName()} />
              <HiOutlineXMark className='delete_list_icon' onClick={() => setIsListEditing(false)} />
            </>
          ) :
            <>
              <MdModeEdit className='edit_list_icon' onClick={() => setIsListEditing(true)} />
              <MdDeleteForever className='delete_list_icon' onClick={() => handle_delete_list_click()} />
            </>
          }
        </div>
        {isListDeleting && (
          <ConfirmationDialog
            message={`Are you sure you want to delete the task "${list.name}"?`}
            onConfirm={confirmDelete}
            onCancel={cancelListDelete}
          />
        )}
      </div>
      <div className='margin_element' ></div>
      {list.tasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          deleteTask={deleteTask}
          updateTask={updateTask}
          moveTaskWithinList={moveTaskWithinList}
          currentTheme={currentTheme}
          allCurrentBoardUsers={allCurrentBoardUsers}
        />
      ))}

      <div className='add_task_cont' >
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
    </div>
  );
};

export default List;