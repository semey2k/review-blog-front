import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import './index.css';

import { ThemeProvider } from '@mui/material';
import { theme } from './theme';
import store from './redux/store';
import { ColorModeContext, ColorModeContextProvider } from './hooks/context';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <>
    <CssBaseline />
    <ColorModeContextProvider>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </ColorModeContextProvider>
  </>,
);
