import { Children, createContext } from 'react';
import { translations } from '../trans/localization';
import { useContext, useState, useMemo } from 'react';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import { lightBlue } from '@mui/material/colors';
export const LanguageContext = createContext(translations.ru);

export default function MultiLingualContent({ contentID }) {
  const { language, getLocaleLanguage } = useContext(LanguageContext);

  return translations[getLocaleLanguage ? getLocaleLanguage : language][contentID];
}

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const ColorModeContextProvider = ({ children }) => {
  const [mode, setMode] = useState(window.localStorage.getItem('theme') || 'light');

  const toggleColorMode = () => {
    if (mode === 'light') {
      setMode('dark');
      window.localStorage.setItem('theme', 'dark');
    } else if (mode === 'dark') {
      setMode('light');
      window.localStorage.setItem('theme', 'light');
    }
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            light: '#92BCEA',
            main: mode === 'dark' ? '#093868d2' : '#001e3c',
            dark: '#92BCEA',
            contrastText: '#fff',
          },
          outlined: {
            main: mode === 'dark' ? '#fff' : '#093868d2',
            dark: '#92BCEA',
          },
        },
        typography: {
          button: {
            textTransform: 'none',
            fontWeight: 400,
          },
          h2: {
            fontSize: '24px',
            fontWeight: 'bold',
          },
          h5: {
            fontSize: '16px',
            marginTop: '10px',
            marginBottom: '30px',
          },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              elevation: {
                backgroundColor: mode === 'dark' ? '#001e3c' : 'white',
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={{ toggleColorMode, mode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => useContext(ColorModeContext);
