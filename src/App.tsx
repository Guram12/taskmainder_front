import './App.css'
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage'
import Login from './auth/login'
import Register from './auth/register'
import Header from './header/Header';
import { useState } from 'react';
import axiosInstance from './utils/axiosinstance';
import { ThemeSpecs } from './utils/theme';
import { board } from './utils/interface';
import FinishGoogleSignIn from './auth/FinishGoogleSignIn';
import { ProfileData } from './utils/interface';
import PasswordReset from './auth/PasswordReset';
import PasswordResetConfirm from './auth/PasswordResetConfirm';
import subscribeToPushNotifications from './utils/supbscription';
import { Board_Users } from './utils/interface';
import { NotificationPayload } from './utils/interface';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import CustomDragLayer from './components/Boards/CustomDragLayer';






const App: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'ka'>('en');

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    id: 0,
    email: '',
    phone_number: '',
    profile_picture: '',
    username: '',
    timezone: '',
    is_social_account: false,
  });

  const default_is_custom_theme_selected = localStorage.getItem('isCustomThemeSelected') === null ? false : localStorage.getItem('isCustomThemeSelected') === 'true';

  const [isCustomThemeSelected, setIsCustomThemeSelected] = useState<boolean>(default_is_custom_theme_selected);

  const background_color = localStorage.getItem('background_color') || '#4E4E4E';
  const border_color = localStorage.getItem('border_color') || '#d9e0e3';
  const main_text_coloure = localStorage.getItem('main_text_coloure') || '#333';
  const scrollbar_thumb_color = localStorage.getItem('scrollbar_thumb_color') || '#d9e0e3';
  const list_background_color = localStorage.getItem('list_background_color') || '#ffffff';
  const task_background_color = localStorage.getItem('task_background_color') || '#f0f0f0';


  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const [saved_custom_theme, setSaved_custom_theme] = useState({
    '--background-color': background_color,
    '--border-color': border_color,
    '--main-text-coloure': main_text_coloure,
    '--scrollbar-thumb-color': scrollbar_thumb_color,
    '--list-background-color': list_background_color,
    '--task-background-color': task_background_color,
  });

  const [currentTheme, setCurrentTheme] = useState<ThemeSpecs>({
    '--background-color': '#4E4E4E',
    '--border-color': '#d9e0e3',
    '--main-text-coloure': '#333',
    '--scrollbar-thumb-color': '#d9e0e3',
    '--list-background-color': '#ffffff',
    '--task-background-color': '#f0f0f0',
  });

  const [change_current_theme, setChange_current_theme] = useState(false);
  const [boards, setBoards] = useState<board[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<board | null>({
    id: 0,
    name: '',
    created_at: '',
    lists: [],
    owner: '',
    owner_email: '',
    members: [],
    board_users: [],
    background_image: null,
  });

  const [isBoardsLoaded, setIsBoardsLoaded] = useState<boolean>(false);


  const [current_board_users, setCurrent_board_users] = useState<Board_Users[]>([]);
  const [is_cur_Board_users_fetched, setIs_cur_Board_users_fetched] = useState<boolean>(false);

  useEffect(() => {
    console.log('boards==>>:', boards);
  }, [boards]);



  const [notificationData, setNotificationData] = useState<NotificationPayload>({
    type: "USER_REMOVED_FROM_BOARD",
    title: '',
    body: '',
    notification_id: 0,
    is_read: false,
  });


  const [is_new_notification_received, setIs_new_notification_received] = useState<boolean>(false);




  const accessToken: string | null = localStorage.getItem('access_token');
  const refreshToken: string | null = localStorage.getItem('refresh_token');


  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const themeSpecs: ThemeSpecs = JSON.parse(savedTheme);
      for (const [key, value] of Object.entries(themeSpecs)) {
        document.documentElement.style.setProperty(key, value);
      }
      document.body.style.backgroundColor = themeSpecs['--background-color'];
    }

  }, [change_current_theme]);

  // ==========================================================  regiester service worker ==========================================


  useEffect(() => {
    subscribeToPushNotifications();
  }, []);


  // -------------------------------------------- socket connection for board users ------------------------------------------
  const [is_members_refreshing, setIs_members_refreshing] = useState<boolean>(false);

  const fetch_current_board_users = async () => {
    setIs_cur_Board_users_fetched(false);
    setIs_members_refreshing(true);
    try {
      console.log("selected board users are fetching");
      const response = await axiosInstance.get(`/api/boards/${selectedBoard?.id}/users/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setCurrent_board_users(response.data);
      setIs_cur_Board_users_fetched(true);
      setIs_members_refreshing(false);
    } catch (error) {
      console.error('Error fetching board users:', error);
      setIs_cur_Board_users_fetched(false);
      setIs_members_refreshing(false);
    }
  };



  // =========================================  handle push notification types for updates ===============================================

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data) {
          const { type, ...payload } = event.data;
          setIs_new_notification_received(true);


          switch (type) {
            case 'TASK_DUE_REMINDER':
              console.log(
                `TASK_DUE_REMINDER type ==>> Task Name: ${payload.taskName}, Due Date: ${payload.dueDate}, Priority: ${payload.priority}`
              );
              break;


            case 'USER_REMOVED_FROM_BOARD':
              console.log(`USER_REMOVED_FROM_BOARD type ==>> Board Name: ${payload.boardName}, Removed User Email: ${payload.removedUserEmail}`);
              setNotificationData(event.data);

              // Update the boards list to remove the board
              setBoards((prevBoards) => {
                const updatedBoards = prevBoards.filter((board) => board.name !== payload.boardName);
                if (updatedBoards.length === 0) {
                  setIsBoardsLoaded(true);
                  setSelectedBoard(null);
                }
                return updatedBoards;
              });

              // Reset boardData if no boards are left
              if (boards.length === 1 && boards[0].name === payload.boardName) {
                setSelectedBoard(null);
              }

              fetch_current_board_users();

              break;

            case 'BOARD_INVITATION_ACCEPTED':
              console.log('BOARD_INVITATION_ACCEPTED type ==>> Board Name:', payload.boardName);
              setNotificationData(event.data);

              break;

            case 'USER_LEFT_BOARD':
              console.log(`USER_LEFT_BOARD type ==>> Board Name: ${payload.boardName}, Left User Email: ${payload.leftUserEmail}, Left User Name: ${payload.leftUserName}`);
              setNotificationData(event.data);
              break;


            default:
              console.log('Unknown notification type received:', type, payload);
          }
        }
      });
    }
  }, []);








  // ========================================== fetch  boards ==================================================
  const fetchBoards = async () => {
    try {
      const response = await axiosInstance.get('api/boards/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      console.log('boards fetched successfully!!!!!!;');
      setBoards(response.data);
      setIsBoardsLoaded(true);
    } catch (error) {
      console.error("Error while retrieving boards", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBoards();
    }
  }, [isAuthenticated]);

  // ====================================  useEffect for  change  theme  ===============================================

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const themeSpecs: ThemeSpecs = JSON.parse(savedTheme);
      for (const [key, value] of Object.entries(themeSpecs)) {
        document.documentElement.style.setProperty(key, value);
      }
      document.body.style.backgroundColor = themeSpecs['--background-color'];

    }
  }, [change_current_theme]);

  // ------------------------------------------------------------------------------------
  const theme = localStorage.getItem('theme');
  useEffect(() => {
    if (theme) {
      const themeSpecs = JSON.parse(theme);
      setCurrentTheme(themeSpecs);
    }
  }, [change_current_theme]);


  //======================================== fetch profile data ==================================================
  const FetchProfileData = async () => {
    if (accessToken) {
      try {
        const response = await axiosInstance.get(`/acc/profile/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setProfileData({ ...response.data }); // Create a new object
      } catch (error) {
        console.error("Error while retrieving profile data", error);
      }
    }
  };

  useEffect(() => {
    FetchProfileData();
  }, [isAuthenticated, accessToken, refreshToken]);


  // =================================  validate tokens on website load ==================================
  const validateTokens = async () => {
    if (accessToken) {
      try {
        const response = await axiosInstance.post(`acc/token/verify/`, {
          token: accessToken,
        });
        return response.status === 200;
      } catch (error) {
        console.error('Access token is invalid', error);
      }
    }
    if (refreshToken) {
      try {
        const response = await axiosInstance.post(`/acc/token/refresh/`, {
          refresh: refreshToken,
        });
        console.log("Refresh token is valid", response);
        localStorage.setItem('access_token', response.data.access);
        return true;
      } catch (error) {
        console.error('Refresh token is invalid', error);
      }
    }
    return false;
  };
  // --------------------------------------------------------------------------------------------------------

  useEffect(() => {
    const checkAuthentication = async () => {
      const isValid = await validateTokens();
      if (isValid) {
        setIsAuthenticated(true);
        if (window.location.pathname === '/') {
          window.location.href = '/mainpage'; // Redirect to main page if on login page
        }
      } else {
        setIsAuthenticated(false);

      }
    };

    checkAuthentication();
  }, []);


  // ========================================================================================================

  return (
    <DndProvider
      backend={isMobile ? TouchBackend : HTML5Backend}
      options={isMobile ? { enableMouseEvents: true, enableTouchScroll: true } : undefined}
    >

      <Router>
        <Header
          profileData={profileData}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          setChange_current_theme={setChange_current_theme}
          change_current_theme={change_current_theme}
          currentTheme={currentTheme}
          isCustomThemeSelected={isCustomThemeSelected}
          saved_custom_theme={saved_custom_theme}
          setCurrentTheme={setCurrentTheme}
          isMobile={isMobile}
          setLanguage={setLanguage}
          language={language}

        />
        <Routes>
          <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/password-reset-confirm/:uid/:token" element={<PasswordResetConfirm />} />
          <Route path="/finish-profile" element={<FinishGoogleSignIn setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/mainpage"
            element={<MainPage
              selectedBoard={selectedBoard}
              setSelectedBoard={setSelectedBoard}
              currentTheme={currentTheme}
              boards={boards}
              setBoards={setBoards}
              current_user_email={profileData.email}
              profileData={profileData}
              FetchProfileData={FetchProfileData}
              fetchBoards={fetchBoards}
              setCurrent_board_users={setCurrent_board_users}
              current_board_users={current_board_users}
              is_cur_Board_users_fetched={is_cur_Board_users_fetched}
              fetch_current_board_users={fetch_current_board_users}
              isBoardsLoaded={isBoardsLoaded}
              setIsBoardsLoaded={setIsBoardsLoaded}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
              notificationData={notificationData}
              setIs_new_notification_received={setIs_new_notification_received}
              is_new_notification_received={is_new_notification_received}
              is_members_refreshing={is_members_refreshing}
              setCurrentTheme={setCurrentTheme}
              setIsCustomThemeSelected={setIsCustomThemeSelected}
              setSaved_custom_theme={setSaved_custom_theme}
              isMobile={isMobile}
              setIsAuthenticated={setIsAuthenticated}
            />} />
        </Routes>
        {isMobile && (
          <CustomDragLayer />
        )}
      </Router>
    </DndProvider>

  );
};

export default App;