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
import { VscTriangleRight } from "react-icons/vsc";


interface MainPageProps {
  currentTheme: ThemeSpecs;
  boards: board[];
  setBoards: (boards: board[]) => void;
  setSelectedBoard: (board: board | null) => void;
  selectedBoard: board | null;
  current_user_email: string;
  profileData: ProfileData;
  FetchProfileData: () => Promise<void>;
  fetchBoards: () => Promise<void>;
  setCurrent_board_users: (users: Board_Users[]) => void;
  current_board_users: Board_Users[];
  is_cur_Board_users_fetched: boolean;
  fetch_current_board_users: () => Promise<void>;
  isBoardsLoaded: boolean;
  setIsBoardsLoaded: (isLoaded: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
  notificationData: any;
  fetchBoardById?: (boardId: number) => Promise<void>;
  setIs_new_notification_received: (is_new_notification_received: boolean) => void;
  is_new_notification_received: boolean;
  is_members_refreshing: boolean;
  setCurrentTheme: (theme: ThemeSpecs) => void;
  setIsCustomThemeSelected: (isCustomThemeSelected: boolean) => void;
  setSaved_custom_theme: (theme: ThemeSpecs) => void;
  isMobile: boolean; // Optional prop for mobile view
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const MainPage: React.FC<MainPageProps> = ({
  currentTheme,
  boards,
  setBoards,
  setSelectedBoard,
  selectedBoard,
  current_user_email,
  profileData,
  FetchProfileData,
  fetchBoards,
  setCurrent_board_users,
  current_board_users,
  is_cur_Board_users_fetched,
  fetch_current_board_users,
  isBoardsLoaded,
  setIsBoardsLoaded,
  setIsLoading,
  isLoading,
  notificationData,
  setIs_new_notification_received,
  is_new_notification_received,
  is_members_refreshing,
  setCurrentTheme,
  setIsCustomThemeSelected,
  setSaved_custom_theme,
  isMobile,
  setIsAuthenticated,
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
    if (boards.length > 0 && selectedBoard?.id === 0) {
      setSelectedBoard(boards[0]);
    }
  }, [boards, selectedBoard, setSelectedBoard]);



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
        setSelectedComponent("Boards"); // Switch to the Boards view
      }
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };

  // -------------------------------------   update backgrownd image based on board ---------------------------------------------------

  // Update body's background image with smooth animation
  useEffect(() => {
    const body = document.body;
    if (selectedBoard?.background_image) {
      body.style.transition = "background-image 0.5s ease-in-out, background-color 0.5s ease-in-out";
      body.style.backgroundImage = `url(${selectedBoard.background_image})`;
      body.style.backgroundSize = "cover";
      body.style.backgroundRepeat = "no-repeat";
    } else {
      body.style.transition = "background-image 0.5s ease-in-out, background-color 0.5s ease-in-out";
      body.style.backgroundImage = ""; // Reset background image
    }
  }, [selectedBoard]);


  const renderComponent = useCallback(() => {

    switch (selectedComponent) {
      case "Settings":
        return <Settings
          profileData={profileData}
          FetchProfileData={FetchProfileData}
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
          setIsCustomThemeSelected={setIsCustomThemeSelected}
          setSaved_custom_theme={setSaved_custom_theme}
          boards={boards}
          setBoards={setBoards}
          current_user_email={current_user_email}
          isMobile={isMobile}
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
            currentTheme={currentTheme}
            setSelectedBoard={setSelectedBoard}
            selectedBoard={selectedBoard}
            current_user_email={current_user_email}
            profileData={profileData}
            setBoards={setBoards}
            boards={boards}
            current_board_users={current_board_users}
            is_cur_Board_users_fetched={is_cur_Board_users_fetched}
            setCurrent_board_users={setCurrent_board_users}
            fetch_current_board_users={fetch_current_board_users}
            isBoardsLoaded={isBoardsLoaded}
            setIsLoading={setIsLoading}
            is_members_refreshing={is_members_refreshing}
            isMobile={isMobile}
          />
        );
      case "Notification":
        return <Notification
          currentTheme={currentTheme}
          setIsLoading={setIsLoading}
          isMobile={isMobile}
        />;

    }
  }, [selectedComponent, boards, selectedBoard,
    currentTheme, profileData, current_board_users,
    is_cur_Board_users_fetched, isLoading, setIsLoading,
    notificationData, isBoardsLoaded, setCurrent_board_users, setCurrentTheme,

  ]);



  // ===========================================================================================================

  const memoizedRenderComponent = useMemo(() => renderComponent(), [renderComponent]);
  const [is_sidebar_open_on_mobile, setIs_sidebar_open_on_mobile] = useState<boolean>(true);
  const [showSidebarOpenArrow, setShowSidebarOpenArrow] = useState<boolean>(false);

  useEffect(() => {
    if (is_sidebar_open_on_mobile) {
      setTimeout(() => {
        setShowSidebarOpenArrow(is_sidebar_open_on_mobile);
      }, 500);
    } else {
      setShowSidebarOpenArrow(is_sidebar_open_on_mobile);
    }
  }, [is_sidebar_open_on_mobile]);



  return (
    <div className="mainpage_component"

    >
      {isLoading && (
        <div className="main_loader_container" >
          <GridLoader color={`${currentTheme['--main-text-coloure']}`} size={20} className="gridloader" />
        </div>
      )}

      {showSidebarOpenArrow && isMobile && (
        <div
          className="side_open_rectangle_container"
          onClick={() => setIs_sidebar_open_on_mobile(false)}
          style={{
            backgroundColor: currentTheme['--list-background-color'],
            borderColor: currentTheme['--main-text-coloure'],
          }}
        >
          <VscTriangleRight
            className='close_sidebar_icon_triangle_icon'
          />
        </div>
      )}

      <SidebarComponent
        currentTheme={currentTheme}
        boards={boards}
        setBoards={setBoards}
        setSelectedBoard={setSelectedBoard}
        selectedComponent={selectedComponent}
        setSelectedComponent={setSelectedComponent}
        setIs_new_notification_received={setIs_new_notification_received}
        is_new_notification_received={is_new_notification_received}
        setIsBoardsLoaded={setIsBoardsLoaded}
        isBoardsLoaded={isBoardsLoaded}
        selectedBoard={selectedBoard}
        isMobile={isMobile}
        setIs_sidebar_open_on_mobile={setIs_sidebar_open_on_mobile}
        is_sidebar_open_on_mobile={is_sidebar_open_on_mobile}
        setIsAuthenticated={setIsAuthenticated}
      />
      {memoizedRenderComponent}
    </div>
  );
};

export default MainPage;