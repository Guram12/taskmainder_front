import "../styles/Settings.css";
import React from "react";
import { ProfileData } from "../utils/interface";
import { ThemeSpecs } from "../utils/theme";
import ProfilePictureUpdate from "./settings/ProfilePictureUpdate";
import Profile_Info_update from "./settings/Profile_Info_update";
import DeleteAccount from "./settings/DeleteAccount";
import ChangePassword from "./settings/ChangePassword";
import CustomTheme from "./settings/CustomTheme";
import { board } from "../utils/interface";
import ConfirmationDialog from "./Boards/ConfirmationDialog";
import axiosInstance from "../utils/axiosinstance";
import { useState } from "react";



interface SettingsProps {
  profileData: ProfileData;
  FetchProfileData: () => Promise<void>;
  currentTheme: ThemeSpecs;
  setCurrentTheme: (theme: ThemeSpecs) => void;
  setIsCustomThemeSelected: (isCustomThemeSelected: boolean) => void;
  setSaved_custom_theme: (theme: ThemeSpecs) => void;
  boards: board[];
  setBoards: (boards: board[]) => void;
}

const Settings: React.FC<SettingsProps> = ({
  profileData,
  FetchProfileData,
  currentTheme,
  setCurrentTheme,
  setIsCustomThemeSelected,
  setSaved_custom_theme,
  boards,
  setBoards
}) => {



  const [isImageDeleting, setIsImageDeleting] = useState<boolean>(false);
  const [new_image_for_board, setNew_image_for_board] = useState<{ boardId: number, NewImage: File }>({
    boardId: 0,
    NewImage: new File([], "")
  });
  const [loading_image, setLoading_image] = useState<{ boardId: number, isLoading: boolean }>({
    boardId: 0,
    isLoading: false
  });


  const handleDeleteImage = async (boardId: number) => {

    try {
      const response = await axiosInstance.delete(`/api/boards/${boardId}/delete-background-image/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      if (response.status === 204) {
        console.log('Image deleted successfully');
        const updatedBoards = boards.map(board => {
          if (board.id === boardId) {
            return {
              ...board,
              background_image: null
            };
          }
          return board;
        });
        setBoards(updatedBoards);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    } finally {
      setNew_image_for_board({
        boardId: 0,
        NewImage: new File([], "")
      });
      setLoading_image({ boardId: 0, isLoading: false });
      setIsImageDeleting(false);
    }
  }


  return (
    <div className="main_settings_container">
      {/* confirmation dialog  */}
      {isImageDeleting && (
        <ConfirmationDialog
          message="Are you sure you want to delete this background image?"
          onConfirm={() => handleDeleteImage(new_image_for_board.boardId)}
          onCancel={() => {
            setIsImageDeleting(false);
            setNew_image_for_board({ boardId: 0, NewImage: new File([], "") });
          }}
        />
      )}

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
      <ChangePassword
        profileData={profileData}
        FetchProfileData={FetchProfileData}
        currentTheme={currentTheme}
      />
      <CustomTheme
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        setIsCustomThemeSelected={setIsCustomThemeSelected}
        setSaved_custom_theme={setSaved_custom_theme}
        boards={boards}
        setBoards={setBoards}
        setNew_image_for_board={setNew_image_for_board}
        new_image_for_board={new_image_for_board}
        setLoading_image={setLoading_image}
        loading_image={loading_image}
        setIsImageDeleting={setIsImageDeleting}
      />
      <DeleteAccount
        currentTheme={currentTheme}
      />
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
























