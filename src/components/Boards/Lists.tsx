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
import type { SortableEvent } from 'sortablejs';
import Skeleton from 'react-loading-skeleton';
import { HiXMark } from "react-icons/hi2";
import { useTranslation } from 'react-i18next';
import { BiMoveHorizontal } from "react-icons/bi";






interface ListProps {
  currentTheme: ThemeSpecs;
  list: lists;
  moveTask: (taskId: number, sourceListId: number, targetListId: number) => void;
  addTask: (listId: number, taskTitle: string) => void;
  deleteTask: (taskId: number, listId: number) => void;
  updateTask: (taskId: number, updatedTitle: string, due_date: string | null, description: string, completed: boolean, task_associated_users_id: number[], priority: 'green' | 'orange' | 'red' | null,) => void;
  setUpdatingListNameId: (updatingListNameId: number | null) => void;
  updatingListNameId: number | null;
  socketRef: React.RefObject<WebSocket>;
  deleteList: (listId: number) => void;
  updateListName: (listId: number, newName: string) => void;
  allCurrentBoardUsers: ProfileData[];
  isLoading: boolean;
  setBoardData: (boardData: board) => void;
  boardData: board;
  dndListId: UniqueIdentifier;
  setUpdatingTaskId: (updatingTaskId: number | null) => void;
  updatingTaskId: number | null;
  setCompletingTaskId: (completingTaskId: number | null) => void;
  completingTaskId: number | null;
  setAdding_new_task_loader: (adding_new_task_loader: { listId: number | null }) => void;
  adding_new_task_loader: { listId: number | null };
}

const List: React.FC<ListProps> = ({
  list,
  addTask,
  deleteTask,
  updateTask,
  currentTheme,
  deleteList,
  updateListName,
  allCurrentBoardUsers,
  isLoading,
  dndListId,
  setUpdatingListNameId,
  updatingListNameId,
  setUpdatingTaskId,
  updatingTaskId,
  setCompletingTaskId,
  completingTaskId,
  setAdding_new_task_loader,
  adding_new_task_loader,
}) => {

  const [isListEditing, setIsListEditing] = useState<boolean>(false);
  const [newListName, setNewListName] = useState<string>(list.name);
  const [isListDeleting, setIsListDeleting] = useState<boolean>(false);

  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);

  const tasksContainerRef = useRef<HTMLDivElement | null>(null);
  const reorderTimeoutRef = useRef<NodeJS.Timeout | null>(null); // debounce ref

  const { t } = useTranslation();
  // ==============================================  drag and drop ==========================================

  // DND-KIT: Make this list a droppable area
  const { setNodeRef, isOver: isOverDnd } = useDroppable({
    id: dndListId, // This should be a number (list.id)
  });


  //================================   SortableJS for reordering tasks within the list   ================================  
  useEffect(() => {
    if (!tasksContainerRef.current) return;
    const sortable = Sortable.create(tasksContainerRef.current, {
      animation: 150,
      handle: '.reorder_icon', // Only allow drag with reorder icon
      draggable: '.sortable-task', // Only these elements are draggable
      onEnd: (evt: SortableEvent) => {
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
      setAdding_new_task_loader({ listId: list.id });
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
    if (newListName.trim().length > 21) {
      setlistInputNameErrorMessage('List name cannot exceed 21 characters.');
      return;
    }
    // if user push enter key than update the list name
    setUpdatingListNameId(list.id);
    setlistInputNameErrorMessage(''); // Clear the error message if validation passes
    updateListName(list.id, newListName);
    setIsListEditing(false);
  };


  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleUpdateListName();
    }
  }

  const handleSaveListNameIconClick = () => {
    handleUpdateListName();
  };

  return (
    <div
      className={`list ${isOverDnd ? 'hover' : ''}`}
      ref={setNodeRef}
      style={{
        backgroundColor: isOverDnd
          ? `seagreen`
          : `${currentTheme['--list-background-color']}`,
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* <SkeletonEachTask currentTheme={currentTheme} /> */}
      <div className='list_title_and_buttons'
        style={{
          backgroundColor: currentTheme['--list-background-color'],
          color: currentTheme['--main-text-coloure'],
          borderBottomLeftRadius: isOverDnd ? '15px' : '0',
          borderBottomRightRadius: isOverDnd ? '15px' : '0',
        }}
      >
        {isListEditing ? (
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            style={{
              borderColor: listInputNameErrorMessage ? 'red' : currentTheme['--border-color'],
              outline: listInputNameErrorMessage ? 'none' : '',
              backgroundColor: currentTheme['--task-background-color'],
              ['--placeholder-color']: currentTheme['--due-date-color'] || '#888',
            } as React.CSSProperties}
            onKeyDown={handleKeyDown}
            placeholder={t('list_name')}
            className='list_name_input'
            maxLength={21}

          />
        ) : (
          <>
            {updatingListNameId === list.id ?
              (
                <Skeleton
                  width="100px"
                  height="20px"
                  highlightColor={currentTheme['--main-text-coloure']}
                  baseColor={currentTheme['--list-background-color']}
                />
              ) : (
                <h3
                  className='list_title'
                  style={{ color: currentTheme['--main-text-coloure'] }}
                  onClick={() => setIsListEditing(true)}
                >
                  {list.name}
                </h3>
              )}
          </>
        )}
        <div className='list_buttons' style={{ color: currentTheme['--main-text-coloure'] }} >
          {isListEditing ? (
            <>
              <GrFormCheckmark className='edit_list_icon' onClick={() => handleSaveListNameIconClick()} />
              <HiOutlineXMark className='delete_list_icon' onClick={() => { setIsListEditing(false); setNewListName(list.name) }} />
            </>
          ) :
            <>
              <MdModeEdit className='edit_list_icon' onClick={() => setIsListEditing(true)} />
              <MdDeleteForever className='delete_list_icon' onClick={() => handle_delete_list_click()} />
            </>
          }
          <BiMoveHorizontal className='list_reorder_icon'
            style={{
              color: currentTheme['--main-text-coloure'],
              cursor: 'w-resize',
              transition: 'color 0.3s ease',
            }}
          />
        </div>
        {isListDeleting && (
          <ConfirmationDialog
            message={`${t('are_you_sure_you_want_to_delete_the_list')} "${list.name}"?`}
            onConfirm={confirmDelete}
            onCancel={cancelListDelete}
            currentTheme={currentTheme}
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
              dndListId={list.id}
              currentTheme={currentTheme}
              allCurrentBoardUsers={allCurrentBoardUsers}
              setUpdatingTaskId={setUpdatingTaskId}
              updatingTaskId={updatingTaskId}
              setCompletingTaskId={setCompletingTaskId}
              completingTaskId={completingTaskId}
            />
          </div>
        ))}
      </div>

      <div className='add_task_cont'>
        {adding_new_task_loader.listId === list.id && <SkeletonEachTask currentTheme={currentTheme} />}


        {!isAddingTask ? (
          <>
            {!isLoading && <button
              className='add_new_task_button'
              onClick={() => setIsAddingTask(true)}
              style={{
                background: currentTheme['--task-background-color'],
                color: currentTheme['--main-text-coloure'],
              }}
            >
              {t('add_task')}
            </button>
            }
          </>
        ) : (
          <div className='newtask_adding_buttons'>
            <input
              type="text"
              placeholder={t('task_title')}
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              disabled={isLoading}
              className='new_task_input'
              style={{
                background: currentTheme['--task-background-color'],
                color: currentTheme['--main-text-coloure'],
                borderColor: currentTheme['--border-color'],
                ['--placeholder-color' as any]: currentTheme['--due-date-color'] || '#888',
              } as React.CSSProperties}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTask();
              }}

            />

            <div
              className='add_task_button_2'
              onClick={handleAddTask}
              style={{
                background: currentTheme['--task-background-color'],
                color: currentTheme['--main-text-coloure'],
              }}
            >
              <GrFormCheckmark className='add_task_button_2_icon' />
            </div>

            <div
              className='cancel_task_button'
              onClick={() => {
                setIsAddingTask(false);
                setNewTaskTitle('');
              }}
              style={{
                background: currentTheme['--task-background-color'],
                color: currentTheme['--main-text-coloure'],
              }}
            >
              <HiXMark className='cancel_task_button_icon' />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(List);
