import '../../styles/settings/ProfilePictureUpdate.css'
import React, { useEffect, useState, useRef } from "react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import { ProfileData } from '../../utils/interface';
import axiosInstance from '../../utils/axiosinstance';
import { ThemeSpecs } from '../../utils/theme';


interface ProfilePictureUpdateProps {
  profileData: ProfileData;
  FetchProfileData: () => Promise<void>;
  currentTheme: ThemeSpecs;
}


const ProfilePictureUpdate: React.FC<ProfilePictureUpdateProps> = ({ profileData, FetchProfileData, currentTheme }) => {

  const [currentProfileImage, setCurrentProfileImage] = useState<string>(profileData.profile_picture);
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // State for preview
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null); // State for file name
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

useEffect(() => {
  console.log('from profile picture update profiledata updated :', profileData);
}, [profileData]);


  //======================= Synchronize currentProfileImage with profileData.profile_picture   ========================
  useEffect(() => {
    setCurrentProfileImage(profileData.profile_picture);
  }, [profileData.profile_picture]);

  //======================= Handle file input change   ========================
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewImage(URL.createObjectURL(file)); // Set preview image
      setNewProfileImage(file);
      setSelectedFileName(file.name);
    }
  };

  const change_profile_image = async () => {
    if (!newProfileImage) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("profile_picture", newProfileImage);

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
      // Update the current profile image with the new one
      setCurrentProfileImage(URL.createObjectURL(newProfileImage));

      setNewProfileImage(null);
      setPreviewImage(null);
      setSelectedFileName(null);

      // Reset the file input value
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

  return (
    <div className="profil_image_cont" style={{ borderColor: currentTheme["--border-color"] }}>
      <div className="profile_picture_update_p_cont" style={{ backgroundColor: currentTheme["--background-color"] }}>
        <p className="profile_picture_ipdate_p" style={{ color: currentTheme["--main-text-coloure"] }}>
          Profile Picture update
        </p>
      </div>

      <img src={currentProfileImage} alt="Profile" className="profile_image" onClick={() => fileInputRef.current?.click()} />

      {previewImage && (
        <MdKeyboardDoubleArrowRight className="profile_update_arrow_icon"
        />
      )}

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
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        )}
      </div>

    </div>
  )
}




export default ProfilePictureUpdate;