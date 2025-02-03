import React, { useState } from 'react';
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
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '20px',
      }}>
        <GoogleSignIn setIsAuthenticated={setIsAuthenticated} />
      </div>
      <button onClick={handleRegisterButtonClick} >Register</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;