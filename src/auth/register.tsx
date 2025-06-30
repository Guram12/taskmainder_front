import "../styles/Register.css";
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosinstance';
import { useNavigate } from 'react-router-dom';
import timezone_data from "../utils/data.json";
import { ThemeSpecs } from '../utils/theme';
import { MdOutlineAlternateEmail } from "react-icons/md";
import { PiPasswordBold } from "react-icons/pi";
import { FaUser } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { IoEarth } from "react-icons/io5";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Select } from 'antd';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";





export interface FilteredCountry {
  name: string;
  timezone: string;
  utc_offset: string;
}

interface RegisterProps {
  currentTheme: ThemeSpecs;
}

const Register: React.FC<RegisterProps> = ({ currentTheme }) => {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [show_password, setShow_password] = useState<boolean>(false);


  // password validation states 
  const [isLongEnough, setIsLongEnough] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordAcceptable, setIsPasswordAcceptable] = useState<boolean>(false);

  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const [selectedTimeZone, setSelectedTimeZone] = useState<string | undefined>(undefined);

  const navigate = useNavigate();


  // ===================================== validate password ============================

  useEffect(() => {
    setIsLongEnough(confirmPassword.length >= 8);
    setHasUppercase(/[A-Z]/.test(confirmPassword));
    setHasNumber(/\d/.test(confirmPassword));
    if (confirmPassword.length > 0) {
      if (confirmPassword === confirmPassword) {
        setIsPasswordValid(true);
      }
      else {
        setIsPasswordValid(false);
      }
    }
  }, [confirmPassword, confirmPassword]);

  useEffect(() => {
    setIsPasswordAcceptable(validatePassword());
  }, [isLongEnough, hasUppercase, hasNumber, isPasswordValid, confirmPassword, confirmPassword]);

  const validatePassword = (): boolean => {
    return isLongEnough && hasUppercase && hasNumber && isPasswordValid;
  };



  // ===================================== register =====================================
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', confirmPassword);
    formData.append('phone_number', phoneNumber);

    if (selectedTimeZone !== undefined) {
      formData.append('timezone', selectedTimeZone);
    }

    try {
      await axiosInstance.post('/acc/register/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Registration successful!');

    } catch (error) {
      setMessage('Registration failed. Please try again.');
    }
  };


  const handleLogin = () => {
    navigate('/');
  };


  // ============================================== hilight countri latters that match ================================



  const openEmailProvider = () => {
    const emailDomain = email.split('@')[1];
    const emailProviderUrl = `https://${emailDomain}`;
    window.open(emailProviderUrl, '_blank');
  };


  const timezoneOptions = timezone_data.map((entry) => ({
    label: `${entry.country_name} (Timezone: ${entry.timezone}, ${entry.utc_offset})`,
    value: entry.timezone,
  }));


  return (
    <div className="main_register_container">
      <div className="register_container">
        <h2
          className="register_header"
          style={{ color: currentTheme['--main-text-coloure'] }}
        >
          Register
        </h2>
        <form
          onSubmit={handleRegister}
          className="register_form"
          style={{
            background: currentTheme['--list-background-color'],
            border: `1px solid ${currentTheme['--border-color']}`,
            color: currentTheme['--main-text-coloure'],
            borderRadius: '10px',

          }}
        >
          <div className="register_form_group" >
            <MdOutlineAlternateEmail className='register_icons' style={{ color: currentTheme['--main-text-coloure'] }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="register_input"
              placeholder="Enter your email"
              style={{
                background: currentTheme['--task-background-color'],
                color: currentTheme['--main-text-coloure'],
                border: `1px solid ${currentTheme['--border-color']}`,
                ['--placeholder-color']: currentTheme['--due-date-color'],
              } as React.CSSProperties}
            />
          </div>

          <div className="register_form_group" >
            <FaUser className='register_icons' style={{ color: currentTheme['--main-text-coloure'] }} />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
              className="register_input"
              style={{
                background: currentTheme['--task-background-color'],
                color: currentTheme['--main-text-coloure'],
                border: `1px solid ${currentTheme['--border-color']}`,
                ['--placeholder-color']: currentTheme['--due-date-color'],

              } as React.CSSProperties}
            />
          </div>

          <div className="register_form_group"  >
            <FaPhone className='register_icons' style={{ color: currentTheme['--main-text-coloure'] }} />
            <PhoneInput
              country={'us'}
              value={phoneNumber}
              onChange={setPhoneNumber}
              inputStyle={{
                background: currentTheme['--task-background-color'],
                color: currentTheme['--main-text-coloure'],
                border: `1px solid ${currentTheme['--border-color']}`,
                width: '320px',
              }}
              buttonStyle={{
                border: `1px solid ${currentTheme['--border-color']}`,
                background: currentTheme['--task-background-color'],
              }}
              containerStyle={{
                width: '320px',
              }}
              dropdownClass="custom-phone-dropdown"
              containerClass="custom-phone-container"
              placeholder="Enter your phone number"
            />
          </div>

          {/* =============== timezone select ================= */}
          <div className="register_form_group">
            <IoEarth className='register_icons' style={{ color: currentTheme['--main-text-coloure'] }} />
            <Select
              showSearch
              value={selectedTimeZone}
              onChange={(value) => {
                setSelectedTimeZone(value);
              }}
              options={timezoneOptions}
              placeholder="Select your country for timezone"
              style={{
                width: 320,
                height: '40px',
                background: currentTheme['--task-background-color'],
                color: currentTheme['--main-text-coloure'],
                border: `1px solid ${currentTheme['--border-color']}`,
              }}
              dropdownStyle={{
                background: currentTheme['--list-background-color'],
                color: currentTheme['--main-text-coloure'],
                border: `1px solid ${currentTheme['--border-color']}`,
              }}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </div>

          {/* =============== password creation ================= */}

          <div className="register_form_group" >
            <PiPasswordBold className='register_icons' style={{ color: currentTheme['--main-text-coloure'] }} />
            <input
              type={show_password ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="register_input"
              placeholder="Enter your password"
              style={{
                background: currentTheme['--task-background-color'],
                color: currentTheme['--main-text-coloure'],
                border: `1px solid ${currentTheme['--border-color']}`,
                ['--placeholder-color']: currentTheme['--due-date-color'],
              } as React.CSSProperties}
            />
          </div>

          <div className="register_form_group" >
            <PiPasswordBold className='register_icons' style={{ color: currentTheme['--main-text-coloure'] }} />
            <input
              type={show_password ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="register_input"
              placeholder="Confirm your password"
              style={{
                background: currentTheme['--task-background-color'],
                color: currentTheme['--main-text-coloure'],
                border: `1px solid ${currentTheme['--border-color']}`,
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


          {/* =======================  register button ======================= */}
          <button
            type="submit"
            className="register_button"
            style={{
              background: currentTheme['--task-background-color'],
              color: currentTheme['--main-text-coloure'],
              border: `1px solid ${currentTheme['--border-color']}`,
              cursor: isPasswordAcceptable ? 'pointer' : 'not-allowed',
            }}
            disabled={isPasswordAcceptable ? false : true}
          >
            Register
          </button>
        </form>
        {message && (
          <div>
            <p
              className={`register_message ${message.includes('failed') ? 'error' : ''}`}
              style={{
                color: message.includes('failed') ? 'red' : 'green',
                background: currentTheme['--task-background-color'],
                border: `1px solid ${currentTheme['--border-color']}`,
                padding: '8px',
                borderRadius: '4px',
                marginTop: '10px',
              }}
            >
              {message}
            </p>
            {message.includes('successful') && (
              <button
                onClick={openEmailProvider}
                className="register_button"
                style={{
                  background: currentTheme['--hover-color'],
                  color: currentTheme['--main-text-coloure'],
                  border: `1px solid ${currentTheme['--border-color']}`,
                }}
              >
                Go to Email for Verification
              </button>
            )}
          </div>
        )}
        <button
          onClick={handleLogin}
          className="back_to_login_btn"
          style={{
            background: currentTheme['--hover-color'],
            color: currentTheme['--main-text-coloure'],
            border: `1px solid ${currentTheme['--border-color']}`,
            marginTop: '10px',
          }}
        >
          Go back to login
        </button>
      </div>
    </div>

  );
}

export default Register;