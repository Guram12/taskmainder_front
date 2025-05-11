import "../styles/Register.css";
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosinstance';
import { useNavigate } from 'react-router-dom';
import timezone_data from "../utils/data.json";



export interface FilteredCountry {
  name: string;
  timezone: string;
  utc_offset: string;
}

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
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
    if (profileImage) {
      formData.append('profile_picture', profileImage);
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
    <div className="register_container">
      <h2 className="register_header">Register</h2>
      <p>guramshanidze44@gmail.com</p>
      <form onSubmit={handleRegister} className="register_form">
        <div>
          <label className="register_label">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="register_input"
          />
        </div>
        <div>
          <label className="register_label">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="register_input"
          />
        </div>
        <div>
          <label className="register_label">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="register_input"
          />
        </div>
        <div>
          <label className="register_label">Phone Number:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="register_input"
          />
        </div>
        <div>
          <label className="register_label">Profile Image:</label>
          <input
            type="file"
            onChange={(e) => setProfileImage(e.target.files ? e.target.files[0] : null)}
            className="register_file_input"
          />
        </div>
        <div className="country_select_inputs_container">
          <label className="register_label">Country:</label>
          <input
            type="text"
            value={countryInput}
            onChange={handleCountryInputChange}
            className="register_input"
          />
          {filteredCountries.length > 0 && (
            <div className="country_list">
              {filteredCountries.map((country, index) => (
                <p
                  className="country"
                  key={index}
                  onClick={() => handleTimeZoneClick(country)}
                >
                  {getHighlightedText(country.name, countryInput)} (Timezone: {country.timezone}, {country.utc_offset})
                </p>
              ))}
            </div>
          )}
        </div>
        <button type="submit" className="register_button">Register</button>
      </form>
      {message && (
        <div>
          <p className={`register_message ${message.includes('failed') ? 'error' : ''}`}>{message}</p>
          {message.includes('successful') && (
            <button onClick={openEmailProvider} className="register_button">
              Go to Email for Verification
            </button>
          )}
        </div>
      )}
      <button onClick={handleLogin} className="register_button">Go to login</button>
      {message && <p className={`register_message ${message.includes('failed') ? 'error' : ''}`}>{message}</p>}
    </div>
  );
}

export default Register;