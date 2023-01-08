import React from 'react';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectIsAuth } from '../../redux/slices/auth';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
} from '@mui/material';
import { useContext } from 'react';
import MultiLingualContent, {
  ColorModeContext,
  LanguageContext,
} from '../../hooks/context';

import { styled } from '@mui/material/styles';
import Favorite from '@mui/icons-material/Favorite';
import Switch from '@mui/material/Switch';
import { Image, Transformation } from 'cloudinary-react';
import { ProfileMenu } from '../ProfileMenu';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

export const Header = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');
  const [likes, setLikes] = React.useState('');
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const { mode, toggleColorMode } = useContext(ColorModeContext);
  const { data, status } = useSelector((state) => state.auth);
  const { language, toggleLanguage, getLocaleLanguage } = useContext(LanguageContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [state, setState] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState(open);
  };

  const onClickLogout = () => {
    if (window.confirm('Вы действительно хотите выйти?')) {
      dispatch(logout());
      setAnchorEl(null);
      window.localStorage.removeItem('token');
      navigate('/');
    }
  };

  React.useEffect(() => {
    setSearch('');
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      const likes =
        (await data?.post.map((el) => el.likes.length).length) > 0
          ? data?.post.map((el) => el.likes.length).reduce((a, b) => a + b)
          : 0;
      setLikes(likes);
    };
    fetchData();
  }, [data]);

  const onClickSearch = () => {
    navigate(`/posts/search/${search}`);
    setSearch('');
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);



  return (
    <Paper
      style={{ borderBottom: mode === 'dark' ? 'none' : '1px solid #e0e0e0' }}
      className={styles.root}>
      <Container maxWidth="xl">
        <div className={styles.inner}>
          <Link
            style={{ color: mode === 'dark' ? '#fff' : '#001e3c' }}
            className={styles.logo}
            to="/">
            <div>ReadCrit</div>
          </Link>
          <Box
            sx={{
              mr: 1,
              display: {
                xs: 'none',
                md: 'block',
              },
            }}>
            <TextField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              id="outlined-basic"
              label={<MultiLingualContent contentID="search"></MultiLingualContent>}
              variant="outlined"
              color="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton disabled={search ? false : true} onClick={onClickSearch} edge="end">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box
            sx={{
              display: {
                xs: 'none',
                md: 'flex',
              },
            }}>
            <FormControl size="small">
              <Select
                displayEmpty
                value={getLocaleLanguage ? getLocaleLanguage : language}
                autoWidth
                color="outlined"
                inputProps={{ 'aria-label': 'Without label' }}
                onChange={toggleLanguage}>
                <MenuItem value={'ru'}>Русский</MenuItem>
                <MenuItem value={'en'}>English</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              sx={{ mr: 1 }}
              control={
                <MaterialUISwitch
                  onClick={toggleColorMode}
                  sx={{ ml: 1 }}
                  defaultChecked={mode === 'dark'}
                />
              }
            />
          </Box>
          <Box
            sx={{
              display: {
                xs: 'none',
                md: 'block',
              },
            }}>
            {isAuth ? (
              <>
                <IconButton
                  onClick={handleClick}
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}>
                  {data.avatarUrl ? (
                    <Image
                      className={styles.avatar}
                      cloudName="dw0rsewtk"
                      publicId={data.avatarUrl}>
                      <Transformation radius="max" width="40" height="40" crop="fill" />
                    </Image>
                  ) : (
                    <Avatar
                      style={{ color: 'white' }}
                      alt={data.fullName}
                      src="/static/images/avatar/1.jpg"
                    />
                  )}
                </IconButton>
                <ProfileMenu
                  likes={likes}
                  data={data}
                  anchorEl={anchorEl}
                  handleClose={handleClose}
                  onClickLogout={onClickLogout}
                />
              </>
            ) : (
              <Box
                sx={{
                  display: {
                    xs: 'none',
                    md: 'block',
                  },
                }}>
                <Link style={{ marginRight: '5px', textDecoration: 'none' }} to="/login">
                  <Button variant="outlined" color="outlined">
                    <MultiLingualContent contentID={'signIn'}></MultiLingualContent>
                  </Button>
                </Link>

                <Link style={{ textDecoration: 'none' }} to="/register">
                  <Button variant="contained">
                    <MultiLingualContent contentID={'signUp'}></MultiLingualContent>
                  </Button>
                </Link>
              </Box>
            )}
          </Box>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(true)}
            sx={{
              display: {
                xs: 'block',
                md: 'none',
              },
            }}>
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor="right"
            open={state}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}>
            <Box
              sx={{
                p: 2,
                height: 1,
              }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IconButton sx={{ mb: 2 }}>
                  <CloseIcon onClick={toggleDrawer(false)} />
                </IconButton>
                {isAuth && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {data?.avatarUrl ? (
                      <Image
                        className={styles.avatar}
                        cloudName="dw0rsewtk"
                        publicId={data?.avatarUrl}>
                        <Transformation radius="max" width="40" height="40" crop="fill" />
                      </Image>
                    ) : (
                      <Avatar
                        style={{ color: 'white' }}
                        alt={data?.fullName}
                        src="/static/images/avatar/1.jpg"
                      />
                    )}
                    <IconButton color="error" style={{ margin: '0 auto' }}>
                      <Favorite />
                      <span>{likes || 0}</span>
                    </IconButton>
                  </Box>
                )}
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ mb: 2 }}>
                <FormControl size="small">
                  <Select
                    displayEmpty
                    value={getLocaleLanguage ? getLocaleLanguage : language}
                    autoWidth
                    color="outlined"
                    inputProps={{ 'aria-label': 'Without label' }}
                    onChange={toggleLanguage}>
                    <MenuItem value={'ru'}>Русский</MenuItem>
                    <MenuItem value={'en'}>English</MenuItem>
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <MaterialUISwitch
                      onClick={toggleColorMode}
                      sx={{ ml: 2 }}
                      defaultChecked={mode === 'dark'}
                    />
                  }
                />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {isAuth ? (
                  <>
                    <Link style={{ textDecoration: 'none', marginBottom: '10px' }} to="/profile">
                      <Button
                        onClick={toggleDrawer(false)}
                        fullWidth
                        variant="outlined"
                        color="outlined">
                        <MultiLingualContent contentID="profile"></MultiLingualContent>
                      </Button>
                    </Link>
                    <Link
                      style={{ textDecoration: 'none', marginBottom: '10px' }}
                      to={`/register/${data?._id}`}>
                      <Button
                        onClick={toggleDrawer(false)}
                        fullWidth
                        variant="outlined"
                        color="outlined">
                        Изменить профиль
                      </Button>
                    </Link>
                    {data?.status === 'admin' && (
                      <Link
                        style={{ textDecoration: 'none', marginBottom: '10px' }}
                        to="/admin-panel">
                        <Button
                          onClick={toggleDrawer(false)}
                          fullWidth
                          variant="outlined"
                          color="outlined">
                          <MultiLingualContent contentID="admin"></MultiLingualContent>
                        </Button>
                      </Link>
                    )}
                    <Button
                      style={{ marginBottom: '10px' }}
                      onClick={onClickLogout}
                      variant="contained"
                      color="primary">
                      <MultiLingualContent contentID="logout"></MultiLingualContent>
                    </Button>
                  </>
                ) : (
                  <>
                    <Link style={{ textDecoration: 'none', marginBottom: '10px' }} to="/login">
                      <Button
                        onClick={toggleDrawer(false)}
                        fullWidth
                        variant="outlined"
                        color="outlined">
                        <MultiLingualContent contentID={'signIn'}></MultiLingualContent>
                      </Button>
                    </Link>

                    <Link style={{ textDecoration: 'none', marginBottom: '10px' }} to="/register">
                      <Button onClick={toggleDrawer(false)} fullWidth variant="contained">
                        <MultiLingualContent contentID={'signUp'}></MultiLingualContent>
                      </Button>
                    </Link>
                  </>
                )}
                <TextField
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  size="small"
                  id="outlined-basic"
                  label={<MultiLingualContent contentID="search"></MultiLingualContent>}
                  variant="outlined"
                  color="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          disabled={search ? false : true}
                          onClick={onClickSearch}
                          edge="end">
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box></Box>
            </Box>
          </Drawer>
        </div>
      </Container>
    </Paper>
  );
};
