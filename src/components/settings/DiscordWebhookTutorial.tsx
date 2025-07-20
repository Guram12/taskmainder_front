import '../../styles/settings/DiscordWebhookTutorial.css'
import { useState } from 'react';
import React from 'react';
import { ThemeSpecs } from '../../utils/theme';

const steps = [
  { img: '/screenshots/step1.png', text: 'Go to Discord and open your server settings.' },
  { img: '/screenshots/step2.png', text: 'Navigate to Integrations > Webhooks.' },
  { img: '/screenshots/step3.png', text: 'Click "New Webhook" and copy the URL.' },
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
      <img src={steps[step].img} alt={`Step ${step + 1}`} style={{ width: '100%' }} />
      <p>{steps[step].text}</p>
      <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>Back</button>
      <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1}>Next</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}


export default DiscordWebhookTutorial;