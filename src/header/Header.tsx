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
import ConfirmationDialog from "../components/Boards/ConfirmationDialog";
import { useTranslation } from 'react-i18next';
import { board } from "../utils/interface";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { SettingOutlined, LogoutOutlined } from '@ant-design/icons';



interface HeaderProps {
  profileData: ProfileData;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setChange_current_theme: (change_current_theme: boolean) => void;
  change_current_theme: boolean;
  currentTheme: ThemeSpecs;
  setCurrentTheme: (currentTheme: ThemeSpecs) => void;
  isCustomThemeSelected: boolean;
  setIsCustomThemeSelected: (isCustomThemeSelected: boolean) => void;
  saved_custom_theme: ThemeSpecs;
  isMobile: boolean; // Optional prop for mobile view
  setLanguage: (language: 'en' | 'ka') => void;
  language: 'en' | 'ka';
  setSelectedComponent: (selectedComponent: string) => void;
  setSelectedBoard: (selectedBoard: board | null) => void;
  boards: board[];
  setActiveSidebarBoardId: (boardId: number | null) => void;
}



const Header: React.FC<HeaderProps> = ({
  profileData,
  isAuthenticated,
  setIsAuthenticated,
  setChange_current_theme,
  change_current_theme,
  currentTheme,
  setCurrentTheme,
  isCustomThemeSelected,
  setIsCustomThemeSelected,
  saved_custom_theme,
  isMobile,
  setLanguage,
  language,
  setSelectedComponent,
  setSelectedBoard,
  boards,
  setActiveSidebarBoardId,
}) => {



  const prev_theme_bar_open = localStorage.getItem('is_theme_bar_open') === 'true' ? true : localStorage.getItem('is_theme_bar_open') === 'false' ? false : true; // Default to true if not set

  const [showColorContainer, setShowColorContainer] = useState<boolean>(prev_theme_bar_open);
  const [show_theme_open_icon, setShow_theme_open_icon] = useState<boolean>(false);

  const [confirmation_for_logout, setConfirmation_for_logout] = useState<boolean>(false);

  const [showHeader, setShowHeader] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (
      location.pathname === "/" ||
      location.pathname === "/login" ||
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
  const [header_selected_theme, setHeader_selected_theme] = useState<string>('');

  useEffect(() => {
    // On mount, set theme from localStorage if available
    const storedTheme = localStorage.getItem('theme') as string | null;
    if (storedTheme) {
      const themeObj = JSON.parse(storedTheme);
      // Find the theme key that matches the stored theme
      const foundThemeKey = Object.keys(themes).find(key => {
        const theme = themes[key as keyof typeof themes];
        // Compare all theme properties
        return Object.keys(themeObj).every(prop => theme[prop as keyof ThemeSpecs] === themeObj[prop]);
      });
      if (foundThemeKey) {
        setHeader_selected_theme(foundThemeKey);
        setCurrentTheme(themes[foundThemeKey as keyof typeof themes]);
        // Optionally, apply theme to document
        Object.entries(themes[foundThemeKey as keyof typeof themes]).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
        document.body.style.backgroundColor = themes[foundThemeKey as keyof typeof themes]['--background-color'];
        document.body.style.color = themes[foundThemeKey as keyof typeof themes]['--main-text-coloure'];
      } else {
        // If not found, just apply the stored theme
        setCurrentTheme(themeObj);
        Object.entries(themeObj).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value as string);
        });
        document.body.style.backgroundColor = themeObj['--background-color'];
        document.body.style.color = themeObj['--main-text-coloure'];
      }
    }
  }, []);



  const changeTheme = (themeSpecs: ThemeSpecs, themeName: string) => {
    setHeader_selected_theme(String(themeName));
    for (const [key, value] of Object.entries(themeSpecs)) {
      document.documentElement.style.setProperty(key, value)
    }
    localStorage.setItem('theme', JSON.stringify(themeSpecs));
    localStorage.setItem('isCustomThemeSelected', 'false'); // Clear custom theme flag
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
    console.log('Returning to custom theme');
    // Ensure we have a valid custom theme with fallbacks
    const validCustomTheme = {
      '--background-color': saved_custom_theme['--background-color'],
      '--main-text-coloure': saved_custom_theme['--main-text-coloure'],
      '--border-color': saved_custom_theme['--border-color'],
      '--scrollbar-thumb-color': saved_custom_theme['--scrollbar-thumb-color'],
      '--list-background-color': saved_custom_theme['--list-background-color'],
      '--task-background-color': saved_custom_theme['--task-background-color'],
      '--hover-color': saved_custom_theme['--hover-color'],
      '--due-date-color': saved_custom_theme['--due-date-color'],
    };
    console.log('===', validCustomTheme['--main-text-coloure'])
    for (const [key, value] of Object.entries(validCustomTheme)) {
      document.documentElement.style.setProperty(key, value);
    }

    document.body.style.backgroundColor = validCustomTheme['--background-color'];
    document.body.style.color = validCustomTheme['--main-text-coloure'];
    localStorage.setItem('theme', JSON.stringify(validCustomTheme));

    setCurrentTheme(validCustomTheme);
    localStorage.setItem('isCustomThemeSelected', 'true');
    setIsCustomThemeSelected(true);
    // Clear the header selected theme since we're using custom theme
    setHeader_selected_theme('');

    // Trigger theme change
    setChange_current_theme(!change_current_theme);
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
    setActiveSidebarBoardId(null);
    setSelectedComponent('Settings');
    navigate('/mainpage/settings/');
  };


  const themeMenu: MenuProps = {
    items: [
      ...themeKeys.map((key, idx) => ({
        key,
        label: (
          <div
            className={`header_coloure_child_container  example${idx + 2}`}
            onClick={() => changeTheme(themes[key as keyof typeof themes], key)}
            id="ttt"
            style={{
              borderColor: header_selected_theme === key ? 'seagreen' : 'black',
            }}
          />
        ),
      })),
      {
        key: 'custom',
        label: (

          <div
            className='custom_theme_container_in_header'
            style={{
              backgroundColor: isCustomThemeSelected ? saved_custom_theme['--background-color'] : 'seagreen',
              borderColor: saved_custom_theme['--border-color'],
              color: saved_custom_theme['--main-text-coloure'],
            }}
            onClick={handle_return_to_custom_theme}
          >
            <p style={{
              color: saved_custom_theme['--main-text-coloure'],
            }}
              className="custom_theme_text_in_header">
              {t('customTheme')}
            </p>

            <div className="customtheme_backg_color" style={{ backgroundColor: saved_custom_theme['--background-color'] }}></div>
            <div className="customtheme_backg_color" style={{ backgroundColor: saved_custom_theme['--list-background-color'] }}></div>
            <div className="customtheme_backg_color" style={{ backgroundColor: saved_custom_theme['--border-color'] }}></div>
            <div className="customtheme_backg_color" style={{ backgroundColor: saved_custom_theme['--task-background-color'] }}></div>
            <div className="customtheme_backg_color" style={{ backgroundColor: saved_custom_theme['--hover-color'] }}></div>
            <div className="customtheme_backg_color" style={{ backgroundColor: saved_custom_theme['--due-date-color'] }}></div>
            <div className="customtheme_backg_color" style={{ backgroundColor: saved_custom_theme['--scrollbar-thumb-color'] }}></div>

          </div>
        ),
      },
    ],
  };

  useEffect(() => {
    console.log('=>', isCustomThemeSelected)
  }, [isCustomThemeSelected]);

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


  const profileMenu: MenuProps = {
    items: [
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: (
          <span className="profile-dropdown-item" onClick={handleUserImageClick} >
            {t('settings')}
          </span>
        ),
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: (
          <span className="profile-dropdown-item" onClick={handle_logout_icon_click}>
            {t('logout')}
          </span>
        ),
      },
    ],
  };

  // ================================================  logo click   ======================================================

  const handleLogoClick = () => {
    setSelectedComponent('Boards');
    const prev_selected_board_id = localStorage.getItem('prev_selected_board_id');
    navigate(`/mainpage/boards/${prev_selected_board_id}`);
    if (prev_selected_board_id === null) {
      return;
    }
    const board_to_be_selected = boards.find(board => board.id === JSON.parse(prev_selected_board_id));
    setActiveSidebarBoardId(board_to_be_selected?.id ?? null);
    if (board_to_be_selected) {
      setSelectedBoard(board_to_be_selected);
    }
  }

  // =====================================================================================================================
  const handle_open_theme_container = () => {
    localStorage.setItem('is_theme_bar_open', 'false');
    setShowColorContainer(false);
    setTimeout(() => {
      setShow_theme_open_icon(true);
    }, 600);
  };

  const handle_close_theme_container = () => {
    localStorage.setItem('is_theme_bar_open', 'true');
    setShowColorContainer(true);
    setShow_theme_open_icon(false);
  };

  // Update `show_theme_open_icon` based on `is_theme_bar_open` on mount
  useEffect(() => {
    const isThemeBarOpen = localStorage.getItem('is_theme_bar_open') === 'true';
    setShow_theme_open_icon(!isThemeBarOpen);
  }, []);

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
      <div className='header_logo_container'
        onClick={() => handleLogoClick()}
      >
        <LogoComponent currentTheme={currentTheme} />
      </div>




      {/* theme and language dropdowns*/}
      <div className="header_all_dropdowns_container" >
        {!showColorContainer && !isMobile && show_theme_open_icon && (
          <IoIosArrowDroprightCircle
            size={27}
            onClick={handle_close_theme_container}
            className="header_theme_icon"
          />
        )}
        {!isMobile && (
          <div
            className={`header_coloure_container${showColorContainer ? '' : ' hide_color_container'}`}
          >
            <div className='header_coloure_child_container example2' style={{ borderColor: header_selected_theme === 'dark_gray' ? 'seagreen' : 'black' }}
              onClick={() => changeTheme(themes.dark_gray, 'dark_gray')}></div>
            <div className='header_coloure_child_container example3' style={{ borderColor: header_selected_theme === 'forest_night' ? 'seagreen' : 'black' }}
              onClick={() => changeTheme(themes.forest_night, 'forest_night')}></div>
            <div className='header_coloure_child_container example4' style={{ borderColor: header_selected_theme === 'neon_void' ? 'seagreen' : 'black' }}
              onClick={() => changeTheme(themes.neon_void, 'neon_void')}></div>
            <div className='header_coloure_child_container example5' style={{ borderColor: header_selected_theme === 'deep_aqua' ? 'seagreen' : 'black' }}
              onClick={() => changeTheme(themes.deep_aqua, 'deep_aqua')}></div>
            <div className='header_coloure_child_container example6' style={{ borderColor: header_selected_theme === 'ink_cobalt' ? 'seagreen' : 'black' }}
              onClick={() => changeTheme(themes.ink_cobalt, 'ink_cobalt')}></div>
            <div className='header_coloure_child_container example7' style={{ borderColor: header_selected_theme === 'blue_steel' ? 'seagreen' : 'black' }}
              onClick={() => changeTheme(themes.blue_steel, 'blue_steel')}></div>
            <div className='header_coloure_child_container example8' style={{ borderColor: header_selected_theme === 'hologram_glow' ? 'seagreen' : 'black' }}
              onClick={() => changeTheme(themes.hologram_glow, 'hologram_glow')}></div>
            <div className='header_coloure_child_container example9' style={{ borderColor: header_selected_theme === 'sky_breeze' ? 'seagreen' : 'black' }}
              onClick={() => changeTheme(themes.sky_breeze, 'sky_breeze')}></div>
            <div className='header_coloure_child_container example10' style={{ borderColor: header_selected_theme === 'mint_ice' ? 'seagreen' : 'black' }}
              onClick={() => changeTheme(themes.mint_ice, 'mint_ice')}></div>
            <div className='header_coloure_child_container example11' style={{ borderColor: header_selected_theme === 'sage_paper' ? 'seagreen' : 'black' }}
              onClick={() => changeTheme(themes.sage_paper, 'sage_paper')}></div>
            <div className='header_coloure_child_container example12' style={{ borderColor: header_selected_theme === 'glacier_bite' ? 'seagreen' : 'black' }}
              onClick={() => changeTheme(themes.glacier_bite, 'glacier_bite')}></div>



            <div
              className='custom_theme_container_in_header'
              style={{
                backgroundColor: saved_custom_theme['--background-color'],
                borderColor: !isCustomThemeSelected ? saved_custom_theme['--border-color'] : 'seagreen',
                color: saved_custom_theme['--main-text-coloure'],
              }}
              onClick={handle_return_to_custom_theme}
            >
              <p style={{
                color: saved_custom_theme['--main-text-coloure'],
              }}
                className="custom_theme_text_in_header">
                {t('customTheme')}
              </p>

              <div className="customtheme_backg_color" style={{ backgroundColor: saved_custom_theme['--background-color'] }}></div>
              <div className="customtheme_backg_color" style={{ backgroundColor: saved_custom_theme['--list-background-color'] }}></div>
              <div className="customtheme_backg_color" style={{ backgroundColor: saved_custom_theme['--border-color'] }}></div>
              <div className="customtheme_backg_color" style={{ backgroundColor: saved_custom_theme['--task-background-color'] }}></div>
              <div className="customtheme_backg_color" style={{ backgroundColor: saved_custom_theme['--hover-color'] }}></div>
              <div className="customtheme_backg_color" style={{ backgroundColor: saved_custom_theme['--due-date-color'] }}></div>
              <div className="customtheme_backg_color" style={{ backgroundColor: saved_custom_theme['--scrollbar-thumb-color'] }}></div>

            </div>

            <IoIosArrowDropleftCircle
              size={27}
              onClick={handle_open_theme_container}
              className="header_theme_icon"

            />

          </div>

        )}


      </div>

      {isMobile && (
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
      )

      }

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


        {/* Profile Dropdown */}
        <div className="header_profile_dropdown_container"
          style={{
            backgroundColor: currentTheme['--list-background-color'],
            borderColor: currentTheme['--border-color'],
            color: currentTheme['--main-text-coloure'],
          }}
        >
          <Dropdown
            menu={profileMenu}
            placement="bottomRight"
            arrow
            overlayClassName="custom-centered-dropdown"
            trigger={['hover', 'click']}
          >
            <div className="header_profile_container" style={{ cursor: 'pointer' }}>
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
                    color: getAvatarStyles(profileData.username.charAt(0)).color,
                    width: '30px',
                    height: '30px',
                  }}

                >
                  {profileData.username.charAt(0).toUpperCase()}
                </Avatar>
              )}
            </div>
          </Dropdown>
        </div>


        {confirmation_for_logout && (
          <ConfirmationDialog
            message={t('are_you_sure_you_want_to_log_out?')}
            onConfirm={handleLogOut}
            onCancel={() => setConfirmation_for_logout(false)}
            currentTheme={currentTheme}
            isOpen={confirmation_for_logout}
          />
        )}


      </div>
    </div>
  )
}

export default Header;
































