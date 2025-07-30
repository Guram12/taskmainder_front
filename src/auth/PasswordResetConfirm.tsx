import '../styles/PasswordResetConfirm.css';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosinstance';
import { ThemeSpecs } from '../utils/theme';
import { PiPassword } from "react-icons/pi";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { Helmet } from "react-helmet-async";



interface PasswordResetConfirmProps {
  currentTheme: ThemeSpecs;
}


const PasswordResetConfirm: React.FC<PasswordResetConfirmProps> = ({ currentTheme }) => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [show_password, setShow_password] = useState<boolean>(false);


  // password validation states 
  const [isLongEnough, setIsLongEnough] = useState<boolean>(false);
  const [hasUppercase, setHasUppercase] = useState<boolean>(false);
  const [hasNumber, setHasNumber] = useState<boolean>(false);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [isPasswordAcceptable, setIsPasswordAcceptable] = useState<boolean>(false);



  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axiosInstance.post(`/acc/password-reset-confirm/${uid}/${token}/`, {
        new_password: newPassword,
      });

      if (response.status === 200) {
        setMessage('Password has been reset successfully. Redirecting to login...');
        setTimeout(() => navigate('/'), 3000); // Redirect to login after 3 seconds
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } catch (err: any) {
      setError('Failed to reset password. Please try again.');
    }
  };

  // ===================================== validate password ============================

  useEffect(() => {
    setIsLongEnough(newPassword.length >= 8);
    setHasUppercase(/[A-Z]/.test(newPassword));
    setHasNumber(/\d/.test(newPassword));
    if (newPassword.length > 0) {
      if (newPassword === confirmPassword) {
        setIsPasswordValid(true);
      }
      else {
        setIsPasswordValid(false);
      }
    }
  }, [newPassword, confirmPassword]);


  useEffect(() => {
    setIsPasswordAcceptable(validatePassword());
  }, [isLongEnough, hasUppercase, hasNumber, isPasswordValid, newPassword, confirmPassword]);

  const validatePassword = (): boolean => {
    return isLongEnough && hasUppercase && hasNumber && isPasswordValid;
  };


  return (
    <>
      <Helmet>
        <title>Set New Password | DailyDoer</title>
        <meta name="description" content="Set a new password for your DailyDoer account." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://dailydoer.space/password-reset-confirm" />
      </Helmet>
      <div className='confirm_reset_container' >

        <h2 style={{ color: currentTheme['--main-text-coloure'] }}>{t('create_new_password')}</h2>
        <div className='confirm_reset_child_container' style={{ borderColor: currentTheme['--border-color'] }}>
          <form onSubmit={handleSubmit} className='confirm_reset_form'>

            <div className='confirm_password_group'>
              <PiPassword style={{ color: currentTheme['--main-text-coloure'] }} className='confirm_reset_icon' />
              <input
                type={show_password ? 'text' : 'password'}
                className='confirm_password_input'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder={t('new_Password')}
                style={{
                  borderColor: currentTheme['--border-color'],
                  color: currentTheme['--main-text-coloure'],
                  backgroundColor: currentTheme['--list-background-color'],
                  ['--placeholder-color']: currentTheme['--due-date-color'],
                } as React.CSSProperties}
              />
            </div>

            <div className='confirm_password_group'>
              <PiPassword style={{ color: currentTheme['--main-text-coloure'] }} className='confirm_reset_icon' />
              <input
                type={show_password ? 'text' : 'password'}
                className='confirm_password_input'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder={t('confirm_new_Password')}
                style={{
                  borderColor: currentTheme['--border-color'],
                  color: currentTheme['--main-text-coloure'],
                  backgroundColor: currentTheme['--list-background-color'],
                  ['--placeholder-color']: currentTheme['--due-date-color'],
                } as React.CSSProperties}
              />
            </div>

            <div className="show_password_container" >
              {show_password ? (
                <FaRegEye className='show_password' onClick={() => setShow_password(!show_password)} />
              ) : (
                <FaRegEyeSlash className='show_password' onClick={() => setShow_password(!show_password)} />
              )}
              <p onClick={() => setShow_password(!show_password)}
                style={{
                  cursor: 'pointer',
                  color: currentTheme['--main-text-coloure'],
                  margin: '0px',
                }}
              >
                {show_password ? t('hide_password') : t('show_password')}
              </p>
            </div>


            {/* password validations  */}
            <div className='register_password_validations_container'>
              <p className='register_password_validations' style={{ color: isLongEnough ? 'mediumseagreen' : 'red' }}>
                {!isLongEnough && <span>*</span>} {t('minimum_8_symbols')}
              </p>
              <p className='register_password_validations' style={{ color: hasUppercase ? 'mediumseagreen' : 'red' }}>
                {!hasUppercase && <span>*</span>} {t('at_least_one_uppercase_letter')}
              </p>
              <p className='register_password_validations' style={{ color: hasNumber ? 'mediumseagreen' : 'red' }}>
                {!hasNumber && <span>*</span>} {t('at_least_one_number')}
              </p>
              <p className='register_password_validations' style={{ color: isPasswordValid ? 'mediumseagreen' : 'red' }}>
                {isPasswordValid ? (
                  <span>{t('passwords_match')}</span>
                ) : (
                  <span> {t('Passwords_do_not_match')}</span>
                )}
              </p>
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: currentTheme['--list-background-color'],
                borderColor: currentTheme['--border-color'],
                color: currentTheme['--main-text-coloure'],
                cursor: isLongEnough && hasUppercase && hasNumber && isPasswordValid ? 'pointer' : 'not-allowed',
              }}
              className='confirm_reset_button'
              disabled={!isPasswordAcceptable}
            >
              {t('confirm')}
            </button>

            {message && <p style={{ color: 'seagreen', marginTop: '10px' }}>{message}</p>}
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          </form>


        </div>
      </div>
    </>

  );
};

export default PasswordResetConfirm;