import "../styles/MainPage.css";
import React from "react";
import SidebarComponent from "./SideBar";
import { useState } from "react"; 
import Settings from "./Settings";
import Calendar from "./Calendar";
import Boards from "./Boards";
import { ThemeSpecs } from "../utils/theme";
import { board } from "./Boards";

interface MainPageProps {
  currentTheme: ThemeSpecs;
  boards: board[];
  setSelectedBoard: (board: board) => void;
  selectedBoard: board;
}



const MainPage: React.FC<MainPageProps> = ({ currentTheme, boards, setSelectedBoard , selectedBoard}) => {
  const [selectedComponent, setSelectedComponent] = useState<string>("");

  const renderComponent = () => {
    switch (selectedComponent) {
      case "Settings":
        return <Settings  boards={boards}  />;
      case "Calendar":
        return <Calendar  boards={boards} />;
        case "Boards":
          return <Boards  selectedBoard={selectedBoard} currentTheme={currentTheme}  />;
      default:
        return <div>Select a component from the sidebar</div>;
    }
  }



  return (
    <div className="mainpage_component" >
      <SidebarComponent
        currentTheme={currentTheme}
        boards={boards}
        setSelectedBoard={setSelectedBoard}
        setSelectedComponent={setSelectedComponent}
      />

      {renderComponent()}
    </div>
  )
}

export default MainPage;










































