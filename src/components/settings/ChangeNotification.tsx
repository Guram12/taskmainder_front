import '../../styles/settings/ChangeNotification.css';
import React, { useEffect } from 'react';
import { ProfileData } from '../../utils/interface';
import { ThemeSpecs } from '../../utils/theme';
import discord_icon from '../../assets/discord.png';
import email_icon from '../../assets/mail.png';
import { useState } from 'react';
import DiscordWebhookTutorial from './DiscordWebhookTutorial';
import axiosInstance from '../../utils/axiosinstance';




interface ChangeNotificationProps {
  profileData: ProfileData;
  currentTheme: ThemeSpecs;
}


const ChangeNotification: React.FC<ChangeNotificationProps> = ({ profileData, currentTheme }) => {
  const [selected_notification_preferences, setSelected_notification_preferences] = useState<'email' | 'discord' | 'both' | null>(null);
  const [current_webhook_url, setCurrent_webhook_url] = useState<string | null>(profileData.discord_webhook_url);
  const [is_tutorial_open, setIs_tutorial_open] = useState<boolean>(false);



  const [is_url_updatable, setIs_url_updatable] = useState<boolean>(false);


  useEffect(() => {
    if (profileData.discord_webhook_url === null) {
      setCurrent_webhook_url(null);
      setIs_url_updatable(false);
    } else {
      setCurrent_webhook_url(profileData.discord_webhook_url);
      setIs_url_updatable(true);
    }
  }, [profileData.discord_webhook_url]);

  useEffect(() => {
    console.log('is_tutorial_open', is_tutorial_open)
  }, [profileData.discord_webhook_url]);

  useEffect(() => {
    if (profileData.discord_webhook_url === null || profileData.discord_webhook_url === 'email') {
      setSelected_notification_preferences('email');
    } else if (profileData.notification_preference === 'discord') {
      setSelected_notification_preferences('discord');
    } else if (profileData.notification_preference === 'both') {
      setSelected_notification_preferences('both');
    }
  }, [profileData.notification_preference]);


  // =========================================== save notification preferences ===========================================
  const handle_save_webhook_url = async () => {
    if (current_webhook_url === null) {
      alert('Please select a notification preference.');
      return;
    }
    try {
      const response = await axiosInstance.put('acc/discord-webhook-url/',
        {
          discord_webhook_url: current_webhook_url
        }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (response.status === 200) {
        alert('Notification preferences updated successfully.');
        setIs_url_updatable(false);
      } else {
        alert('Failed to update notification preferences.');
      }
    } catch (error) {
      console.error('Error saving notification preferences:', error);
    }
  };

  // -----------------------------  delete webhook utrl ---------------------------------

  const handle_delete_webhook_url = async () => {
    try {
      const response = await axiosInstance.put(
        'acc/discord-webhook-url/',
        {
          discord_webhook_url: null
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      if (response.status === 200) {
        setCurrent_webhook_url(null);
        setSelected_notification_preferences('email');
        setIs_url_updatable(false);

        console.log('Webhook URL deleted successfully.');
      } else {
        console.error('Failed to delete webhook URL.');
      }
    } catch (error) {
      console.error('Error deleting webhook URL:', error);
    }
  };
  // =======================================================================================================
  // useEffect(() => {
  //   console.log("profile data ->>", profileData);
  // }, [profileData]);

  const handle_tutorial_open = () => {
    setIs_tutorial_open(true);
  }

  // ===================================================    preferences click     =======================================================

  const handle_Email_Click = () => {
    setSelected_notification_preferences('email');
  }

  const handle_Discord_Click = () => {
    setSelected_notification_preferences('discord');
  }

  const handle_Both_Click = () => {
    setSelected_notification_preferences('both');
  }

  const handle_update_webhook_url_click = () => {
    console.log('clicked update ')

    setIs_url_updatable(true);

  }

  return (
    <div className="change_notification_main_cont" style={{ borderColor: currentTheme['--border-color'] }} >
      <div className="noti_update_cont"
        style={{
          backgroundColor: currentTheme["--background-color"],
          borderColor: currentTheme["--border-color"]
        }}
      >
        <p className="noti_update_p"
          style={{
            backgroundColor: currentTheme["--background-color"],
            borderColor: currentTheme["--border-color"]
          }}
        >
          Notification preferences
        </p>
      </div>


      <div>
        {profileData.discord_webhook_url === null && (

          <h2 className='no_discord_webhook_p' >
            You have not set a Discord webhook URL. For creating a Discord webhook URL, please click
            <span
              onClick={handle_tutorial_open}
              className='tutorial_link'
              style={{
                borderColor: currentTheme['--border-color'],
                backgroundColor: currentTheme['--task-background-color'],
              }}
            >
              here
            </span>
            .
          </h2>
        )}

        {profileData.discord_webhook_url !== null && (

          <h2 className='no_discord_webhook_p' >
            For creating a Discord webhook URL, please click
            <span
              onClick={handle_tutorial_open}
              className='tutorial_link'
              style={{
                borderColor: currentTheme['--border-color'],
                backgroundColor: currentTheme['--task-background-color'],
              }}
            >
              here
            </span>
            .
          </h2>
        )}


        <div className='discord_webhook_input_container' >
          {is_url_updatable ? (
            <>
              <input
                type="url"
                value={current_webhook_url || ''}
                style={{
                  backgroundColor: currentTheme['--task-background-color'],
                  borderColor: currentTheme['--border-color'],
                  color: currentTheme['--main-text-coloure'],
                  ['--placeholder-color']: currentTheme['--due-date-color'],
                } as React.CSSProperties}
                className='discord_webhook_input'
                onChange={(e) => setCurrent_webhook_url(e.target.value)}
                placeholder='Enter your Discord webhook URL'
                autoComplete="off"
                name="discord-webhook-url-unique"
              />
              <button
                className='save_webhook_url_button'
                style={{
                  backgroundColor: currentTheme['--task-background-color'],
                  borderColor: currentTheme['--border-color'],
                  color: currentTheme['--main-text-coloure'],
                }}
                onClick={handle_save_webhook_url}
              >
                Save
              </button>

              <button
                className='delete_webhook_url_button'
                style={{
                  backgroundColor: currentTheme['--task-background-color'],
                  borderColor: currentTheme['--border-color'],
                  color: currentTheme['--main-text-coloure'],
                }}
                onClick={() => setIs_url_updatable(false)}
              >
                Cancel
              </button>

              <button
                className='delete_webhook_url_button'
                style={{
                  backgroundColor: currentTheme['--task-background-color'],
                  borderColor: currentTheme['--border-color'],
                  color: currentTheme['--main-text-coloure'],
                }}
                onClick={handle_delete_webhook_url}
              >
                Delete
              </button>



            </>
          ) : (
            <>
              <div
                className='no_webhook_url_message'
                style={{
                  backgroundColor: currentTheme['--list-background-color'],
                  borderColor: currentTheme['--border-color'],
                }}>
                No Webhook URL
              </div>
              <button
                className='update_webhook_url_button'
                style={{
                  backgroundColor: currentTheme['--task-background-color'],
                  borderColor: currentTheme['--border-color'],
                  color: currentTheme['--main-text-coloure'],
                }}
                onClick={handle_update_webhook_url_click}
              >
                Enter
              </button>
            </>
          )}
        </div>


        {is_tutorial_open && (
          <>
            <div className="discord-webhook-tutorial-overlay"></div>
            <DiscordWebhookTutorial
              onClose={() => setIs_tutorial_open(false)}
              currentTheme={currentTheme}
            />
          </>
        )}
      </div>

      <div className='header_and_pref_container'>
        <h1 className='select_pref_h1' >Please select where you want to receive notifications:</h1>

        <div className='select_pref_big_container' >

          {/* Email option */}
          <div className='select_pref_item_container' >
            <p className='select_pref_item_text' style={{ color: currentTheme['--main-text-coloure'] }}>Email</p>
            <div
              className='select_pref_item'
              style={{
                borderColor: selected_notification_preferences === 'email' ? currentTheme['--border-color'] : 'transparent',
                ['--hover-color']: currentTheme['--hover-color']
              } as React.CSSProperties}
              onClick={handle_Email_Click}
            >
              <img src={email_icon} alt="Email" className='mail_icon' />
            </div>
          </div>

          {/* Discord option */}
          <div className='select_pref_item_container' >
            <p className='select_pref_item_text' style={{ color: currentTheme['--main-text-coloure'] }}>Discord</p>
            <div
              className='select_pref_item'
              style={{
                borderColor: selected_notification_preferences === 'discord' ? currentTheme['--border-color'] : 'transparent',
                ['--hover-color']: currentTheme['--hover-color']
              } as React.CSSProperties}
              onClick={handle_Discord_Click}
            >
              <img src={discord_icon} alt="Discord" className='discord_icon' />
            </div>
          </div>

          <div className='select_pref_item_container' >
            <p className='select_pref_item_text' style={{ color: currentTheme['--main-text-coloure'] }}>Both</p>
            {/* Both option */}
            <div
              className='select_pref_item_both'
              style={{
                borderColor: selected_notification_preferences === 'both' ? currentTheme['--border-color'] : 'transparent',
                ['--hover-color']: currentTheme['--hover-color']
              } as React.CSSProperties}
              onClick={handle_Both_Click}
            >
              <img src={email_icon} alt="Both" className='mail_icon_both' />
              <img src={discord_icon} alt="Discord" className='discord_icon_both' />
            </div>
          </div>
        </div>

      </div>




    </div>

  )

}


export default ChangeNotification;










