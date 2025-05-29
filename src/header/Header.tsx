import "./Header.css";
import React from 'react';
import { ProfileData } from "../utils/interface";
import LogoComponent from '../components/LogoComponent';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeSpecs } from '../utils/theme';
import themes from '../utils/theme';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar'; // Import Avatar from Material-UI
import getAvatarStyles from "../utils/SetRandomColor";



interface HeaderProps {
  profileData: ProfileData;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setChange_current_theme: (change_current_theme: boolean) => void;
  change_current_theme: boolean;
  currentTheme: ThemeSpecs;
  setCurrentTheme: (currentTheme: ThemeSpecs) => void;
  isCustomThemeSelected: boolean;
  saved_custom_theme: ThemeSpecs;
}



const Header: React.FC<HeaderProps> = ({
  profileData,
  isAuthenticated,
  setIsAuthenticated,
  setChange_current_theme,
  change_current_theme,
  currentTheme,
  setCurrentTheme,
  // isCustomThemeSelected,
  saved_custom_theme
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
    document.body.style.color = themeSpecs['--main-text-coloure'];
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
  // '--background-color': background_color,
  // '--border-color': border_color,
  // '--main-text-coloure': main_text_coloure,
  // '--scrollbar-thumb-color': scrollbar_thumb_color,
  // '--list-background-color': list_background_color,
  // '--task-background-color': task_background_color,


  const handle_return_to_custom_theme = () => {
    // Apply the saved custom theme to the document
    for (const [key, value] of Object.entries(saved_custom_theme)) {
      document.documentElement.style.setProperty(key, value);
    }
  
    // Update the body styles
    document.body.style.backgroundColor = saved_custom_theme['--background-color'];
    document.body.style.color = saved_custom_theme['--main-text-coloure'];
  
    // Update the current theme state
    setCurrentTheme(saved_custom_theme);
  
    // Optionally, update the localStorage to reflect the custom theme selection
    localStorage.setItem('isCustomThemeSelected', 'true');
  };
  // ==============================================================================================
  return (
    <div className={`main_Header_container ${!isAuthenticated ? "hide_container" : ''}  ${!showHeader ? 'hide_header' : ""} `}
      style={{ backgroundColor: currentTheme['--background-color'] }}
    >
      <div className='header_logo_container' >
        <LogoComponent />
      </div>

      <div className='header_coloure_container'>
        <div className='header_coloure_child_container example2'
          onClick={() => changeTheme(themes.dark_gray)}></div>
        <div className='header_coloure_child_container example3'
          onClick={() => changeTheme(themes.dark_blue)}></div>
        <div className='header_coloure_child_container example4'
          onClick={() => changeTheme(themes.yellow)}></div>
        <div className='header_coloure_child_container example5'
          onClick={() => changeTheme(themes.light_green)}></div>

        <div className='custom_theme_container_in_header'
          style={{
            backgroundColor: saved_custom_theme['--background-color'],
            borderColor: saved_custom_theme['--border-color']
          }}
          onClick={handle_return_to_custom_theme} 

        >
          Custom Theme
        </div>


      </div>



      <div>
        <div className="header_profile_container">
          <h3 className="header_profile_username">{profileData.username}</h3>
          {profileData?.profile_picture ? (
            <img
              src={profileData.profile_picture}
              alt="profile"
              className="header_profile_picture"
            />
          ) : (
            <Avatar
              style={{
                backgroundColor: getAvatarStyles(profileData.username.charAt(0)).backgroundColor,
                color: getAvatarStyles(profileData.username.charAt(0)).color
              }}
            >
              {profileData.username.charAt(0).toUpperCase()}
            </Avatar>
          )}
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































