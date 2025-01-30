import '../styles/boards.css'
import React from "react";
import { useEffect, useState, useRef } from "react";
import { ThemeSpecs } from '../utils/theme';
import { FaPlus } from "react-icons/fa";

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
}


const Boards: React.FC<BoardsProps> = ({ selectedBoard, currentTheme }) => {
  const [lists, setLists] = useState<lists[]>([]);
  const [activeListId, setActiveListId] = useState<number | null>(null);
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [taskDueDate, setTaskDueDate] = useState<string>('');


  const [isNewTaskChecked, setIsNewTaskChecked] = useState(false);

  const listsContainerRef = useRef<HTMLDivElement>(null);








  // --------------------------------------------------------------------------------
  useEffect(() => {
    setLists(selectedBoard.lists);
  }, [selectedBoard]);

  useEffect(() => {
    console.log("lists--->>>", lists);
  }, [lists]);


  // ======================================== mouse wheel scroll effect ========================================
  // useEffect(() => {
  //   const handleWheel = (event: WheelEvent) => {
  //     if (listsContainerRef.current) {
  //       event.preventDefault();
  //       listsContainerRef.current.scrollLeft += event.deltaY;
  //     }
  //   };

  //   const container = listsContainerRef.current;
  //   if (container) {
  //     container.addEventListener('wheel', handleWheel);
  //   }

  //   return () => {
  //     if (container) {
  //       container.removeEventListener('wheel', handleWheel);
  //     }
  //   };
  // }, []);
  // ==============================================================================================================
  // ================================================== task add functionalisy ====================================
  const handleTaskModalOpen = (listId: number) => {
    setActiveListId(listId);
  };

  const handleTaskModalClose = () => {
    setActiveListId(null);
  };



  // ==============================================================================================================

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
            <h1 className='list_title' >{list.name}</h1>
            {/* task */}

            <div className='all_tasks_container' >
              {list.tasks.map((task, index) => (
                <div className='task_container' key={index}>
                  <p> {task.title}</p>
                  <p> {task.description}</p>
                  <p> {task.due_date}</p>
                  <input type="checkbox"
                    checked={task.completed}
                    onChange={() => { }}

                  />
                </div>
              )
              )}
              <div className="line_before_plus" style={{ backgroundColor: currentTheme['--border-color'] }} ></div>

              {/* task add  elements  */}
              <div>
                <FaPlus className='plus_sign' onClick={() => handleTaskModalOpen(list.id)} />
                {activeListId === list.id && (
                  <>
                    <div className="overlay active" onClick={handleTaskModalClose}></div>
                    <div className='task_add_modal'>
                      <p>List : {list.name}</p>
                      <div className='task_add_inputs_container' >

                        <input
                          type="text"
                          placeholder="Title"
                          value={taskTitle}
                          onChange={(e) => setTaskTitle(e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Description"
                          value={taskDescription}
                          onChange={(e) => setTaskDescription(e.target.value)}
                        />
                        <input
                          type="date"
                          placeholder="Due Date"
                          value={taskDueDate}
                          onChange={(e) => setTaskDueDate(e.target.value)}

                        />
                        <input
                          type="checkbox"
                          checked={isNewTaskChecked}
                          onChange={(e) => setIsNewTaskChecked(e.target.checked)}

                        />
                      </div>
                      <button>Add Task</button>
                      <button onClick={handleTaskModalClose}>Close</button>
                    </div>
                  </>
                )}
              </div>

            </div>


          </div>
        ))}
      </div>

    </div>
  )
}



export default Boards;





















