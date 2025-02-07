import '../styles/boards.css'
import React from "react";
import { useEffect, useState, useRef } from "react";
import { ThemeSpecs } from '../utils/theme';
import { FaPlus } from "react-icons/fa";
import axiosInstance from '../utils/axiosinstance';
import { MdPlaylistAdd } from "react-icons/md";


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
  onNewListAdded: (list: lists) => void;
  onNewTaskAdded: (task: tasks , axtiveListId : number | null) => void;
}


const Boards: React.FC<BoardsProps> = ({ selectedBoard, currentTheme, setIsLoading, onNewListAdded , onNewTaskAdded}) => {

  const [lists, setLists] = useState<lists[]>([]);
  const [activeListId, setActiveListId] = useState<number | null>(null);
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [taskDueDate, setTaskDueDate] = useState<string>('');
  const [isNewTaskChecked, setIsNewTaskChecked] = useState<boolean>(false);

  //new list add
  const [addingNewList, setAddingNewList] = useState<boolean>(false);
  const [newListName, setNewListName] = useState<string>('');




  const listsContainerRef = useRef<HTMLDivElement>(null);



  // --------------------------------------------------------------------------------
  useEffect(() => {
    setLists(selectedBoard.lists);
  }, [selectedBoard]);

  useEffect(() => {
    console.log("selected_board--->>>", selectedBoard);
  }, [selectedBoard]);


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
        onNewTaskAdded(newTask, activeListId);
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


  // =========================================   add new list   ====================================================
  const handleAddNewList = () => {
    setAddingNewList(true);
  }

  const handleCanselClick = () => {
    setAddingNewList(false);
  }


  const add_new_list = async () => {
    try {
      const response = await axiosInstance.post(`api/lists/`, {
        name: newListName,
        board: selectedBoard.id
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (response.status === 201) {
        const updatedList = response.data;
        setLists(prevLists => [...prevLists, updatedList]);
        setNewListName('');
        setAddingNewList(false);
        onNewListAdded(updatedList);
      }
    } catch (error) {
      console.log("Error while adding new list", error);
    }
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
              // backgroundColor: currentTheme['--background-color'],
              backgroundColor:'#0d1b2a',
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
                  <h2 className='add_task_p'  >Add Task</h2>
                </div>

              </div>

            </div>
          </div>
        ))}

        {!addingNewList && (
          <div className='add_new_list_container'
            style={{
              backgroundColor: currentTheme['--background-color'],
              color: currentTheme['--main-text-coloure'],
              border: `1px solid ${currentTheme['--border-color']}`
            }}
            onClick={handleAddNewList}
          >
            <MdPlaylistAdd className='add_new_list_icon' />
            <p className='add_new_list_p' > Add new List </p>
          </div>
        )}

        {addingNewList && (
          <div className='add_new_list_container_for_input'
            style={{
              backgroundColor: currentTheme['--background-color'],
              color: currentTheme['--main-text-coloure'],
              border: `1px solid ${currentTheme['--border-color']}`
            }}
          >
            <input
              type="text"
              placeholder="Name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
            <div className='ad_list_buttons_container'>
              <button onClick={add_new_list} > Add List</button>
              <button onClick={handleCanselClick} > Cansel</button>
            </div>
          </div>
        )}


      </div>

    </div>
  )
}



export default Boards;





















