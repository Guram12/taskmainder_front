import "../styles/FinishGoogleSignIn.css";
import React, { useState, useEffect } from "react";
import timezone_data from "../utils/data.json";
import axiosInstance from "../utils/axiosinstance";
import { useNavigate } from "react-router-dom";
import { ThemeSpecs } from "../utils/theme";
import { FaUser } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import PhoneInput from 'react-phone-input-2';
import { IoEarth } from "react-icons/io5";
import { Select } from 'antd';
import PulseLoader from "react-spinners/PulseLoader";
import { Helmet } from "react-helmet";



interface FinishGoogleSignInProps {
  setIsAuthenticated: (value: boolean) => void;
  currentTheme: ThemeSpecs;
  isMobile: boolean;
}

const FinishGoogleSignIn: React.FC<FinishGoogleSignInProps> = ({ setIsAuthenticated, currentTheme, isMobile }) => {
  const [username, setUsername] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);


  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTimeZone) {
      setMessage('Please select a timezone.');
      return;
    }

    setLoading(true);
    setMessage(''); // Clear any previous messages

    // Add a small delay to ensure the loader renders
    await new Promise(resolve => setTimeout(resolve, 100));

    const formData = new FormData();
    formData.append('username', username);
    formData.append('phone_number', phoneNumber);

    if (selectedTimeZone === "Europe/Tbilisi") {
      formData.append('timezone', 'Asia/Tbilisi');
    } else {
      formData.append('timezone', selectedTimeZone);
    }

    try {
      await axiosInstance.patch('/acc/profile-finish/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
      });

      setMessage('Registration successful!');
      setIsSuccessful(true);
      setTimeout(() => {
        setIsAuthenticated(true);
        navigate('/mainpage');
      }, 2000);
    } catch (error) {
      setMessage('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("selectedTimeZone:===>", selectedTimeZone);
  }, [selectedTimeZone]);


  // ============================================== timezone select options ================================
  const timezoneOptions = timezone_data.map((entry) => ({
    label: `${entry.country_name} (Timezone: ${entry.timezone}, ${entry.utc_offset})`,
    value: entry.timezone,
  }));


  return (
    <>
      <Helmet>
        <title>Finish Profile | DailyDoer</title>
        <meta name="description" content="Complete your profile to start using DailyDoer." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://dailydoer.space/finish-profile" />
      </Helmet>
      
      <div
        className="main_finish_profile_container"
      >
        <div className="finish_profile_container">

          <h1 style={{ color: currentTheme['--main-text-coloure'] }}>Finish Profile</h1>

          <form onSubmit={handleSubmit}
            style={{
              background: currentTheme['--list-background-color'],
              border: `1px solid ${currentTheme['--border-color']}`,
              color: currentTheme['--main-text-coloure'],
              borderRadius: '10px',

            }}
            className="finish_profile_form"
          >
            <div className="register_form_group" >
              <FaUser className='register_icons' style={{ color: currentTheme['--main-text-coloure'] }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Username"
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
                placeholder="Phone number"
              />
            </div>

            <div className="register_form_group">
              <IoEarth className='register_icons' style={{ color: currentTheme['--main-text-coloure'] }} />
              <Select
                showSearch
                value={selectedTimeZone || undefined} // <-- change here
                onChange={(value) => {
                  setSelectedTimeZone(value);
                }}
                options={timezoneOptions}
                placeholder="Select country for timezone"
                style={{
                  width: isMobile ? '290px' : '320px',
                  height: '40px',
                  background: currentTheme['--task-background-color'],
                  color: currentTheme['--main-text-coloure'],
                  border: `1px solid ${currentTheme['--border-color']}`,
                }}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                <PulseLoader color={currentTheme['--main-text-coloure']} size={8} />
              </div>
            ) : (
              !isSuccessful && (
                <button
                  type="submit"
                  disabled={loading}
                  className="finish_btn"
                  style={{
                    color: currentTheme['--main-text-coloure'],
                    background: currentTheme['--task-background-color'],
                    border: `1px solid ${currentTheme['--border-color']}`,
                  }}
                >
                  Finish
                </button>
              )
            )}
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
    </>

  );
};

export default FinishGoogleSignIn;