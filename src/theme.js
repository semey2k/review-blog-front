import { createTheme } from '@mui/material/styles';
import { dark } from '@mui/material/styles/createPalette';

export const theme = createTheme({
  shadows: Array(25).fill('none'),
  palette: {
    primary: {
      light: '#92BCEA',
      main: '#001e3c',
      dark: '#093868d2',
      contrastText: '#fff',
    },
  },
  typography: {
    button: {
      textTransform: 'none',
      fontWeight: 400,
    },
    h2: {
      fontSize: '14px',
      fontWeight: 'bold',
    }
  },
});
