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
import { IoEarth } from "react-icons/io5";
import { Select } from 'antd';
import timezone_data from '../../utils/data.json';

interface Profile_Info_updateProps {
  profileData: ProfileData;
  FetchProfileData: () => Promise<void>;
  currentTheme: ThemeSpecs;
  isMobile: boolean;
}

const Profile_Info_update: React.FC<Profile_Info_updateProps> = ({ profileData, FetchProfileData, currentTheme, isMobile }) => {
  const [isEditing, setIsEditing] = useState<{ username: boolean; phone: boolean; timezone: boolean }>({ username: false, phone: false, timezone: false });
  const [username, setUsername] = useState<string>(profileData.username);
  const [phoneNumber, setPhoneNumber] = useState<string>(profileData.phone_number);
  const [loading_user_data, setLoading_user_data] = useState<{ username: boolean; phone: boolean; timezone: boolean }>({ username: false, phone: false, timezone: false });
  const [selectedTimeZone, setSelectedTimeZone] = useState<string | undefined>(undefined);


  useEffect(() => {
    console.log('tmz', selectedTimeZone);
  }, [selectedTimeZone]);

  useEffect(() => {
    setUsername(profileData.username);
    setPhoneNumber(profileData.phone_number);
    setSelectedTimeZone(profileData.timezone);
  }, [profileData]);

  // ============================= send updated data to backend ======================================

  const handleUpdate = async () => {
    try {
      const response = await axiosInstance.patch("/acc/update-username-phone/", {
        username: username,
        phone_number: phoneNumber,
        timezone: selectedTimeZone,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (response.status === 200) {
        console.log("Profile updated successfully");
        await FetchProfileData(); // Fetch updated profile data from the backend
        setIsEditing({ username: false, phone: false, timezone: false }); // Exit editing mode
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading_user_data({ username: false, phone: false, timezone: false });
    }
  };

  // ============================= handle cancel button click ======================================

  const handleCansel_username_update = () => {
    setIsEditing({ ...isEditing, username: false })
  }
  const handleCansel_phone_update = () => {
    setIsEditing({ ...isEditing, phone: false })
  }

  const handleCansel_timezone_update = () => {
    setIsEditing({ ...isEditing, timezone: false })
  }

  // ============================================== timezone select options ================================
  const timezoneOptions = timezone_data.map((entry) => ({
    label: `${entry.country_name} (Timezone: ${entry.timezone}, ${entry.utc_offset})`,
    value: entry.timezone,
  }));



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
                    setLoading_user_data({ username: true, phone: false, timezone: false });
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
                    setLoading_user_data({ username: false, phone: true, timezone: false });
                    setIsEditing({ ...isEditing, phone: false })

                  }}
                />
                <HiMiniXMark className='cansel_icon' onClick={handleCansel_phone_update} />
              </div>
            </div>
          )}

        </div>
        {/* =============== timezone select ================= */}
        <div className="names_with_input_cont">
          <div className='each_input_cont' >
            <IoEarth className='register_icons' style={{ color: currentTheme['--main-text-coloure'] }} />
            {loading_user_data.timezone ?
              <SkeletonUserInfo currentTheme={currentTheme} height={35} width={250} />
              :
              <h1 className='user_username' >{selectedTimeZone || 'Select timezone'}</h1>
            }
            <TbEdit className='user_info_edit_icon' onClick={() => setIsEditing({ ...isEditing, timezone: true })} />
          </div>

          {isEditing.timezone && (
            <div className='tmz_input_and_save_icoin_cont' >

              <Select
                showSearch
                value={selectedTimeZone}
                onChange={(value) => {
                  setSelectedTimeZone(value);
                }}
                options={timezoneOptions}
                placeholder="Select country for timezone"
                style={{
                  width: isMobile ? '290px' : '320px',
                  height: '45px',
                  background: currentTheme['--list-background-color'],
                  color: currentTheme['--main-text-coloure'],
                  border: `1px solid ${currentTheme['--border-color']}`,
                }}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />

              <div className='x_and_mark_icon_container' >
                <GrFormCheckmark
                  className='save_icon'
                  onClick={() => {
                    handleUpdate();
                    setLoading_user_data({ username: false, phone: false, timezone: true });
                    setIsEditing({ ...isEditing, timezone: false })
                  }}
                />
                <HiMiniXMark className='cansel_icon' onClick={handleCansel_timezone_update}  />
              </div>
            </div>
          )}

        </div>


      </div>
    </div>
  )
}



export default Profile_Info_update;