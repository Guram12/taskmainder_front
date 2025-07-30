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
import { TbArrowBackUp } from "react-icons/tb";
import PulseLoader from "react-spinners/PulseLoader";
import { useTranslation } from 'react-i18next';
import { Helmet } from "react-helmet-async";



export interface FilteredCountry {
  name: string;
  timezone: string;
  utc_offset: string;
}

interface RegisterProps {
  currentTheme: ThemeSpecs;
  isMobile: boolean;
}

const Register: React.FC<RegisterProps> = ({ currentTheme, isMobile }) => {
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

  const [registration_loading, setRegistration_loading] = useState<boolean>(false);

  const { t } = useTranslation();

  const navigate = useNavigate();


  useEffect(() => {
    console.log('selected timezone: ', selectedTimeZone);
  }, [selectedTimeZone]);

  // ===================================== validate password ============================

  useEffect(() => {
    setIsLongEnough(password.length >= 8);
    setHasUppercase(/[A-Z]/.test(password));
    setHasNumber(/\d/.test(password));
    if (password.length > 0) {
      if (password === confirmPassword) {
        setIsPasswordValid(true);
      }
      else {
        setIsPasswordValid(false);
      }
    }
  }, [confirmPassword, password]);

  useEffect(() => {
    setIsPasswordAcceptable(validatePassword());
  }, [isLongEnough, hasUppercase, hasNumber, isPasswordValid, confirmPassword, password]);

  const validatePassword = (): boolean => {
    return isLongEnough && hasUppercase && hasNumber && isPasswordValid;
  };



  // ===================================== register =====================================
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistration_loading(true);
    const formData = new FormData();
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', confirmPassword);
    formData.append('phone_number', phoneNumber);

    if (selectedTimeZone !== undefined) {
      if (selectedTimeZone === 'Europe/Tbilisi') {
        console.log('Selected timezone is Europe/Tbilisi');
        formData.append('timezone', 'Asia/Tbilisi');
      } else {
        formData.append('timezone', selectedTimeZone);
      }
    }

    try {
      await axiosInstance.post('/acc/register/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Registration successful!');
    } catch (error: any) {
      // Try to extract a detailed error message from the response
      let errorMsg = 'Registration failed.';
      if (error.response && error.response.data) {
        // If the backend returns an object like { email: [...] }
        const data = error.response.data;
        if (typeof data === 'object') {
          errorMsg += ' ' + Object.entries(data)
            .map(([field, messages]) => `${field}: ${(Array.isArray(messages) ? messages.join(', ') : messages)}`)
            .join(' | ');
        } else {
          errorMsg += ' ' + data;
        }
      } else if (error instanceof Error) {
        errorMsg += ' ' + error.message;
      }
      setMessage(errorMsg);
      console.error('Registration error:', error);
    } finally {
      setRegistration_loading(false);
    }
  };


  const handleLogin = () => {
    navigate('/');
  };


  // ============================================== open email providcer ================================

  const openEmailProvider = () => {
    const emailDomain = email.split('@')[1];
    const emailProviderUrl = `https://${emailDomain}`;
    window.open(emailProviderUrl, '_self');   // i should select '_self' instead of '_blank' to open in the same tab
  };

  // ============================================== timezone select options ================================
  const timezoneOptions = timezone_data.map((entry) => ({
    label: `${entry.country_name} (Timezone: ${entry.timezone}, ${entry.utc_offset})`,
    value: entry.timezone,
  }));


  return (
    <>
      <Helmet>
        <title>Register | DailyDoer</title>
        <meta name="description" content="Create a new DailyDoer account to start organizing your tasks, boards, and projects efficiently." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://dailydoer.space/register" />
      </Helmet>
      
      <div className="main_register_container">
        <div className="register_container">

          {/* Logo Component */}
          <div className="logo-wrapper"> {/* <-- Add this wrapper */}
            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 517.14 758.16"
              width="60"
              height="60"
            >
              <g >
                <polygon
                  style={{
                    fill: currentTheme['--main-text-coloure'],
                    stroke: currentTheme['--main-text-coloure'],
                    strokeWidth: 25,
                  }}
                  points="0 0 73 0 73 429.33 36.5 385.33 0 429.33 0 0"
                />
              </g>
              <g >
                <path
                  className=""
                  style={{
                    fill: currentTheme['--main-text-coloure'],
                    stroke: currentTheme['--main-text-coloure'],
                    strokeWidth: 25,
                  }}
                  d="M925.67,249v77.33s368.66-56.66,316,352C1237.54,709,1224.35,772.94,1174,830c-99.17,112.38-252.29,96-268,94l-66.17,74.33A595.52,595.52,0,0,0,967,1004c51.54-3.23,115.06-7.2,183-44,15-8.1,64.88-36.61,109-93,87-111.13,80.35-239.69,78-275-2.77-41.65-9.27-139.56-81-224C1138.22,229.34,946.34,246.79,925.67,249Z"
                  transform="translate(-770 -247)"
                />
              </g>
            </svg>
          </div>

          <h2
            className="register_header"
            style={{ color: currentTheme['--main-text-coloure'] }}
          >
            {t('register')}
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
                placeholder={t('email')}
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
                placeholder={t('username')}
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
                  width: isMobile ? '290px' : '320px',
                  height: '40px',

                }}
                buttonStyle={{
                  border: `1px solid ${currentTheme['--border-color']}`,
                  background: currentTheme['--task-background-color'],
                }}
                // containerStyle={{
                //   width: '320px',
                // }}
                dropdownClass="custom-phone-dropdown"
                containerClass="custom-phone-container"
                placeholder={t('phone_number')}
              />
            </div>

            {/* =============== timezone select ================= */}
            <div className="register_form_group"

            >
              <IoEarth className='register_icons' style={{ color: currentTheme['--main-text-coloure'] }} />
              <Select
                showSearch
                value={selectedTimeZone}
                onChange={(value) => {
                  setSelectedTimeZone(value);
                }}
                options={timezoneOptions}
                placeholder={t('select_timezone')}
                style={{
                  width: isMobile ? '290px' : '320px',
                  height: '40px',
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
                placeholder={t('password')}
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
                placeholder={t('confirm_password')}
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
                {show_password ? <>{t('hide_password')}</> : <>{t('show_password')}</>}
              </p>
            </div>


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
                  <span>{t('Passwords_do_not_match')}</span>
                )}
              </p>
            </div>


            {/* =======================  register button ======================= */}
            {!registration_loading ? (
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
                <>{t('register')}</>
              </button>
            ) : (
              <PulseLoader
                className='register_loading'
                color={currentTheme['--task-background-color']}
                size={10}
              />
            )}


          </form>

          {message && (
            <div>
              <p
                className={`register_message ${message.includes('failed') ? 'error' : ''}`}
                style={{
                  color: message.includes('failed') ? 'red' : 'seagreen',
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
                  className="open_email_button"
                  style={{
                    background: currentTheme['--list-background-color'],
                    color: currentTheme['--main-text-coloure'],
                    border: `1px solid ${currentTheme['--border-color']}`,
                  }}
                >
                  Go to Email for Verification
                </button>
              )}
            </div>
          )}

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
}

export default Register;