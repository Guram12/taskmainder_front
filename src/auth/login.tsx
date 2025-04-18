import '../styles/Login.css';
import React, {  useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosinstance';
import GoogleSignIn from './GoogleSignIn';

interface loginProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Login: React.FC<loginProps> = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
    }
  };

  const handleRegisterButtonClick = () => {
    navigate('/register');
  };



  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            className="form-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password:</label>
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="login-button" type="submit">
          Login
        </button>
      </form>
      <div className="google-signin-container">
        <GoogleSignIn setIsAuthenticated={setIsAuthenticated} />
      </div>
      <button className="register-button" onClick={handleRegisterButtonClick}>
        Register
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;