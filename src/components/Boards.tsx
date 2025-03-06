import '../styles/boards.css'
import React, { useState, useEffect } from "react";
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeSpecs } from '../utils/theme';

export interface board {
  id: number;
  name: string;
  created_at: string;
  lists: lists[];
  owner: string;
}

export interface lists {
  id: number;
  name: string;
  created_at: string;
  board: number;
  tasks: tasks[];
}

export interface tasks {
  created_at: string;
  description: string;
  due_date: string;
  id: number;
  list: number;
  title: string;
  completed: boolean;
}

export interface BoardsProps {
  selectedBoard: board;
  currentTheme: ThemeSpecs;
  setIsLoading: (value: boolean) => void;
  setSelectedBoard: (board: board) => void;
}

const ItemTypes = {
  TASK: 'task',
};

const Task: React.FC<{ task: tasks }> = ({ task }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { id: task.id, listId: task.list },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {task.title}
    </div>
  );
};

const List: React.FC<{ list: lists, moveTask: (taskId: number, sourceListId: number, targetListId: number) => void }> = ({ list, moveTask }) => {
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

  return (
    <div ref={drop} className={`list ${isOver ? 'hover' : ''}`}>
      <h3>{list.name}</h3>
      {list.tasks.map((task) => (
        <Task key={task.id} task={task} />
      ))}
    </div>
  );
};

const Boards: React.FC<BoardsProps> = ({ selectedBoard, setSelectedBoard }) => {
  const [boardData, setBoardData] = useState(selectedBoard);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    setBoardData(selectedBoard);
  }, [selectedBoard]);

  useEffect(() => {
    if (!selectedBoard.id) return;

    const newSocket = new WebSocket(`ws://${window.location.hostname}:8000/ws/boards/${selectedBoard.id}/`);
    setSocket(newSocket);

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
        case 'create':
        case 'update':
          setBoardData((prevData) => ({
            ...prevData,
            ...payload,
          }));
          break;
        case 'delete':
          // Handle delete action if necessary
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
      newSocket.close();
    };
  }, [selectedBoard.id]);

  const moveTask = (taskId: number, sourceListId: number, targetListId: number) => {
    const sourceListIndex = boardData.lists.findIndex(list => list.id === sourceListId);
    const targetListIndex = boardData.lists.findIndex(list => list.id === targetListId);

    if (sourceListIndex === -1 || targetListIndex === -1) return;

    const taskIndex = boardData.lists[sourceListIndex].tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;

    const [movedTask] = boardData.lists[sourceListIndex].tasks.splice(taskIndex, 1);
    movedTask.list = targetListId;
    boardData.lists[targetListIndex].tasks.push(movedTask);

    setBoardData({ ...boardData });
    setSelectedBoard({ ...boardData });

    if (socket) {
      console.log('Sending move_task message:', {
        action: 'move_task',
        payload: {
          task_id: taskId,
          source_list_id: sourceListId,
          target_list_id: targetListId
        }
      });
      socket.send(JSON.stringify({
        action: 'move_task',
        payload: {
          task_id: taskId,
          source_list_id: sourceListId,
          target_list_id: targetListId
        }
      }));
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="main_boards_container">
        {boardData.lists.map((list) => (
          <List key={list.id} list={list} moveTask={moveTask} />
        ))}
      </div>
    </DndProvider>
  );
};

export default Boards;