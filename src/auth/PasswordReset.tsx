import '../styles/PasswordReset.css';
import React, { useState } from 'react';
import axiosInstance from '../utils/axiosinstance';
import axios from 'axios';
import { ThemeSpecs } from '../utils/theme';
import { MdOutlineAlternateEmail } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { TbArrowBackUp } from "react-icons/tb";
import { useTranslation } from 'react-i18next';
import { Helmet } from "react-helmet-async";


interface PasswordResetProps {
  currentTheme: ThemeSpecs;
}

const PasswordReset: React.FC<PasswordResetProps> = ({ currentTheme }) => {
  const [email, setEmail] = useState<string>('');
  const [show_reset_button, setShow_reset_button] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { t } = useTranslation();

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
        setMessage(t('password_reset_link_sent_to_your_email_address.'));
        setShow_reset_button(false);
      } else {
        setError(t('failed_to_send_password_reset_link'));
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log('Error:', err);
        if (err.response) {
          setError(err.response.data?.error || t('failed_to_send_password_reset_link'));
        } else {
          setError('Network error. Please check your connection.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };


  const handleLogin = () => {
    navigate('/login');
  };

  const openEmailProvider = () => {
    const emailDomain = email.split('@')[1];
    const emailProviderUrl = `https://${emailDomain}`;
    window.open(emailProviderUrl, '_self');   // i should select '_self' instead of '_blank' to open in the same tab
  };



  return (
    <>
      <Helmet>
        <title>Password Reset | DailyDoer</title>
        <meta name="description" content="Reset your DailyDoer account password securely and regain access to your tasks and boards." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://dailydoer.space/password-reset" />
      </Helmet>
      
      <div className='main_reset_container' >
        <h2 style={{ color: currentTheme['--main-text-coloure'] }} >{t('password_reset')}</h2>
        <div className='send_reset_email_container' style={{ borderColor: currentTheme['--border-color'] }} >

          <form onSubmit={handleSubmit}>

            <div className='reset_email_input_container' >
              <MdOutlineAlternateEmail style={{ color: currentTheme['--main-text-coloure'] }} className='reset_email_icon' />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='reset_email_input'
                placeholder={t('enter_your_email')}
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
                {t('send_reset_link')}
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
                {t('open_email_provider')}
              </button>
            )}



          </form>
          {message && <p style={{ color: 'seagreen', marginTop: '10px', fontWeight: 'bold' }}>{message}</p>}
          {error && <p style={{ color: 'red', marginTop: '10px', fontWeight: 'bold' }}>{error}</p>}

          {/* =======================  go back to login ======================= */}
          <div className="back_to_login_container">
            <p
              onClick={handleLogin}
              className="back_to_login_p"
              style={{ color: currentTheme['--main-text-coloure'], }}
            >
              {t('go_back_to_login')}
            </p>
            <TbArrowBackUp style={{ color: currentTheme['--main-text-coloure'] }} className="back_to_login_icon" />
          </div>

        </div>
      </div>
    </>

  );
};

export default PasswordReset;