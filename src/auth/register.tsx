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
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [countryInput, setCountryInput] = useState<string>('');
  const [filteredCountries, setFilteredCountries] = useState<FilteredCountry[]>([]);

  const [selectedTimeZone, setSelectedTimeZone] = useState<string>('');

  const navigate = useNavigate();


  // ===================================== register =====================================
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('phone_number', phoneNumber);
    formData.append('timezone', selectedTimeZone);

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

  // ==================================== search country by name =====================================

  const handleCountryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCountryInput(value);
    if (value) {
      const filtered: FilteredCountry[] = [];
      timezone_data.forEach(entry => {
        if (entry.country_name.toLowerCase().includes(value.toLowerCase())) {
          filtered.push({ name: entry.country_name, timezone: entry.timezone, utc_offset: entry.utc_offset });
        }
      });
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries([]);
    }
  };
  const handleTimeZoneClick = (country: FilteredCountry) => {
    setSelectedTimeZone(country.timezone);
    setCountryInput(country.timezone);
    setFilteredCountries([]);
  };

  useEffect(() => {
    console.log("selectedTimeZone:===>", selectedTimeZone);
  }, [selectedTimeZone]);

  // ============================================== hilight countri latters that match ================================

  const getHighlightedText = (text: string, highlight: string) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? <span key={index} className="highlight">{part}</span> : part
    );
  }

  const openEmailProvider = () => {
    const emailDomain = email.split('@')[1];
    const emailProviderUrl = `https://${emailDomain}`;
    window.open(emailProviderUrl, '_blank');
  };


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
              style={{
                background: currentTheme['--task-background-color'],
                color: currentTheme['--main-text-coloure'],
                border: `1px solid ${currentTheme['--border-color']}`,
              }}
            />
          </div>

          <div className="register_form_group" >
            <FaUser className='register_icons' style={{ color: currentTheme['--main-text-coloure'] }} />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="register_input"
              style={{
                background: currentTheme['--task-background-color'],
                color: currentTheme['--main-text-coloure'],
                border: `1px solid ${currentTheme['--border-color']}`,
              }}
            />
          </div>

          <div className="register_form_group" >
            <PiPasswordBold className='register_icons' style={{ color: currentTheme['--main-text-coloure'] }} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="register_input"
              style={{
                background: currentTheme['--task-background-color'],
                color: currentTheme['--main-text-coloure'],
                border: `1px solid ${currentTheme['--border-color']}`,
              }}
            />
          </div>

          <div className="register_form_group"  >
            <FaPhone className='register_icons' style={{ color: currentTheme['--main-text-coloure'] }} />
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="register_input"
              style={{
                background: currentTheme['--task-background-color'],
                color: currentTheme['--main-text-coloure'],
                border: `1px solid ${currentTheme['--border-color']}`,
              }}
            />
          </div>

          <div className="country_select_inputs_container">
            <label className="register_label" style={{ color: currentTheme['--main-text-coloure'] }}>Country:</label>
            <input
              type="text"
              value={countryInput}
              onChange={handleCountryInputChange}
              className="register_input"
              style={{
                background: currentTheme['--task-background-color'],
                color: currentTheme['--main-text-coloure'],
                border: `1px solid ${currentTheme['--border-color']}`,
              }}
            />
            {filteredCountries.length > 0 && (
              <div
                className="country_list"
                style={{
                  background: currentTheme['--list-background-color'],
                  color: currentTheme['--main-text-coloure'],
                  border: `1px solid ${currentTheme['--border-color']}`,
                }}
              >
                {filteredCountries.map((country, index) => (
                  <p
                    className="country"
                    key={index}
                    onClick={() => handleTimeZoneClick(country)}
                    style={{
                      color: currentTheme['--main-text-coloure'],
                      background: currentTheme['--task-background-color'],
                      border: `1px solid ${currentTheme['--border-color']}`,
                    }}
                  >
                    {getHighlightedText(country.name, countryInput)} (Timezone: {country.timezone}, {country.utc_offset})
                  </p>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="register_button"
            style={{
              background: currentTheme['--due-date-color'],
              color: currentTheme['--main-text-coloure'],
              border: `1px solid ${currentTheme['--border-color']}`,
            }}
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
          className="register_button"
          style={{
            background: currentTheme['--hover-color'],
            color: currentTheme['--main-text-coloure'],
            border: `1px solid ${currentTheme['--border-color']}`,
            marginTop: '10px',
          }}
        >
          Go to login
        </button>
      </div>
    </div>

  );
}

export default Register;