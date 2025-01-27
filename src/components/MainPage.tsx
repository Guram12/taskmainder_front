import "../styles/MainPage.css";
import React from "react";
import SidebarComponent from "./SideBar";
import { ThemeSpecs } from "../header/Header";
import { board } from "../App";



interface MainPageProps {
  currentTheme: ThemeSpecs;
  boards: board[];
}



const MainPage: React.FC<MainPageProps> = ({ currentTheme, boards }) => {





  return (
    <div>
      <SidebarComponent currentTheme={currentTheme} boards={boards} />


    </div>
  )
}

export default MainPage;










































