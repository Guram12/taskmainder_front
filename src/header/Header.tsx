import React from 'react';
import "./Header.css";
import { ProfileData } from '../App';
import LogoComponent from '../components/LogoComponent';



interface HeaderProps {
  profileData: ProfileData;
  isAuthenticated: boolean;
}

export interface ThemeSpecs {
  '--background-color': string;
  '--main-text-coloure': string;
  '--border-color': string;
}


const Header: React.FC<HeaderProps> = ({ profileData , isAuthenticated}) => {




  const changeTheme = (themeSpecs: ThemeSpecs) => {
    for (const [key, value] of Object.entries(themeSpecs)) {
      document.documentElement.style.setProperty(key, value)
    }
    localStorage.setItem('theme', JSON.stringify(themeSpecs));
    document.body.style.backgroundColor = themeSpecs['--background-color'];

  }



  return (
    <div className={`main_Header_container ${!isAuthenticated ? "hide_container"  : ''  } `}>
      <div className='header_logo_container' >
        <LogoComponent />
      </div>

      <div className='header_coloure_container'  >
        <div className='header_coloure_child_container example1'
          onClick={() =>
            changeTheme(
              {
                '--background-color': '#000000',
                '--main-text-coloure': '#037F45',
                '--border-color': '#000000'
              })}></div>
        <div className='header_coloure_child_container example2'
          onClick={() =>
            changeTheme({
              '--background-color': '#19647E',
              '--main-text-coloure': '#FFFFFF',
              '--border-color': '#000000'
            })}></div>
        <div className='header_coloure_child_container example3'
          onClick={() =>
            changeTheme({
              '--background-color': '#28AFB0',
              '--main-text-coloure': '#FFFFFF',
              '--border-color': '#000000'
            })}></div>
        <div className='header_coloure_child_container example4'
          onClick={() =>
            changeTheme({
              '--background-color': '#F4D35E',
              '--main-text-coloure': '#000000',
              '--border-color': '#000000'
            })}></div>
        <div className='header_coloure_child_container example5'
          onClick={() =>
            changeTheme({
              '--background-color': '#708B75',
              '--main-text-coloure': '#FFFFFF',
              '--border-color': '#000000'
            })}></div>
        <div className='header_coloure_child_container example6'
          onClick={() =>
            changeTheme({
              '--background-color': '#005f54',
              '--main-text-coloure': '#FFFFFF',
              '--border-color': '#000000'
            })}></div>
      </div>

      <div>
        <div className='header_profile_container' >
          <h3 className="header_profile_username">{profileData.username}</h3>
          <img src={profileData.profile_picture} alt="profile" className="header_profile_picture" />
        </div>
      </div>

    </div>
  )
}

export default Header;








// 1F271B for example 1
// 19647E for example 2
// 28AFB0 for example 3
// F4D35E for example 4
// 708B75 for example 5
// 005f54 for example 6































