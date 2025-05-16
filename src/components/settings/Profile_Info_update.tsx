import '../../styles/settings/Profile_Info_update.css'
import React from 'react';
import { useState, useEffect } from 'react'
import { ProfileData } from '../../utils/interface';
import { ThemeSpecs } from '../../utils/theme';
import { FaUser } from "react-icons/fa";
// import axiosInstance from '../../utils/axiosinstance';
import { TbEdit } from "react-icons/tb";
import { MdPhoneIphone } from "react-icons/md";
import { GrFormCheckmark } from "react-icons/gr";
import { HiMiniXMark } from "react-icons/hi2";
import axiosInstance from '../../utils/axiosinstance';



interface Profile_Info_updateProps {
  profileData: ProfileData;
  FetchProfileData: () => Promise<void>;
  currentTheme: ThemeSpecs;
}

const Profile_Info_update: React.FC<Profile_Info_updateProps> = ({ profileData, FetchProfileData, currentTheme }) => {
  const [isEditing, setIsEditing] = useState<{ username: boolean; phone: boolean }>({ username: false, phone: false });
  const [username, setUsername] = useState<string>(profileData.username);
  const [phoneNumber, setPhoneNumber] = useState<string>(profileData.phone_number);




  useEffect(() => {
    setUsername(profileData.username);
    setPhoneNumber(profileData.phone_number);
    console.log("Profile data update from child ===>>>> :", profileData);
  }, [profileData]);

  // ============================= send updated data to backend ======================================


  const handleUpdate = async () => {
    try {
      const response = await axiosInstance.patch("/acc/update-username-phone/", {
        username: username,
        phone_number: phoneNumber,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (response.status === 200) {
        console.log("Profile updated successfully");
        await FetchProfileData(); // Fetch updated profile data from the backend
        setIsEditing({ username: false, phone: false }); // Exit editing mode
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // ============================= handle cancel button click ======================================

  const handleCansel_username_update = () => {
    setIsEditing({ ...isEditing, username: false })
  }
  const handleCansel_phone_update = () => {
    setIsEditing({ ...isEditing, phone: false })
  }
  return (
    <div className='main_profilinfo_cont'>
      <div className="user_info_update_cont" style={{ backgroundColor: currentTheme["--background-color"] }}>
        <p className="user_info_update_p" style={{ color: currentTheme["--main-text-coloure"] }}>
          User information update
        </p>
      </div>

      <div className='user_info_input_container' >

        {/* username update  */}
        <div className='names_with_input_cont' >
          <div className='each_input_cont' >
            <FaUser className="user_icon" style={{ color: currentTheme["--main-text-coloure"] }} />
            <h1 className='user_username' >{profileData.username}</h1>
            <TbEdit className='user_info_edit_icon' onClick={() => setIsEditing({ ...isEditing, username: true })} />
          </div>
          {isEditing.username && (
            <div className='input_and_save_icoin_cont' >
              <input type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
              <div className='x_and_mark_icon_container' >
                <GrFormCheckmark className='save_icon' onClick={handleUpdate} />
                <HiMiniXMark className='cansel_icon' onClick={handleCansel_username_update} />
              </div>
            </div>
          )}
        </div>

        {/* phone number update  */}
        <div className='names_with_input_cont' >
          <div className='each_input_cont' >
            <MdPhoneIphone className="user_icon" style={{ color: currentTheme["--main-text-coloure"] }} />
            <h1 className='user_username' >{profileData.phone_number}</h1>
            <TbEdit className='user_info_edit_icon' onClick={() => setIsEditing({ ...isEditing, phone: true })} />
          </div>
          {isEditing.phone && (
            <div className='input_and_save_icoin_cont' >
              <input type="text" placeholder="Enter your phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              <div className='x_and_mark_icon_container' >
                <GrFormCheckmark className='save_icon' onClick={handleUpdate} />
                <HiMiniXMark className='cansel_icon' onClick={handleCansel_phone_update} />
              </div>
            </div>
          )}
        </div>


      </div>

    </div>
  )
}



export default Profile_Info_update;