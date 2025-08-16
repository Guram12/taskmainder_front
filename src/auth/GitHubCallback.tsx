import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosinstance';
import { ProfileData } from '../utils/interface';
import { ThemeSpecs } from '../utils/theme';
import GridLoader from "react-spinners/GridLoader";

interface GitHubCallbackProps {
  setIsAuthenticated: (value: boolean) => void;
  currentTheme: ThemeSpecs;
}

const GitHubCallback: React.FC<GitHubCallbackProps> = ({ setIsAuthenticated, currentTheme }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const storedState = localStorage.getItem('github_oauth_state');

      // Verify state parameter
      if (!state || state !== storedState) {
        console.error('Invalid state parameter');
        navigate('/login');
        return;
      }

      // Clear all stored GitHub OAuth data
      localStorage.removeItem('github_oauth_state');
      localStorage.removeItem('github_redirect_uri');
      localStorage.removeItem('github_scope');

      if (!code) {
        console.error('No authorization code received');
        navigate('/login');
        return;
      }

      try {
        const res = await axiosInstance.post('/acc/social/github/login/', {
          code: code,
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (res.data.access && res.data.refresh) {
          localStorage.setItem('access_token', res.data.access);
          localStorage.setItem('refresh_token', res.data.refresh);
          
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
          
          const first_sign_up = localStorage.getItem('first_time_signup');
          if (!first_sign_up) {
            localStorage.setItem('first_time_signup', 'true');
          }
        }
      } catch (error) {
        console.error('GitHub login error:', error);
        // navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate, setIsAuthenticated]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: currentTheme['--background-color'],
      gap: '20px'
    }}>
      <div style={{
        padding: '20px',
        borderRadius: '12px',
        backgroundColor: currentTheme['--list-background-color'],
        border: `1px solid ${currentTheme['--border-color']}`
      }}>
        <svg 
          width="60" 
          height="60" 
          viewBox="0 0 24 24" 
          fill={currentTheme['--main-text-coloure']}
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.30 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </div>
      
      <h2 style={{
        color: currentTheme['--main-text-coloure'],
        margin: 0,
        fontSize: '24px',
        fontWeight: '500'
      }}>
        Processing GitHub Authentication...
      </h2>
      
      <GridLoader color={currentTheme['--hover-color']} size={20} />
    </div>
  );
};

export default GitHubCallback;