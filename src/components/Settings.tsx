import "../styles/Settings.css";
import React, { useEffect, useState } from "react";
import { board } from "./Boards";
import { ProfileData } from "../App";
import axiosInstance from "../utils/axiosinstance";

interface SettingsProps {
  boards: board[];
  profileData: ProfileData;
  FetchProfileData: () => Promise<void>;
}

const Settings: React.FC<SettingsProps> = ({ profileData, FetchProfileData }) => {
  const [currentProfileImage, setCurrentProfileImage] = useState<string>(profileData.profile_picture);
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Synchronize currentProfileImage with profileData.profile_picture
  useEffect(() => {
    setCurrentProfileImage(profileData.profile_picture);
  }, [profileData.profile_picture]);

  // Handle file input change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfileImage(e.target.files[0]);
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
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload the image. Please try again.");
    } finally {
      setIsUploading(false);

    }
  };

  return (
    <div>
      <div className="profil_image_cont">
        <img
          src={currentProfileImage}
          alt="Profile"
          className="profile_image"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="image_input"
          
        />
        <button
          onClick={change_profile_image}
          className="upload_button"
          disabled={newProfileImage === null}
          style={{
            cursor: !newProfileImage ? "not-allowed" : "pointer",
          }}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
};

export default Settings;