import '../styles/Sidebar.css';
import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { FaCalendarAlt } from "react-icons/fa";
import { TiPin, TiPinOutline } from "react-icons/ti";
import { MdSpaceDashboard } from "react-icons/md";
import { GrTasks } from "react-icons/gr";
import { FaClipboardList } from "react-icons/fa";
import { RiSettings4Fill } from "react-icons/ri";
import { board } from "./Boards";
import { GoRepoTemplate } from "react-icons/go";
import axiosInstance from '../utils/axiosinstance';



interface SidebarProps {
  currentTheme: ThemeSpecs;
  boards: board[];
  setSelectedBoard: (board: board) => void;
  setSelectedComponent: (component: string) => void;
  onNewBoardAdded: (board: board) => void;
}


interface ThemeSpecs {
  '--background-color': string;
  '--border-color': string;
  '--main-text-coloure': string;
}

const SidebarComponent: React.FC<SidebarProps> = ({ currentTheme, boards, setSelectedBoard, setSelectedComponent, onNewBoardAdded }) => {
  const [isOpen, setIsOpen] = useState(true);
  const is_Pinned_Value: boolean = JSON.parse(localStorage.getItem('isPinned') || 'false');
  const [isPinned, setIsPinned] = useState<boolean>(is_Pinned_Value);
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);



  const [newBoardName, setNewBoardName] = useState<string>('');
  const [addingNewBoard, setAddingNewBoard] = useState<boolean>(false);





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


  const handleBoardClick = (board: board) => {
    setSelectedBoard(board);
    setSelectedComponent("Boards");
    setSelectedBoardId(board.id); // Update the selected board ID
  }
  // ========================================== add new board =================================================
  const handleBoardAddClick = () => {
    setAddingNewBoard(true);
  }

  const canselBoardAdding = () => {
    setAddingNewBoard(false);
    setNewBoardName('');
  }


  const handle_add_new_board = async () => {
    try {
      const response = await axiosInstance.post('api/boards/', {
        name: newBoardName
      },
        {
          headers:
            { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        const newBoard = response.data;
        onNewBoardAdded(newBoard);
        setAddingNewBoard(false);
        setNewBoardName('');
        console.log('newBoard--->>>', newBoard)

    } catch (error) {

    }
  }



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
                <SubMenu label="Boards" id="board" icon={<GrTasks className="sidebar_big_icon" />}>
                  {isOpen && (
                    <div >
                      {boards.map((board: board) => (
                        <MenuItem
                          key={board.id}
                          rootStyles={{
                            backgroundColor: `${currentTheme['--background-color']}`,
                            transition: 'all 0.3s',
                            color: selectedBoardId === board.id ? 'green' : currentTheme['--main-text-coloure'], // Apply different color if selected
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
                      <h3 onClick={handleBoardAddClick} style={{ backgroundColor: `${currentTheme['--background-color']}`, color: 'black', margin: '0px' }} >+ New board</h3>
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
                      <button onClick={handle_add_new_board} > Add</button>
                      <button onClick={canselBoardAdding}> Cansel</button>
                    </div>
                  )}

                </SubMenu>

                <MenuItem icon={<GoRepoTemplate className='sidebar_big_icon' />} onClick={() => setSelectedComponent("Templates")} >Templates</MenuItem>
                <MenuItem
                  icon={<FaCalendarAlt className='sidebar_big_icon' />}
                  onClick={() => setSelectedComponent("Calendar")}
                >Calendar</MenuItem>
              </Menu>
            </div>
            <div >
              <Menu style={{ marginTop: 'auto' }}>
                <MenuItem
                  icon={<RiSettings4Fill className="sidebar_big_icon" />}
                  onClick={() => setSelectedComponent("Settings")}
                >Settings</MenuItem>
              </Menu>
            </div>
          </div>
        </Sidebar>

      </div>
    </div>
  );
};

export default SidebarComponent;