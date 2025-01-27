import "../styles/MainPage.css";
import React from "react";
import SidebarComponent from "./SideBar";







interface MainPageProps {
  change_current_theme: boolean;
}





const MainPage: React.FC<MainPageProps> = ({ change_current_theme }) => {

  return (
    <div>
      <SidebarComponent  change_current_theme={change_current_theme} />

    </div>
  )
}

export default MainPage;










































