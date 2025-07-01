import '../styles/PasswordReset.css';
import React, { useState } from 'react';
import axiosInstance from '../utils/axiosinstance';
import axios from 'axios';
import { ThemeSpecs } from '../utils/theme';
import { MdOutlineAlternateEmail } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { TbArrowBackUp } from "react-icons/tb";


interface PasswordResetProps {
  currentTheme: ThemeSpecs;
}

const PasswordReset: React.FC<PasswordResetProps> = ({ currentTheme }) => {
  const [email, setEmail] = useState<string>('');
  const [show_reset_button, setShow_reset_button] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');



  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axiosInstance.post('/acc/password-reset/', {
        email,
      });

      // Check if the response status is 200
      if (response.status === 200) {
        setMessage('Password reset link sent to your email address.');
        setShow_reset_button(false);
      } else {
        setError('Failed to send password reset link. Please try again.');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log('Error:', err);
        if (err.response) {
          setError(err.response.data?.error || 'Failed to send password reset link. Please try again.');
        } else {
          setError('Network error. Please check your connection.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };


  const handleLogin = () => {
    navigate('/');
  };

  const openEmailProvider = () => {
    const emailDomain = email.split('@')[1];
    const emailProviderUrl = `https://${emailDomain}`;
    window.open(emailProviderUrl, '_self');   // i should select '_self' instead of '_blank' to open in the same tab
  };



  return (
    <div className='main_reset_container' >
      <div className='send_reset_email_container' style={{ borderColor: currentTheme['--border-color'] }} >
        <h2 style={{ color: currentTheme['--main-text-coloure'] }} >Password Reset</h2>

        <form onSubmit={handleSubmit}>

          <div className='reset_email_input_container' >
            <MdOutlineAlternateEmail style={{ color: currentTheme['--main-text-coloure'] }} className='reset_email_icon' />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='reset_email_input'
              placeholder='Enter your email address'
              style={{
                borderColor: currentTheme['--border-color'],
                color: currentTheme['--main-text-coloure'],
                backgroundColor: currentTheme['--list-background-color'],
                ['--placeholder-color']: currentTheme['--due-date-color'],
              } as React.CSSProperties}
            />
          </div>

          {show_reset_button ? (
            <button
              type="submit"
              style={{
                backgroundColor: currentTheme['--list-background-color'],
                color: currentTheme['--main-text-coloure'],
                borderColor: currentTheme['--border-color'],
                cursor: email.trim() === '' || email.includes('@') === false ? 'not-allowed' : 'pointer',
              }}
              disabled={email.trim() === '' || email.includes('@') === false}
              className='send_reset_email_button'
            >
              Send Reset Link
            </button>
          ) : (
            <button
              onClick={openEmailProvider}
              style={{
                backgroundColor: currentTheme['--list-background-color'],
                color: currentTheme['--main-text-coloure'],
                borderColor: currentTheme['--border-color'],
              }}
              className='open_email_prov_open_btn'
            >
              Open Email Provider
            </button>
          )}



        </form>
        {message && <p style={{ color: 'seagreen', marginTop: '10px' }}>{message}</p>}
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

        {/* =======================  go back to login ======================= */}
        <div className="back_to_login_container">
          <p
            onClick={handleLogin}
            className="back_to_login_p"
            style={{ color: currentTheme['--main-text-coloure'], }}
          >
            Go back to login
          </p>
          <TbArrowBackUp style={{ color: currentTheme['--main-text-coloure'] }} className="back_to_login_icon" />
        </div>

      </div>
    </div>
  );
};

export default PasswordReset;