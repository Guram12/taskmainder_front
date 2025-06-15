import React from 'react';
import '../styles/ErrorPage..css';
import { ThemeSpecs } from '../utils/theme';
import error_image from '../assets/error3.png';
import { FaFaceSadTear } from "react-icons/fa6";



interface ErrorPageProps {
  currentTheme: ThemeSpecs;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ currentTheme }) => {
  return (
    <div className="error-page-container" style={{
      color: currentTheme['--main-text-coloure'],
    }}>
      <img src={error_image} alt="error image" className='error_image' />
      <div className='error-message-container'>

        <h1 className="error-description">Link time has expired.</h1>
        <FaFaceSadTear className='error_icon' />
      </div>

      <button
        className="error-close-button"
        onClick={() => {
          window.close();
        }}
        style={{ backgroundColor: currentTheme['--task-background-color'] }}
      >
        Close Window
      </button>
      <p className="error-footer">© 2023 TaskMinder. All rights reserved.</p>
    </div>
  );
};



export default ErrorPage;




