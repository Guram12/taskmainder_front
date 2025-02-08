import '../styles/boards.css'
import React from "react";
import { useEffect, useState, useRef } from "react";
import { ThemeSpecs } from '../utils/theme';
import { FaPlus } from "react-icons/fa";
import axiosInstance from '../utils/axiosinstance';
import { MdPlaylistAdd } from "react-icons/md";
import { MdOutlineSubtitles } from "react-icons/md";
import { PiTextAlignRightLight } from "react-icons/pi";
import { MdOutlineEdit } from "react-icons/md";
import { IoMdCheckmark } from "react-icons/io";
import { HiX } from "react-icons/hi";
import { TbEdit } from "react-icons/tb";


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
  onNewTaskAdded: (task: tasks, axtiveListId: number | null) => void;
}


const Boards: React.FC<BoardsProps> = ({ selectedBoard, currentTheme, setIsLoading, onNewListAdded, onNewTaskAdded }) => {

  const [lists, setLists] = useState<lists[]>([]);
  const [activeListId, setActiveListId] = useState<number | null>(null);
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [taskDueDate, setTaskDueDate] = useState<string>('');
  const [isNewTaskChecked, setIsNewTaskChecked] = useState<boolean>(false);

  //new list add
  const [addingNewList, setAddingNewList] = useState<boolean>(false);
  const [newListName, setNewListName] = useState<string>('');

  // task editing and deleting states
  const [isTaskUpdating, setIsTaskUpdating] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<tasks>({
    created_at: '',
    description: '',
    due_date: '',
    id: 0,
    list: 0,
    title: '',
    completed: false
  });

  // -------- editing selected task title 
  const [itSelectedTaskEditing, setItSelectedTaskEditing] = useState<boolean>(false);
  const [selectedTaskTitle, setSelectedTaskTitle] = useState<string>('');

  // -------- editing selected task description 
  const [isDescriptionEditing, setIsDescriptionEditing] = useState<boolean>(false);
  const [selectedTaskDescription, setSelectedTaskDescription] = useState<string>(selectedTask.description);






  const listsContainerRef = useRef<HTMLDivElement>(null);
  const taskUpdateWindowRef = useRef<HTMLDivElement>(null);


  // --------------------------------------------------------------------------------
  useEffect(() => {
    setLists(selectedBoard.lists);
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
      setIsLoading(true);
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
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error while adding new list", error);
    }
  };

  // =======================================  adit and delete selected task ===============================================

  const handleTaskClick = (task: tasks) => {
    setIsTaskUpdating(true);
    setSelectedTask(task);
  }

  const handle_Edit_Task_Title_click = () => {
    setItSelectedTaskEditing(true);
    setSelectedTaskTitle(selectedTask.title);
    console.log('clicked')
  }

  const cansell_editing_task_title = () => {
    setItSelectedTaskEditing(false);
    setSelectedTaskTitle(selectedTask.title);
  }
  // -------------------------------------------------------- update task title -------------------------------------------
  const update_selected_task = async (task: tasks) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.put(`api/tasks/${task.id}/`, {
        title: selectedTaskTitle,
        list: task.list,
        description: selectedTaskDescription,
        // due_date: task.due_date,
        // completed: task.completed,


      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      console.log(response.data)
      // update the task title in the frontend
      const updatedTask = response.data;
      const updatedLists = lists.map((list) => {
        if (list.id === task.list) {
          return {
            ...list,
            tasks: list.tasks.map((task) => {
              if (task.id === updatedTask.id) {
                return updatedTask;
              }
              return task;
            })
          };
        }
        return list;
      });
      setLists(updatedLists);
      setSelectedTask(updatedTask);
      setItSelectedTaskEditing(false);
      setIsDescriptionEditing(false);
      onNewTaskAdded(updatedTask, task.list);
      setIsLoading(false);
    } catch (error) {
      console.log("Error while editing task title", error);
    }
  }

  // ------------------------------------------------ update task description ------------------------------------------
  const handle_Edit_Task_Description_click = () => {
    setIsDescriptionEditing(true);
    setSelectedTaskDescription(selectedTask.description);
    setSelectedTaskTitle(selectedTask.title);
  };

  const cansell_editing_task_description = () => {
    setIsDescriptionEditing(false);
    setSelectedTaskDescription(selectedTask.description);
  };



  // -------------------------------------------  close window when outside click ocures--------------------------------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (taskUpdateWindowRef.current && !taskUpdateWindowRef.current.contains(event.target as Node)) {
        setIsTaskUpdating(false);
        setItSelectedTaskEditing(false);
        setIsDescriptionEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [taskUpdateWindowRef]);

  // =================================================================================================================
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  };

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
              backgroundColor: '#0d1b2a',
              color: currentTheme['--main-text-coloure'],
              border: `1px solid ${currentTheme['--border-color']}`
            }} >
            <h1 className='list_title' >{list.name}</h1>

            {/* task */}
            <div className='all_tasks_container' >
              {list.tasks.map((task, index) => (
                <div
                  className='task_container'
                  key={index}
                  onClick={() => handleTaskClick(task)}
                >
                  <p className='task_title'> {task.title}</p>

                  {task.due_date ? <p className='due_date_p' > {formatDate(task.due_date)}</p> : <p className='due_date_p' > No due date</p>}

                  {/* <input type="checkbox"
                    checked={task.completed}
                    onChange={() => { }}

                  /> */}
                </div>
              )
              )}

              <div className="line_before_plus" style={{ backgroundColor: currentTheme['--border-color'] }} ></div>

              {/* ==============================   containers for task adit and delete   =================================*/}
              {isTaskUpdating && (
                <>
                  <div className='dark_background' ></div>
                  <div className='task_update_window' ref={taskUpdateWindowRef} >

                    <div className='task_title_container' >
                      <MdOutlineSubtitles className='selected_task_title_icon' />
                      {!itSelectedTaskEditing ?
                        <h1 className='selected_task_title' >{selectedTask.title}</h1>
                        :
                        <div className='inputs_and_icons_container' >
                          <input
                            type="text"
                            value={selectedTaskTitle}
                            onChange={(e) => setSelectedTaskTitle(e.target.value)}
                          />
                          <IoMdCheckmark onClick={() => update_selected_task(selectedTask)} className='save_task_icon' />
                          <HiX onClick={cansell_editing_task_title} className='cansell_task_icon' />
                        </div>
                      }
                      <MdOutlineEdit className='selectedtask_edit_icon' onClick={() => handle_Edit_Task_Title_click()} />
                    </div>

                    <div className='task_content_container' >

                      <div className='description_and_icon_container' >
                        <PiTextAlignRightLight className='selected_task_description_icon' />
                        <h2>Description : </h2>
                      </div>

                      <div className='descr_and_icon_container'>
                        {!isDescriptionEditing ?
                          <>
                            <p className='selected_task_description' >{selectedTask.description}</p>
                            <TbEdit className='decsr_edit_icon' onClick={handle_Edit_Task_Description_click} />
                          </>
                          :
                          <div>
                            <textarea
                              value={selectedTaskDescription}
                              className='selected_task_description_input'
                              onChange={(e) => setSelectedTaskDescription(e.target.value)}
                            />
                            <IoMdCheckmark onClick={() => update_selected_task(selectedTask)} className='save_task_icon' />
                            <HiX onClick={cansell_editing_task_description} className='cansell_task_icon' />
                          </div>
                        }

                      </div>
                    </div>

                  </div>
                </>
              )}




              {/* ==========================  task add  elements   =============================================*/}
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





















