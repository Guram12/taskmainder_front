export interface ThemeSpecs {
  '--background-color': string;
  '--main-text-coloure': string;
  '--border-color': string;
  '--scrollbar-thumb-color': string;
  '--list-background-color': string;
  '--task-background-color': string; 
}



const themes = {
  dark_gray: {
    '--background-color': '#121212',
    '--main-text-coloure': '#ffffff',
    '--border-color': '#ffffff',
    '--scrollbar-thumb-color': '#555555',
    '--list-background-color': '#1e3a4a',
    '--task-background-color': '#2a2a2a'
    
  },

  dark_blue: {
    '--background-color': '#2e4053',
    '--main-text-coloure': '#FFFFFF',
    '--border-color': '#9BA1A7',
    '--scrollbar-thumb-color': '#4e5e73',
    '--list-background-color': '#1e3a4a',
    '--task-background-color': '#152935'

  },

  yellow: {
    '--background-color': '#F4D35E',
    '--main-text-coloure': '#121212',
    '--border-color': '#000000',
    '--scrollbar-thumb-color': '#c0c0c0',
    '--list-background-color': '#BAC700',
    '--task-background-color': '#f0e68c'

  },

  light_green: {
    '--background-color': '#708B75',
    '--main-text-coloure': '#FFFFFF',
    '--border-color': '#000000',
    '--scrollbar-thumb-color': '#90ab95',
    '--list-background-color': '#ffffff',
    '--task-background-color': '#d0e8d0'

  },

};

export default themes;