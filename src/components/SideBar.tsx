import React, { useEffect, useState } from "react";
import '../styles/Sidebar.css';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaChartPie, FaChartLine, FaBook, FaCalendarAlt } from "react-icons/fa";


interface SidebarProps {
  change_current_theme: boolean;
}


interface ThemeSpecs {
  '--background-color': string;
  '--border-color': string;
  '--main-text-coloure': string;
}

const SidebarComponent: React.FC<SidebarProps> = ({ change_current_theme}) => {
  const [isOpen, setIsOpen] = useState(false);


  const [currentTheme, setCurrentTheme] = useState<ThemeSpecs>({
    '--background-color': '#f4f7f6',
    '--border-color': '#d9e0e3',
    '--main-text-coloure': '#333'
  });



  const theme = localStorage.getItem('theme');
  // theme is a String. i shopuld transfer it to json object to use it
  useEffect(() => {
    if (theme) {
      const themeSpecs = JSON.parse(theme);
      console.log(themeSpecs)
      setCurrentTheme(themeSpecs);
    }
  }, [change_current_theme]);



  // make sidebar expanded while hopvering on sidebar
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
                <MenuItem icon={<FaCalendarAlt />}>Dashboard</MenuItem>
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