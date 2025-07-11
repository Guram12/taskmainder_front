import '../../styles/Board Styles/Boards.css';
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ThemeSpecs } from '../../utils/theme';
import Members from '../Members';
import List from './Lists';
import { board } from '../../utils/interface';
import { ProfileData } from '../../utils/interface';
import { Board_Users } from '../../utils/interface';
import SkeletonLoader from './SkeletonLoader';
import SkeletonMember from './SkeletonMember';
import NoBoards from '../NoBoards';
import SkeletonListLoader from './SkeletonListLoader';
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import Task from './Tasks';
import { useTranslation } from 'react-i18next';
import { GrFormCheckmark } from "react-icons/gr";
import { HiXMark } from "react-icons/hi2";
import Sortable from 'sortablejs';
import type { SortableEvent } from 'sortablejs';



export interface BoardsProps {
  selectedBoard: board | null;
  currentTheme: ThemeSpecs;
  setSelectedBoard: (board: board | null) => void;
  current_user_email: string;
  profileData: ProfileData;
  setBoards: (boards: board[]) => void;
  boards: board[];
  setCurrent_board_users: (users: Board_Users[]) => void;
  current_board_users: Board_Users[];
  is_cur_Board_users_fetched: boolean;
  fetch_current_board_users: () => Promise<void>;
  isBoardsLoaded: boolean;
  setIsLoading: (isLoading: boolean) => void;
  is_members_refreshing: boolean;
  isMobile: boolean;

  socketRef: React.MutableRefObject<WebSocket | null>;
  listsContainerRef: React.RefObject<HTMLDivElement>;
  boardData: board;
  setBoardData: (boardData: board) => void;
  loadingLists: { [listId: number]: boolean };
  setLoadingLists: (loadingLists: { [listId: number]: boolean }) => void;
  isAddingList: boolean;
  setIsAddingList: (isAddingList: boolean) => void;
  updatingListNameId: number | null;
  setUpdatingListNameId: (id: number | null) => void;
  setUpdatingTaskId: (id: number | null) => void;
  updatingTaskId: number | null;
  setCompletingTaskId: (id: number | null) => void;
  completingTaskId: number | null;
  setAdding_new_list: (Adding_new_list: boolean) => void;
  Adding_new_list: boolean;
  setListName: (ListName: string) => void;
  ListName: string;
  setAllCurrentBoardUsers: (allCurrentBoardUsers: ProfileData[]) => void;
  allCurrentBoardUsers: ProfileData[];
  setAdding_new_task_loader: (adding_new_task_loader: { listId: number | null }) => void;
  adding_new_task_loader: { listId: number | null };
  setSelectedComponent: (component: string) => void;
}

const Boards: React.FC<BoardsProps> = ({
  selectedBoard,
  setSelectedBoard,
  current_user_email,
  currentTheme, profileData,
  setBoards,
  boards,
  setCurrent_board_users,
  is_cur_Board_users_fetched,
  current_board_users,
  fetch_current_board_users,
  isBoardsLoaded,
  setIsLoading,
  is_members_refreshing,
  isMobile,

  socketRef,
  listsContainerRef,
  boardData,
  setBoardData,
  loadingLists,
  setLoadingLists,
  isAddingList,
  setIsAddingList,
  updatingListNameId,
  setUpdatingListNameId,
  setUpdatingTaskId,
  updatingTaskId,
  setCompletingTaskId,
  completingTaskId,
  Adding_new_list,
  setAdding_new_list,
  setListName,
  ListName,
  allCurrentBoardUsers,
  setAllCurrentBoardUsers,
  setAdding_new_task_loader,
  adding_new_task_loader,
  setSelectedComponent,
}) => {




  const scrollRef = useRef<{ direction: 'left' | 'right' | null, speed: number }>({ direction: null, speed: 2 }); // Reduced speed
  const isManualScrollRef = useRef(false);

  const [activeTask, setActiveTask] = useState<null | { task: any; listId: number }>(null);
  const [reordering, setReordering] = useState(false); // Add this state


  const { t } = useTranslation();

  useEffect(() => {
    if (selectedBoard?.board_users) {
      const selectedBoardUsers: ProfileData[] = selectedBoard.board_users.map((user) => ({
        id: user.id,
        email: user.email,
        phone_number: '',
        profile_picture: user.profile_picture || null,
        username: user.username,
        timezone: '',
        user_status: user.user_status,
        is_social_account: false,
      }));
      setAllCurrentBoardUsers(selectedBoardUsers);
    } else {
      setAllCurrentBoardUsers([]);
    }
  }, [selectedBoard]);

  // =========================================   usefect for getting actions for websocket  =========================================


  useEffect(() => {
    if (!selectedBoard) return;
    setBoardData(selectedBoard);
  }, [selectedBoard]);


  // ==================================================== list reordering =========================================================
  const listReorderTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Add this

  useEffect(() => {
    if (!listsContainerRef.current) return;

    const sortable = Sortable.create(listsContainerRef.current, {
      animation: 150,
      handle: '.list_reorder_icon',
      draggable: '.list',
      direction: 'horizontal',
      scroll: true,
      ghostClass: 'sortable-ghost',
      filter: '.add_new_list_big_container',
      onEnd: (evt: SortableEvent) => {
        if (
          evt.oldIndex === undefined ||
          evt.newIndex === undefined ||
          evt.oldIndex === evt.newIndex
        )
          return;

        if (listReorderTimeoutRef.current) {
          clearTimeout(listReorderTimeoutRef.current);
        }

        listReorderTimeoutRef.current = setTimeout(() => {
          const updatedLists = [...boardData.lists];
          const [removed] = updatedLists.splice(evt.oldIndex!, 1);
          updatedLists.splice(evt.newIndex!, 0, removed);

          // Update order values based on new positions
          const reorderedLists = updatedLists.map((list, index) => ({
            ...list,
            order: index + 1
          }));




          // Create the updated board data object
          const updatedBoardData: board = {
            ...boardData,
            lists: reorderedLists
          };

          setBoardData(updatedBoardData);

          // Send updated order to backend
          if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(
              JSON.stringify({
                action: 'reorder_lists',
                payload: {
                  board_id: selectedBoard?.id,
                  list_order: reorderedLists.map(l => l.id),
                  list_positions: reorderedLists.map(l => ({ id: l.id, order: l.order }))
                },
              })
            );
          }
        }, 50);
      },
    });

    return () => {
      sortable.destroy();
      if (listReorderTimeoutRef.current) {
        clearTimeout(listReorderTimeoutRef.current);
      }
    };
  }, [boardData.lists, selectedBoard?.id]);




  // =================================================  Add task =========================================================
  const addTask = (listId: number, taskTitle: string) => {
    console.log('Adding task:', { listId, taskTitle });
    const updatedLoadingLists = { ...loadingLists, [listId]: true };

    setLoadingLists(updatedLoadingLists);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const newTask = {
        id: Date.now(), // Temporary ID, replace with server-generated ID
        title: taskTitle,
        list: listId,
        created_at: new Date().toISOString(),
      };

      console.log('Sending add_task message:', {
        action: 'add_task',
        payload: newTask,
      });

      socketRef.current.send(JSON.stringify({
        action: 'add_task',
        payload: newTask,
      }));


    } else {
      console.error('WebSocket is not open. Cannot send add_task message.');
      const resetLoadingLists = { ...loadingLists, [listId]: false };
      setLoadingLists(resetLoadingLists);
      setAdding_new_task_loader({ listId: null });
    }

  };

  // ================================================== delete task =========================================================

  const deleteTask = (taskId: number, listId: number) => {
    const updatedLists = boardData.lists.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          tasks: list.tasks.filter((task) => task.id !== taskId),
        };
      }
      return list;
    });

    const updatedBoardData: board = {
      ...boardData,
      lists: updatedLists
    };

    setBoardData(updatedBoardData);
    setSelectedBoard(updatedBoardData);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        action: 'delete_task',
        payload: { task_id: taskId, list_id: listId },
      }));
    }
  };

  // ================================================== Update task =========================================================


  const updateTask = (
    taskId: number,
    updatedTitle: string,
    due_date: string | null,
    description: string,
    completed: boolean,
    task_associated_users_id: number[],
    priority: 'green' | 'orange' | 'red' | null,
  ) => {
    console.log('Updating task:', { taskId, updatedTitle, due_date, completed, task_associated_users_id, priority });

    // Create the updated board data object directly
    const updatedLists = boardData.lists.map((list) => ({
      ...list,
      tasks: list.tasks.map((task) =>
        task.id === taskId
          ? {
            ...task,
            title: updatedTitle,
            due_date: due_date,
            completed: completed,
            task_associated_users_id: task_associated_users_id,
            priority: priority
          }
          : task
      ),
    }));

    const updatedBoardData: board = {
      ...boardData,
      lists: updatedLists
    };

    setBoardData(updatedBoardData);
    setSelectedBoard(updatedBoardData);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        action: 'update_task',
        payload: {
          task_id: taskId,
          title: updatedTitle,
          due_date: due_date,
          description: description,
          completed: completed,
          task_associated_users_id: task_associated_users_id,
          priority: priority,
        },
      }));
    }
  };



  // =================================================  move task =========================================================



  const moveTask = (taskId: number, sourceListId: number, targetListId: number) => {
    if (reordering) return;

    // Find the task to move
    const sourceList = boardData.lists.find(list => list.id === sourceListId);
    const taskToMove = sourceList?.tasks.find(task => task.id === taskId);

    if (!taskToMove) return;

    // Create the updated lists
    const updatedLists = boardData.lists.map((list) => {
      if (list.id === sourceListId) {
        // Remove task from source list
        return {
          ...list,
          tasks: list.tasks.filter(task => task.id !== taskId),
        };
      } else if (list.id === targetListId) {
        // Add task to target list
        return {
          ...list,
          tasks: [...list.tasks, { ...taskToMove, list: targetListId }],
        };
      }
      return list;
    });

    const updatedBoardData: board = {
      ...boardData,
      lists: updatedLists
    };

    setBoardData(updatedBoardData);
    setSelectedBoard(updatedBoardData);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        action: 'move_task',
        payload: {
          task_id: taskId,
          source_list_id: sourceListId,
          target_list_id: targetListId,
        },
      }));
    }
  };

  // =================================================== add list =========================================================

  const addList = () => {
    if (!ListName.trim()) {
      console.error('List name cannot be empty');
      return;
    }

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      setIsAddingList(true);

      // Calculate the highest order number and add 1
      const maxOrder = boardData.lists.length > 0
        ? Math.max(...boardData.lists.map(list => list.order || 0))
        : 0;

      const newList = {
        id: Date.now(),
        name: ListName,
        created_at: new Date().toISOString(),
        board: selectedBoard?.id,
        tasks: [],
        order: maxOrder + 1, // Give it the highest order number
      };

      socketRef.current.send(JSON.stringify({
        action: 'add_list',
        payload: newList,
      }));
      setListName('');
      setAdding_new_list(false);
    }
  };


  // ====================================================  update list name ==========================================

  const updateListName = (listId: number, NewListName: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          action: 'edit_list_name',
          payload: { list_id: listId, new_name: NewListName },
        })
      );
    }
  }


  // ====================================================  delete list ==========================================

  const deleteList = (listId: number) => {
    setIsLoading(true);
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          action: 'delete_list',
          payload: { list_id: listId },
        })
      );
    }
  };

  // ============================================  Board Name Update ===============================================


  const update_board_name = (newName: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          action: 'update_board_name',
          payload: { board_id: selectedBoard?.id, new_name: newName },
        })
      );
    }
  };


  // ============================================  Delete Board    ===============================================

  const deleteBoard = () => {
    console.log('Deleting board:', selectedBoard?.id);

    // Start loading
    setIsLoading(true);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        action: 'delete_board',
        payload: {
          board_id: selectedBoard?.id,
          user_id: profileData.id,
        }
      }));

      // Simulate a delay to finish loading after the board is deleted
      setTimeout(() => {
        setIsLoading(false); // End loading
      }, 1000); // Adjust the delay as needed
    } else {
      console.error('WebSocket is not open. Cannot delete board.');
      setIsLoading(false); // End loading in case of an error
    }
  };

  // =================================================== scroll =========================================================
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      // Check if the mouse is over a list
      const target = event.target as HTMLElement;
      if (target.closest('.list')) {
        // If the mouse is over a list, prevent scrolling
        event.preventDefault();
        return;
      }

      if (listsContainerRef.current) {
        isManualScrollRef.current = true;
        listsContainerRef.current.scrollLeft += event.deltaY;
      }
    };
    const handleDragOver = (event: DragEvent) => {
      if (listsContainerRef.current) {
        const { clientX, currentTarget } = event;
        const { left, right } = (currentTarget as HTMLElement).getBoundingClientRect();

        if (clientX < left + 150) {
          scrollRef.current.direction = 'left';
        } else if (clientX > right - 150) {
          scrollRef.current.direction = 'right';
        } else {
          scrollRef.current.direction = null;
        }
      }
    };

    const handleDrop = () => {
      scrollRef.current.direction = null;
      isManualScrollRef.current = false; // Reset manual scroll flag on drop
    };

    const scroll = () => {
      if (listsContainerRef.current && scrollRef.current.direction && !isManualScrollRef.current) {
        if (scrollRef.current.direction === 'left') {
          listsContainerRef.current.scrollLeft -= scrollRef.current.speed;
        } else if (scrollRef.current.direction === 'right') {
          listsContainerRef.current.scrollLeft += scrollRef.current.speed;
        }
      }
      requestAnimationFrame(scroll);
    };

    const handleScrollEnd = () => {
      isManualScrollRef.current = false;
    };

    const listsContainer = listsContainerRef.current;
    if (listsContainer) {
      listsContainer.addEventListener('wheel', handleWheel);
      listsContainer.addEventListener('dragover', handleDragOver);
      listsContainer.addEventListener('drop', handleDrop);
      listsContainer.addEventListener('scroll', handleScrollEnd);
      requestAnimationFrame(scroll);
    }

    return () => {
      if (listsContainer) {
        listsContainer.removeEventListener('wheel', handleWheel);
        listsContainer.removeEventListener('dragover', handleDragOver);
        listsContainer.removeEventListener('drop', handleDrop);
        listsContainer.removeEventListener('scroll', handleScrollEnd);
      }
    };
  }, []);
  // ==============================================================================================================

  const is_any_board_selected = selectedBoard?.name !== '';

  // ================================  render boards  ========================================


  const handleDragStart = (event: any) => {
    const { active } = event;
    const taskId = active.id;
    const sourceListId = active.data.current?.dndListId;
    if (typeof taskId === 'number' && typeof sourceListId === 'number') {
      // Find the task object
      const sourceList = boardData.lists.find((l) => l.id === sourceListId);
      const task = sourceList?.tasks.find((t) => t.id === taskId);
      if (task) {
        setActiveTask({ task, listId: sourceListId });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null); // Clear overlay
    if (!over) return;

    const activeListId = active.data.current?.dndListId;
    const overListId = over.id;

    // Only allow dropping on lists (not on tasks)
    const isOverAList = boardData.lists.some(list => list.id === overListId);

    if (
      typeof activeListId === "number" &&
      typeof overListId === "number" &&
      activeListId !== overListId &&
      isOverAList
    ) {
      moveTask(Number(active.id), Number(activeListId), Number(overListId));
    }
  };
  // ================================================ drag for mobile devices ========================================

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5, // Optional: require a small drag before activating
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 0, // Set to 0 for instant activation on touch
      tolerance: 5,
    },
  });


  const sensors = useSensors(pointerSensor, touchSensor);
  const reorderDebounceRef = useRef<NodeJS.Timeout | null>(null);




  const handleReorderTasks = useCallback((event: any) => {
    const { listId, taskOrder } = event.detail;

    setReordering(true); // Block moveTask during reorder

    // Create the updated board data object directly
    const updatedLists = boardData.lists.map((list) => {
      if (list.id === listId) {
        // Only include tasks that exist in list.tasks
        const reorderedTasks = taskOrder
          .map((taskId: number) => {
            const found = list.tasks.find((task) => task.id === taskId);
            // Optional: warn if not found
            if (!found) {
              console.warn(`Task with id ${taskId} not found in list ${listId}`);
            }
            return found;
          })
          .filter(Boolean); // Remove undefined

        // Also add any tasks that are in list.tasks but not in taskOrder (to avoid losing tasks)
        const missingTasks = list.tasks.filter(
          (task) => !taskOrder.includes(task.id)
        );
        return { ...list, tasks: [...reorderedTasks, ...missingTasks] };
      }
      return list;
    });

    const updatedBoardData: board = {
      ...boardData,
      lists: updatedLists
    };

    setBoardData(updatedBoardData);

    // Immediately send backend request (no debounce)
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          action: 'reorder_task',
          payload: { list_id: listId, task_order: taskOrder },
        })
      );
    }
    setReordering(false); // Allow moveTask after reorder
  }, [boardData]);


  useEffect(() => {
    window.addEventListener('reorder-tasks', handleReorderTasks as EventListener);
    return () => {
      window.removeEventListener('reorder-tasks', handleReorderTasks as EventListener);
      if (reorderDebounceRef.current) {
        clearTimeout(reorderDebounceRef.current);
      }
    };
  }, [handleReorderTasks]);



  return (
    <div className='members_container'
    >
      {/* {boards.length > 0 && ( */}
      <div >
        {isBoardsLoaded && boards.length > 0 && selectedBoard?.id !== 0 && (
          <div>
            <Members
              selectedBoard={selectedBoard}
              socketRef={socketRef}
              current_user_email={current_user_email}
              currentTheme={currentTheme}
              update_board_name={update_board_name}
              deleteBoard={deleteBoard}
              setCurrent_board_users={setCurrent_board_users}
              current_board_users={current_board_users}
              is_cur_Board_users_fetched={is_cur_Board_users_fetched}
              fetch_current_board_users={fetch_current_board_users}
              setBoards={setBoards}
              boards={boards}
              is_members_refreshing={is_members_refreshing}
              isMobile={isMobile}
              profileData={profileData}
              setSelectedComponent={setSelectedComponent}
              setSelectedBoard={setSelectedBoard}
              setIsLoading={setIsLoading}
            />
          </div>
        )}
      </div>


      {/* Show skeleton only when boards are not loaded */}
      {!isBoardsLoaded && (
        <div className='skeleton_in_board'>
          <SkeletonMember currentTheme={currentTheme} isMobile={isMobile} />
        </div>
      )}

      {isBoardsLoaded && boards.length === 0 && (
        <NoBoards currentTheme={currentTheme} />
      )}

      {selectedBoard?.id === 0 && boards.length > 0 ? (
        <div className='pls_select_board_cont'>
          <p className='pla_select_board' >Please select a board.</p>
        </div>
      ) : (

        <div className={`main_boards_container ${boards.length === 0 && isBoardsLoaded ? 'remove_height' : 'add_height'}`}  >
          {!isBoardsLoaded ? (
            <SkeletonLoader currentTheme={currentTheme} />
          ) : (
            // DND-KIT: Wrap lists in DndContext
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className='lists_container' ref={listsContainerRef}>

                {boardData.lists.map((list) => (
                  <List
                    key={list.id}
                    list={list}
                    moveTask={moveTask}
                    addTask={addTask}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                    setUpdatingListNameId={setUpdatingListNameId}
                    updatingListNameId={updatingListNameId}
                    socketRef={socketRef}
                    currentTheme={currentTheme}
                    deleteList={deleteList}
                    updateListName={updateListName}
                    allCurrentBoardUsers={allCurrentBoardUsers}
                    isLoading={loadingLists[list.id] || false}
                    setBoardData={setBoardData}
                    boardData={boardData}
                    dndListId={list.id}
                    setUpdatingTaskId={setUpdatingTaskId}
                    updatingTaskId={updatingTaskId}
                    setCompletingTaskId={setCompletingTaskId}
                    completingTaskId={completingTaskId}
                    setAdding_new_task_loader={setAdding_new_task_loader}
                    adding_new_task_loader={adding_new_task_loader}
                  />

                ))}
                {isAddingList && (
                  <SkeletonListLoader currentTheme={currentTheme} />
                )}

                <div className='add_new_list_big_container'>
                  {is_any_board_selected && (
                    <div className='list'
                      style={{ backgroundColor: `${currentTheme['--list-background-color']}` }}
                    >
                      {!Adding_new_list ?
                        (
                          <button
                            onClick={() => setAdding_new_list(true)}
                            className='add_new_list_btn'
                            style={{
                              backgroundColor: currentTheme['--task-background-color'],
                              color: currentTheme['--main-text-coloure'],
                              borderColor: currentTheme['--border-color'],

                            }}
                          >
                            {t('create_List')}
                          </button>
                        )
                        :
                        (
                          <div className='add_new_list_cont' >
                            <input
                              type="text"
                              placeholder={t('list_name')}
                              value={ListName}
                              onChange={(e) => setListName(e.target.value)}
                              required
                              autoFocus
                              style={{
                                background: currentTheme['--task-background-color'],
                                color: currentTheme['--main-text-coloure'],
                                borderColor: currentTheme['--border-color'],
                                ['--placeholder-color' as any]: currentTheme['--due-date-color'] || '#888',
                              } as React.CSSProperties}
                              className='add_new_list_input'
                            />
                            <button
                              onClick={() => addList()}
                              style={{
                                backgroundColor: currentTheme['--task-background-color'],
                                color: currentTheme['--main-text-coloure'],
                                borderColor: currentTheme['--border-color'],
                                cursor: ListName.trim() === '' ? 'not-allowed' : 'pointer',
                              }}
                              className='save_new_list_btn'
                              disabled={ListName.trim() === ''}
                            >
                              <GrFormCheckmark className='add_list_button_2_icon' />

                            </button>
                            <button
                              onClick={() => {
                                setAdding_new_list(false);
                                setListName('');
                              }}
                              style={{
                                backgroundColor: currentTheme['--task-background-color'],
                                color: currentTheme['--main-text-coloure'],
                                borderColor: currentTheme['--border-color'],
                              }}
                              className='cancel_new_list_btn'

                            >
                              <HiXMark className='cancel_list_button_icon' />
                            </button>
                          </div>
                        )
                      }
                    </div>
                  )}
                </div>


              </div>
              {/* DND-KIT: DragOverlay for ghost */}
              <DragOverlay>
                {activeTask ? (
                  <Task
                    task={activeTask.task}
                    deleteTask={() => { }}
                    updateTask={() => { }}
                    setUpdatingTaskId={() => { }}
                    updatingTaskId={null}
                    currentTheme={currentTheme}
                    allCurrentBoardUsers={allCurrentBoardUsers}
                    dndListId={activeTask.listId}
                    setCompletingTaskId={setCompletingTaskId}
                    completingTaskId={completingTaskId}
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      )}

    </div>
  );
};

export default Boards;