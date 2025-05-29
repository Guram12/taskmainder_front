import '../../styles/settings/CustomTheme.css';
import React, { useState, useRef } from 'react';
import { ThemeSpecs } from '../../utils/theme';
import { ProfileData } from '../../utils/interface';
import { FaRegImages } from "react-icons/fa";
import axiosInstance from '../../utils/axiosinstance';

interface CustomThemeProps {
  currentTheme: ThemeSpecs;
  profileData: ProfileData;
}

const CustomTheme: React.FC<CustomThemeProps> = ({ currentTheme, profileData }) => {
  const [current_backgrownd_image, setCurrent_backgrownd_image] = useState<string>(profileData.background_image || '');
  const [updatedBackgrowndImage, setUpdatedBackgrowndImage] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUpdatedBackgrowndImage(file);
      const fileURL = URL.createObjectURL(file); // Create a preview URL for the image
      setCurrent_backgrownd_image(fileURL); // Update the preview image
    }

  };


  const handleSaveImage = async () => {
    try {
      const formData = new FormData();
      if (updatedBackgrowndImage) {
        formData.append('background_image', updatedBackgrowndImage);
      }
  
      const response = await axiosInstance.patch('/acc/update-background-image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Background image saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving background image:", error);
    }
  };
  return (
    <div className="custom_theme_container">
      <div className="customtheme_container" style={{ backgroundColor: currentTheme["--background-color"] }}>
        <p className="customtheme_p" style={{ color: currentTheme["--main-text-coloure"] }}> Create Custom Theme </p>
      </div>

      <div className='backgrownd_image_main_cont' >

        <div className="backgrownd_img_cont">
          <div className='no_backgr_img_container'>
            {current_backgrownd_image ? (
              <img src={current_backgrownd_image} alt="Preview" className="preview_img" />
            ) : (
              <FaRegImages style={{ color: currentTheme['--main-text-coloure'] }} className='no_backgr_img_icon' />
            )}
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="change_backg_img_btn"
            style={{
              color: currentTheme["--main-text-coloure"],
            }}
          >
            {current_backgrownd_image ? 'Change Background Image' : 'Set Background Image'}
          </button>

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </div>

        <button className='save_backgr_image_btn' onClick={handleSaveImage}>Save</button>

      </div>
    </div>
  );
};

export default CustomTheme;