import React from "react";
import '../styles/Sidebar.css';
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { RiMenuFold2Fill } from "react-icons/ri";





const SidebarComponent: React.FC = () => {
  return (
    <div className="sidebar_main_container">
      <div className="sidebar_first_content" >
        <RiMenuFold2Fill className="sidebar_logos" />
      </div>

      <div className="sidebar_first_content" >
        <MdOutlineSpaceDashboard  className="sidebar_logos"/>

      </div>
    </div>
  );
};

export default SidebarComponent;