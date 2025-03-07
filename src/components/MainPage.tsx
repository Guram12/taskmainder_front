import "../styles/MainPage.css";
import React, { useState, useMemo, useCallback, useEffect } from "react";
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
  setSelected_board_ID_for_sidebar?: (id: number| null) => void;
  selected_board_ID_for_sidebar?: number | null;
}

const MainPage: React.FC<MainPageProps> = ({
  currentTheme,
  boards,
  setSelectedBoard,
  selectedBoard,
  setIsLoading,
  setSelected_board_ID_for_sidebar,
  selected_board_ID_for_sidebar,

}) => {
  const [selectedComponent, setSelectedComponent] = useState<string>("Boards");

  useEffect(() => {
    if (boards.length > 0 && selectedBoard.id === 0) {
      setSelectedBoard(boards[0]);
    }
  }, [boards, selectedBoard, setSelectedBoard]);

  const renderComponent = useCallback(() => {
    switch (selectedComponent) {
      case "Settings":
        return <Settings boards={boards} />;
      case "Calendar":
        return <Calendar boards={boards} />;
      case "Templates":
        return <Templates />;
      // case '':
      //   return ;
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
        setSelected_board_ID_for_sidebar={setSelected_board_ID_for_sidebar}
        selected_board_ID_for_sidebar={selected_board_ID_for_sidebar}
      />
      {memoizedRenderComponent}
    </div>
  );
};

export default MainPage;