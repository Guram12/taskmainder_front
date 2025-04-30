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
import { ProfileData } from "../App";
import { StyledEngineProvider } from '@mui/material/styles';




interface MainPageProps {
  currentTheme: ThemeSpecs;
  boards: board[];
  setBoards: (boards: board[]) => void;
  setSelectedBoard: (board: board) => void;
  selectedBoard: board;
  setIsLoading: (value: boolean) => void;
  setSelected_board_ID_for_sidebar?: (id: number | null) => void;
  selected_board_ID_for_sidebar?: number | null;
  current_user_email: string;
  profileData: ProfileData;
  FetchProfileData: () => Promise<void>;
}

const MainPage: React.FC<MainPageProps> = ({
  currentTheme,
  boards,
  setBoards,
  setSelectedBoard,
  selectedBoard,
  setIsLoading,
  setSelected_board_ID_for_sidebar,
  selected_board_ID_for_sidebar,
  current_user_email,
  profileData,
  FetchProfileData,
}) => {
  const [selectedComponent, setSelectedComponent] = useState<string>("Boards");


  // ------------------------------ set selected board depenging  previous user board selection ---------------------------


  useEffect(() => {
    if (boards.length > 0 && selectedBoard.id === 0) {
      setSelectedBoard(boards[0]);
    }
  }, [boards, selectedBoard, setSelectedBoard]);


  // ---------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    if (boards.length > 0 && selected_board_ID_for_sidebar === null) {
      setSelected_board_ID_for_sidebar?.(boards[0].id);
    }
  }, [boards, selected_board_ID_for_sidebar, setSelected_board_ID_for_sidebar]);

  const renderComponent = useCallback(() => {
    switch (selectedComponent) {
      case "Settings":
        return <Settings boards={boards} profileData={profileData} FetchProfileData={FetchProfileData} />;

      case "Calendar":
        return <StyledEngineProvider injectFirst>
          <Calendar boards={boards} />
        </StyledEngineProvider>;

      case "Templates":
        return <Templates />;


      case "Boards":
        return (
          <Boards
            currentTheme={currentTheme}
            setIsLoading={setIsLoading}
            setSelectedBoard={setSelectedBoard}
            selectedBoard={selectedBoard}
            current_user_email={current_user_email}
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
        setBoards={setBoards}
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