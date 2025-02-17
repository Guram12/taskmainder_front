import "../styles/MainPage.css";
import React, { useState, useMemo, useCallback } from "react";
import SidebarComponent from "./SideBar";
import Settings from "./Settings";
import Calendar from "./Calendar";
import Boards, { tasks } from "./Boards";
import { ThemeSpecs } from "../utils/theme";
import { board } from "./Boards";
import { lists } from "./Boards";
import Templates from "./Templates";
import LearnDrag from "./LearnDrag";


interface MainPageProps {
  currentTheme: ThemeSpecs;
  boards: board[];
  setSelectedBoard: (board: board) => void;
  selectedBoard: board;
  setIsLoading: (value: boolean) => void;
  onNewListAdded: (list: lists) => void;
  onNewTaskAdded: (task: tasks, activeListId: number | null) => void;
  onNewBoardAdded: (board: board) => void;
  handleTaskDeleted: (task: tasks) =>   void;
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
  handleTaskDeleted
}) => {
  const [selectedComponent, setSelectedComponent] = useState<string>("");

  const renderComponent = useCallback(() => {
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
            setSelectedBoard={setSelectedBoard}
            handleTaskDeleted={handleTaskDeleted}
          />
        );
      default:
        return <LearnDrag />;
    }
  }, [selectedComponent, boards, selectedBoard, currentTheme, setIsLoading, onNewListAdded, onNewTaskAdded]);

  const memoizedRenderComponent = useMemo(() => renderComponent(), [renderComponent]);

  return (
    <div className="mainpage_component">
      <SidebarComponent
        currentTheme={currentTheme}
        boards={boards}
        setSelectedBoard={setSelectedBoard}
        setSelectedComponent={setSelectedComponent}
        onNewBoardAdded={onNewBoardAdded}
      />
      {memoizedRenderComponent}
    </div>
  );
};

export default MainPage;