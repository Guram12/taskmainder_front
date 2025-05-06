export interface ThemeSpecs {
  '--background-color': string;
  '--main-text-coloure': string;
  '--border-color': string;
  '--scrollbar-bg-color': string;
  '--scrollbar-thumb-color': string;
  '--list-background-color': string;
}



const themes = {
  dark: {
    '--background-color': '#000000',
    '--main-text-coloure': '#ffffff',
    '--border-color': '#f2f3f4',
    '--scrollbar-thumb-color': '##34ebc6',
    '--list-background-color': '#24292b'
  },
  light: {
    '--background-color': '#F4D35E',
    '--main-text-coloure': '#000000',
    '--border-color': '#000000',
    '--scrollbar-thumb-color': '#c0c0c0',
    '--list-background-color': '#ffffff'

  },
  theme1: {
    '--background-color': '#121212',
    '--main-text-coloure': '#FFFFFF',
    '--border-color': '#f2f3f4',
    '--scrollbar-thumb-color': '#555555',
    '--list-background-color': '#1e3a4a'

  },
  theme2: {
    '--background-color': '#2e4053',
    '--main-text-coloure': '#FFFFFF',
    '--border-color': '#d6dbdf',
    '--scrollbar-thumb-color': '#4e5e73',
    '--list-background-color': '#1e3a4a'

  },
  theme3: {
    '--background-color': '#708B75',
    '--main-text-coloure': '#FFFFFF',
    '--border-color': '#000000',
    '--scrollbar-thumb-color': '#90ab95',
    '--list-background-color': '#ffffff'

  },
  theme4: {
    '--background-color': '#005f54',
    '--main-text-coloure': '#FFFFFF',
    '--border-color': '#000000',
    '--scrollbar-thumb-color': '#207f74',
    '--list-background-color': '#ffffff'
  }
};

export default themes;