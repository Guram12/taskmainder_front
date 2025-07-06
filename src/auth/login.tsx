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

  return (
    <div
      className="login-container"
      style={{
        background: currentTheme['--background-color'],
        color: currentTheme['--main-text-coloure'],
        minHeight: '100vh',
      }}
    >
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
  );
};

export default Login;