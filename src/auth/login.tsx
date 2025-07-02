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



interface loginProps {
  setIsAuthenticated: (value: boolean) => void;
  currentTheme: ThemeSpecs;
}

const Login: React.FC<loginProps> = ({ setIsAuthenticated, currentTheme }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [login_loading, setLogin_loading] = useState<boolean>(false);


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



  return (
    <div
      className="login-container"
      style={{
        background: currentTheme['--background-color'],
        color: currentTheme['--main-text-coloure'],
        minHeight: '100vh',
      }}
    >
      <h2 className="login-title" style={{ color: currentTheme['--main-text-coloure'] }}>Login</h2>
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
            placeholder='Enter your email'
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
            placeholder='Enter your password'
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
            {showPassword ? 'Hide password' : 'Show password'}
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
            Login
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
        Register
      </button>
      <a
        href="/password-reset"
        style={{
          color: currentTheme['--due-date-color'],
          marginTop: '10px',
          textDecoration: 'underline',
        }}
      >
        forgot password?
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