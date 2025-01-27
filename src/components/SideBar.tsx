import React, { useState } from "react";
import '../styles/Sidebar.css';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaChartPie, FaChartLine, FaBook, FaCalendarAlt } from "react-icons/fa";
import { TiPin, TiPinOutline } from "react-icons/ti";


interface SidebarProps {
  currentTheme: ThemeSpecs;
}


interface ThemeSpecs {
  '--background-color': string;
  '--border-color': string;
  '--main-text-coloure': string;
}

const SidebarComponent: React.FC<SidebarProps> = ({ currentTheme }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isPinned, setIsPinned] = useState(true);








  // ================================== sidebar pin and unpin ===============================================
  const toggleSidebarPin = () => {
    setIsPinned(!isPinned);
  }

  const handleMouseEnter = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  }
  // =========================================================================================================
  return (
    <div className={`sidebar_main_container ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar_container">
        <Sidebar
          collapsed={!isOpen}
          backgroundColor="transparent"
          // onMouseEnter={handleMouseEnter}
          // onMouseLeave={handleMouseLeave}
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
                <MenuItem icon={<FaCalendarAlt />}>
                  <div className="for_dashboard_child_container">
                    <p> Dashboard</p>
                    <div onClick={toggleSidebarPin} className="pin_container">
                      {isPinned ? <TiPin className="pin_icon" /> : <TiPinOutline className="pin_icon" />}
                    </div>
                  </div>
                </MenuItem>

                <SubMenu label="Boards" id="board" icon={<MdOutlineSpaceDashboard />}>
                  {isOpen && (
                    <>
                      <MenuItem
                        rootStyles={{
                          backgroundColor: `${currentTheme['--background-color']}`,
                          transition: 'all 0.3s',
                        }}
                        icon={<FaChartPie />}
                      >
                        Pie charts
                      </MenuItem>
                      <MenuItem
                        rootStyles={{
                          backgroundColor: `${currentTheme['--background-color']}`,
                          transition: 'all 0.3s',
                        }}
                        icon={<FaChartLine />}
                      >
                        Line charts
                      </MenuItem>
                    </>
                  )}
                </SubMenu>
                <MenuItem icon={<FaBook />}>Documentation</MenuItem>
                <MenuItem icon={<FaCalendarAlt />}>Calendar</MenuItem>
              </Menu>
            </div>
            <div >
              <Menu style={{ marginTop: 'auto' }}>
                <MenuItem icon={<FaCalendarAlt />}>Settings</MenuItem>
              </Menu>
            </div>
          </div>
        </Sidebar>

      </div>
    </div>
  );
};

export default SidebarComponent;