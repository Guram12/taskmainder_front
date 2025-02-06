import "../styles/MainPage.css";
import React from "react";
import SidebarComponent from "./SideBar";
import { useState } from "react";
import Settings from "./Settings";
import Calendar from "./Calendar";
import Boards, { tasks } from "./Boards";
import { ThemeSpecs } from "../utils/theme";
import { board } from "./Boards";
import { lists } from "./Boards";
import Templates from "./Templates";


interface MainPageProps {
  currentTheme: ThemeSpecs;
  boards: board[];
  setSelectedBoard: (board: board) => void;
  selectedBoard: board;
  setIsLoading: (value: boolean) => void;
  onNewListAdded: (list: lists) => void;
  onNewTaskAdded: (task: tasks , axtiveListId : number | null) => void;
  onNewBoardAdded: (board: board) => void;
}



const MainPage: React.FC<MainPageProps> = ({
  currentTheme,
  boards,
  setSelectedBoard,
  selectedBoard,
  setIsLoading,
  onNewListAdded,
  onNewTaskAdded,
  onNewBoardAdded,
}) => {

  const [selectedComponent, setSelectedComponent] = useState<string>("");

  const renderComponent = () => {
    switch (selectedComponent) {
      case "Settings":
        return <Settings boards={boards} />;
      case "Calendar":
        return <Calendar boards={boards} />;
      case "Templates":
        return <Templates />;
      case "Boards":
        return (
          <Boards
            selectedBoard={selectedBoard}
            currentTheme={currentTheme}
            setIsLoading={setIsLoading}
            onNewListAdded={onNewListAdded}
            onNewTaskAdded={onNewTaskAdded}
          />
        );
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
        onNewBoardAdded={onNewBoardAdded}
      />

      {renderComponent()}
    </div>
  )
}

export default MainPage;










































