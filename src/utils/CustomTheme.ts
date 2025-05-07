import { createTheme } from '@mui/material/styles';
import { ThemeSpecs } from './theme';

const generateCustomTheme = (currentTheme: ThemeSpecs) => {
  return createTheme({
    components: {



      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: currentTheme['--background-color'],
            color: currentTheme['--main-text-coloure'],
            scrollbarColor: `${currentTheme['--scrollbar-thumb-color']} transparent`,
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: currentTheme['--scrollbar-thumb-color'],
            },
          },
        },
      },
    },
  });
};

export default generateCustomTheme;