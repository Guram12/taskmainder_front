import './App.css'
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage'
import Login from './auth/login'
import Register from './auth/register'
import Header from './header/Header';
import { useState } from 'react';
import axiosInstance from './utils/axiosinstance';
import { ThemeSpecs } from './header/Header';


export interface ProfileData {
  email: string;
  phone_number: string;
  profile_picture: string;
  username: string;
}

export interface board {
  id: number;
  name: string;
  created_at: string;
  lists: lists[];
  owner: string;
}

export interface lists {
  id: number;
  name: string;
  created_at: string;
  board: number;
  tasks: tasks[];
}

export interface tasks {
  created_at: string;
  description: string;
  due_date: string;
  id: number;
  list: number;
  title: string;
}


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    email: '',
    phone_number: '',
    profile_picture: '',
    username: ''
  });

  const [currentTheme, setCurrentTheme] = useState<ThemeSpecs>({
    '--background-color': '#f4f7f6',
    '--border-color': '#d9e0e3',
    '--main-text-coloure': '#333'
  });

  const [change_current_theme, setChange_current_theme] = useState(false);
  const [boards, setBoards] = useState<board[]>([]);




  const accessToken: string | null = localStorage.getItem('access_token');
  const refreshToken: string | null = localStorage.getItem('refresh_token');

  // ========================================== fetch  boards ==================================================
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axiosInstance.get('api/boards/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        console.log(response.data);
        setBoards(response.data);
      } catch (error) {
        console.error("Error while retrieving boards", error);
      }
    };

    if (isAuthenticated) {
      fetchBoards();
    }
  }, [isAuthenticated]);

  // ====================================  useEffect for theme change ===============================================
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
  useEffect(() => {
    const fetchProfile = async () => {
      if (accessToken) {
        try {
          const response = await axiosInstance.get(`/acc/profile/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          setProfileData(response.data);
        } catch (error) {
          console.error("Error while retrieving profile data", error);
        }
      }
    };

    fetchProfile();
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
    console.log("useEffect called");
    const checkAuthentication = async () => {
      const isValid = await validateTokens();
      if (isValid) {
        setIsAuthenticated(true);
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
        setChange_current_theme={setChange_current_theme}
        change_current_theme={change_current_theme}
      />
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" 
        element={<MainPage
          currentTheme={currentTheme}
          boards={boards}
        />} />
      </Routes>
    </Router>
  );
};

export default App;