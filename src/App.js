import Container from '@mui/material/Container';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components';
import { Home, FullPost, Registration, AddPost, Login, Profile, AdminPanel} from './pages';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthMe, selectIsAuth } from './redux/slices/auth';
// import './i18n'
import { ColorModeContext, LanguageContext, useColorMode } from './hooks/context';
import { Paper } from '@mui/material';
import { useContext } from 'react';

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  const [language, setLanguage] = React.useState('ru');


  const toggleLanguage = () => {
    // setLanguage((language) => if(language === 'english'){
    //   'russian'
    // } (language === 'english' ?  : 'english'));
    if (language === 'en') {
      window.localStorage.setItem('language', 'ru');
      setLanguage('ru');
    } else if (language === 'ru') {
      window.localStorage.setItem('language', 'en');
      setLanguage('en');
    }
  };

  const getLocaleLanguage = window.localStorage.getItem('language');

  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  const { mode } = useContext(ColorModeContext);

  document.body.style.backgroundColor = mode === 'dark' ? '#001e3c' : 'white';

  return (
    <Paper elevation={0}>
      <LanguageContext.Provider value={{ language, toggleLanguage, getLocaleLanguage }}>
        <Header />
        <Container maxWidth="lg">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts/search/:query" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
            <Route path="/posts/:id" element={<FullPost />} />
            <Route path="/posts/tags/:tagsId" element={<Home />} />
            <Route path="/register/:id" element={<Registration />} />
            <Route path="/posts/:id/edit" element={<AddPost />} />
            <Route path="/posts/:id/edit/:el" element={<AddPost />} />
            <Route path="/add-post" element={<AddPost />} />
            <Route path="/add-post/:el" element={<AddPost />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
          </Routes>
        </Container>
      </LanguageContext.Provider>
    </Paper>
  );
}

export default App;
