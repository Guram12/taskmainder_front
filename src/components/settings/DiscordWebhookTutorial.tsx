import '../../styles/settings/DiscordWebhookTutorial.css'
import { useState } from 'react';
import React from 'react';
import { ThemeSpecs } from '../../utils/theme';
import w_1 from '../../assets/w_1.png';
import w_2 from '../../assets/w_2.png';
import w_3 from '../../assets/w_3.png';
import { useTranslation } from 'react-i18next';
import { CgCloseR } from "react-icons/cg";





interface DiscordWebhookTutorialProps {
  onClose: () => void;
  currentTheme: ThemeSpecs;
}

const DiscordWebhookTutorial: React.FC<DiscordWebhookTutorialProps> = ({ onClose, currentTheme }) => {
  const [step, setStep] = useState(0);

  const { t } = useTranslation();

  const steps = [
    { img: w_1, text: t('go_to_discord_and_open_your_server_settings.') },
    { img: w_2, text: t('navigate_to_integrations_webhooks.') },
    { img: w_3, text: t('click_new_webhook_and_copy_the_url.') },
  ];

  return (
    <div className='discord-webhook-tutorial-container'
      style={{
        backgroundColor: currentTheme['--background-color']
      }}
    >
      <button
        className='close_tutorial_button'
        onClick={onClose}>
        <CgCloseR size={24} color={currentTheme['--main-text-coloure']} className='close_tutorial_btn_icon' />
      </button>

      <h2>{t('how_to_create_a_discord_webhook_url')}</h2>
      <div className="discord-webhook-slider-wrapper">
        {steps.map((stepObj, idx) => (
          <img
            key={idx}
            src={stepObj.img}
            alt={`Step ${idx + 1}`}
            className={`discord-webhook-slider-img${step === idx ? ' active' : ''}`}
          />
        ))}
      </div>
      <p>{steps[step].text}</p>
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          style={{
            backgroundColor: currentTheme['--list-background-color'],
            color: currentTheme['--main-text-coloure'],
            border: `1px solid ${currentTheme['--border-color']}`,
            padding: '6px 10px',
            borderRadius: '8px',
            cursor: step === 0 ? 'not-allowed' : 'pointer',
          }}
          className='tutorial_back_btn'
        >
          {t('back')}
        </button>

        <button
          onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1}
          className='tutorial_next_btn'
          style={{
            backgroundColor: currentTheme['--list-background-color'],
            color: currentTheme['--main-text-coloure'],
            border: `1px solid ${currentTheme['--border-color']}`,
            padding: '6px 10px',
            borderRadius: '8px',
            cursor: step === steps.length - 1 ? 'not-allowed' : 'pointer',
          }}
        >
          {t('next')}
        </button>

      </div>
    </div>
  );
}


export default DiscordWebhookTutorial;