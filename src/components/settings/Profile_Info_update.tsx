import '../../styles/settings/Profile_Info_update.css'
import React from 'react';
import { useState, useEffect } from 'react'
import { ProfileData } from '../../utils/interface';
import { ThemeSpecs } from '../../utils/theme';
import { FaUser } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { MdPhoneIphone } from "react-icons/md";
import { GrFormCheckmark } from "react-icons/gr";
import { HiMiniXMark } from "react-icons/hi2";
import axiosInstance from '../../utils/axiosinstance';
import PhoneInput from 'react-phone-input-2';
import SkeletonUserInfo from '../Boards/SkeletonUserInfo';


interface Profile_Info_updateProps {
  profileData: ProfileData;
  FetchProfileData: () => Promise<void>;
  currentTheme: ThemeSpecs;
  isMobile: boolean;
}

const Profile_Info_update: React.FC<Profile_Info_updateProps> = ({ profileData, FetchProfileData, currentTheme, isMobile }) => {
  const [isEditing, setIsEditing] = useState<{ username: boolean; phone: boolean }>({ username: false, phone: false });
  const [username, setUsername] = useState<string>(profileData.username);
  const [phoneNumber, setPhoneNumber] = useState<string>(profileData.phone_number);
  const [loading_user_data, setLoading_user_data] = useState<{ username: boolean; phone: boolean }>({ username: false, phone: false });



  useEffect(() => {
    setUsername(profileData.username);
    setPhoneNumber(profileData.phone_number);
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
    } finally {
      setLoading_user_data({ username: false, phone: false });
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
    <div className='main_profilinfo_cont' style={{ borderColor: currentTheme['--border-color'] }} >
      <div className="user_info_update_cont"
        style={{
          backgroundColor: currentTheme["--background-color"],
          borderColor: currentTheme["--border-color"]
        }}
      >
        <p className="user_info_update_p"
          style={{
            backgroundColor: currentTheme["--background-color"],
            borderColor: currentTheme["--border-color"]
          }}
        >
          User information update
        </p>
      </div>

      <div className='user_info_input_container' >

        {/* username update  */}
        <div className='names_with_input_cont' >
          <div className='each_input_cont' >
            <FaUser className="user_icon" style={{ color: currentTheme["--main-text-coloure"] }} />
            {loading_user_data.username ?
              <SkeletonUserInfo currentTheme={currentTheme} height={35} width={220} />
              :
              <h1 className='user_username' >{profileData.username}</h1>
            }

            <TbEdit className='user_info_edit_icon' onClick={() => setIsEditing({ ...isEditing, username: true })} />
          </div>
          {isEditing.username && (
            <div className='input_and_save_icoin_cont' >
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                className='username_input'
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  color: currentTheme["--main-text-coloure"],
                  backgroundColor: currentTheme["--background-color"],
                  borderColor: currentTheme["--border-color"],
                  ['--placeholder-color']: currentTheme['--due-date-color']
                } as React.CSSProperties}

              />
              <div className='x_and_mark_icon_container' >
                <GrFormCheckmark
                  className='save_icon'
                  onClick={() => {
                    handleUpdate();
                    setLoading_user_data({ username: true, phone: false });
                    setIsEditing({ ...isEditing, username: false })
                  }}
                />
                <HiMiniXMark className='cansel_icon' onClick={handleCansel_username_update} />
              </div>
            </div>
          )}
        </div>

        {/* phone number update  */}
        <div className='names_with_input_cont' >
          <div className='each_input_cont' >
            <MdPhoneIphone className="user_icon" style={{ color: currentTheme["--main-text-coloure"] }} />
            {loading_user_data.phone ?
              <SkeletonUserInfo currentTheme={currentTheme} height={35} width={250} />
              :
              <h1 className='user_username' >{profileData.phone_number}</h1>
            }
            <TbEdit className='user_info_edit_icon' onClick={() => setIsEditing({ ...isEditing, phone: true })} />
          </div>
          {isEditing.phone && (
            <div className='input_and_save_icoin_cont' >
              <PhoneInput
                country={'us'}
                value={phoneNumber}
                onChange={setPhoneNumber}
                inputStyle={{
                  background: currentTheme['--list-background-color'],
                  color: currentTheme['--main-text-coloure'],
                  border: `1px solid ${currentTheme['--border-color']}`,
                  width: isMobile ? '290px' : '320px',
                  height: '44px',

                }}
                buttonStyle={{
                  border: `1px solid ${currentTheme['--border-color']}`,
                  background: currentTheme['--list-background-color'],
                }}
                dropdownClass="custom-phone-dropdown"
                containerClass="custom-phone-container"
                placeholder="Phone number"
              />
              <div className='x_and_mark_icon_container' >
                <GrFormCheckmark
                  className='save_icon'
                  onClick={() => {
                    handleUpdate();
                    setLoading_user_data({ username: false, phone: true });
                    setIsEditing({ ...isEditing, phone: false })

                  }}
                />
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