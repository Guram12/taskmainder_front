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
import subscribeToPushNotifications from './utils/notification';


// =====>>>>  .გასაკეთებელი დავალებები
// ბოოარზე იუზერის დამატებისას იუზერს უნდა  მიუვიდეს ნოტიფიცა რომ დაადასტუროს ბიოარდზე დამატება
// Notifications System
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered with scope:', registration.scope);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/service-worker.js')
//     .then(registration => {
//       console.log('Service Worker registered:', registration);
//     })
//     .catch(error => {
//       console.error('Service Worker registration failed:', error);
//     });
// }

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



  const [selected_board_ID_for_sidebar, setSelected_board_ID_for_sidebar] = useState<number | null>(null);


  const accessToken: string | null = localStorage.getItem('access_token');
  const refreshToken: string | null = localStorage.getItem('refresh_token');

  // ==========================================================  regiester service worker ==========================================
  useEffect(() => {
    registerServiceWorker();
  }, []);


  useEffect(() => {
    subscribeToPushNotifications();
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
          />} />
      </Routes>
    </Router>
  );
};

export default App;