import '../styles/IntroPage.css';
import React, { useEffect, useRef } from 'react';
import { Helmet } from "react-helmet-async";
import { ThemeSpecs } from '../utils/theme';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import { SplitText } from "gsap/SplitText";
import { Dropdown } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';
// import GoogleSignIn from '../auth/GoogleSignIn';
// import main_image from '../assets/main_image.png'
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import themes from '../utils/theme';
// import { ScrollTrigger } from "gsap/ScrollTrigger";
import TaskSlider from './TaskSlider';
import task_managment_image from '../assets/task_management_icon.png';
import diagram_image from '../assets/diagram_image.png';
import calendar_image from '../assets/calendar_image.png';
import team_image from '../assets/team_image.png';
import customtheme_image from '../assets/customtheme_image.png';
import SvgBackground from './SvgBackground';
import GifSlider from './GifSlider.tsx';
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useInView } from "framer-motion";
import notification_image from '../assets/notification_image.png'



interface IntroPageProps {
  currentTheme: ThemeSpecs;
  language: string;
  setLanguage: (lang: 'en' | 'ka') => void;
  setIsAuthenticated: (value: boolean) => void;
  setCurrentTheme: (theme: ThemeSpecs) => void;
  currentThemeKey: string;
  setCurrentThemeKey: (key: string) => void;
  isMobile: boolean;
}

const IntroPage: React.FC<IntroPageProps> = ({
  currentTheme,
  language,
  setLanguage,
  // setIsAuthenticated,
  setCurrentTheme,
  currentThemeKey,
  setCurrentThemeKey,
  isMobile

}) => {


  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // =============================================== smooth scroll ==================================================
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const smoother = ScrollSmoother.create({
      wrapper: ".main_intropage_container",
      content: ".mainpage_child_main_cont",
      smooth: 2, // Smoothness level (0-3, higher = smoother)
      effects: true,
      normalizeScroll: true, // Handles different scroll behaviors across devices
    });

    return () => {
      smoother?.kill();
    };
  }, []);

  // =====================================================  header text animation =========================================
  const headerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.registerPlugin(SplitText);

    if (headerRef.current) {
      let split: any = undefined;
      // let animation: gsap.core.Animation | undefined = undefined; // <-- Remove this line

      split = SplitText.create(headerRef.current);

      // Animate on mount (refresh)
      if (split && split.chars) {
        gsap.from(split.chars, {
          x: 150,
          opacity: 0,
          duration: 1,
          ease: "power4",
          stagger: 0.04
        });
      }
    }

  }, []);

  // -------------------------- slogan animation ------------------------

  const sloganRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrambleTextPlugin)

    if (sloganRef.current) {
      gsap.to(sloganRef.current, {
        duration: 2,
        scrambleText: {
          text: t('slogan'),
          chars: " ",
          revealDelay: 0.5,
          speed: 0.1,
          newClass: "myClass"
        }
      });
    }


  }, [language])


  const handleLanguageChange = (selectedLanguage: 'en' | 'ka') => {
    setLanguage(selectedLanguage);
    localStorage.setItem('language', selectedLanguage);
    i18n.changeLanguage(selectedLanguage);
  };

  // ===================================== welcome text animation ================================================
  const chooseDailyDoerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {

    gsap.registerPlugin(SplitText);

    if (chooseDailyDoerRef.current) {
      let split: any = undefined;

      split = SplitText.create(chooseDailyDoerRef.current);

      // Animate on mount (refresh)
      if (split && split.chars) {
        gsap.from(split.chars, {
          x: 150,
          opacity: 0,
          duration: 1,
          ease: "power4",
          stagger: 0.04,
          delay: 0.5
        });
      }
    }


  }, []);

  // ===================================================   logo animations =========================================
  const polygonRef = useRef<SVGPolygonElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (polygonRef.current) {
      const pathLength = polygonRef.current.getTotalLength();
      // Reset styles before animating
      polygonRef.current.style.strokeDasharray = `${pathLength}`;
      polygonRef.current.style.strokeDashoffset = `${pathLength}`;
      polygonRef.current.style.opacity = '0';
      polygonRef.current.style.fill = 'none';

      gsap.to(polygonRef.current, {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: "power2.out",
        delay: 0.3,
        opacity: 1,
        onComplete: () => {
          gsap.to(polygonRef.current, {
            fill: currentTheme['--main-text-coloure'],
            duration: 0.6,
            ease: "power1.inOut"
          });
        }
      });
    }
    if (pathRef.current) {
      const pathLength = pathRef.current.getTotalLength();
      // Reset styles before animating
      pathRef.current.style.strokeDasharray = `${pathLength}`;
      pathRef.current.style.strokeDashoffset = `${pathLength}`;
      pathRef.current.style.opacity = '0';
      pathRef.current.style.fill = 'none';

      gsap.to(pathRef.current, {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: "power2.out",
        delay: 0.3,
        opacity: 1,
        onComplete: () => {
          gsap.to(pathRef.current, {
            fill: currentTheme['--main-text-coloure'],
            duration: 0.6,
            ease: "power1.inOut"
          });
        }
      });
    }
  }, [currentTheme, currentThemeKey]);


  // ========================================= Language dropdown menu =============================================
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

  // ========================================= theme change on logo sclick  =============================================

  const handleLogoClick = () => {
    const themeKeys = Object.keys(themes);
    const currentIndex = themeKeys.indexOf(currentThemeKey);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    const nextThemeKey = themeKeys[nextIndex];
    setCurrentTheme(themes[nextThemeKey]);
    setCurrentThemeKey(nextThemeKey);
    localStorage.setItem('theme', JSON.stringify(themes[nextThemeKey]));
    document.body.style.backgroundColor = themes[nextThemeKey]['--background-color'];

    // Add this to apply all CSS custom properties including scrollbar
    for (const [key, value] of Object.entries(themes[nextThemeKey])) {
      document.documentElement.style.setProperty(key, value);
    }
  };


  // ====================================== referances for feature content motion animations  ==================================
  // for task feature content 
  const taskFeatureRef = useRef<HTMLDivElement>(null);
  const task_feature_inView = useInView(taskFeatureRef, { once: true, margin: "-100px" });

  // for diagram feature content
  const diagramFeatureRef = useRef<HTMLDivElement>(null);
  const diagram_feature_inView = useInView(diagramFeatureRef, { once: true, margin: "-100px" });

  // for calendar feature content
  const calendarFeatureRef = useRef<HTMLDivElement>(null);
  const calendar_feature_inView = useInView(calendarFeatureRef, { once: true, margin: "-100px" });

  // for team feature content
  const teamFeatureRef = useRef<HTMLDivElement>(null);
  const team_feature_inView = useInView(teamFeatureRef, { once: true, margin: "-100px" });

  // for notification feature content
  const notificationFeatureRef = useRef<HTMLDivElement>(null);
  const notification_feature_inView = useInView(notificationFeatureRef, { once: true, margin: "-100px" });

  // for custom theme feature content
  const customThemeFeatureRef = useRef<HTMLDivElement>(null);
  const custom_theme_inView = useInView(customThemeFeatureRef, { once: true, margin: "-100px" });

  // -------------------- last test ---------------------

  // for last  ready to boost text
  const readyToBoostRef = useRef<HTMLHeadingElement>(null);
  const ready_to_boost_inView = useInView(readyToBoostRef, { once: true, margin: "-100px" });

  // for ready p tag
  const readyToBoostPRef = useRef<HTMLParagraphElement>(null);
  const ready_to_boost_p_inView = useInView(readyToBoostPRef, { once: true, margin: "-100px" });

  // for get started button
  const getStartedBtnRef = useRef<HTMLDivElement>(null);
  const get_started_btn_inView = useInView(getStartedBtnRef, { once: true, margin: "-100px" });
  // =====================================================================================================================

  return (
    <>
      <Helmet>
        <title>DailyDoer – Smart Task Manager and Planner</title>
        <meta name="description" content="DailyDoer helps you manage tasks, boards, calendars and more – all in one productivity platform. Organize your day the smart way." />
        <link rel="canonical" href="https://dailydoer.space/" />
      </Helmet>


      <div className="main_intropage_container" style={{
        color: currentTheme['--main-text-coloure'],
        transition: 'all'
      }}>

        <div className='mainpage_child_main_cont' >
          <div className='landing_header_cont' >
            {/* Logo Component */}
            <div className="landing_logo_container" onClick={handleLogoClick} >
              <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 517.14 758.16"
                width={isMobile ? '40' : '50'}
                height={isMobile ? '40' : '50'}
              >
                <g >
                  <polygon
                    ref={polygonRef}

                    className=""
                    style={{
                      fill: "none",
                      stroke: currentTheme['--main-text-coloure'],
                      strokeWidth: 10,
                      opacity: 0,
                      transition: "fill 0.3s",
                    }}
                    points="0 0 73 0 73 429.33 36.5 385.33 0 429.33 0 0"
                  />
                </g>
                <g className="">
                  <path
                    ref={pathRef}
                    className=""
                    style={{
                      fill: "none",
                      stroke: currentTheme['--main-text-coloure'],
                      strokeWidth: 10,
                      opacity: 0,
                      transition: "fill 0.3s",
                    }}
                    d="M925.67,249v77.33s368.66-56.66,316,352C1237.54,709,1224.35,772.94,1174,830c-99.17,112.38-252.29,96-268,94l-66.17,74.33A595.52,595.52,0,0,0,967,1004c51.54-3.23,115.06-7.2,183-44,15-8.1,64.88-36.61,109-93,87-111.13,80.35-239.69,78-275-2.77-41.65-9.27-139.56-81-224C1138.22,229.34,946.34,246.79,925.67,249Z"
                    transform="translate(-770 -247)"
                  />
                </g>
              </svg>
            </div>

            <div className='landing_buttons_cont' >
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

              <button
                onClick={() => navigate('/login')}
                className='login_button'
                style={{
                  backgroundColor: currentTheme['--main-text-coloure'],
                  color: currentTheme['--background-color']
                }}
              >
                {t('login')}
              </button>
              <button
                onClick={() => navigate('/register')}
                className='register_button'
                style={{
                  backgroundColor: currentTheme['--main-text-coloure'],
                  color: currentTheme['--background-color']
                }}
              >
                {t('register')}
              </button>
            </div>

          </div>

          <h1 className='intro_header' ref={headerRef} >{t('welcome_to_dailydoer')}</h1>

          <div className='slogan_container'>
            <h2 className="slogan_h2" ref={sloganRef}></h2>
          </div>

          <TaskSlider
            currentTheme={currentTheme}
            isMobile={isMobile}
          />


          <div className="features_section_container">
            <svg className="svg_wave_bg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path fill={currentTheme['--task-background-color']} d="M0,160L80,165.3C160,171,320,181,480,165.3C640,149,800,107,960,112C1120,117,1280,171,1360,197.3L1440,224L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
            </svg>
            <h2 className="features_title" ref={chooseDailyDoerRef} >{t('why_choose_dailydoer')}</h2>



            {/* features containers  */}
            <div className="features_all_card_container">
              <div className="feature_card">
                <div className='feature_text_cont' >
                  <SvgBackground isMobile={isMobile} path_variant={1} currentTheme={currentTheme} />
                  <motion.div
                    className='feature_all_text_container'
                    ref={taskFeatureRef}
                    initial={{ opacity: 0, y: 40 }}
                    animate={task_feature_inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <h3>{t('feature_task_management_title')}</h3>
                    <div className='feature_line' style={{ borderColor: currentTheme['--border-color'] }}  ></div>
                    <p>{t('feature_task_management_desc')}</p>
                  </motion.div>
                </div>
                <img src={task_managment_image} alt="Task Management image" className='feature_image' />
              </div>
              <div className="feature_card">
                <div className='feature_text_cont' >
                  <SvgBackground isMobile={isMobile} path_variant={2} currentTheme={currentTheme} />
                  <motion.div
                    className='feature_all_text_container'
                    ref={diagramFeatureRef}
                    initial={{ opacity: 0, y: 40 }}
                    animate={diagram_feature_inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <h3>{t('feature_diagram_title')}</h3>
                    <div className='feature_line' style={{ borderColor: currentTheme['--border-color'] }}  ></div>
                    <p>{t('feature_diagram_desc')}</p>
                  </motion.div>
                </div>
                <img src={diagram_image} alt="Diagram image" className='feature_image' />
              </div>
              <div className="feature_card">
                <div className='feature_text_cont' >
                  <SvgBackground isMobile={isMobile} path_variant={3} currentTheme={currentTheme} />
                  <motion.div
                    className='feature_all_text_container'
                    ref={calendarFeatureRef}
                    initial={{ opacity: 0, y: 40 }}
                    animate={calendar_feature_inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <h3>{t('feature_calendar_title')}</h3>
                    <div className='feature_line' style={{ borderColor: currentTheme['--border-color'] }}  ></div>
                    <p>{t('feature_calendar_desc')}</p>
                  </motion.div>
                </div>
                <img src={calendar_image} alt="Calendar image" className='feature_image' />
              </div>
              <div className="feature_card">
                <div className='feature_text_cont' >
                  <SvgBackground isMobile={isMobile} path_variant={4} currentTheme={currentTheme} />
                  <motion.div
                    className='feature_all_text_container'
                    ref={teamFeatureRef}
                    initial={{ opacity: 0, y: 40 }}
                    animate={team_feature_inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <h3>{t('feature_team_title')}</h3>
                    <div className='feature_line' style={{ borderColor: currentTheme['--border-color'] }}  ></div>
                    <p>{t('feature_team_desc')}</p>
                  </motion.div>
                </div>
                <img src={team_image} alt="Team image" className='feature_image' />
              </div>
              <div className="feature_card">
                <div className='feature_text_cont' >
                  <SvgBackground isMobile={isMobile} path_variant={2} currentTheme={currentTheme} />
                  <motion.div
                    className='feature_all_text_container'
                    ref={notificationFeatureRef}
                    initial={{ opacity: 0, y: 40 }}
                    animate={notification_feature_inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <h3>{t('feature_notification_title')}</h3>
                    <div className='feature_line' style={{ borderColor: currentTheme['--border-color'] }}  ></div>
                    <p>{t('feature_notification_desc')}</p>
                  </motion.div>
                </div>
                <img src={notification_image} alt="notification image" className='feature_image' />
              </div>
              <div className="feature_card">
                <div className='feature_text_cont' >
                  <SvgBackground isMobile={isMobile} path_variant={5} currentTheme={currentTheme} />
                  <motion.div
                    className='feature_all_text_container'
                    ref={customThemeFeatureRef}
                    initial={{ opacity: 0, y: 40 }}
                    animate={custom_theme_inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <h3>{t('feature_custom_theme_title')}</h3>
                    <div className='feature_line' style={{ borderColor: currentTheme['--border-color'] }}  ></div>
                    <p>{t('feature_custom_theme_desc')}</p>
                  </motion.div>
                </div>
                <img src={customtheme_image} alt="Custom Theme image" className='feature_image' />
              </div>

              <GifSlider 
                isMobile={isMobile}
              />

              <div className="cta_section">
                <motion.h2
                  ref={readyToBoostRef}
                  initial={{ opacity: 0, y: 40 }}
                  animate={ready_to_boost_inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  {t('ready_to_boost')}
                </motion.h2>
                <motion.p
                  ref={readyToBoostPRef}
                  initial={{ opacity: 0, y: 40 }}
                  animate={ready_to_boost_p_inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
                >
                  {t('join_us_for_organizing')}
                </motion.p>
                <motion.div
                  style={{
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  ref={getStartedBtnRef}
                  initial={{ opacity: 0, y: 40 }}
                  animate={get_started_btn_inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
                >
                  <button
                    onClick={() => navigate('/login')}
                    className="register_cta_btn"
                    style={{
                      backgroundColor: currentTheme['--list-background-color'],
                      color: currentTheme['--main-text-coloure'],
                      minHeight: '40px',
                    }}
                  >
                    {t('get_started_free')}
                  </button>
                </motion.div>
              </div>


              <svg className="svg_wave_bg_bottom" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill={currentTheme['--task-background-color']} d="M0,96L80,112C160,128,320,160,480,160C640,160,800,128,960,101.3C1120,75,1280,53,1360,42.7L1440,32L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
              </svg>
              
              <p style={{
                position: 'absolute',
                bottom: '-12px',
                right: '2px',
                zIndex: 1000,
                color: currentTheme['--due-date-color'],
              }}>© 2025 DailyDoer</p>
            </div>
          </div>




        </div>
        {/* <GoogleSignIn setIsAuthenticated={setIsAuthenticated} /> */}
      </div>
    </>
  );
};




export default IntroPage;





















