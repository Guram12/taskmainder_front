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
import { useTranslation } from 'react-i18next';


interface SettingsProps {
  profileData: ProfileData;
  FetchProfileData: () => Promise<void>;
  currentTheme: ThemeSpecs;
  setCurrentTheme: (theme: ThemeSpecs) => void;
  setIsCustomThemeSelected: (isCustomThemeSelected: boolean) => void;
  setSaved_custom_theme: (theme: ThemeSpecs) => void;
  boards: board[];
  setBoards: (boards: board[]) => void;
  current_user_email: string;
  isMobile: boolean;

}

const Settings: React.FC<SettingsProps> = ({
  profileData,
  FetchProfileData,
  currentTheme,
  setCurrentTheme,
  setIsCustomThemeSelected,
  setSaved_custom_theme,
  boards,
  setBoards,
  current_user_email,
  isMobile,
}) => {
  // ================================================================================================================================
  const [isImageDeleting, setIsImageDeleting] = useState<boolean>(false);
  const [deleting_image_boardId, setDeleting_image_boardId] = useState<number>(0);
  const [new_image_for_board, setNew_image_for_board] = useState<{ boardId: number, NewImage: File }>({
    boardId: 0,
    NewImage: new File([], "")
  });
  const [loading_image, setLoading_image] = useState<{ boardId: number, isLoading: boolean }>({
    boardId: 0,
    isLoading: false
  });

  const { t } = useTranslation();


  // =================================================== delete board backgrownd image  ============================================
  const handleDeleteImage = async (boardId: number) => {
    try {
      const response = await axiosInstance.delete(`/api/boards/${boardId}/delete-background-image/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });

      if (response.status === 200) {
        console.log('Image deleted successfully');

        // Update the boards state immutably
        const updatedBoards = boards.map(board => {
          if (board.id === boardId) {
            return {
              ...board,
              background_image: null,
            };
          }
          return board;
        });

        setBoards([...updatedBoards]);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    } finally {
      setNew_image_for_board({
        boardId: 0,
        NewImage: new File([], ""),
      });
      setLoading_image({ boardId: 0, isLoading: false });
      setIsImageDeleting(false);
    }
  };

  // =================================================== handle image delete  =====================================================

  const handle_image_delete = (boardId: number) => {
    setLoading_image({
      boardId: boardId,
      isLoading: true
    });
    setIsImageDeleting(false);
    handleDeleteImage(boardId);
  }


  // ================================================================================================================================

  return (
    <div className="main_settings_container">
      {/* confirmation dialog  */}
      {isImageDeleting && (
        <ConfirmationDialog
          message={t("are_you_sure_you_want_to_delete_this_background_image")}
          onConfirm={() => handle_image_delete(deleting_image_boardId)}
          onCancel={() => {
            setIsImageDeleting(false);
            setNew_image_for_board({ boardId: 0, NewImage: new File([], "") });
          }}
          currentTheme={currentTheme}
        />
      )}

      <ProfilePictureUpdate
        profileData={profileData}
        FetchProfileData={FetchProfileData}
        currentTheme={currentTheme}
        isMobile={isMobile}
      />
      <Profile_Info_update
        profileData={profileData}
        FetchProfileData={FetchProfileData}
        currentTheme={currentTheme}
        isMobile={isMobile}
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
        setDeleting_image_boardId={setDeleting_image_boardId}
        current_user_email={current_user_email}

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
// report bug or feedback  ???    
// Theme Customization            +   
// Notification                   +
// Account Deletion               +
// Language Preferences
// Keyboard Shortcuts  ???
// Logout from All Devices  ???
























