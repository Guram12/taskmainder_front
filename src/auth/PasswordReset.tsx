import React, { useState } from 'react';
import axiosInstance from '../utils/axiosinstance';
import axios from 'axios';

const PasswordReset: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
        setMessage('Password reset link sent to your email address.');
      } else {
        setError('Failed to send password reset link. Please try again.');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(  'Error:', err);
        // Handle error response
        if (err.response) {
          // Display error message from server if available
          setError(err.response.data?.error || 'Failed to send password reset link. Please try again.');
        } else {
          setError('Network error. Please check your connection.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Password Reset</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Send Reset Link
        </button>
      </form>
      {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};

export default PasswordReset;