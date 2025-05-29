import '../../styles/settings/CustomTheme.css';
import React, { useState, useRef, useEffect } from 'react';
import { ThemeSpecs } from '../../utils/theme';
import { ProfileData } from '../../utils/interface';
import { FaRegImages } from "react-icons/fa";
import axiosInstance from '../../utils/axiosinstance';
import { ColorPicker, Space } from 'antd'; // Import Ant Design ColorPicker



interface CustomThemeProps {
  currentTheme: ThemeSpecs;
  profileData: ProfileData;
  setCurrentTheme: (theme: ThemeSpecs) => void;
  setIsCustomThemeSelected: (isCustomThemeSelected: boolean) => void;
  setSaved_custom_theme: (theme: ThemeSpecs) => void;
}

const CustomTheme: React.FC<CustomThemeProps> = ({ currentTheme, profileData, setCurrentTheme, setIsCustomThemeSelected, setSaved_custom_theme }) => {
  const [current_backgrownd_image, setCurrent_backgrownd_image] = useState<string>(profileData.background_image || '');
  const [updatedBackgrowndImage, setUpdatedBackgrowndImage] = useState<File | null>(null);


  const [backgroundColor, setBackgroundColor] = useState<string>(currentTheme['--background-color']);
  const [borderColor, setBorderColor] = useState<string>(currentTheme['--border-color']);
  const [mainTextColor, setMainTextColor] = useState<string>(currentTheme['--main-text-coloure']);
  const [scrollbarThumbColor, setScrollbarThumbColor] = useState<string>(currentTheme['--scrollbar-thumb-color']);
  const [listBackgroundColor, setListBackgroundColor] = useState<string>(currentTheme['--list-background-color']);
  const [taskBackgroundColor, setTaskBackgroundColor] = useState<string>(currentTheme['--task-background-color']);

  useEffect(() => {
    setBackgroundColor(currentTheme['--background-color']);
    setBorderColor(currentTheme['--border-color']);
    setMainTextColor(currentTheme['--main-text-coloure']);
    setScrollbarThumbColor(currentTheme['--scrollbar-thumb-color']);
    setListBackgroundColor(currentTheme['--list-background-color']);
    setTaskBackgroundColor(currentTheme['--task-background-color']);
  }, [currentTheme]);



  useEffect(() => {
    console.log('backgroundColor changed:', backgroundColor);
  }, [backgroundColor]);

  // ============================================== Reference for the file input   ================================================
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUpdatedBackgrowndImage(file);
      const fileURL = URL.createObjectURL(file); // Create a preview URL for the image
      setCurrent_backgrownd_image(fileURL); // Update the preview image
    }

  };

  // ===========================================  save the image ==========================================================
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

  // ===========================================  save the colors  ==========================================================

  const handleColoresSavce = async () => {
    localStorage.setItem('isCustomThemeSelected', 'true');
    setIsCustomThemeSelected(true);

    setSaved_custom_theme({
      '--background-color': backgroundColor,
      '--border-color': borderColor,
      '--main-text-coloure': mainTextColor,
      '--scrollbar-thumb-color': scrollbarThumbColor,
      '--list-background-color': listBackgroundColor,
      '--task-background-color': taskBackgroundColor,
    });

    localStorage.setItem('theme', JSON.stringify({
      '--background-color': backgroundColor,
      '--border-color': borderColor,
      '--main-text-coloure': mainTextColor,
      '--scrollbar-thumb-color': scrollbarThumbColor,
      '--list-background-color': listBackgroundColor,
      '--task-background-color': taskBackgroundColor,
    }));

    document.body.style.backgroundColor = backgroundColor;
    document.body.style.color = mainTextColor;

    setCurrentTheme({
      '--background-color': backgroundColor,
      '--border-color': borderColor,
      '--main-text-coloure': mainTextColor,
      '--scrollbar-thumb-color': scrollbarThumbColor,
      '--list-background-color': listBackgroundColor,
      '--task-background-color': taskBackgroundColor,
    });
    console.log("Theme colors saved to localStorage.");
  };

  // =======================================================================================================
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

      {/* line */}
      <div className='division_line' ></div>

      <div className='color_selection_container' >
        {/*1  background color selection  */}
        <div className='each_color_property' >
          <h2 className='property_h2' >Background Color</h2>

          <Space direction="vertical">
            <ColorPicker
              value={backgroundColor}
              allowClear
              showText
              mode="single"
              onChangeComplete={(color) => {
                setBackgroundColor(color.toCssString());
              }}
              size='large'

            />
          </Space>
        </div>

        {/*2  borderColor color selection  */}
        <div className='each_color_property' >
          <h2 className='property_h2' >Border Color</h2>
          <Space direction="vertical">
            <ColorPicker
              value={borderColor}
              allowClear
              showText
              mode="single"
              onChangeComplete={(color) => {
                setBorderColor(color.toCssString());
              }}
              size='large'

            />
          </Space>
        </div>


        {/*3  mainTextColor color selection  */}
        <div className='each_color_property' >
          <h2 className='property_h2' >Main Text Color</h2>
          <Space direction="vertical">
            <ColorPicker
              value={mainTextColor}
              allowClear
              showText
              mode="single"
              onChangeComplete={(color) => {
                setMainTextColor(color.toCssString());
              }}
              size='large'
            />
          </Space>
        </div>

        {/*4  scrollbarThumbColor color selection  */}
        <div className='each_color_property' >
          <h2 className='property_h2' >Scrollbar Thumb Color</h2>

          <Space direction="vertical">
            <ColorPicker
              value={scrollbarThumbColor}
              allowClear
              showText
              mode="single"
              onChangeComplete={(color) => {
                setScrollbarThumbColor(color.toCssString());
              }}
              size='large'
            />
          </Space>
        </div>

        {/*5  listBackgroundColor color selection  */}
        <div className='each_color_property' >
          <h2 className='property_h2' > List Background Color</h2>
          <Space direction="vertical">
            <ColorPicker
              value={listBackgroundColor}
              allowClear
              showText
              mode="single"
              onChangeComplete={(color) => {
                setListBackgroundColor(color.toCssString());
              }}
              size='large'
            />
          </Space>
        </div>

        {/*6  taskBackgroundColor color selection  */}
        <div className='each_color_property' >
          <h2 className='property_h2' > List Background Color</h2>
          <Space direction="vertical">
            <ColorPicker
              value={taskBackgroundColor}
              allowClear
              showText
              mode="single"
              onChangeComplete={(color) => {
                setTaskBackgroundColor(color.toCssString());
              }}
              size='large'
            />
          </Space>
        </div>



      </div>

      <div className='save_coolore_btn_container' >
        <button onClick={handleColoresSavce} className='save_colour_btn'>Save Theme</button>
      </div>

    </div>
  );
};

export default CustomTheme;