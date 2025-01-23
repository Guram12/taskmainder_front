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

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<any>(null);

  const accessToken: string | null = localStorage.getItem('access_token');
  const refreshToken: string | null = localStorage.getItem('refresh_token');

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

  return (
    <Router>
      <Header />
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