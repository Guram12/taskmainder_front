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
import { Dropdown } from 'antd';
import { IoMdArrowDropdown } from "react-icons/io";
import { AiFillSkin } from "react-icons/ai"; // Optional: theme icon
import { GlobalOutlined } from '@ant-design/icons'; // AntD icon for language


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
  isMobile: boolean; // Optional prop for mobile view
  setLanguage: (language: 'en' | 'ka') => void;
  language: 'en' | 'ka';
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
  saved_custom_theme,
  isMobile,
  setLanguage,
  language
}) => {

  const [showHeader, setShowHeader] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();


  // 
  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/register") {
      setShowHeader(false);
    }
    else {
      setShowHeader(true);
    }
  }, [location.pathname])


  // ======================================== language change function =========================================
  const handleLanguageChange = (lang: 'en' | 'ka') => {
    setLanguage(lang);
    // Optionally, persist language selection:
    localStorage.setItem('language', lang);
    // Add your i18n logic here if needed
  };


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

  const handle_return_to_custom_theme = () => {
    for (const [key, value] of Object.entries(saved_custom_theme)) {
      document.documentElement.style.setProperty(key, value);
    }
    document.body.style.backgroundColor = saved_custom_theme['--background-color'];
    document.body.style.color = saved_custom_theme['--main-text-coloure'];
    setCurrentTheme(saved_custom_theme);
    // Optionally, update the localStorage to reflect the custom theme selection
    localStorage.setItem('isCustomThemeSelected', 'true');
  };


  // ===========================================  dropdown styles   ================================================





  return (
    <div className={`main_Header_container ${!isAuthenticated ? "hide_container" : ''}  ${!showHeader ? 'hide_header' : ""} `}
      style={{
        backdropFilter: 'blur(10px)', // Apply blur effect to the background
        WebkitBackdropFilter: 'blur(10px)', // Safari support
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black for darker effect
      }}
    >
      <div className='header_logo_container' >
        <LogoComponent />
      </div>


      {!isMobile ? (
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

      ) : (
        <div className="mobile_theme_dropdown_wrapper"

        >
          <Dropdown
            trigger={['click']}
            overlay={
              <div className="theme_dropdown"
                style={{
                  backdropFilter: 'blur(10px)', // Apply blur effect to the background
                  WebkitBackdropFilter: 'blur(10px)', // Safari support
                  backgroundColor: 'rgba(0 0 0 / 0.27)',
                  borderColor: currentTheme['--border-color'] // Use the main text color for the border
                }}
              >
                <div className='header_coloure_child_container example2'
                  onClick={() => changeTheme(themes.dark_gray)} />
                <div className='header_coloure_child_container example3'
                  onClick={() => changeTheme(themes.dark_blue)} />
                <div className='header_coloure_child_container example4'
                  onClick={() => changeTheme(themes.yellow)} />
                <div className='header_coloure_child_container example5'
                  onClick={() => changeTheme(themes.light_green)} />
                <div
                  className='custom_theme_container_in_header'
                  style={{
                    backgroundColor: saved_custom_theme['--background-color'],
                    borderColor: saved_custom_theme['--border-color']
                  }}
                  onClick={handle_return_to_custom_theme}
                >
                  Custom Theme
                </div>
              </div>
            }
            placement="bottomLeft"
            arrow
          >
            <button className="mobile_theme_dropdown_btn"
              style={{
                backgroundColor: currentTheme['--list-background-color'],

              }}
            >
              <AiFillSkin size={20} style={{ marginRight: 6, color: currentTheme['--main-text-coloure'] }} />

              <IoMdArrowDropdown size={18} style={{ marginLeft: 4 }} />
            </button>
          </Dropdown>
        </div>
      )}

      {/* Language Dropdown */}
      <div className="mobile_language_dropdown_wrapper">
        <Dropdown
          trigger={['click']}
          overlay={
            <div className="language_dropdown">
              <div
                className={`language_option${language === 'en' ? ' selected' : ''}`}
                onClick={() => handleLanguageChange('en')}
              >
                🇬🇧 English
              </div>
              <div
                className={`language_option${language === 'ka' ? ' selected' : ''}`}
                onClick={() => handleLanguageChange('ka')}
              >
                🇬🇪 ქართული
              </div>
            </div>
          }
          placement="bottomLeft"
          arrow
        >
          <button className="mobile_language_dropdown_btn"
            style={{
              backgroundColor: currentTheme['--list-background-color'],
            }}
          >
            <GlobalOutlined style={{ marginRight: 6, color: currentTheme['--main-text-coloure'] }} />
            {language === 'en' ? 'EN' : 'KA'}
            <IoMdArrowDropdown size={18} style={{ marginLeft: 4 }} />
          </button>
        </Dropdown>
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

        {!isMobile && (
          <div>
            <button onClick={handleLogOut}  >logout</button>
          </div>
        )}
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































