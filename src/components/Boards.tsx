import '../styles/boards.css'
import React, { useState } from "react";
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
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item: { id: number, listId: number }) => {
      if (item.listId !== list.id) {
        moveTask(item.id, item.listId, list.id);
      }
    },
  }));

  return (
    <div ref={drop} className="list">
      <h3>{list.name}</h3>
      {list.tasks.map((task) => (
        <Task key={task.id} task={task} />
      ))}
    </div>
  );
};

const Boards: React.FC<BoardsProps> = ({ selectedBoard, setSelectedBoard }) => {
  const [boardData, setBoardData] = useState(selectedBoard);

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