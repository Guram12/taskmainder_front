import "../styles/Settings.css";
import React from "react";
import { ProfileData } from "../utils/interface";
import { ThemeSpecs } from "../utils/theme";
import ProfilePictureUpdate from "./settings/ProfilePictureUpdate";
import Profile_Info_update from "./settings/Profile_Info_update";










interface SettingsProps {
  profileData: ProfileData;
  FetchProfileData: () => Promise<void>;
  currentTheme: ThemeSpecs;
}

const Settings: React.FC<SettingsProps> = ({ profileData, FetchProfileData, currentTheme }) => {




  return (
    <div className="main_settings_container">
      <ProfilePictureUpdate
        profileData={profileData}
        FetchProfileData={FetchProfileData}
        currentTheme={currentTheme}
      />
      <Profile_Info_update
        profileData={profileData}
        FetchProfileData={FetchProfileData}
        currentTheme={currentTheme}
      />
    </div>
  );
};

export default Settings;


// new functionality for settings  ==>>>

// profile picture update         +
// Update Profile Information     +
// Custom Avatars ???
// Change Password
// Theme Customization
// Notification Preferences
// Account Deletion
// Language Preferences
// Export/Import Data  ???
// Keyboard Shortcuts  ???
// Logout from All Devices  ???
























