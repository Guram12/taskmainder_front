import "../styles/GoogleSignUp.css";
import React from 'react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import axiosInstance from '../utils/axiosinstance';
import { useNavigate } from 'react-router-dom';
import { ProfileData } from "../utils/interface";

interface GoogleSignInProps {
  setIsAuthenticated: (value: boolean) => void;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const google_client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleGoogleLoginSuccess = async (response: CredentialResponse) => {
    try {
      const res = await axiosInstance.post('/acc/social/login/token/', {
        id_token: response.credential,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (res.data.access && res.data.refresh) {
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        // navigate('/finish_profile');
        const profile_info = await axiosInstance.get(`/acc/profile/`, {
          headers: {
            Authorization: `Bearer ${res.data.access}`
          }
        });
        const profileData: ProfileData = profile_info.data;
        if (profileData.phone_number === null) {
          navigate('/finish-profile');
        } else {
          setIsAuthenticated(true);
          navigate('/mainpage');
        }
        const first_sign_up = localStorage.getItem('first_time_signup')
        if (!first_sign_up) {
          localStorage.setItem('first_time_signup', 'true');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }


  const handleGoogleLoginFailure = () => {
    console.error('Google login error');
  }

  // Log the redirect URI
  // console.log("Redirect URI:", `${window.location.origin}/finish_profile`);

  return (
    <GoogleOAuthProvider
      clientId={google_client_id}
      onScriptLoadError={() => console.log('Google Script Load Error')}
      onScriptLoadSuccess={() => console.log('Google Script Loaded Successfully')}
    >
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={handleGoogleLoginFailure}
        ux_mode="popup"
        useOneTap={true}
        theme="filled_black"  // Options: 'outline' or 'filled'
        size="large"     // Options: 'small', 'medium', 'large'
        text="signup_with"    // Options: 'signin_with', 'signup_with', 'continue_with', 'signin'
        width="300px"  // Options: '50px', '300px', '100%'
        locale="en"  // Options: 'en', 'es', 'fr', 'de', 'pt', 'it', 'ja', 'ko', 'zh-CN', 'zh-TW'

      />
    </GoogleOAuthProvider>
  );
};

export default GoogleSignIn;