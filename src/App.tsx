import './App.css'
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage'
import Login from './auth/login'
import Register from './auth/register'
import Boards from './components/Boards';
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




const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    email: '',
    phone_number: '',
    profile_picture: '',
    username: ''
  });



  const accessToken: string | null = localStorage.getItem('access_token');
  const refreshToken: string | null = localStorage.getItem('refresh_token');
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
  }, []);
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
          console.log("Profile data", response.data);
        } catch (error) {
          console.error("Error while retrieving profile data", error);
        }
      }
    };

    fetchProfile();
  }, [isAuthenticated, accessToken, refreshToken]);

  // =================================  validate tokens on website load ==================================
  const validateTokens = async () => {
    console.log("validateTokens called");
    if (accessToken) {
      try {
        const response = await axiosInstance.post(`acc/token/verify/`, {
          token: accessToken,
        });
        console.log("Access token is valid", response);
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
      <Header profileData={profileData} isAuthenticated={isAuthenticated}  />
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<MainPage />} />
        <Route path='/boards' element={<Boards />} />
      </Routes>
    </Router>
  );
};

export default App;