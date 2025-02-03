
import React from "react"
import { useState } from "react";
import timezone_data from "../utils/data.json";
import { FilteredCountry } from "./register";
import axiosInstance from "../utils/axiosinstance";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";



interface FinishGoogleSignInProps {
  setIsAuthenticated: (value: boolean) => void;
}


const FinishGoogleSignIn: React.FC<FinishGoogleSignInProps> = ({setIsAuthenticated}) => {
  const [username, setUsername] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [countryInput, setCountryInput] = useState<string>('');
  const [filteredCountries, setFilteredCountries] = useState<FilteredCountry[]>([]);
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>

        <div>
          <label>Phone Number:</label>
          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </div>

        <div className="country_select_inputs_container" >
          <label>Country:</label>
          <input type="text" value={countryInput} onChange={handleCountryInputChange} />
          {filteredCountries.length > 0 && (
            <div className='country_list'>
              {filteredCountries.map((country, index) => (
                <p
                  className='country'
                  key={index}
                  onClick={() => handleTimeZoneClick(country)}
                >{country.name} (Timezone: {country.timezone} , {country.utc_offset})</p>
              ))}
            </div>
          )}
        </div>
        <button type="submit">Finish</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}






export default FinishGoogleSignIn;








