import '../../styles/settings/DiscordWebhookTutorial.css'
import { useState } from 'react';
import React from 'react';
import { ThemeSpecs } from '../../utils/theme';
import w_1 from '../../assets/w_1.png';
import w_2 from '../../assets/w_2.png';
import w_3 from '../../assets/w_3.png';



const steps = [
  { img: w_1, text: 'Go to Discord and open your server settings.' },
  { img: w_2, text: 'Navigate to Integrations > Webhooks.' },
  { img: w_3, text: 'Click "New Webhook" and copy the URL.' },
];


interface DiscordWebhookTutorialProps {
  onClose: () => void;
  currentTheme: ThemeSpecs;
}

const DiscordWebhookTutorial: React.FC<DiscordWebhookTutorialProps> = ({ onClose, currentTheme }) => {
  const [step, setStep] = useState(0);

  return (
    <div className='discord-webhook-tutorial-container'
      style={{
        backgroundColor: currentTheme['--background-color']
      }}
    >
      <h2>How to Create a Discord Webhook URL</h2>
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
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>Back</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1}>Next</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}


export default DiscordWebhookTutorial;