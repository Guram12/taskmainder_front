import '../styles/Sidebar.css';
import 'shepherd.js/dist/css/shepherd.css';
import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { FaCalendarAlt } from "react-icons/fa";
import { TiPin, TiPinOutline } from "react-icons/ti";
import { MdSpaceDashboard } from "react-icons/md";
import { GrTasks } from "react-icons/gr";
import { FaClipboardList } from "react-icons/fa";
import { RiSettings4Fill } from "react-icons/ri";
import { board } from '../utils/interface';
import { GoRepoTemplate } from "react-icons/go";
import axiosInstance from '../utils/axiosinstance';
// import Shepherd from 'shepherd.js';
import { MdNotificationsActive } from "react-icons/md";





interface SidebarProps {
  currentTheme: ThemeSpecs;
  boards: board[];
  setBoards?: (boards: board[]) => void;
  selectedBoard: board | null;
  setSelectedBoard: (board: board | null) => void;
  setSelectedComponent: (component: string) => void;
  setIsBoardsLoaded?: (isLoaded: boolean) => void;
  setIs_new_notification_received: (is_new_notification_received: boolean) => void;
  is_new_notification_received: boolean;
}


interface ThemeSpecs {
  '--background-color': string;
  '--border-color': string;
  '--main-text-coloure': string;
}

const SidebarComponent: React.FC<SidebarProps> = ({
  currentTheme,
  boards,
  setBoards,
  selectedBoard,
  setSelectedBoard,
  setSelectedComponent,
  setIsBoardsLoaded,
  setIs_new_notification_received,
  is_new_notification_received,
}) => {

  const [isOpen, setIsOpen] = useState(true);
  const is_Pinned_Value: boolean = JSON.parse(localStorage.getItem('isPinned') || 'false');
  const [isPinned, setIsPinned] = useState<boolean>(is_Pinned_Value);



  const [newBoardName, setNewBoardName] = useState<string>('');
  const [addingNewBoard, setAddingNewBoard] = useState<boolean>(false);

  // useEffect(() => {
  //   console.log('boards----------', boards);
  // }, [boards])\



  // ======================================== for hilighting the elements in the tour ==========================================
  // const startTour = () => {
  //   const tour = new Shepherd.Tour({
  //     defaultStepOptions: {
  //       cancelIcon: { enabled: true },
  //       classes: 'custom-class-name',
  //       scrollTo: { behavior: 'smooth', block: 'center' },
  //     },
  //     useModalOverlay: true, // Enable backdrop to dim the rest of the page
  //   });

  //   // Step 1: Highlight Dashboard
  //   tour.addStep({
  //     title: 'Dashboard',
  //     text: 'This is the Dashboard section where you can view your main tasks.',
  //     attachTo: { element: '.dashboard_icon', on: 'right' },
  //     buttons: [
  //       {
  //         text: 'Next',
  //         action: tour.next,
  //       },
  //     ],
  //   });

  //   // Step 2: Highlight Boards
  //   tour.addStep({
  //     title: 'Boards',
  //     text: 'Here you can manage your boards. Click on a board to view its details.',
  //     attachTo: { element: '#board', on: 'right' },
  //     buttons: [
  //       {
  //         text: 'Next',
  //         action: tour.next,
  //       },
  //     ],
  //   });

  //   // Step 3: Highlight Templates
  //   tour.addStep({
  //     title: 'Templates',
  //     text: 'This section contains templates for creating new boards.',
  //     attachTo: { element: '.sidebar_big_icon', on: 'right' },
  //     buttons: [
  //       {
  //         text: 'Finish',
  //         action: tour.complete,
  //       },
  //     ],
  //   });

  //   tour.start();
  // };



  // ==============================================================================================================


  // ================================== sidebar pin and unpin ===============================================
  const toggleSidebarPin = () => {
    localStorage.setItem('isPinned', JSON.stringify(!isPinned));
    setIsPinned(!isPinned);
  }

  const handleMouseEnter = () => {
    if (isPinned) {
      setIsOpen(true);
    } else {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  // =========================================================================================================
  const handleBoardClick = async (board: board) => {
    console.log('Selected board:', board);
    setSelectedComponent("Boards");
    // Update the sidebar selection

    if (board.id === selectedBoard?.id) {
      console.log('This board is already selected. No need to fetch data.');
      return; // Exit early if the board is already selected
    }
    try {
      if (setIsBoardsLoaded) {
        setIsBoardsLoaded(false); // Show skeleton loader
      }

      // Fetch the selected board data
      const response = await axiosInstance.get(`/api/boards/${board.id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      const updatedBoard = response.data;

      // Update the selected board
      setSelectedBoard(updatedBoard);

      // Update only the specific board in the boards state
      if (setBoards) {
        const updatedBoards = boards.map((b) =>
          b.id === updatedBoard.id ? updatedBoard : b
        );
        setBoards(updatedBoards); // Set the updated boards array
      }

      if (setIsBoardsLoaded) {
        setIsBoardsLoaded(true); // Mark as loaded
      }



    } catch (error) {
      console.error('Error selecting board:', error);
      if (setIsBoardsLoaded) {
        setIsBoardsLoaded(true); // Stop loading even if there's an error
      }
    }
  };


  // =========================================  sidebar pager click   ================================================

  const handel_sidebar_page_click = (component_name: string) => {
    setSelectedComponent(component_name);
    setSelectedBoard(null);

  }

  const handle_nnotification_page_click = () => {
    setSelectedComponent("Notification");
    setIs_new_notification_received(false);
    setSelectedBoard(null);

  }


  // ========================================== add new board =================================================
  const handleBoardAddClick = () => {
    setAddingNewBoard(true);
  }

  const canselBoardAdding = () => {
    setAddingNewBoard(false);
    setNewBoardName('');
  }



  const handle_create_new_board = async () => {
    try {
      const response = await axiosInstance.post('api/boards/', {
        name: newBoardName
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (response.status === 201 && setBoards) {
        const newBoard = response.data;

        // Add the new board to the boards list
        setBoards([...boards, newBoard]);

        // Set the newly created board as the selected board
        setSelectedBoard(newBoard);

        // Optionally, switch to the "Boards" view
        setSelectedComponent("Boards");

        // Reset the input and state
        setAddingNewBoard(false);
        setNewBoardName('');
      }
    } catch (error) {
      console.error("Error creating new board:", error);
    }
  };


  // =========================================================================================================


  return (
    <div className={`sidebar_main_container ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar_container">
        <Sidebar
          collapsed={!isOpen}
          backgroundColor="transparent"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          rootStyles={{
            height: '100%',

          }}
          id="sidebar"
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between',
            backgroundColor: `${currentTheme['--background-color']}`,
            transition: 'all 0.3s',
          }} >

            <div>
              <Menu>
                {/* dashboard  */}
                <MenuItem icon={<MdSpaceDashboard className="dashboard_icon" />}>
                  <div className="for_dashboard_child_container">
                    <p> Dashboard</p>
                    <div onClick={toggleSidebarPin} className="pin_container">
                      {isPinned ? <TiPin className="pin_icon" /> : <TiPinOutline className="pin_icon" />}
                    </div>
                  </div>
                </MenuItem>

                {/* other menu items  */}
                <SubMenu label="Boards" id="board" icon={<GrTasks className="sidebar_big_icon" />} defaultOpen={true}>
                  {isOpen && (
                    <div >
                      {boards.map((board: board) => (
                        <MenuItem
                          key={board.id}
                          rootStyles={{
                            backgroundColor: `${currentTheme['--background-color']}`,
                            transition: 'all 0.3s',
                            color: selectedBoard?.id === board.id ? 'green' : currentTheme['--main-text-coloure'],
                            textAlign: 'left',
                          }}
                          icon={<FaClipboardList />}
                          onClick={() => handleBoardClick(board)}
                        >
                          {board.name}
                        </MenuItem>
                      ))}
                    </div>
                  )}


                  {!addingNewBoard && (
                    <div style={{
                      backgroundColor: `${currentTheme['--background-color']}`,

                    }} >
                      <h3
                        onClick={handleBoardAddClick}
                        style={{ backgroundColor: `${currentTheme['--background-color']}`, color: 'black', margin: '0px' }}
                      >
                        + New board
                      </h3>
                    </div>
                  )}

                  {addingNewBoard && (
                    <div>
                      <input
                        type="text"
                        placeholder='board name'
                        value={newBoardName}
                        onChange={(e) => setNewBoardName(e.target.value)}
                      />
                      <button onClick={() => handle_create_new_board()}  > Add</button>
                      <button onClick={canselBoardAdding}> Cansel</button>
                    </div>
                  )}

                </SubMenu>

                <MenuItem icon={<GoRepoTemplate className='sidebar_big_icon' />} onClick={() => handel_sidebar_page_click("Templates")} >Templates</MenuItem>
                <MenuItem
                  icon={<FaCalendarAlt className='sidebar_big_icon' />}
                  onClick={() => handel_sidebar_page_click("Calendar")}
                >Calendar</MenuItem>
                <MenuItem
                  icon={
                    <div style={{ position: 'relative' }}>
                      <MdNotificationsActive className="sidebar_big_icon" />
                      {is_new_notification_received && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            width: '10px',
                            height: '10px',
                            backgroundColor: 'red',
                            borderRadius: '50%',
                            border: '2px solid white',
                          }}
                        ></span>
                      )}
                    </div>
                  }
                  onClick={() => handle_nnotification_page_click()}
                >
                  Notification
                </MenuItem>
              </Menu>
            </div>
            <div >
              <Menu style={{ marginTop: 'auto' }}>
                <MenuItem
                  icon={<RiSettings4Fill className="sidebar_big_icon" />}
                  onClick={() => handel_sidebar_page_click("Settings")}
                >Settings</MenuItem>
              </Menu>
            </div>
          </div>
        </Sidebar>
        {/* <div style={{ padding: '10px' }}>
          <button onClick={startTour} style={{ cursor: 'pointer' }}>
            Start Tour
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default SidebarComponent;