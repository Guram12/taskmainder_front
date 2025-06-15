import '../../styles/Board Styles/Boards.css';
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ThemeSpecs } from '../../utils/theme';
import Members from '../Members';
import List from './Lists';
import { board } from '../../utils/interface';
import { isMobile } from 'react-device-detect'; // Install react-device-detect
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

if (isMobile) {
  console.log('Running on a mobile device');
}




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

}) => {
  const [boardData, setBoardData] = useState<board>({
    id: 0,
    name: '',
    created_at: '',
    lists: [],
    owner: '',
    owner_email: '',
    members: [],
    board_users: [],
    background_image: null

  });

  const [isAddingList, setIsAddingList] = useState<boolean>(false);
  const [Adding_new_list, setAdding_new_list] = useState<boolean>(false);
  const [ListName, setListName] = useState<string>('');

  const [updatingListNameId, setUpdatingListNameId] = useState<number | null>(null);


  const [allCurrentBoardUsers, setAllCurrentBoardUsers] = useState<ProfileData[]>([]);


  const [loadingLists, setLoadingLists] = useState<{ [listId: number]: boolean }>({});


  const socketRef = useRef<WebSocket | null>(null);
  const listsContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<{ direction: 'left' | 'right' | null, speed: number }>({ direction: null, speed: 2 }); // Reduced speed
  const isManualScrollRef = useRef(false);

  const [activeTask, setActiveTask] = useState<null | { task: any; listId: number }>(null);
  const [reordering, setReordering] = useState(false); // Add this state




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



  // ======================================   Main useEffect for websocket connection  =========================================


  useEffect(() => {
    if (!selectedBoard?.id) return;

    if (socketRef.current) {
      socketRef.current.close();
    }

    // const token = localStorage.getItem('access_token');
    // // Detect protocol and set ws or wss accordingly
    // const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    // // Use your backend's public domain or tunnel endpoint, NOT window.location.hostname
    // const backendHost = '446952c95fe5eac0751e5291d4fbd6ca.serveo.net'; // your backend domain or tunnel
    // const newSocket = new WebSocket(`ws://${backendHost}/ws/boards/${selectedBoard.id}/?token=${token}`);
    // socketRef.current = newSocket;


    const token = localStorage.getItem('access_token');
    const newSocket = new WebSocket(`ws://${window.location.hostname}:8000/ws/boards/${selectedBoard.id}/?token=${token}`);
    socketRef.current = newSocket;


    newSocket.onopen = () => {
      console.log('WebSocket connection established');
    };


    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const { action, payload } = data;

      switch (action) {
        // case 'full_board_state':
        //   console.log('Received full board state:', payload);
        //   setBoardData(payload); // Update the board data with the full state
        //   setSelectedBoard(payload); // Update the selected board with the full state
        //   setIsBoardsLoaded(true);
        //   console.log('board loader after receiving full_board_state ==>>', isBoardsLoaded);

        //   break;


        case 'move_task':
          const { task_id, source_list_id, target_list_id } = payload;
          setBoardData((prevData) => {
            const newBoardData = { ...prevData };
            const sourceListIndex = newBoardData.lists.findIndex(list => list.id === source_list_id);
            const targetListIndex = newBoardData.lists.findIndex(list => list.id === target_list_id);

            if (sourceListIndex === -1 || targetListIndex === -1) return newBoardData;

            const taskIndex = newBoardData.lists[sourceListIndex].tasks.findIndex(task => task.id === task_id);
            if (taskIndex === -1) return newBoardData;

            const [movedTask] = newBoardData.lists[sourceListIndex].tasks.splice(taskIndex, 1);
            movedTask.list = target_list_id;
            newBoardData.lists[targetListIndex].tasks.push(movedTask);

            return newBoardData;
          });
          break;


        case 'set_status':
          console.log('Received set_status:', payload);
          setBoardData((prevData) => {
            const newBoardData = { ...prevData };
            const userIndex = newBoardData.board_users.findIndex(user => user.id === payload.user_id);
            if (userIndex !== -1) {
              newBoardData.board_users[userIndex].user_status = payload.new_status;
            }
            return newBoardData;
          });

          const updatedBoardUsers = selectedBoard?.board_users.map((user) =>
            user.id === payload.user_id ? { ...user, user_status: payload.new_status } : user
          );

          setCurrent_board_users(updatedBoardUsers || []);
          break;

        case 'create':
        case 'update':
          setBoardData((prevData) => ({
            ...prevData,
            ...payload,
          }));
          break;

        case 'add_list':
          setBoardData((prevData) => ({
            ...prevData,
            lists: [...prevData.lists, payload],
          }));
          setIsAddingList(false); // Clear loading state when adding list

          break;

        case 'edit_list_name':
          console.log('Received edit_list_name:', payload);
          setBoardData((prevData) => {
            const updatedLists = prevData.lists.map((list) =>
              list.id === payload.list_id ? { ...list, name: payload.new_name } : list
            );
            setUpdatingListNameId(null);
            return { ...prevData, lists: updatedLists };
          });
          break;

        case 'delete_list':
          setIsLoading(false);
          setBoardData((prevData) => ({
            ...prevData,
            lists: prevData.lists.filter((list) => list.id !== payload.list_id),
          }));
          break;

        case 'add_task':
          console.log('Received add_task:', payload);
          setBoardData((prevData) => {
            const updatedLists = prevData.lists.map((list) => {
              if (list.id === payload.list) {
                return { ...list, tasks: [...list.tasks, payload] };
              }
              return list;
            });

            return { ...prevData, lists: updatedLists };
          });
          setLoadingLists((prev) => ({ ...prev, [payload.list]: false }));
          break;

        case 'delete_task':
          console.log('Received delete_task:', payload);
          setBoardData((prevData) => {
            const updatedLists = prevData.lists.map((list) => {
              if (list.id === payload.list_id) {
                return { ...list, tasks: list.tasks.filter((task) => task.id !== payload.task_id) };
              }
              return list;
            });
            return { ...prevData, lists: updatedLists };
          });
          break;

        case 'update_task':
          console.log('Received update_task:', payload);
          setBoardData((prevData) => {
            const updatedLists = prevData.lists.map((list) => ({
              ...list,
              tasks: list.tasks.map((task) =>
                task.id === payload.id ? {
                  ...task,
                  title: payload.title,
                  description: payload.description,
                  due_date: payload.due_date,
                  completed: payload.completed,
                  priority: payload.priority

                } : task
              ),
            }));
            return { ...prevData, lists: updatedLists };
          });
          break;


        case 'reorder_task':
          console.log('Received reorder_task:', payload);
          setBoardData((prevData) => {
            const updatedLists = prevData.lists.map((list) => {
              if (list.id === payload.list_id) {
                const reorderedTasks = payload.task_order.map((taskId: number) =>
                  list.tasks.find((task) => task.id === taskId)
                );
                return { ...list, tasks: reorderedTasks };
              }
              return list;
            });
            return { ...prevData, lists: updatedLists };
          });
          break;


        case 'update_board_name':
          console.log('Received update_board_name:', payload);

          // Update boardData
          setBoardData((prevData: board) => ({
            ...prevData,
            name: payload.new_name,
          }));

          if (typeof payload.new_name === 'string') {
            const updatedBoard: board = {
              ...selectedBoard,
              name: payload.new_name,
            };
            setSelectedBoard(updatedBoard);
          } else {
            console.error('Invalid board name:', payload.new_name);
          }
          break;


        case 'delete_board':
          console.log('Received delete_board:', payload);
          // Handle board deletion
          setBoardData((prevData) => ({ ...prevData, lists: [] }));
          setSelectedBoard({
            id: 0,
            name: '',
            created_at: '',
            lists: [],
            owner: '',
            owner_email: '',
            members: [],
            board_users: [],
            background_image: null
          });

          if (payload.board_id) {
            const updatedBoards = boards.filter((board) => board.id !== payload.board_id);
            setBoards(updatedBoards);
          }
          break;


        default:
          break;
      }
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    newSocket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [selectedBoard?.id]);




  // =================================================  Add task =========================================================

  const addTask = (listId: number, taskTitle: string) => {
    console.log('Adding task:', { listId, taskTitle });

    setLoadingLists((prev) => ({ ...prev, [listId]: true }));


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
      setLoadingLists((prev) => ({ ...prev, [listId]: false }));

    }
  };

  // ================================================== delete task =========================================================

  const deleteTask = (taskId: number, listId: number) => {
    setBoardData((prevBoardData) => {
      const updatedLists = prevBoardData.lists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            tasks: list.tasks.filter((task) => task.id !== taskId),
          };
        }
        return list;
      });

      const newBoardData = { ...prevBoardData, lists: updatedLists };
      setSelectedBoard(newBoardData);

      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          action: 'delete_task',
          payload: { task_id: taskId, list_id: listId },
        }));
      }

      return newBoardData;
    });
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

    setBoardData((prevBoardData) => {
      const updatedLists = prevBoardData.lists.map((list) => ({
        ...list,
        tasks: list.tasks.map((task) =>
          task.id === taskId ? { ...task, title: updatedTitle, due_date: due_date, completed: completed, task_associated_users_id: task_associated_users_id, priority: priority } : task
        ),
      }));

      const newBoardData = { ...prevBoardData, lists: updatedLists };
      setSelectedBoard(newBoardData);

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

      return newBoardData;
    });
  };




  // =================================================  move task =========================================================


  const moveTask = (taskId: number, sourceListId: number, targetListId: number) => {
    if (reordering) {
      // Prevent moveTask if a reorder is in progress
      console.warn('moveTask blocked: reorder in progress');
      return;
    }
    setBoardData((prevBoardData) => {
      const sourceListIndex = prevBoardData.lists.findIndex(list => list.id === sourceListId);
      const targetListIndex = prevBoardData.lists.findIndex(list => list.id === targetListId);

      if (sourceListIndex === -1 || targetListIndex === -1) return prevBoardData;

      const taskIndex = prevBoardData.lists[sourceListIndex].tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
        // Prevent crash if task is missing
        // console.warn(`moveTask: Task ${taskId} not found in list ${sourceListId}`);
        return prevBoardData;
      }

      const [movedTask] = prevBoardData.lists[sourceListIndex].tasks.splice(taskIndex, 1);
      movedTask.list = targetListId;
      prevBoardData.lists[targetListIndex].tasks.push(movedTask);

      const newBoardData = { ...prevBoardData };
      setSelectedBoard(newBoardData);

      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        console.log('Sending move_task message:', {
          action: 'move_task',
          payload: {
            task_id: taskId,
            source_list_id: sourceListId,
            target_list_id: targetListId
          }
        });
        socketRef.current.send(JSON.stringify({
          action: 'move_task',
          payload: {
            task_id: taskId,
            source_list_id: sourceListId,
            target_list_id: targetListId
          }
        }));
      }

      return newBoardData;
    });
  };


  // =================================================== add list =========================================================

  const addList = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      setIsAddingList(true); //loading state for list adding 

      const newList = {
        id: Date.now(), // Temporary ID, replace with server-generated ID
        name: ListName,
        created_at: new Date().toISOString(),
        board: selectedBoard?.id,
        tasks: [],
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

  // --- Handle reorder-tasks event from SortableJS ---
  const handleReorderTasks = useCallback((event: any) => {
    const { listId, taskOrder } = event.detail;

    setReordering(true); // Block moveTask during reorder

    setBoardData((prevData) => {
      const updatedLists = prevData.lists.map((list) => {
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
      return { ...prevData, lists: updatedLists };
    });

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
  }, [setBoardData]);

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
      {boards.length > 0 && (
        <div>
          {!isBoardsLoaded ? (
            <div className='skeleton_in_board' >
              <SkeletonMember currentTheme={currentTheme} />
            </div>
          ) : (
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
            />

          )}
        </div>
      )}


      {isBoardsLoaded && boards.length === 0 && (
        <NoBoards currentTheme={currentTheme} />
      )}

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
                  // DND-KIT: Pass listId for droppable
                  dndListId={list.id}
                />
              ))}
              {isAddingList && (
                <SkeletonListLoader currentTheme={currentTheme} />
              )}
              {is_any_board_selected && (
                <div className='list'
                  style={{ backgroundColor: `${currentTheme['--list-background-color']}` }}
                >
                  {!Adding_new_list ?
                    (
                      <button onClick={() => setAdding_new_list(true)} >Create List</button>
                    )
                    :
                    (
                      <div className='add_new_list_cont' >
                        <input
                          type="text"
                          placeholder='List Name'
                          value={ListName}
                          onChange={(e) => setListName(e.target.value)}
                          required
                        />
                        <button onClick={() => addList()}  >Add</button>
                        <button onClick={() => setAdding_new_list(false)}  >Cansel</button>
                      </div>
                    )
                  }
                </div>
              )}
            </div>
            {/* DND-KIT: DragOverlay for ghost */}
            <DragOverlay>
              {activeTask ? (
                <Task
                  task={activeTask.task}
                  deleteTask={() => { }}
                  updateTask={() => { }}
                  currentTheme={currentTheme}
                  allCurrentBoardUsers={allCurrentBoardUsers}
                  dndListId={activeTask.listId}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

    </div>
  );
};

export default Boards;