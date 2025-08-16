import '../styles/Login.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosinstance';
import GoogleSignIn from './GoogleSignIn';
import { ThemeSpecs } from '../utils/theme';
import { MdOutlineAlternateEmail } from "react-icons/md";
import { PiPasswordBold } from "react-icons/pi";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import PulseLoader from "react-spinners/PulseLoader";
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { useTranslation } from 'react-i18next';
import { GlobalOutlined } from '@ant-design/icons';
import { Helmet } from "react-helmet-async";
import GitHubSignIn from './GithubSignUp';

interface loginProps {
  setIsAuthenticated: (value: boolean) => void;
  currentTheme: ThemeSpecs;
  language: 'en' | 'ka';
  setLanguage: (language: 'en' | 'ka') => void;
}

const Login: React.FC<loginProps> = ({ setIsAuthenticated, currentTheme, language, setLanguage }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [login_loading, setLogin_loading] = useState<boolean>(false);


  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLogin_loading(true);
    try {
      const response = await axiosInstance.post(`/acc/login/`, {
        email,
        password,
      });

      if (response.data.access && response.data.refresh) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        setIsAuthenticated(true);
        navigate('/mainpage');
      } else {
        setError('An error occurred during login.');
      }
    } catch (err: any) {
      console.error('Error during login:', err.response);
      setError(err.response.data.error || 'An error occurred during login.');
    } finally {
      setLogin_loading(false);
    }
  };

  const handleRegisterButtonClick = () => {
    navigate('/register');
  };



  // =================================== Language dropdown menu ===================================
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

  const handleLanguageChange = (selectedLanguage: 'en' | 'ka') => {
    setLanguage(selectedLanguage);
    localStorage.setItem('language', selectedLanguage);
    i18n.changeLanguage(selectedLanguage);
  };

  // =================================================== logo click =============================================
  const handleLogoClick = () => {
    navigate('/');
  };


  return (
    <>
      <Helmet>
        <title>Login | DailyDoer</title>
        <meta name="description" content="Login to your DailyDoer account to manage your tasks, boards, and projects efficiently." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://dailydoer.space/login" />
      </Helmet>


      <div
        className="login-container"
        style={{
          background: currentTheme['--background-color'],
          color: currentTheme['--main-text-coloure'],
          minHeight: '100vh',
        }}
      >

        {/* Logo Component */}
        <div className="logo-wrapper" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 517.14 758.16"
            width="60"
            height="60"
          >
            <g >
              <polygon
                className="logo-polygon  animate-down-up"
                style={{
                  fill: currentTheme['--main-text-coloure'],
                  stroke: currentTheme['--main-text-coloure'],
                  strokeWidth: 25,
                }}
                points="0 0 73 0 73 429.33 36.5 385.33 0 429.33 0 0"
              />
            </g>
            <g className="path-element">
              <path
                className=""
                style={{
                  fill: currentTheme['--main-text-coloure'],
                  stroke: currentTheme['--main-text-coloure'],
                  strokeWidth: 25,
                }}
                d="M925.67,249v77.33s368.66-56.66,316,352C1237.54,709,1224.35,772.94,1174,830c-99.17,112.38-252.29,96-268,94l-66.17,74.33A595.52,595.52,0,0,0,967,1004c51.54-3.23,115.06-7.2,183-44,15-8.1,64.88-36.61,109-93,87-111.13,80.35-239.69,78-275-2.77-41.65-9.27-139.56-81-224C1138.22,229.34,946.34,246.79,925.67,249Z"
                transform="translate(-770 -247)"
              />
            </g>
          </svg>
        </div>


        <h2 className="login-title" style={{ color: currentTheme['--main-text-coloure'] }}>{t('login')}</h2>

        {/* Language Dropdown */}
        <div className="mobile_language_dropdown_wrapper onloginpage">
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

        <form
          className="login-form"
          onSubmit={handleLogin}
          style={{
            background: currentTheme['--list-background-color'],
            border: `1px solid ${currentTheme['--border-color']}`,
            color: currentTheme['--main-text-coloure'],
          }}
        >
          <div className="form-group">
            <MdOutlineAlternateEmail className='login_icons' style={{ color: currentTheme['--main-text-coloure'] }} />
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t('enter_your_email')}
              style={{
                background: currentTheme['--task-background-color'],
                color: currentTheme['--main-text-coloure'],
                border: `1px solid ${currentTheme['--border-color']}`,
                ['--placeholder-color']: currentTheme['--due-date-color'],
              } as React.CSSProperties}


            />
          </div>
          <div className="form-group">
            <PiPasswordBold className='login_icons' style={{ color: currentTheme['--main-text-coloure'] }} />
            <input
              className="form-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t('enter_your_password')}
              style={{
                background: currentTheme['--task-background-color'],
                color: currentTheme['--main-text-coloure'],
                border: `1px solid ${currentTheme['--border-color']}`,
                ['--placeholder-color']: currentTheme['--due-date-color'],
              } as React.CSSProperties}
            />
          </div>

          <div className="form-group">
            {showPassword ? (
              <FaEye className='login_icons showpassword' style={{ color: currentTheme['--main-text-coloure'] }} onClick={() => setShowPassword(false)} />
            ) : (
              <FaEyeSlash className='login_icons showpassword' style={{ color: currentTheme['--main-text-coloure'] }} onClick={() => setShowPassword(true)} />
            )}
            <p style={{ color: currentTheme['--main-text-coloure'], margin: '0px', marginLeft: '10px', cursor: 'pointer' }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <>{t('hide_password')}</> : <>{t('show_password')}</>}
            </p>
          </div>
          {!login_loading ? (
            <button
              className="login-button"
              type="submit"
              style={{
                background: currentTheme['--hover-color'],
                color: currentTheme['--main-text-coloure'],
                border: `1px solid ${currentTheme['--border-color']}`,
              }}
            >
              {t('login')}
            </button>
          ) : (
            <PulseLoader
              className='register_loading'
              color={currentTheme['--task-background-color']}
              size={10}
            />
          )}
        </form>
        <div className="google-signin-container">
          <GoogleSignIn setIsAuthenticated={setIsAuthenticated} />
          <GitHubSignIn />

        </div>
        <button
          className="register-button"
          onClick={handleRegisterButtonClick}
          style={{
            background: currentTheme['--task-background-color'],
            color: currentTheme['--main-text-coloure'],
            border: `1px solid ${currentTheme['--border-color']}`,
          }}
        >
          {t('register')}
        </button>
        <a
          href="/password-reset"
          style={{
            color: currentTheme['--due-date-color'],
            marginTop: '10px',
            textDecoration: 'underline',
          }}
        >
          {t('forgot_password')}
        </a>
        {error && (
          <p
            className="error-message"
            style={{
              color: 'red',
              background: currentTheme['--task-background-color'],
              border: `1px solid ${currentTheme['--border-color']}`,
              padding: '8px',
              borderRadius: '4px',
              marginTop: '10px',
            }}
          >
            {error}
          </p>
        )}
      </div>
    </>

  );
};

export default Login;