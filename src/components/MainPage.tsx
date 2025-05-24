import "../styles/MainPage.css";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import SidebarComponent from "./SideBar";
import Settings from "./Settings";
import Calendar from "./Calendar";
import Boards from "./Boards/Boards";
import { ThemeSpecs } from "../utils/theme";
import { board } from "../utils/interface";
import Templates from "./Templates";
import { ProfileData } from "../utils/interface";
import { StyledEngineProvider } from '@mui/material/styles';
import axiosInstance from "../utils/axiosinstance";
import { Board_Users } from "../utils/interface";
import Notification from "./Notification";
import GridLoader from "react-spinners/GridLoader";


interface MainPageProps {
  currentTheme: ThemeSpecs;
  boards: board[];
  setBoards: (boards: board[]) => void;
  setSelectedBoard: (board: board) => void;
  selectedBoard: board;
  setSelected_board_ID_for_sidebar?: (id: number | null) => void;
  selected_board_ID_for_sidebar?: number | null;
  current_user_email: string;
  profileData: ProfileData;
  FetchProfileData: () => Promise<void>;
  fetchBoards: () => Promise<void>;
  setCurrent_board_users: (users: Board_Users[]) => void;
  current_board_users: Board_Users[];
  fetch_current_board_users: () => Promise<void>;
  isBoardsLoaded: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
  notificationData: any;
}

const MainPage: React.FC<MainPageProps> = ({
  currentTheme,
  boards,
  setBoards,
  setSelectedBoard,
  selectedBoard,
  setSelected_board_ID_for_sidebar,
  selected_board_ID_for_sidebar,
  current_user_email,
  profileData,
  FetchProfileData,
  fetchBoards,
  setCurrent_board_users,
  current_board_users,
  fetch_current_board_users,
  isBoardsLoaded,
  setIsLoading,
  isLoading,
  notificationData,
}) => {
  const [selectedComponent, setSelectedComponent] = useState<string>("Boards");


  const accessToken: string | null = localStorage.getItem('access_token');
  const refreshToken: string | null = localStorage.getItem('refresh_token');



  // --------------------------------------------------------------------------------------------------------------
  // if accesstoken or refreshtoken is null,or incorrect , redirect to login page
  useEffect(() => {
    if (!accessToken || !refreshToken) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/';
    }

  }, [refreshToken, accessToken]);

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

  // ---------------------------------------------------------------------------------------------------------------------

  const handleTemplateSelect = async (boardId: number) => {
    try {
      // Fetch the updated boards from the backend
      const response = await axiosInstance.get("/api/boards/");
      setBoards(response.data);

      // Set the newly created board as the selected board
      const newBoard = response.data.find((board: board) => board.id === boardId);
      if (newBoard) {
        setSelectedBoard(newBoard);
        setSelected_board_ID_for_sidebar?.(newBoard.id);
        setSelectedComponent("Boards"); // Switch to the Boards view
      }
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };




  const renderComponent = useCallback(() => {

    switch (selectedComponent) {
      case "Settings":
        return <Settings
          profileData={profileData}
          FetchProfileData={FetchProfileData}
          currentTheme={currentTheme}
        />;

      case "Calendar":
        return <StyledEngineProvider injectFirst>
          <Calendar
            boards={boards}
            currentTheme={currentTheme}
            fetchBoards={fetchBoards}
          />
        </StyledEngineProvider>;

      case "Templates":
        return <Templates
          handleTemplateSelect={handleTemplateSelect}
          currentTheme={currentTheme}
          setIsLoading={setIsLoading}
        />;


      case "Boards":
        return (
          <Boards
            key={selectedBoard.id} // Force re-render when selectedBoard changes
            currentTheme={currentTheme}
            setSelectedBoard={setSelectedBoard}
            selectedBoard={selectedBoard}
            current_user_email={current_user_email}
            profileData={profileData}
            setBoards={setBoards}
            boards={boards}
            current_board_users={current_board_users}
            setCurrent_board_users={setCurrent_board_users}
            fetch_current_board_users={fetch_current_board_users}
            isBoardsLoaded={isBoardsLoaded}
            setIsLoading={setIsLoading}

          />
        );
      case "Notification":
        return <Notification
          currentTheme={currentTheme}
          setIsLoading={setIsLoading}
        />;

    }
  }, [selectedComponent, boards, selectedBoard, currentTheme, profileData, current_board_users, isLoading, setIsLoading, notificationData]);

  const memoizedRenderComponent = useMemo(() => renderComponent(), [renderComponent]);

  return (
    <div className="mainpage_component">
      {isLoading && (
        <div className="main_loader_container" >
          <GridLoader color={`${currentTheme['--main-text-coloure']}`} size={20} className="gridloader" />
        </div>
      )}
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