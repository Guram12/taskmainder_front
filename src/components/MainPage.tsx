import "../styles/MainPage.css";
import React, { useState, useEffect, useRef } from "react";
import SidebarComponent from "./SideBar";
import Settings from "./Settings";
import Calendar from "./Calendar";
import Boards from "./Boards/Boards";
import { ThemeSpecs } from "../utils/theme";
import { board } from "../utils/interface";
import Templates from "./Templates";
import { ProfileData } from "../utils/interface";
// import { StyledEngineProvider } from '@mui/material/styles';
import axiosInstance from "../utils/axiosinstance";
import { Board_Users } from "../utils/interface";
import Notification from "./Notification";
import GridLoader from "react-spinners/GridLoader";
import { VscTriangleRight } from "react-icons/vsc";
import MindMap from "./MindMap";
import { environment_urls } from "../utils/URLS";
import { ReactFlowProvider } from 'reactflow';
import { Routes, Route, useNavigate } from "react-router-dom";
import { startTour } from "../utils/tour";
import { useTranslation } from 'react-i18next';
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

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
  fetchBoardById?: (boardId: number) => Promise<void>;
  setIs_new_notification_received: (is_new_notification_received: boolean) => void;
  is_new_notification_received: boolean;
  is_members_refreshing: boolean;
  setCurrentTheme: (theme: ThemeSpecs) => void;
  setIsCustomThemeSelected: (isCustomThemeSelected: boolean) => void;
  setSaved_custom_theme: (theme: ThemeSpecs) => void;
  isMobile: boolean; // Optional prop for mobile view
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setSelectedComponent: (selectedComponent: string) => void;
  selectedComponent: string;
  setActiveSidebarBoardId: (boardId: number | null) => void;
  activeSidebarBoardId: number | null;
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
  setIs_new_notification_received,
  is_new_notification_received,
  is_members_refreshing,
  setCurrentTheme,
  setIsCustomThemeSelected,
  setSaved_custom_theme,
  isMobile,
  setIsAuthenticated,
  setSelectedComponent,
  selectedComponent,
  setActiveSidebarBoardId,
  activeSidebarBoardId
}) => {

  const navigate = useNavigate();

  const accessToken: string | null = localStorage.getItem('access_token');
  const refreshToken: string | null = localStorage.getItem('refresh_token');

  const location = useLocation();

  const { t } = useTranslation();




  // --------------------------------------------------------------------------------------------------------------
  // if accesstoken or refreshtoken is null,or incorrect , redirect to login page
  useEffect(() => {
    if (!accessToken || !refreshToken) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/';
    }

  }, [refreshToken, accessToken]);



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
        navigate("/mainpage/boards"); // <--- change here

      }
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };

  // -------------------------------------   update backgrownd image based on board ---------------------------------------------------

  // Update body's background image with smooth animation
  useEffect(() => {
    const body = document.body;
    // Only show background image on boards route
    if (
      selectedBoard?.background_image &&
      location.pathname.startsWith("/mainpage/boards")
    ) {
      body.style.transition = "background-image 0.5s ease-in-out, background-color 0.5s ease-in-out";
      body.style.backgroundImage = `url(${selectedBoard.background_image})`;
      body.style.backgroundSize = "cover";
      body.style.backgroundRepeat = "no-repeat";
    } else {
      body.style.transition = "background-image 0.5s ease-in-out, background-color 0.5s ease-in-out";
      body.style.backgroundImage = ""; // Reset background image
    }
  }, [selectedBoard, location.pathname]);





  // ======================================   Main useEffect for websocket connection  =========================================
  const socketRef = useRef<WebSocket | null>(null);
  const listsContainerRef = useRef<HTMLDivElement | null>(null);

  const [boardData, setBoardData] = useState<board>({
    id: 0,
    name: '',
    created_at: '',
    lists: [],
    owner: '',
    owner_email: '',
    members: [],
    board_users: [],
    background_image: null,
    creation_date: '',

  });
  const [Adding_new_list, setAdding_new_list] = useState<boolean>(false);
  const [ListName, setListName] = useState<string>('');

  const [allCurrentBoardUsers, setAllCurrentBoardUsers] = useState<ProfileData[]>([]);



  const [isAddingList, setIsAddingList] = useState<boolean>(false);
  const [updatingListNameId, setUpdatingListNameId] = useState<number | null>(null);
  const [loadingLists, setLoadingLists] = useState<{ [listId: number]: boolean }>({});
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);
  const [completingTaskId, setCompletingTaskId] = useState<number | null>(null);
  const [adding_new_task_loader, setAdding_new_task_loader] = useState<{ listId: number | null }>({ listId: null });




  useEffect(() => {
    if (!selectedBoard?.id) return;

    if (socketRef.current) {
      socketRef.current.close();
    }


    const token = localStorage.getItem('access_token');
    const newSocket = new WebSocket(`${environment_urls.URLS.websockersURL}${selectedBoard.id}/?token=${token}`);
    // const newSocket = new WebSocket(`ws://localhost:8000/ws/boards/${selectedBoard.id}/?token=${token}`);

    socketRef.current = newSocket;


    newSocket.onopen = () => {
      console.log('WebSocket connection established');
    };

    newSocket.onerror = (error) => console.log('WebSocket error:', error);

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const { action, payload } = data;

      switch (action) {
        case 'move_task':
          const { task_id, source_list_id, target_list_id } = payload;
          setBoardData((prevData: board) => {
            const newBoardData = { ...prevData };
            const sourceListIndex = newBoardData.lists.findIndex(list => list.id === source_list_id);
            const targetListIndex = newBoardData.lists.findIndex(list => list.id === target_list_id);

            if (sourceListIndex === -1 || targetListIndex === -1) return newBoardData;

            const taskIndex = newBoardData.lists[sourceListIndex].tasks.findIndex(task => task.id === task_id);
            if (taskIndex === -1) return newBoardData;

            const [movedTask] = newBoardData.lists[sourceListIndex].tasks.splice(taskIndex, 1);
            movedTask.list = target_list_id;
            newBoardData.lists[targetListIndex].tasks.push(movedTask);

            return newBoardData;
          });
          break;

        case 'set_status':
          console.log('Received set_status:', payload);
          setBoardData((prevData: board) => {
            const newBoardData = { ...prevData };
            const userIndex = newBoardData.board_users.findIndex(user => user.id === payload.user_id);
            if (userIndex !== -1) {
              newBoardData.board_users[userIndex].user_status = payload.new_status;
            }
            return newBoardData;
          });

          const updatedBoardUsers = selectedBoard?.board_users.map((user) =>
            user.id === payload.user_id ? { ...user, user_status: payload.new_status } : user
          );

          setCurrent_board_users(updatedBoardUsers || []);
          break;

        case 'create':
        case 'update':
          setBoardData((prevData: board) => ({
            ...prevData,
            ...payload,
          }));
          break;

        case 'add_list':
          setBoardData((prevData: board) => ({
            ...prevData,
            lists: [...prevData.lists, payload],
          }));
          setIsAddingList(false); // Clear loading state when adding list

          break;

        case 'edit_list_name':
          console.log('Received edit_list_name:', payload);
          setBoardData((prevData: board) => {
            const updatedLists = prevData.lists.map((list) =>
              list.id === payload.list_id ? { ...list, name: payload.new_name } : list
            );
            setUpdatingListNameId(null);
            return { ...prevData, lists: updatedLists };
          });
          break;

        case 'reorder_lists':
          console.log('Received reorder_lists:', payload);
          setBoardData((prevData: board) => {
            const reorderedLists = payload.list_order.map((listId: number) =>
              prevData.lists.find((list) => list.id === listId)
            ).filter(Boolean); // Remove undefined

            // Also add any lists that are in prevData.lists but not in list_order (to avoid losing lists)
            const missingLists = prevData.lists.filter(
              (list) => !payload.list_order.includes(list.id)
            );

            return { ...prevData, lists: [...reorderedLists, ...missingLists] };
          });
          break;

        case 'delete_list':
          setIsLoading(false);
          setBoardData((prevData: board) => ({
            ...prevData,
            lists: prevData.lists.filter((list) => list.id !== payload.list_id),
          }));
          break;

        case 'add_task':
          console.log('Received add_task:', payload);
          setBoardData((prevData: board) => {
            const updatedLists = prevData.lists.map((list) => {
              if (list.id === payload.list) {
                return { ...list, tasks: [...list.tasks, payload] };
              }
              return list;
            });

            return { ...prevData, lists: updatedLists };
          });
          setLoadingLists((prev) => ({ ...prev, [payload.list]: false }));
          setAdding_new_task_loader({ listId: null }); // Clear the skeleton loader
          break;

        case 'delete_task':
          console.log('Received delete_task:', payload);
          setBoardData((prevData: board) => {
            const updatedLists = prevData.lists.map((list) => {
              if (list.id === payload.list_id) {
                return { ...list, tasks: list.tasks.filter((task) => task.id !== payload.task_id) };
              }
              return list;
            });
            return { ...prevData, lists: updatedLists };
          });
          break;

        case 'update_task':
          console.log('Received update_task:', payload);
          setBoardData((prevData: board) => {
            const updatedLists = prevData.lists.map((list) => ({
              ...list,
              tasks: list.tasks.map((task) =>
                task.id === payload.id ? {
                  ...task,
                  title: payload.title,
                  description: payload.description,
                  due_date: payload.due_date,
                  completed: payload.completed,
                  priority: payload.priority,
                  task_associated_users_id: payload.task_associated_users_id, // Add this line
                } : task
              ),
            }));
            setUpdatingTaskId(null);
            setCompletingTaskId(null);
            return { ...prevData, lists: updatedLists };
          });
          break;


        case 'reorder_task':
          console.log('Received reorder_task:', payload);
          setBoardData((prevData: board) => {
            const updatedLists = prevData.lists.map((list) => {
              if (list.id === payload.list_id) {
                const reorderedTasks = payload.task_order.map((taskId: number) =>
                  list.tasks.find((task) => task.id === taskId)
                );
                return { ...list, tasks: reorderedTasks };
              }
              return list;
            });
            return { ...prevData, lists: updatedLists };
          });
          break;


        case 'update_board_name':
          console.log('Received update_board_name:', payload);
          // Update boardData
          setBoardData((prevData: board) => ({
            ...prevData,
            name: payload.new_name,
          }));

          if (typeof payload.new_name === 'string') {
            // Update selectedBoard
            const updatedBoard: board = {
              ...selectedBoard,
              name: payload.new_name,
            };
            setSelectedBoard(updatedBoard);

            // Update boards array so Sidebar re-renders with new name
            const new_boards: board[] = boards.map((board: board) =>
              board.id === selectedBoard?.id ? { ...board, name: payload.new_name } : board
            );
            setBoards(new_boards);
          } else {
            console.error('Invalid board name:', payload.new_name);
          }
          break;


        case 'delete_board':
          console.log('Received delete_board:', payload);
          // Handle board deletion
          setBoardData((prevData: board) => ({ ...prevData, lists: [] }));
          setSelectedBoard({
            id: 0,
            name: '',
            created_at: '',
            lists: [],
            owner: '',
            owner_email: '',
            members: [],
            board_users: [],
            background_image: null,
            creation_date: '',

          });

          if (payload.board_id) {
            const updatedBoards = boards.filter((board) => board.id !== payload.board_id);
            setBoards(updatedBoards);
          }
          break;


        default:
          break;
      }
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    newSocket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [selectedBoard?.id]);

  // ===========================================================================================================
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


  // ======================================== for hilighting the elements in the tour ==========================================


  useEffect(() => {
    // also check MdWidthFull, if it is more than 768, do nothing
    if (window.innerWidth > 768) {

      if (localStorage.getItem('first_time_signup') === 'true') {
        startTour(currentTheme, navigate, t, setSelectedComponent);
        localStorage.setItem('first_time_signup', 'false');

      }
      else {
        localStorage.setItem('first_time_signup', 'false');
      }
    }
  }, []);



  // ====================================================================================================================

  return (
    <>
      <Helmet>
        <title>Main Page | DailyDoer</title>
        <meta name="description" content="Organize your tasks, boards, calendar, and more with DailyDoer. Collaborate, customize, and boost your productivity on your main dashboard." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://dailydoer.space/mainpage" />
      </Helmet>
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
          setActiveSidebarBoardId={setActiveSidebarBoardId}
          activeSidebarBoardId={activeSidebarBoardId}
        />
        <Routes>
          <Route path="boards" element={
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

              socketRef={socketRef}
              listsContainerRef={listsContainerRef}
              boardData={boardData}
              setBoardData={setBoardData}
              loadingLists={loadingLists}
              setLoadingLists={setLoadingLists}
              isAddingList={isAddingList}
              setIsAddingList={setIsAddingList}
              updatingListNameId={updatingListNameId}
              setUpdatingListNameId={setUpdatingListNameId}

              setUpdatingTaskId={setUpdatingTaskId}
              updatingTaskId={updatingTaskId}
              setCompletingTaskId={setCompletingTaskId}
              completingTaskId={completingTaskId}
              setAdding_new_list={setAdding_new_list}
              Adding_new_list={Adding_new_list}
              setListName={setListName}
              ListName={ListName}
              setAllCurrentBoardUsers={setAllCurrentBoardUsers}
              allCurrentBoardUsers={allCurrentBoardUsers}
              setAdding_new_task_loader={setAdding_new_task_loader}
              adding_new_task_loader={adding_new_task_loader}
              setSelectedComponent={setSelectedComponent}
              setActiveSidebarBoardId={setActiveSidebarBoardId}
            />
          } />
          <Route path="calendar" element={
            <Calendar
              boards={boards}
              currentTheme={currentTheme}
              fetchBoards={fetchBoards}
            />

          } />
          <Route path="settings" element={
            <Settings
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
            />
          } />
          <Route path="templates" element={
            <Templates
              handleTemplateSelect={handleTemplateSelect}
              currentTheme={currentTheme}
              setIsLoading={setIsLoading}
            />

          } />
          <Route path="notification" element={
            <Notification
              currentTheme={currentTheme}
              setIsLoading={setIsLoading}
              isMobile={isMobile}
            />
          } />
          <Route path="mindmap" element={
            <ReactFlowProvider>
              <MindMap
                currentTheme={currentTheme}
                boards={boards}
                setBoards={setBoards}
                allCurrentBoardUsers={allCurrentBoardUsers}
                setSelectedBoard={setSelectedBoard}
                setSelectedComponent={setSelectedComponent}
                setActiveSidebarBoardId={setActiveSidebarBoardId}
              />
            </ReactFlowProvider>
          } />
          {/* Default route */}
          <Route index element={
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

              socketRef={socketRef}
              listsContainerRef={listsContainerRef}
              boardData={boardData}
              setBoardData={setBoardData}
              loadingLists={loadingLists}
              setLoadingLists={setLoadingLists}
              isAddingList={isAddingList}
              setIsAddingList={setIsAddingList}
              updatingListNameId={updatingListNameId}
              setUpdatingListNameId={setUpdatingListNameId}

              setUpdatingTaskId={setUpdatingTaskId}
              updatingTaskId={updatingTaskId}
              setCompletingTaskId={setCompletingTaskId}
              completingTaskId={completingTaskId}
              setAdding_new_list={setAdding_new_list}
              Adding_new_list={Adding_new_list}
              setListName={setListName}
              ListName={ListName}
              setAllCurrentBoardUsers={setAllCurrentBoardUsers}
              allCurrentBoardUsers={allCurrentBoardUsers}
              setAdding_new_task_loader={setAdding_new_task_loader}
              adding_new_task_loader={adding_new_task_loader}
              setSelectedComponent={setSelectedComponent}
              setActiveSidebarBoardId={setActiveSidebarBoardId}
            />

          } />
        </Routes>
      </div>
    </>

  );
};

export default MainPage;