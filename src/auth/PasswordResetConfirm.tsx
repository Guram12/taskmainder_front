import '../styles/PasswordResetConfirm.css';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosinstance';
import { ThemeSpecs } from '../utils/theme';
import { PiPassword } from "react-icons/pi";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";



interface PasswordResetConfirmProps {
  currentTheme: ThemeSpecs;
}


const PasswordResetConfirm: React.FC<PasswordResetConfirmProps> = ({ currentTheme }) => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show_password, setShow_password] = useState<boolean>(false);


  // password validation states 
  const [isLongEnough, setIsLongEnough] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordAcceptable, setIsPasswordAcceptable] = useState<boolean>(false);



  const [message, setMessage] = useState('');
  const [error, setError] = useState('');



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
  }, [newPassword]);


  useEffect(() => {
    setIsPasswordAcceptable(validatePassword());
  }, [isLongEnough, hasUppercase, hasNumber, isPasswordValid, newPassword]);

  const validatePassword = (): boolean => {
    return isLongEnough && hasUppercase && hasNumber && isPasswordValid;
  };


  return (
    <div className='confirm_reset_container' >

      <h2 style={{ color: currentTheme['--main-text-coloure'] }}>Create New Password</h2>
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
              placeholder='Enter new password'
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
              placeholder='Confirm new password'
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
              {show_password ? 'Hide Password' : 'Show Password'}
            </p>
          </div>


          {/* password validations  */}
          <div className='register_password_validations_container'>
            <p className='register_password_validations' style={{ color: isLongEnough ? 'mediumseagreen' : 'red' }}>
              {!isLongEnough && <span>*</span>} Minimum 8 symbols
            </p>
            <p className='register_password_validations' style={{ color: hasUppercase ? 'mediumseagreen' : 'red' }}>
              {!hasUppercase && <span>*</span>} At least one uppercase letter
            </p>
            <p className='register_password_validations' style={{ color: hasNumber ? 'mediumseagreen' : 'red' }}>
              {!hasNumber && <span>*</span>} At least one number
            </p>
            <p className='register_password_validations' style={{ color: isPasswordValid ? 'mediumseagreen' : 'red' }}>
              {isPasswordValid ? (
                <span>Passwords match</span>
              ) : (
                <span>* Passwords do not match</span>
              )}
            </p>
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: currentTheme['--list-background-color'],
              borderColor: currentTheme['--border-color'],
              color: currentTheme['--main-text-coloure'],
            }}
            className='confirm_reset_button'
            disabled={!isPasswordAcceptable}
          >
            Confirm
          </button>

        </form>

        {message && <p style={{ color: 'seagreen', marginTop: '10px' }}>{message}</p>}
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      </div>
    </div>
  );
};

export default PasswordResetConfirm;