import '../../styles/boards.css';
import React, { useState, useEffect, useRef } from "react";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeSpecs } from '../../utils/theme';
import Members from '../Members';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import List from './Lists';
import { board } from '../../utils/interface';

export interface BoardsProps {
  selectedBoard: board;
  currentTheme: ThemeSpecs;
  setIsLoading: (value: boolean) => void;
  setSelectedBoard: (board: board) => void;
  current_user_email: string;
}

const Boards: React.FC<BoardsProps> = ({ selectedBoard, setSelectedBoard, current_user_email }) => {
  const [boardData, setBoardData] = useState(selectedBoard);
  const [Adding_new_list, setAdding_new_list] = useState<boolean>(false);
  const [ListName, setListName] = useState<string>('');







  const socketRef = useRef<WebSocket | null>(null);
  const listsContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<{ direction: 'left' | 'right' | null, speed: number }>({ direction: null, speed: 2 }); // Reduced speed
  const isManualScrollRef = useRef(false);



  useEffect(() => {
    setBoardData(selectedBoard);
  }, [selectedBoard]);

  useEffect(() => {
    if (!selectedBoard.id) return;

    if (socketRef.current) {
      socketRef.current.close();
    }


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
          setBoardData((prevData) => {
            const newBoardData = { ...prevData };
            const userIndex = newBoardData.board_users.findIndex(user => user.id === payload.user_id);
            if (userIndex !== -1) {
              newBoardData.board_users[userIndex].user_status = payload.new_status;
            }
            // Remove any duplicate users
            newBoardData.board_users = newBoardData.board_users.filter((user, index, self) =>
              index === self.findIndex((u) => u.id === user.id)
            );
            return newBoardData;
          });
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
  }, [selectedBoard.id]);

  const moveTask = (taskId: number, sourceListId: number, targetListId: number) => {
    setBoardData((prevBoardData) => {
      const sourceListIndex = prevBoardData.lists.findIndex(list => list.id === sourceListId);
      const targetListIndex = prevBoardData.lists.findIndex(list => list.id === targetListId);

      if (sourceListIndex === -1 || targetListIndex === -1) return prevBoardData;

      const taskIndex = prevBoardData.lists[sourceListIndex].tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) return prevBoardData;

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


  const addList = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const newList = {
        id: Date.now(), // Temporary ID, replace with server-generated ID
        name: ListName,
        created_at: new Date().toISOString(),
        board: selectedBoard.id,
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

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
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


  return (
    <DndProvider backend={HTML5Backend}>
      <div className='members_container'>
        <div>
          <Members selectedBoard={selectedBoard} socketRef={socketRef} current_user_email={current_user_email} />
        </div>
        <div className="main_boards_container">
          <div className='lists_container' ref={listsContainerRef}>
            {boardData.lists.map((list) => (
              <List key={list.id} list={list} moveTask={moveTask} />
            ))}
            <div className='list' >
              {!Adding_new_list ?
                (
                  <button onClick={() => setAdding_new_list(true)} >Add NewList</button>
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
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default Boards;