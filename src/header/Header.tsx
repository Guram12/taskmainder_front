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
import { AiFillSkin } from "react-icons/ai"; // Optional: theme icon
import { GlobalOutlined } from '@ant-design/icons'; // AntD icon for language
import type { MenuProps } from 'antd';


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
  const themeKeys = [
    'dark_gray',
    'forest_night',
    'ocean_teal',
    'deep_aqua',
    'ink_cobalt',
    'charcoal_rose',
    'velvet_moss',
    'arctic_alice',
    'mint_ice',
    'spring_cloud',
    'lavender_mist'
  ];

  const themeMenu: MenuProps = {
    items: [
      ...themeKeys.map((key, idx) => ({
        key,
        label: (
          <div
            className={`header_coloure_child_container example${idx + 2}`}
            onClick={() => changeTheme(themes[key as keyof typeof themes])}
          />
        ),
      })),
      {
        key: 'custom',
        label: (
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
        ),
      },
    ],
  };



  // Language dropdown menu
  const languageMenu: MenuProps = {
    items: [
      {
        key: 'en',
        label: (
          <div
            className={`language_option${language === 'en' ? ' selected' : ''}`}
            onClick={() => handleLanguageChange('en')}
          >
            <p style={{ color: currentTheme['--main-text-coloure'], margin: 0 }}>
              🇬🇧 English
            </p>
          </div>
        ),
      },
      {
        key: 'ka',
        label: (
          <div
            className={`language_option${language === 'ka' ? ' selected' : ''}`}
            onClick={() => handleLanguageChange('ka')}
          >
            <p style={{ color: currentTheme['--main-text-coloure'], margin: 0 }}>
              🇬🇪 ქართული
            </p>
          </div>
        ),
      },
    ],
  };


  return (
    <div className={`main_Header_container ${!isAuthenticated ? "hide_container" : ''}  ${!showHeader ? 'hide_header' : ""} `}
      style={{
        backdropFilter: 'blur(10px)', // Apply blur effect to the background
        WebkitBackdropFilter: 'blur(10px)', // Safari support
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black for darker effect
        borderColor: currentTheme['--border-color'],
      }}
    >
      <div className='header_logo_container' >
        <LogoComponent />
      </div>

      {/* theme and language dropdowns*/}
      <div className="header_all_dropdowns_container" >
        {!isMobile ? (
          <div className='header_coloure_container'>
            <div className='header_coloure_child_container example2'
              onClick={() => changeTheme(themes.dark_gray)}></div>
            <div className='header_coloure_child_container example3'
              onClick={() => changeTheme(themes.forest_night)}></div>
            <div className='header_coloure_child_container example4'
              onClick={() => changeTheme(themes.ocean_teal)}></div>
            <div className='header_coloure_child_container example5'
              onClick={() => changeTheme(themes.deep_aqua)}></div>
            <div className='header_coloure_child_container example6'
              onClick={() => changeTheme(themes.ink_cobalt)}></div>
            <div className='header_coloure_child_container example7'
              onClick={() => changeTheme(themes.blue_steel)}></div>
            <div className='header_coloure_child_container example8'
              onClick={() => changeTheme(themes.velvet_moss)}></div>
            <div className='header_coloure_child_container example9'
              onClick={() => changeTheme(themes.arctic_alice)}></div>
            <div className='header_coloure_child_container example10'
              onClick={() => changeTheme(themes.mint_ice)}></div>
            <div className='header_coloure_child_container example11'
              onClick={() => changeTheme(themes.spring_cloud)}></div>
            <div className='header_coloure_child_container example11'
              onClick={() => changeTheme(themes.lavender_mist)}></div>


            <div className='custom_theme_container_in_header'
              style={{
                backgroundColor: currentTheme['--background-color'],
                borderColor: currentTheme['--border-color'],
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
              menu={themeMenu}
              placement="bottomLeft"
              arrow
              overlayClassName="custom-centered-dropdown"

            >
              <button className="mobile_theme_dropdown_btn"
                style={{
                  backgroundColor: currentTheme['--list-background-color'],
                }}
              >
                <AiFillSkin size={20} style={{ color: currentTheme['--main-text-coloure'] }} />
              </button>
            </Dropdown>
          </div>
        )}


      </div>



      <div className="language_and_user_in_header" >
        {/* Language Dropdown */}
        <div className="mobile_language_dropdown_wrapper">
          <Dropdown
            menu={languageMenu}
            placement="bottomLeft"
            arrow
            overlayClassName="custom-centered-dropdown"

          >
            <button className="mobile_language_dropdown_btn"
              style={{
                backgroundColor: currentTheme['--list-background-color'],
                borderColor: currentTheme['--border-color'],
              }}
            >
              <GlobalOutlined style={{ marginRight: 6, color: currentTheme['--main-text-coloure'] }} />
              <p style={{ color: currentTheme['--main-text-coloure'], margin: 0 }}>
                {language === 'en' ? 'EN' : 'KA'}
              </p>
            </button>
          </Dropdown>
        </div>

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































