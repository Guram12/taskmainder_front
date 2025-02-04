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



interface SidebarProps {
  currentTheme: ThemeSpecs;
  boards: board[];
  setSelectedBoard: (board: board) => void;
  setSelectedComponent: (component: string) => void;
}


interface ThemeSpecs {
  '--background-color': string;
  '--border-color': string;
  '--main-text-coloure': string;
}

const SidebarComponent: React.FC<SidebarProps> = ({ currentTheme, boards, setSelectedBoard, setSelectedComponent }) => {
  const [isOpen, setIsOpen] = useState(true);
  const is_Pinned_Value: boolean = JSON.parse(localStorage.getItem('isPinned') || 'false');
  const [isPinned, setIsPinned] = useState<boolean>(is_Pinned_Value);





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
  }


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
                          }}
                          icon={<FaClipboardList />}
                          onClick={() => handleBoardClick(board)}
                        >
                          {board.name}
                        </MenuItem>
                      ))}
                    </div>
                  )}


                </SubMenu>
                <MenuItem icon={<GoRepoTemplate className='sidebar_big_icon' />}  >Templates</MenuItem>
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