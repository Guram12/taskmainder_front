import React from 'react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import axiosInstance from '../utils/axiosinstance';




const GoogleSignIn: React.FC = () => {


const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
  try {
    const response = await axiosInstance.post(`/dj-rest-auth/google/`, {
      id_token: credentialResponse.credential,  // Send credential as id_token
    });
    if (response.data.access && response.data.refresh) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

    }
  } catch (error: any) {
    console.error('Error during Google login:', error.response);

  }
};


const handleGoogleLoginFailure = () => {
  console.error('Google login error');
};

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <GoogleLogin
      onSuccess={handleGoogleLoginSuccess}
      onError={handleGoogleLoginFailure}
      theme="filled_black"  // Options: 'outline' or 'filled'
      size="large"     // Options: 'small', 'medium', 'large'
      text="signup_with"    // Options: 'signin_with', 'signup_with', 'continue_with', 'signin'
      width="50px"  // Options: '50px', '300px', '100%'

    />
  </GoogleOAuthProvider>
  );
};

export default GoogleSignIn;
