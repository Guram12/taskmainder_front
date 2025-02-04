import '../styles/boards.css'
import React from "react";
import { useEffect, useState, useRef } from "react";
import { ThemeSpecs } from '../utils/theme';
import { FaPlus } from "react-icons/fa";
import axiosInstance from '../utils/axiosinstance';


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
}


const Boards: React.FC<BoardsProps> = ({ selectedBoard, currentTheme, setIsLoading }) => {
  const [lists, setLists] = useState<lists[]>([]);
  const [activeListId, setActiveListId] = useState<number | null>(null);
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [taskDueDate, setTaskDueDate] = useState<string>('');
  const [isNewTaskChecked, setIsNewTaskChecked] = useState<boolean>(false);



  const listsContainerRef = useRef<HTMLDivElement>(null);








  // --------------------------------------------------------------------------------
  useEffect(() => {
    setLists(selectedBoard.lists);
  }, [selectedBoard]);

  useEffect(() => {
    console.log("lists--->>>", lists);
  }, [lists]);


  // ================================================== task add functionalisy ====================================
  const handleTaskModalOpen = (listId: number) => {
    console.log('clicked')
    setActiveListId(listId);
  };

  const handleTaskModalClose = () => {
    setActiveListId(null);
  };

  const handleTaskAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    setIsLoading(true);
    if (activeListId !== null) {
      formData.append('list', activeListId.toString());
    }
    formData.append('title', taskTitle);
    formData.append('description', taskDescription);
    formData.append('due_date', taskDueDate);
    formData.append('completed', isNewTaskChecked.toString());

    try {
      const response = await axiosInstance.post('api/tasks/', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })

      if (response.status === 201) {
        // add newly added task to the list to show in frontend
        const newTask = response.data;
        console.log('newTask--->>>', newTask)
        const updateList = lists.map((list) => {
          if (list.id === activeListId) {
            return {
              ...list,
              tasks: [...list.tasks, newTask]
            };
          }
          return list;
        });
        setLists(updateList);

        // Reset form fields
        setTaskTitle('');
        setTaskDescription('');
        setTaskDueDate('');
        setIsNewTaskChecked(false);
        handleTaskModalClose();
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error while adding task", error);
    }
  }



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
              <div className='task_add_mother_cont' >
                {activeListId === list.id && (
                  <>
                    <form onSubmit={handleTaskAdd}>
                      <div className='task_add_modal'>
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
                            type="datetime-local"
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
                      </div>
                      <button type='submit'>Add Task</button>
                    </form>
                    <button onClick={handleTaskModalClose}>Close</button>
                  </>
                )}
                <div className='add_task_and_plus_container' onClick={() => handleTaskModalOpen(list.id)} >
                  <FaPlus className='plus_sign' />
                  <h2 className='add_task_p' >Add Task</h2>
                </div>

              </div>

            </div>


          </div>
        ))}
      </div>

    </div>
  )
}



export default Boards;





















