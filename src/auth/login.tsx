import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosinstance';
import axios from 'axios';


interface loginProps {
  setIsAuthenticated: (value: boolean) => void;
}



const Login: React.FC<loginProps> = ({ setIsAuthenticated }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();


  // ===================================== login ====================================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/acc/login/`, {
        email,
        password,
      });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem("login_status", "true");
      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response && err.response.status === 400) {
          const errorMessage = err.response.data.email || 'Invalid email or password';
          console.error(errorMessage);
        } else {
          console.error('An error occurred. Please try again later.');
          setMessage('An error occurred. Please try again later.');
        }
      } else {
        console.error('An unexpected error occurred. Please try again later.');
        setMessage('An unexpected error occurred. Please try again later.');
      }
    }
  };
  // =================================================================================


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
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;