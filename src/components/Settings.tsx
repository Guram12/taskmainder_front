import "../styles/Settings.css";
import React from "react";
import { ProfileData } from "../utils/interface";
import { ThemeSpecs } from "../utils/theme";
import ProfilePictureUpdate from "./settings/ProfilePictureUpdate";
import Profile_Info_update from "./settings/Profile_Info_update";
import DeleteAccount from "./settings/DeleteAccount";
import ChangePassword from "./settings/ChangePassword";
import CustomTheme from "./settings/CustomTheme";




interface SettingsProps {
  profileData: ProfileData;
  FetchProfileData: () => Promise<void>;
  currentTheme: ThemeSpecs;
  setCurrentTheme: (theme: ThemeSpecs) => void;
  setIsCustomThemeSelected: (isCustomThemeSelected: boolean) => void;
  setSaved_custom_theme: (theme: ThemeSpecs) => void;
}

const Settings: React.FC<SettingsProps> = ({
  profileData,
  FetchProfileData,
  currentTheme,
  setCurrentTheme,
  setIsCustomThemeSelected,
  setSaved_custom_theme
}) => {




  return (
    <div className="main_settings_container">
      {/* <ProfilePictureUpdate
        profileData={profileData}
        FetchProfileData={FetchProfileData}
        currentTheme={currentTheme}
      />
      <Profile_Info_update
        profileData={profileData}
        FetchProfileData={FetchProfileData}
        currentTheme={currentTheme}
      />
      <ChangePassword
        profileData={profileData}
        FetchProfileData={FetchProfileData}
        currentTheme={currentTheme}
      /> */}
      <CustomTheme
        profileData={profileData}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        setIsCustomThemeSelected={setIsCustomThemeSelected}
        setSaved_custom_theme={setSaved_custom_theme}
      />
      {/* <DeleteAccount
        currentTheme={currentTheme}
      /> */}
    </div>
  );
};

export default Settings;


// new functionality for settings  ==>>>

// profile picture update         +
// Update Profile Information     +
// Custom Avatars                 +
// Change Password                +
// Theme Customization
// Notification Preferences 
// Account Deletion               +
// Language Preferences
// Export/Import Data  ???
// Keyboard Shortcuts  ???
// Logout from All Devices  ???
























