import '../../styles/settings/ChangeNotification.css';
import React, { useEffect } from 'react';
import { ProfileData } from '../../utils/interface';
import { ThemeSpecs } from '../../utils/theme';
import discord_icon from '../../assets/discord.png';
import email_icon from '../../assets/mail.png';
import { useState } from 'react';
import DiscordWebhookTutorial from './DiscordWebhookTutorial';

interface ChangeNotificationProps {
  profileData: ProfileData;
  currentTheme: ThemeSpecs;
}


const ChangeNotification: React.FC<ChangeNotificationProps> = ({ profileData, currentTheme }) => {
  const [selected_notification_preferences, setSelected_notification_preferences] = useState<'email' | 'discord' | 'both' | null>(null);


  const [current_webhook_url, setCurrent_webhook_url] = useState<string | null>(profileData.discord_webhook_url);

  const [is_tutorial_open, setIs_tutorial_open] = useState<boolean>(false);








  useEffect(() => {
    if (profileData.discord_webhook_url === null || profileData.discord_webhook_url === 'email') {
      setSelected_notification_preferences('email');
    } else if (profileData.notification_preference === 'discord') {
      setSelected_notification_preferences('discord');
    } else if (profileData.notification_preference === 'both') {
      setSelected_notification_preferences('both');
    }
  }, [profileData.discord_webhook_url])



  const handle_not_pref_change = (preference: 'email' | 'discord' | 'both') => {
    setSelected_notification_preferences(preference);
    // Here you would typically make an API call to save the preference
    // For example:
    // axiosInstance.post('/api/update-notification-preference', { preference })
    //   .then(response => {
    //     console.log('Preference updated successfully');
    //   })
    //   .catch(error => {
    //     console.error('Error updating preference:', error);
    //   });
  };
  useEffect(() => {
    console.log("profile data ->>", profileData);
  }, [profileData]);


  const handle_tutorial_open = () => {
    setIs_tutorial_open(true);
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

        <div className='discord_webhook_input_container' >
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
          />
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
              onClick={() => handle_not_pref_change('email')}
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
              onClick={() => handle_not_pref_change('discord')}
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
              onClick={() => handle_not_pref_change('both')}
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










