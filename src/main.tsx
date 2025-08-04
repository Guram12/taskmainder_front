import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import themes from './utils/theme.ts'
import './utils/i18n.ts' 

if (!localStorage.getItem('theme')) {
  const deepAquaTheme = themes.blue_steel;
  localStorage.setItem('theme', JSON.stringify(deepAquaTheme));
  for (const [key, value] of Object.entries(deepAquaTheme)) {
    document.documentElement.style.setProperty(key, value);
  }
  document.body.style.backgroundColor = deepAquaTheme['--background-color'];
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)



