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









const App: React.FC = () => {

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
  });


  const [isBoardsLoaded, setIsBoardsLoaded] = useState<boolean>(false);


  const [current_board_users, setCurrent_board_users] = useState<Board_Users[]>([]);
  const [is_cur_Board_users_fetched, setIs_cur_Board_users_fetched] = useState<boolean>(false);



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

  // ==========================================================  regiester service worker ==========================================


  useEffect(() => {
    subscribeToPushNotifications();
  }, []);

  // -------------------------------------------- socket connection for board users ------------------------------------------
  const fetch_current_board_users = async () => {
    setIs_cur_Board_users_fetched(false);
    try {
      console.log("selected board users are fetching");
      const response = await axiosInstance.get(`/api/boards/${selectedBoard?.id}/users/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setCurrent_board_users(response.data);
      setIs_cur_Board_users_fetched(true);
    } catch (error) {
      console.error('Error fetching board users:', error);
      setIs_cur_Board_users_fetched(false);
    }
  };
  // ======================== fetch users if only selected  board is same as in payload ========

  useEffect(() => {
    console.log('selected board ----->>>   :', selectedBoard);
  }, [selectedBoard]);


  const fetch_Users_If_SelectedBoard_Matches = async (payload: NotificationPayload) => {
    const tringi_payload = JSON.stringify(payload);
    console.log(`payload boardid: ${tringi_payload} ==? selectedboard.id ${selectedBoard?.id}`);
    if (selectedBoard?.id === payload.board_id) {

      await fetch_current_board_users();
    } else {
      console.log("Selected board does not match the payload board ID. No action taken.");
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
              console.log('Board invitation accepted. Fetching current board users...');
              setNotificationData(event.data);
              setSelectedBoard(selectedBoard)
              fetch_Users_If_SelectedBoard_Matches(payload);
              break;


            case 'USER_LEFT_BOARD':
              console.log(`USER_LEFT_BOARD type ==>> Board Name: ${payload.boardName}, Left User Email: ${payload.leftUserEmail}, Left User Name: ${payload.leftUserName}`);
              setNotificationData(event.data); // Update state with notification data


              fetch_current_board_users();
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
    <Router>
      <Header
        profileData={profileData}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        setChange_current_theme={setChange_current_theme}
        change_current_theme={change_current_theme}
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
          />} />
      </Routes>
    </Router>
  );
};

export default App;