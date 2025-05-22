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











const App: React.FC = () => {

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
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
  });

  const [change_current_theme, setChange_current_theme] = useState(false);
  const [boards, setBoards] = useState<board[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<board>({
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
  const [notificationData, setNotificationData] = useState<any>(null); // State to store notification data



  const [selected_board_ID_for_sidebar, setSelected_board_ID_for_sidebar] = useState<number | null>(null);


  const accessToken: string | null = localStorage.getItem('access_token');
  const refreshToken: string | null = localStorage.getItem('refresh_token');

  // ==========================================================  regiester service worker ==========================================


  useEffect(() => {
    subscribeToPushNotifications();
  }, []);

  // -------------------------------------------- socket connection for board users ------------------------------------------
  const fetch_current_board_users = async () => {
    try {
      console.log("selected board users are fetching because of notification ");
      const response = await axiosInstance.get(`/api/boards/${selectedBoard.id}/users/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      // console.log("fetched board users ", response.data);
      setCurrent_board_users(response.data);
    } catch (error) {
      console.error('Error fetching board users:', error);
    }
  };



  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'BOARD_USER_UPDATE') {
          console.log('Message received from service worker:', event.data);
          setNotificationData(event.data); // Update state with notification data
        }
      });
    }
  }, []);

  useEffect(() => {
    if (notificationData) {
      console.log('Notification data updated:', notificationData);
      // Perform actions based on the notification data
      fetch_current_board_users(); // Example: Fetch updated board users
    }
  }, [notificationData]);



  useEffect(() => {
    // this useeffect should trigger wheh i get push notigication and after i will do some functionality here
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
            setSelected_board_ID_for_sidebar={setSelected_board_ID_for_sidebar}
            selected_board_ID_for_sidebar={selected_board_ID_for_sidebar}
            current_user_email={profileData.email}
            profileData={profileData}
            FetchProfileData={FetchProfileData}
            fetchBoards={fetchBoards}
            setCurrent_board_users={setCurrent_board_users}
            current_board_users={current_board_users}
            fetch_current_board_users={fetch_current_board_users}
            isBoardsLoaded={isBoardsLoaded}
          />} />
      </Routes>
    </Router>
  );
};

export default App;