import '../styles/Sidebar.css';
import 'shepherd.js/dist/css/shepherd.css';
import React, { useEffect, useState } from "react";
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
import { ThemeSpecs } from '../utils/theme';
import { IoCloseSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { MdOutlineLogout } from "react-icons/md";
import ConfirmationDialog from './Boards/ConfirmationDialog';
import SkeletonBoardName from './Boards/SkeletonBoardName';
import { IoIosAddCircleOutline } from "react-icons/io";
import { GrFormCheckmark } from "react-icons/gr";
import { HiXMark } from "react-icons/hi2";


interface SidebarProps {
  currentTheme: ThemeSpecs;
  boards: board[];
  setBoards?: (boards: board[]) => void;
  selectedBoard: board | null;
  setSelectedBoard: (board: board | null) => void;
  selectedComponent: string;
  setSelectedComponent: (component: string) => void;
  setIsBoardsLoaded: (isLoaded: boolean) => void;
  isBoardsLoaded: boolean;
  setIs_new_notification_received: (is_new_notification_received: boolean) => void;
  is_new_notification_received: boolean;
  isMobile: boolean;
  setIs_sidebar_open_on_mobile: (is_sidebar_open_on_mobile: boolean) => void;
  is_sidebar_open_on_mobile: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}



const SidebarComponent: React.FC<SidebarProps> = ({
  currentTheme,
  boards,
  setBoards,
  selectedBoard,
  setSelectedBoard,
  selectedComponent,
  setSelectedComponent,
  setIsBoardsLoaded,
  isBoardsLoaded,
  setIs_new_notification_received,
  is_new_notification_received,
  isMobile,
  setIs_sidebar_open_on_mobile,
  is_sidebar_open_on_mobile,
  setIsAuthenticated,
}) => {

  const [isOpen, setIsOpen] = useState<boolean>(true);
  const is_Pinned_Value: boolean = JSON.parse(localStorage.getItem('isPinned') || 'false');
  const [isPinned, setIsPinned] = useState<boolean>(is_Pinned_Value);

  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState<boolean>(false);


  const [newBoardName, setNewBoardName] = useState<string>('');
  const [addingNewBoard, setAddingNewBoard] = useState<boolean>(false);


  const [isNewBoardSaving, setIsNewBoardSaving] = useState<boolean>(false);

  const navigate = useNavigate();

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

  // ================================================== toggle sidebar pin =================================================
  const toggleSidebarPin = () => {
    localStorage.setItem('isPinned', JSON.stringify(!isPinned));
    setIsPinned(!isPinned);
  }

  const handleMouseEnter = () => {
    if (isMobile) {
      return
    } else {
      if (isPinned) {
        setIsOpen(true);
      } else {
        setIsOpen(true);
      }
    }
  };

  const handleMouseLeave = () => {
    if (isMobile) {
      return
    } else {
      if (!isPinned) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    }
  };




  useEffect(() => {
    console.log('mobile ', isMobile);
  }, [isMobile]);



  const handle_burger_icon_click = () => {
    setIs_sidebar_open_on_mobile(!is_sidebar_open_on_mobile);
    console.log('burger icon clicked, sidebar open state:', is_sidebar_open_on_mobile);
  }


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
      setIs_sidebar_open_on_mobile(true);

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
    setIs_sidebar_open_on_mobile(true);
  }

  const handle_nnotification_page_click = () => {
    setSelectedComponent("Notification");
    setIs_new_notification_received(false);
    setSelectedBoard(null);
    setIs_sidebar_open_on_mobile(true);

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
    setIsNewBoardSaving(true);
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
        setIsNewBoardSaving(false);
      }
    } catch (error) {
      console.error("Error creating new board:", error);
    } finally {
      setIsNewBoardSaving(false);
    }
  };


  // =========================================================================================================

  const handleLogOutIconClick = () => {
    setIsConfirmationDialogOpen(true);
  }

  const handleLogOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    navigate('/');
  }

  return (
    <div
      onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
      className={`sidebar_main_container ${isOpen ? 'open' : 'closed'}
        ${is_sidebar_open_on_mobile ? "sidebar_closed_on_mobile" : ''}`}

      style={{
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)', // Safari support
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black for darker effect
      }}
    >
      <div className="sidebar_container">
        {isConfirmationDialogOpen && (
          <ConfirmationDialog
            message="Are you sure you want to log out?"
            onCancel={() => setIsConfirmationDialogOpen(false)}
            onConfirm={handleLogOut}
          />
        )}
        <Sidebar
          collapsed={!isOpen}
          backgroundColor="transparent"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          rootStyles={{
            height: '100%',
            border: 'none',
          }}
          id="sidebar"
          className='sidebar_lbrary'
        >

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between',
            backgroundColor: 'transparent',
            transition: 'all 0.3s',
          }} >

            <div>
              <Menu
                menuItemStyles={{
                  root: {
                    color: '#fff', // Always white
                    fontWeight: 'bold',
                  },
                  button: {
                    '&:hover': {
                      backgroundColor: currentTheme['--hover-color'] || '#11995a',
                    },
                  },
                  subMenuContent: {
                    backgroundColor: 'transparent',
                  },

                }}
              >


                {/* dashboard  */}
                <MenuItem icon={<MdSpaceDashboard className="dashboard_icon" />}>
                  <div className="for_dashboard_child_container">
                    <p> Dashboard</p>
                    {isMobile ?
                      (
                        <div
                          className='close_dashboard_container'
                          onClick={handle_burger_icon_click}
                        >
                          <IoCloseSharp
                            className='close_dashboard_icon'
                          />
                        </div>
                      )
                      :
                      (
                        <div onClick={toggleSidebarPin} className="pin_container">
                          {isPinned ? <TiPin className="pin_icon" /> : <TiPinOutline className="pin_icon" />}
                        </div>
                      )}
                  </div>
                </MenuItem>

                {/* other menu items  */}
                <SubMenu label="Boards" id="board" icon={<GrTasks className="sidebar_big_icon" />} defaultOpen={true}

                >
                  {isOpen && (
                    <div className='mapped_boards_container' >
                      {boards.map((board: board) => (
                        <MenuItem
                          key={board.id}
                          rootStyles={{
                            transition: 'all 0.3s',
                            color: selectedBoard?.id === board.id ? 'seagreen' : 'white',
                            textAlign: 'left',
                            fontWeight: 'bold',
                          }}
                          icon={<FaClipboardList />}
                          onClick={() => handleBoardClick(board)}
                        >
                          {board.name}
                        </MenuItem>
                      ))}
                    </div>
                  )}
                  {boards.length === 0 && !isBoardsLoaded && (
                    <>
                      <SkeletonBoardName currentTheme={currentTheme} />
                      <SkeletonBoardName currentTheme={currentTheme} />
                      <SkeletonBoardName currentTheme={currentTheme} />
                    </>
                  )}

                  {/* add new boarf  */}
                  {!addingNewBoard && (
                    <MenuItem
                      icon={<IoIosAddCircleOutline className='sidebar_big_icon' />}
                      onClick={handleBoardAddClick}
                      rootStyles={{
                        transition: 'all 0.3s',
                        textAlign: 'left',
                        fontWeight: 'bold',
                      }}
                    >
                      Add New Board
                    </MenuItem>
                  )}


                  {addingNewBoard && (
                    <div>
                      {isNewBoardSaving ? (
                        <SkeletonBoardName currentTheme={currentTheme} />
                      ) : (
                        <>
                          <input
                            type="text"
                            placeholder='board name'
                            value={newBoardName}
                            onChange={(e) => setNewBoardName(e.target.value)}
                            className='add_board_input'
                            style={{
                              backgroundColor: currentTheme['--list-background-color'],
                              color: currentTheme['--main-text-coloure'],
                              border: `1px solid `,
                              borderColor: currentTheme['--border-color'],
                            }}
                          />
                          <div className='add_board_button_container' >
                            <GrFormCheckmark onClick={() => handle_create_new_board()} className='add_board_icon' />
                            <HiXMark onClick={canselBoardAdding} className='cancel_add_board_icon' />
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </SubMenu>


                <MenuItem
                  icon={<GoRepoTemplate className='sidebar_big_icon' />}
                  onClick={() => handel_sidebar_page_click("Templates")}
                  style={{
                    color: selectedComponent === "Templates" ? 'seagreen' : 'white',
                    fontWeight: 'bold',
                    transition: 'all 0.3s',
                  }}
                >Templates
                </MenuItem>


                <MenuItem
                  style={{
                    color: selectedComponent === "Calendar" ? 'seagreen' : 'white',
                    fontWeight: 'bold',
                    transition: 'all 0.3s',
                  }}
                  icon={<FaCalendarAlt className='sidebar_big_icon' />}
                  onClick={() => handel_sidebar_page_click("Calendar")}
                >Calendar</MenuItem>
                <MenuItem
                  style={{
                    color: selectedComponent === "Notification" ? 'seagreen' : 'white',
                    fontWeight: 'bold',
                    transition: 'all 0.3s',
                  }}
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



            {/* Settings and logout(loghout only on mobile) */}
            <div >
              <Menu
                style={{ marginTop: 'auto', position: 'relative' }}
                menuItemStyles={{
                  root: {
                    color: '#fff', // Always white
                    fontWeight: 'bold',
                  },
                  button: {
                    '&:hover': {
                      backgroundColor: currentTheme['--hover-color'] || '#11995a',
                    },
                  },
                  subMenuContent: {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                <MenuItem
                  icon={<RiSettings4Fill className="sidebar_big_icon" />}
                  onClick={() => handel_sidebar_page_click("Settings")}
                  style={{
                    color: selectedComponent === "Settings" ? 'seagreen' : 'white',
                    fontWeight: 'bold',
                    transition: 'all 0.3s',
                  }}
                >Settings
                </MenuItem>

                {isMobile && (
                  <MenuItem
                    icon={<MdOutlineLogout className='sidebar_big_icon' />}
                    onClick={handleLogOutIconClick}
                    style={{ color: 'red', fontWeight: 'bold' }}
                  > Log Out
                  </MenuItem>
                )}

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