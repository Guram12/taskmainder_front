import '../../styles/settings/ProfilePictureUpdate.css'
import React, { useEffect, useState, useRef } from "react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import { ProfileData } from '../../utils/interface';
import axiosInstance from '../../utils/axiosinstance';
import { ThemeSpecs } from '../../utils/theme';
import Avatar from '@mui/material/Avatar'; // Import Avatar from Material-UI
import getAvatarStyles from '../../utils/SetRandomColor';
import { MdDeleteForever } from "react-icons/md";
import ConfirmationDialog from '../Boards/ConfirmationDialog';
import avatar_1 from "../../assets/avatar-1.png";
import avatar_2 from "../../assets/avatar-2.png";
import avatar_3 from "../../assets/avatar-3.png";
import avatar_4 from "../../assets/avatar-4.png";
import avatar_5 from "../../assets/avatar-5.jpg";
import avatar_6 from "../../assets/avatar-6.jpg";



interface ProfilePictureUpdateProps {
  profileData: ProfileData;
  FetchProfileData: () => Promise<void>;
  currentTheme: ThemeSpecs;
}


const ProfilePictureUpdate: React.FC<ProfilePictureUpdateProps> = ({ profileData, FetchProfileData, currentTheme }) => {

  const [currentProfileImage, setCurrentProfileImage] = useState<string | null>(profileData.profile_picture || null);
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // State for preview
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null); // State for file name
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [IsDeletingWindow, setIsDeletingWindow] = useState<boolean>(false);


  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {

    console.log("Profile data update from child ===>>>> :", profileData);
  }, [profileData]);

  //========================== Synchronize currentProfileImage with profileData.profile_picture   ============================
  useEffect(() => {
    setCurrentProfileImage(profileData.profile_picture || null);
  }, [profileData.profile_picture]);

  //============================================= Handle file input change   ============================================
  const handleImageChange = async (e?: React.ChangeEvent<HTMLInputElement>, avatarUrl?: string, avatarName?: string) => {
    if (avatarUrl && avatarName) {
      // Handle avatar selection
      try {
        const response = await fetch(avatarUrl); // Fetch the avatar image
        const blob = await response.blob(); // Convert the response to a Blob

        // Extract the file extension from the avatar URL
        const extension = avatarUrl.split('.').pop() || 'png'; // Default to 'png' if no extension is found
        const fileName = `${avatarName}.${extension}`; // Append the extension to the file name

        const file = new File([blob], fileName, { type: blob.type }); // Create a File object with the correct extension

        setPreviewImage(avatarUrl); // Set the preview image to the avatar URL
        setSelectedFileName(fileName); // Set the file name
        setNewProfileImage(file); // Treat the avatar as a file
      } catch (error) {
        console.error("Error fetching avatar image:", error);
      }
    } else if (e?.target.files && e.target.files[0]) {

      const file = e.target.files[0];
      setPreviewImage(URL.createObjectURL(file));
      setSelectedFileName(file.name);
      setNewProfileImage(file);
    }
  };
  // ==================================================   upload image   ==========================================================

  const change_profile_image = async () => {
    if (!newProfileImage && !previewImage) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();

    if (newProfileImage) {
      formData.append("profile_picture", newProfileImage);
    } else if (previewImage) {
      // If previewImage is set (e.g., for avatar images), send the URL or handle it accordingly
      formData.append("profile_picture_url", previewImage); // Assuming your backend can handle this
    }

    setIsUploading(true);

    try {
      const response = await axiosInstance.patch("/acc/update-profile-picture/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      console.log("Image uploaded successfully:", response.data);

      await FetchProfileData();
      setCurrentProfileImage(previewImage || (newProfileImage ? URL.createObjectURL(newProfileImage) : null));

      setNewProfileImage(null);
      setPreviewImage(null);
      setSelectedFileName(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload the image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };



  // ============================================= delete profile picture ==========================================


  const deleteProfilePicture = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axiosInstance.patch(
        '/acc/update-profile-picture/', // Replace with your actual endpoint
        { delete_picture: true },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the JWT token for authentication
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Profile picture deleted successfully:', response.data);
      await FetchProfileData();
      setCurrentProfileImage(null);
      setIsDeletingWindow(false);
      return response.data;
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      throw error;
    }
  };

  const handleCancelDelete = () => {
    setIsDeletingWindow(false);
  }

  const handleDeleteClick = () => {
    if (profileData?.profile_picture) {
      setIsDeletingWindow(true);
    }
  }

  // ==========================================   example avatar images  ==========================================





  return (
    <div className="profil_image_cont" style={{ borderColor: currentTheme["--border-color"] }}>

      <MdDeleteForever className='delete_Prof_picture_icon' onClick={handleDeleteClick} />
      {IsDeletingWindow && (
        <ConfirmationDialog
          message="Are you sure you want to delete your profile picture?"
          onConfirm={deleteProfilePicture}
          onCancel={handleCancelDelete}
        />
      )}
      <div className="profile_picture_update_p_cont" style={{ backgroundColor: currentTheme["--background-color"] }}>
        <p className="profile_picture_ipdate_p" style={{ color: currentTheme["--main-text-coloure"] }}>
          Profile Picture update
        </p>
      </div>

      <div className="second_main_container" >
        {profileData?.profile_picture !== null ? (
          <img src={currentProfileImage || undefined} alt="Profile" className="profile_image" onClick={() => fileInputRef.current?.click()} />
        ) : (
          <Avatar
            sx={{
              width: 150, // Set the desired width
              height: 150, // Set the desired height
              fontSize: "2rem", // Optional: Adjust font size for the initials
              marginLeft: "40px",
            }}
            style={{
              backgroundColor: getAvatarStyles(profileData.username.charAt(0)).backgroundColor,
              color: getAvatarStyles(profileData.username.charAt(0)).color
            }}
          >
            {profileData.username.charAt(0).toUpperCase()}
          </Avatar>
        )}

        {previewImage && (<MdKeyboardDoubleArrowRight className="profile_update_arrow_icon" />)}


        {previewImage && (
          <div className="preview_container">
            <MdOutlineCancel className="close_preview" onClick={() => { setPreviewImage(null); setSelectedFileName(null); }} />
            <img src={previewImage} alt="Preview" className="preview_image" />

            <div className="file_name_icon_cont" style={{ color: currentTheme["--main-text-coloure"] }}>
              <MdDriveFileRenameOutline className="file_name_icon" />
              <p className="file_name_p" >{selectedFileName}</p>
            </div>

          </div>
        )}

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="image_input"
          ref={fileInputRef}
          style={{ display: "none" }}
        />

        <div className="profile_update_buttons_cont" >
          <button
            onClick={() => fileInputRef.current?.click()}
            className="custom_file_input_button"
            style={{
              color: currentTheme["--main-text-coloure"],
            }}
          >
            Change image
          </button>

          {previewImage && (
            <button
              onClick={change_profile_image}
              className="upload_button"
              disabled={previewImage === null}
              style={{
                cursor: previewImage ? "pointer" : "not-allowed",
                color: currentTheme["--main-text-coloure"],
              }}
            >
              {isUploading ? "Saving..." : "Save"}
            </button>
          )}
        </div>
      </div>

      <div className='avatar_main_container' style={{ color: currentTheme["--main-text-coloure"] }}>
        <h1 className='select_avatar_h1'>Select Avatar</h1>
        <div className='avatars_container'>
          <img
            src={avatar_1}
            alt="Avatar 1"
            className="avatar_image"
            onClick={() => handleImageChange(undefined, avatar_1, "Avatar 1")}
          />
          <img
            src={avatar_2}
            alt="Avatar 2"
            className="avatar_image"
            onClick={() => handleImageChange(undefined, avatar_2, "Avatar 2")}
          />
          <img
            src={avatar_3}
            alt="Avatar 3"
            className="avatar_image"
            onClick={() => handleImageChange(undefined, avatar_3, "Avatar 3")}
          />
          <img
            src={avatar_4}
            alt="Avatar 4"
            className="avatar_image"
            onClick={() => handleImageChange(undefined, avatar_4, "Avatar 4")}
          />
          <img
            src={avatar_5}
            alt="Avatar 5"
            className="avatar_image"
            onClick={() => handleImageChange(undefined, avatar_5, "Avatar 5")}
          />
          <img
            src={avatar_6}
            alt="Avatar 6"
            className="avatar_image"
            onClick={() => handleImageChange(undefined, avatar_6, "Avatar 6")}
          />
        </div>
      </div>
    </div>
  )
}




export default ProfilePictureUpdate;