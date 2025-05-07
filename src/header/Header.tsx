import "./Header.css";
import React from 'react';
import { ProfileData } from "../utils/interface";
import LogoComponent from '../components/LogoComponent';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeSpecs } from '../utils/theme';
import themes from '../utils/theme';
import { useNavigate } from 'react-router-dom';




interface HeaderProps {
  profileData: ProfileData;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setChange_current_theme: (change_current_theme: boolean) => void;
  change_current_theme: boolean;
}



const Header: React.FC<HeaderProps> = ({
  profileData,
  isAuthenticated,
  setIsAuthenticated,
  setChange_current_theme,
  change_current_theme,
}) => {

  const [showHeader, setShowHeader] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();



  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/register") {
      setShowHeader(false);
    }
    else {
      setShowHeader(true);
    }
  }, [location.pathname])



  // ============================== theme change function ======================================
  const changeTheme = (themeSpecs: ThemeSpecs) => {
    for (const [key, value] of Object.entries(themeSpecs)) {
      document.documentElement.style.setProperty(key, value)
    }
    localStorage.setItem('theme', JSON.stringify(themeSpecs));
    document.body.style.backgroundColor = themeSpecs['--background-color'];
    setChange_current_theme(!change_current_theme);
  }
  // ===========================================================================================

  const handleLogOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    navigate('/');
  }

  // ==============================================================================================
  return (
    <div className={`main_Header_container ${!isAuthenticated ? "hide_container" : ''}  ${!showHeader ? 'hide_header' : ""} `}>
      <div className='header_logo_container' >
        <LogoComponent />
      </div>

      <div className='header_coloure_container'>
        <div className='header_coloure_child_container example1'
          onClick={() => changeTheme(themes.dark)}></div>
        <div className='header_coloure_child_container example2'
          onClick={() => changeTheme(themes.theme1)}></div>
        <div className='header_coloure_child_container example3'
          onClick={() => changeTheme(themes.theme2)}></div>
        <div className='header_coloure_child_container example4'
          onClick={() => changeTheme(themes.light)}></div>
        <div className='header_coloure_child_container example5'
          onClick={() => changeTheme(themes.theme3)}></div>
        <div className='header_coloure_child_container example6'
          onClick={() => changeTheme(themes.theme4)}></div>
      </div>



      <div>
        <div className='header_profile_container' >
          <h3 className="header_profile_username">{profileData.username}</h3>
          <img src={profileData?.profile_picture} alt="profile" className="header_profile_picture" />
        </div>
      </div>
      <div>
        <button onClick={handleLogOut}  >logout</button>
      </div>
    </div>
  )
}

export default Header;





// 1F271B for example 1
// 19647E for example 2
// 28AFB0 for example 3
// F4D35E for example 4
// 708B75 for example 5
// 005f54 for example 6































