import '../../styles/Board Styles/List.css';
import React, { useState, useEffect, useRef } from "react";
import Task from "./Tasks";
import { lists } from "../../utils/interface";
import { MdModeEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { ThemeSpecs } from '../../utils/theme';
import { GrFormCheckmark } from "react-icons/gr";
import { HiOutlineXMark } from "react-icons/hi2";
import ConfirmationDialog from './ConfirmationDialog';
import { ProfileData } from '../../utils/interface';
import SkeletonEachTask from './SkeletonEachTask';
import { board } from '../../utils/interface';
import { useDroppable } from '@dnd-kit/core';
import { UniqueIdentifier } from '@dnd-kit/core';
import Sortable from 'sortablejs';


interface ListProps {
  currentTheme: ThemeSpecs;
  list: lists;
  moveTask: (taskId: number, sourceListId: number, targetListId: number) => void;
  addTask: (listId: number, taskTitle: string) => void;
  deleteTask: (taskId: number, listId: number) => void;
  updateTask: (taskId: number, updatedTitle: string, due_date: string | null, description: string, completed: boolean, task_associated_users_id: number[], priority: 'green' | 'orange' | 'red' | null,) => void;
  socketRef: React.RefObject<WebSocket>;
  deleteList: (listId: number) => void;
  updateListName: (listId: number, newName: string) => void;
  allCurrentBoardUsers: ProfileData[];
  isLoading: boolean;
  setBoardData: (boardData: board) => void;
  boardData: board;
  dndListId: UniqueIdentifier;
}

const List: React.FC<ListProps> = ({
  list,
  // moveTask,
  addTask,
  deleteTask,
  updateTask,
  // socketRef,
  currentTheme,
  deleteList,
  updateListName,
  allCurrentBoardUsers,
  isLoading,
  // setBoardData,
  // boardData,
  dndListId,
}) => {

  const [isListEditing, setIsListEditing] = useState<boolean>(false);
  const [newListName, setNewListName] = useState<string>(list.name);
  const [isListDeleting, setIsListDeleting] = useState<boolean>(false);

  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);

  const tasksContainerRef = useRef<HTMLDivElement | null>(null);
  const reorderTimeoutRef = useRef<NodeJS.Timeout | null>(null); // debounce ref


  // =========================================u=====  drag and drop ==========================================

  // DND-KIT: Make this list a droppable area
  const { setNodeRef, isOver: isOverDnd } = useDroppable({
    id: dndListId, // This should be a number (list.id)
  });


  // --- SortableJS for reordering tasks within the list ---
  useEffect(() => {
    if (!tasksContainerRef.current) return;
    const sortable = Sortable.create(tasksContainerRef.current, {
      animation: 150,
      handle: '.reorder_icon', // Only allow drag with reorder icon
      draggable: '.sortable-task', // Only these elements are draggable
      onEnd: (evt) => {
        if (
          evt.oldIndex === undefined ||
          evt.newIndex === undefined ||
          evt.oldIndex === evt.newIndex
        )
          return;

        // Debounce: clear previous timeout if exists
        if (reorderTimeoutRef.current) {
          clearTimeout(reorderTimeoutRef.current);
        }

        // Use a short timeout to batch rapid onEnd calls
        reorderTimeoutRef.current = setTimeout(() => {
          const updatedTasks = [...list.tasks];
          const [removed] = updatedTasks.splice(evt.oldIndex!, 1);
          updatedTasks.splice(evt.newIndex!, 0, removed);

          if (typeof window !== "undefined" && window.dispatchEvent) {
            window.dispatchEvent(
              new CustomEvent('reorder-tasks', {
                detail: { listId: list.id, taskOrder: updatedTasks.map(t => t.id) }
              })
            );
          }
        }, 50); // 50ms debounce
      },
    });
    return () => {
      sortable.destroy();
      if (reorderTimeoutRef.current) {
        clearTimeout(reorderTimeoutRef.current);
      }
    };
  }, [list.tasks]);

  // ==========================================  add task inside list ==========================================
  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(list.id, newTaskTitle);
      setNewTaskTitle('');
      setIsAddingTask(false);
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
    <div
      className={`list ${isOverDnd ? 'hover' : ''}`}
      ref={setNodeRef}
      style={{
        backgroundColor: isOverDnd
          ? `green`
          : `${currentTheme['--list-background-color']}`,
        transition: 'background-color 0.3s ease',
      }}
    >

      {/* <SkeletonEachTask currentTheme={currentTheme} /> */}
      <div className='list_title_and_buttons'  >
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
      <div ref={tasksContainerRef}>
        {list.tasks.map((task) => (
          <div key={task.id} className="sortable-task">
            <Task
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
              // DND-KIT: Pass listId for draggable
              dndListId={list.id}
              moveTaskWithinList={() => {}} // Not implemented for now
              currentTheme={currentTheme}
              allCurrentBoardUsers={allCurrentBoardUsers}
            />
          </div>
        ))}
      </div>

      <div className='add_task_cont'>
        {isLoading && <SkeletonEachTask currentTheme={currentTheme} />}
        {!isAddingTask ? (
          <>
            {!isLoading && <button onClick={() => setIsAddingTask(true)}>Add Task</button>}
          </>
        ) : (
          <div className='each_task'>
            <input
              type="text"
              placeholder="Task Title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              disabled={isLoading} // Disable input while loading
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