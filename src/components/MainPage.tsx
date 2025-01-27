import "../styles/MainPage.css";
import React from "react";
import SidebarComponent from "./SideBar";
import { ThemeSpecs } from "../header/Header";






interface MainPageProps {
  currentTheme: ThemeSpecs;
}





const MainPage: React.FC<MainPageProps> = ({  currentTheme }) => {

  return (
    <div>
      <SidebarComponent  currentTheme={currentTheme} />

    </div>
  )
}

export default MainPage;










































