import '../styles/boards.css'
import React from "react";
import { useEffect , useState } from "react";

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
}


const Boards: React.FC<BoardsProps> = ({ selectedBoard }) => {
  const [lists, setLists] = useState<lists[]>([]);



  useEffect(() => {
    setLists(selectedBoard.lists);
  }, [selectedBoard]);

  useEffect(() => {
    console.log("lists--->>>", lists);
  }, [lists]);




  return (
    <div className="main_boards_container" >
      <div className="lists_container">
        {lists.map((list, index) => (
          // list 
          <div className="lists" key={index} >
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





















