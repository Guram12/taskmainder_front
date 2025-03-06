// filepath: /home/guram/Desktop/task_management_app/task_front/taskmainder/src/components/MainPage.tsx
import "../styles/MainPage.css";
import React, { useState, useMemo, useCallback } from "react";
import SidebarComponent from "./SideBar";
import Settings from "./Settings";
import Calendar from "./Calendar";
import Boards from "./Boards";
import { ThemeSpecs } from "../utils/theme";
import { board } from "./Boards";
import Templates from "./Templates";
import LearnDrag from "./LearnDrag";

interface MainPageProps {
  currentTheme: ThemeSpecs;
  boards: board[];
  setSelectedBoard: (board: board) => void;
  selectedBoard: board;
  setIsLoading: (value: boolean) => void;
}

const MainPage: React.FC<MainPageProps> = ({
  currentTheme,
  boards,
  setSelectedBoard,
  selectedBoard,
  setIsLoading,
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
            setSelectedBoard={setSelectedBoard}
          />
        );
      default:
        return <LearnDrag />;
    }
  }, [selectedComponent, boards, selectedBoard, currentTheme, setIsLoading]);

  const memoizedRenderComponent = useMemo(() => renderComponent(), [renderComponent]);

  return (
    <div className="mainpage_component">
      <SidebarComponent
        currentTheme={currentTheme}
        boards={boards}
        setSelectedBoard={setSelectedBoard}
        setSelectedComponent={setSelectedComponent}
      />
      {memoizedRenderComponent}
    </div>
  );
};

export default MainPage;