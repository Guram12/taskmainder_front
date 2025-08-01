import './App.css'
import React, { useEffect, useState, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage'
import Login from './auth/login'
import Register from './auth/register'
import Header from './header/Header';
import axiosInstance from './utils/axiosinstance';
import { ThemeSpecs } from './utils/theme';
import { board } from './utils/interface';
import FinishGoogleSignIn from './auth/FinishGoogleSignIn';
import { ProfileData } from './utils/interface';
import PasswordReset from './auth/PasswordReset';
import PasswordResetConfirm from './auth/PasswordResetConfirm';
import subscribeToPushNotifications from './utils/supbscription';
import { Board_Users } from './utils/interface';
// import { NotificationPayload } from './utils/interface';
import ErrorPage from './components/ErrorPage';
import { useTranslation } from 'react-i18next';
import { HelmetProvider } from "react-helmet-async";





const App: React.FC = () => {
  // ========================================== google gtag function ==============================================
  const gtagId = import.meta.env.VITE_GTAG_ID;

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`;
    script.async = true;
    document.head.appendChild(script);

    const script2 = document.createElement('script');
    script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gtagId}');
  `;
    document.head.appendChild(script2);
  }, []);



  const { i18n } = useTranslation();

  // Initialize language properly from localStorage or i18n
  const [language, setLanguage] = useState<'en' | 'ka'>(() => {
    const savedLang = localStorage.getItem('language') as 'en' | 'ka';
    return savedLang || 'en';
  });

  // ==================================== change language =========================================

  useEffect(() => {
    console.log('language changed to:', language);
    if (i18n.isInitialized) {
      i18n.changeLanguage(language);
    }
    localStorage.setItem('language', language);
  }, [language, i18n]);

  // Initialize language on app start
  useEffect(() => {
    const initializeLanguage = async () => {
      await i18n.loadLanguages(['en', 'ka']);
      const savedLang = localStorage.getItem('language') as 'en' | 'ka';
      if (savedLang && savedLang !== language) {
        setLanguage(savedLang);
      }
      if (i18n.isInitialized) {
        i18n.changeLanguage(language);
      }
    };

    initializeLanguage();
  }, [i18n]);

  // ==============================================================================================
  const [selectedComponent, setSelectedComponent] = useState<string>("Boards");



  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    id: 0,
    email: '',
    phone_number: '',
    profile_picture: '',
    username: '',
    timezone: '',
    is_social_account: false,
    discord_webhook_url: null,
    notification_preference: 'email',
  });

  const default_is_custom_theme_selected = localStorage.getItem('isCustomThemeSelected') === null ? false : localStorage.getItem('isCustomThemeSelected') === 'true';

  const [isCustomThemeSelected, setIsCustomThemeSelected] = useState<boolean>(default_is_custom_theme_selected);


  const background_color = localStorage.getItem('background_color') || '#1A252F';
  const border_color = localStorage.getItem('border_color') || '#EAF6FB';
  const main_text_coloure = localStorage.getItem('main_text_coloure') || '#274357';
  const scrollbar_thumb_color = localStorage.getItem('scrollbar_thumb_color') || '#3B6E7A';
  const list_background_color = localStorage.getItem('list_background_color') || '#22313F';
  const task_background_color = localStorage.getItem('task_background_color') || '#2B4D5C';
  const hover_color = localStorage.getItem('hover_color') || '#22313F';
  const due_date_color = localStorage.getItem('due_date_color') || '#7FC6D7'; 1

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const [saved_custom_theme, setSaved_custom_theme] = useState({
    '--background-color': background_color,
    '--border-color': border_color,
    '--main-text-coloure': main_text_coloure,
    '--scrollbar-thumb-color': scrollbar_thumb_color,
    '--list-background-color': list_background_color,
    '--task-background-color': task_background_color,
    '--hover-color': hover_color,
    '--due-date-color': due_date_color,
  });

  const [currentTheme, setCurrentTheme] = useState<ThemeSpecs>({
    '--background-color': '#1A252F',
    '--border-color': '#EAF6FB',
    '--main-text-coloure': '#274357',
    '--scrollbar-thumb-color': '#3B6E7A',
    '--list-background-color': '#22313F',
    '--task-background-color': '#2B4D5C',
    '--hover-color': '#22313F',
    '--due-date-color': '#7FC6D7',
  });

  const [change_current_theme, setChange_current_theme] = useState(false);
  const [boards, setBoards] = useState<board[]>([]);




  const [selectedBoard, setSelectedBoard] = useState<board | null>({
    id: 0,
    name: '',
    created_at: '',
    lists: [],
    owner: '',
    owner_email: '',
    members: [],
    board_users: [],
    background_image: null,
    creation_date: '',
  });

  const selectedBoardRef = useRef<board | null>(selectedBoard);


  const [activeSidebarBoardId, setActiveSidebarBoardId] = useState<number | null>(selectedBoard?.id ?? null);

  const [isBoardsLoaded, setIsBoardsLoaded] = useState<boolean>(false);


  const [current_board_users, setCurrent_board_users] = useState<Board_Users[]>([]);
  const [is_cur_Board_users_fetched, setIs_cur_Board_users_fetched] = useState<boolean>(false);


  // const [notificationData, setNotificationData] = useState<NotificationPayload>({
  //   type: "USER_REMOVED_FROM_BOARD",
  //   title: '',
  //   body: '',
  //   notification_id: 0,
  //   is_read: false,
  // });


  const [is_new_notification_received, setIs_new_notification_received] = useState<boolean>(false);



  // =================================================================================================

  const accessToken: string | null = localStorage.getItem('access_token');
  const refreshToken: string | null = localStorage.getItem('refresh_token');


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

  // ==========================================================  regiester service worker ==========================================


  useEffect(() => {
    if (isAuthenticated) {
      subscribeToPushNotifications();
    }
  }, [isAuthenticated]);

  // -------------------------------------------- socket connection for board users ------------------------------------------
  const [is_members_refreshing, setIs_members_refreshing] = useState<boolean>(false);

  const fetch_current_board_users = async () => {
    setIs_cur_Board_users_fetched(false);
    setIs_members_refreshing(true);
    try {
      const response = await axiosInstance.get(`/api/boards/${selectedBoard?.id}/users/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setCurrent_board_users(response.data);
      setIs_cur_Board_users_fetched(true);
      setIs_members_refreshing(false);
    } catch (error) {
      console.error('Error fetching board users:', error);
      setIs_cur_Board_users_fetched(false);
      setIs_members_refreshing(false);
    }
  };
  // ------------------------------------- update board users after notification received ---------------------------------------

  const update_board_users = async (boardId: string) => {
    console.log('Updating board users for board ID:---', boardId);
    try {
      const response = await axiosInstance.get(`/api/boards/${boardId}/users/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      if (response.status === 200) {
        console.log('Board users fetched successfully');
        setCurrent_board_users(response.data);
        setIs_cur_Board_users_fetched(true);
        setSelectedBoard(prev => prev ? { ...prev, board_users: response.data } : prev);
      }
    } catch (error) {
      console.error('Error fetching board users:', error);
    }
  };

  // =========================================  handle push notification types for updates ===============================================

  // Update the selected board reference whenever selectedBoard changes
  useEffect(() => {
    selectedBoardRef.current = selectedBoard;
  }, [selectedBoard]);


  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data) {
          const { type, ...payload } = event.data;
          setIs_new_notification_received(true);


          switch (type) {
            case 'TASK_DUE_REMINDER':
              console.log(
                `TASK_DUE_REMINDER type ==>> Task Name: ${payload.taskName}, Due Date: ${payload.dueDate}, Priority: ${payload.priority}`
              );

              break;


            case 'USER_REMOVED_FROM_BOARD':
              console.log(`USER_REMOVED_FROM_BOARD type ==>> Board Name: ${payload.boardName}, Removed User Email: ${payload.removedUserEmail}`);
              // setNotificationData(event.data);

              // Update the boards list to remove the board
              setBoards((prevBoards) => {
                const updatedBoards = prevBoards.filter((board) => board.name !== payload.boardName);
                if (updatedBoards.length === 0) {
                  setIsBoardsLoaded(true);
                  setSelectedBoard(null);
                }
                return updatedBoards;
              });

              // Reset boardData if no boards are left
              if (boards.length === 1 && boards[0].name === payload.boardName) {
                setSelectedBoard(null);
              }

              fetch_current_board_users();

              break;

            case 'BOARD_INVITATION_ACCEPTED':
              if (
                String(payload.boardName).toLowerCase() ===
                String(selectedBoardRef.current?.name).toLowerCase()
              ) {
                console.log('Updating board users for the selected board:', selectedBoardRef.current?.name, 'payload:', payload.boardName);
                update_board_users(String(selectedBoardRef.current?.id));
              }
              break;

            case 'USER_LEFT_BOARD':
              console.log(`USER_LEFT_BOARD type ==>> Board Name: ${payload.boardName}, Left User Email: ${payload.leftUserEmail}, Left User Name: ${payload.leftUserName}`);
              fetchBoards();



              if (payload.boardName === selectedBoardRef.current?.name) {
                console.log('Updating board users for the selected board:', selectedBoardRef.current?.name, 'payload:', payload.boardName);
                update_board_users(String(selectedBoardRef.current?.id));
              }




              break;


            default:
              console.log('Unknown notification type received:', type, payload);
          }
        }
      });
    }
  }, []);



  // ========================================== fetch  boards ==================================================
  const fetchBoards = async () => {
    try {
      const response = await axiosInstance.get('api/boards/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      console.log('boards fetched successfully!!!!!!;');
      setBoards(response.data);
      setIsBoardsLoaded(true);
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
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (
      params.get('isAuthenticated') === 'false' &&
      params.get('invitation') === 'error'
    ) {
      window.history.replaceState({}, '', '/error'); // Clean up URL
      window.location.href = '/error'; // Redirect to error page
    }
  }, []);
  // ========================================================================================================

  return (
    <HelmetProvider>

      <Router>
        <Header
          profileData={profileData}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          setChange_current_theme={setChange_current_theme}
          change_current_theme={change_current_theme}
          currentTheme={currentTheme}
          isCustomThemeSelected={isCustomThemeSelected}
          saved_custom_theme={saved_custom_theme}
          setCurrentTheme={setCurrentTheme}
          isMobile={isMobile}
          setLanguage={setLanguage}
          language={language}
          setSelectedComponent={setSelectedComponent}
          setSelectedBoard={setSelectedBoard}
          boards={boards}
          setActiveSidebarBoardId={setActiveSidebarBoardId}
        />
        <Routes>
          <Route path="/"
            element={<Login
              setIsAuthenticated={setIsAuthenticated}
              currentTheme={currentTheme}
              language={language}
              setLanguage={setLanguage}
            />}
          />
          <Route path="/register" element={<Register currentTheme={currentTheme} isMobile={isMobile} />} />
          <Route path="/password-reset" element={<PasswordReset currentTheme={currentTheme} />} />
          <Route path="/password-reset-confirm/:uid/:token" element={<PasswordResetConfirm currentTheme={currentTheme} />} />



          <Route path="/error" element={<ErrorPage currentTheme={currentTheme} />} />
          <Route path="/finish-profile" element={<FinishGoogleSignIn
            setIsAuthenticated={setIsAuthenticated}
            currentTheme={currentTheme}
            isMobile={isMobile}
          />}
          />
          <Route path="/mainpage/*"
            element={<MainPage
              selectedBoard={selectedBoard}
              setSelectedBoard={setSelectedBoard}
              currentTheme={currentTheme}
              boards={boards}
              setBoards={setBoards}
              current_user_email={profileData.email}
              profileData={profileData}
              FetchProfileData={FetchProfileData}
              fetchBoards={fetchBoards}
              setCurrent_board_users={setCurrent_board_users}
              current_board_users={current_board_users}
              is_cur_Board_users_fetched={is_cur_Board_users_fetched}
              fetch_current_board_users={fetch_current_board_users}
              isBoardsLoaded={isBoardsLoaded}
              setIsBoardsLoaded={setIsBoardsLoaded}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
              setIs_new_notification_received={setIs_new_notification_received}
              is_new_notification_received={is_new_notification_received}
              is_members_refreshing={is_members_refreshing}
              setCurrentTheme={setCurrentTheme}
              setIsCustomThemeSelected={setIsCustomThemeSelected}
              setSaved_custom_theme={setSaved_custom_theme}
              isMobile={isMobile}
              setIsAuthenticated={setIsAuthenticated}
              setSelectedComponent={setSelectedComponent}
              selectedComponent={selectedComponent}
              setActiveSidebarBoardId={setActiveSidebarBoardId}
              activeSidebarBoardId={activeSidebarBoardId}
            />} />

        </Routes>
      </Router>
    </HelmetProvider>

  );
};

export default App;



// import { Helmet } from "react-helmet";
// import { useTranslation } from "react-i18next";

// const MyPage = () => {
//   const { t, i18n } = useTranslation();

//   return (
//     <>
//       <Helmet>
//         <title>{t("mainpage_title")}</title>
//         <meta name="description" content={t("mainpage_description")} />
//         <meta name="robots" content="index, follow" />
//         <link rel="canonical" href="https://dailydoer.space/mainpage" />
//         {/* Optional: set the language for the page */}
//         <html lang={i18n.language} />
//       </Helmet>
//       {/* ...existing code... */}
//     </>
//   );
// };




// // en.json
// {
//   "mainpage_title": "Main Page | DailyDoer",
//   "mainpage_description": "Organize your tasks, boards, calendar, and more with DailyDoer."
// }
// // ka.json
// {
//   "mainpage_title": "მთავარი გვერდი | DailyDoer",
//   "mainpage_description": "დაალაგეთ თქვენი ამოცანები, დაფები, კალენდარი და სხვა DailyDoer-თან ერთად."
// }