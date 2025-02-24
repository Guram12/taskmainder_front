import React, { useState, useEffect } from "react";
import timezone_data from "../utils/data.json";
import { FilteredCountry } from "./register";
import axiosInstance from "../utils/axiosinstance";
import { useNavigate } from "react-router-dom";

interface FinishGoogleSignInProps {
  setIsAuthenticated: (value: boolean) => void;
}

const FinishGoogleSignIn: React.FC<FinishGoogleSignInProps> = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [countryInput, setCountryInput] = useState<string>('');
  const [filteredCountries, setFilteredCountries] = useState<FilteredCountry[]>([]);
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTimeZone) {
      setMessage('Please select a timezone.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('username', username);
    formData.append('phone_number', phoneNumber);
    formData.append('timezone', selectedTimeZone);

    try {
      await axiosInstance.patch('/acc/profile-finish/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
      });

      setMessage('Registration successful!');
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

  return (
    <div>
      <h1>Set Timezone</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            id="phoneNumber"
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div className="country_select_inputs_container">
          <label htmlFor="countryInput">Country:</label>
          <input
            id="countryInput"
            type="text"
            value={countryInput}
            onChange={handleCountryInputChange}
            aria-autocomplete="list"
            aria-controls="country-list"
          />
          {filteredCountries.length > 0 && (
            <div id="country-list" className='country_list'>
              {filteredCountries.map((country, index) => (
                <p
                  className='country'
                  key={index}
                  onClick={() => handleTimeZoneClick(country)}
                  role="option"
                >
                  {country.name} (Timezone: {country.timezone}, {country.utc_offset})
                </p>
              ))}
            </div>
          )}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Finish'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FinishGoogleSignIn;