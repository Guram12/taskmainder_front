import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosinstance";
import '../styles/boards.css';


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

const Boards: React.FC = () => {
  const [boards, setBoards] = useState<board[]>([]);
  const [lists, setLists] = useState<lists[]>([]);
  const [tasks, setTasks] = useState<tasks[]>([]);

  useEffect(() => {
    const fetchBoards = async () => {
      const access_token = localStorage.getItem("access_token");
      const response = await axiosInstance.get("api/boards", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const data = response.data;
      setBoards(data);

      // Extract lists and tasks from the boards data
      const allLists: lists[] = [];
      const allTasks: tasks[] = [];

      data.forEach((board: board) => {
        board.lists.forEach((list: lists) => {
          allLists.push(list);
          list.tasks.forEach((task: tasks) => {
            allTasks.push(task);
          });
        });
      });

      setLists(allLists);
      setTasks(allTasks);

      console.log(data);
    };
    fetchBoards();
  }, []);

  return (
    <div className="kanban-board">
      {boards.map((board: board) => (
        <div key={board.id} className="board">
          <h2>{board.name}</h2>
          <div className="lists">
            {board.lists.map((list: lists) => (
              <div key={list.id} className="list">
                <h3>{list.name}</h3>
                <div className="tasks">
                  {list.tasks.map((task: tasks) => (
                    <div key={task.id} className="task">
                      <h4>{task.title}</h4>
                      <p>{task.description}</p>
                      <p>Due: {task.due_date}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Boards;