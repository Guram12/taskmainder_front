import "../styles/Settings.css";
import React from "react";
import { board } from "../utils/interface";
import { ProfileData } from "../utils/interface";
import { ThemeSpecs } from "../utils/theme";
import ProfilePictureUpdate from "./settings/ProfilePictureUpdate";

interface SettingsProps {
  boards: board[];
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
    </div>
  );
};

export default Settings;





























