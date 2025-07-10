import "./Header.css";
import React from 'react';
import { ProfileData } from "../utils/interface";
import LogoComponent from '../components/LogoComponent';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeSpecs } from '../utils/theme';
import themes from '../utils/theme';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import getAvatarStyles from "../utils/SetRandomColor";
import { Dropdown } from 'antd';
import { AiFillSkin } from "react-icons/ai";
import { GlobalOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { LuLogOut } from "react-icons/lu";
import ConfirmationDialog from "../components/Boards/ConfirmationDialog";
import { useTranslation } from 'react-i18next';
import { board } from "../utils/interface";

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
  setSelectedComponent: (selectedComponent: string) => void;
  setSelectedBoard: (selectedBoard: board | null) => void;
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
  language,
  setSelectedComponent,
  setSelectedBoard
}) => {



  const [confirmation_for_logout, setConfirmation_for_logout] = useState<boolean>(false);

  const [showHeader, setShowHeader] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (
      location.pathname === "/" ||
      location.pathname === "/register" ||
      location.pathname === '/error' ||
      location.pathname === '/password-reset' ||
      location.pathname.startsWith('/finish-profile') ||
      location.pathname.startsWith('/password-reset-confirm')
    ) {
      setShowHeader(false);
    }
    else {
      setShowHeader(true);
    }
  }, [location.pathname])

  // ======================================== language change function =========================================


const handleLanguageChange = (selectedLanguage: 'en' | 'ka') => {
  setLanguage(selectedLanguage);
  localStorage.setItem('language', selectedLanguage);
  i18n.changeLanguage(selectedLanguage);
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

  const handle_logout_icon_click = () => {
    setConfirmation_for_logout(true);
  }

  const handleLogOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setConfirmation_for_logout(false);
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
    'neon_void',
    'deep_aqua',
    'ink_cobalt',
    'charcoal_rose',
    'hologram_glow',
    'sky_breeze',
    'mint_ice',
    'sage_paper',
    'glacier_bite',
  ];

  // ===================================== handle user image click =========================================
  const handleUserImageClick = () => {
    setSelectedBoard(null); 
    setSelectedComponent('Settings');
  };


  const themeMenu: MenuProps = {
    items: [
      ...themeKeys.map((key, idx) => ({
        key,
        label: (
          <div
            className={`header_coloure_child_container  example${idx + 2}`}
            onClick={() => changeTheme(themes[key as keyof typeof themes])}
            id="ttt"
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
              borderColor: saved_custom_theme['--border-color'],
              color: saved_custom_theme['--main-text-coloure'],
            }}
            onClick={handle_return_to_custom_theme}
          >
              
            {t('customTheme')}
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


  // =====================================================================================================================


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
        <LogoComponent currentTheme={currentTheme} />
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
              onClick={() => changeTheme(themes.neon_void)}></div>
            <div className='header_coloure_child_container example5'
              onClick={() => changeTheme(themes.deep_aqua)}></div>
            <div className='header_coloure_child_container example6'
              onClick={() => changeTheme(themes.ink_cobalt)}></div>
            <div className='header_coloure_child_container example7'
              onClick={() => changeTheme(themes.blue_steel)}></div>
            <div className='header_coloure_child_container example8'
              onClick={() => changeTheme(themes.hologram_glow)}></div>
            <div className='header_coloure_child_container example9'
              onClick={() => changeTheme(themes.sky_breeze)}></div>
            <div className='header_coloure_child_container example10'
              onClick={() => changeTheme(themes.mint_ice)}></div>
            <div className='header_coloure_child_container example11'
              onClick={() => changeTheme(themes.sage_paper)}></div>
            <div className='header_coloure_child_container example12'
              onClick={() => changeTheme(themes.glacier_bite)}></div>



            <div className='custom_theme_container_in_header'
              style={{
                backgroundColor: currentTheme['--background-color'],
                borderColor: currentTheme['--border-color'],
              }}
              onClick={handle_return_to_custom_theme}
            >
              {t('customTheme')}
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

        <div className="header_profile_container"
          onClick={handleUserImageClick}

        >
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
          <div
            onClick={handle_logout_icon_click}
            className="header_profile_container"
          >
            <LuLogOut
              size={26}
              style={{ color: currentTheme['--main-text-coloure'] }}
              className="header_logout_icon"
            />
          </div>
        )}

        {confirmation_for_logout && (
          <ConfirmationDialog
            message={t('are_you_sure_you_want_to_log_out?')}
            onConfirm={handleLogOut}
            onCancel={() => setConfirmation_for_logout(false)}
            currentTheme={currentTheme}
          />
        )}


      </div>
    </div>
  )
}

export default Header;
































