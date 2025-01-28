import '../styles/boards.css'
import React from "react";
import { useEffect, useState, useRef } from "react";
import { ThemeSpecs } from '../utils/theme';


interface board {
  id: number;
  name: string;
  created_at: string;
  lists: lists[];
  owner: string;
}

interface lists {
  id: number;
  name: string;
  created_at: string;
  board: number;
  tasks: tasks[];
}

interface tasks {
  created_at: string;
  description: string;
  due_date: string;
  id: number;
  list: number;
  title: string;
}


interface BoardsProps {
  selectedBoard: board;
  currentTheme: ThemeSpecs;
}


const Boards: React.FC<BoardsProps> = ({ selectedBoard, currentTheme }) => {
  const [lists, setLists] = useState<lists[]>([]);
  const listsContainerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    setLists(selectedBoard.lists);
  }, [selectedBoard]);

  useEffect(() => {
    console.log("lists--->>>", lists);
  }, [lists]);



  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (listsContainerRef.current) {
        event.preventDefault();
        listsContainerRef.current.scrollLeft += event.deltaY;
      }
    };

    const container = listsContainerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel);
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);


  return (
    <div className="main_boards_container" >
      <div className="lists_container" ref={listsContainerRef}>
        {lists.map((list, index) => (
          // list 
          <div
            key={index}
            className="lists"
            style={{
              backgroundColor: currentTheme['--background-color'],
              color: currentTheme['--main-text-coloure'],
              border: `1px solid ${currentTheme['--border-color']}`
            }} >
            <h1>{list.name}</h1>
            {/* task */}
            {list.tasks.map((task, index) => {
              return (
                <div key={index}>
                  <p> {task.title}</p>
                </div>
              )
            })}

          </div>
        ))}
      </div>

    </div>
  )
}



export default Boards;





















