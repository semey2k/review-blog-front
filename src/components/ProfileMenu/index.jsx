import Favorite from '@mui/icons-material/Favorite';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import React from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import MultiLingualContent, { ColorModeContext } from '../../hooks/context';

export const ProfileMenu = ({ likes, data, anchorEl, handleClose, onClickLogout }) => {
  const { mode } = useContext(ColorModeContext);
  const open = Boolean(anchorEl);

  return (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          backgroundColor: mode === 'dark' ? 'rgb(0, 30, 60)' : 'white',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
          mt: 1.5,
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: mode === 'dark' ? 'rgb(0, 30, 60)' : 'white',
            backgroundImage:
              'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
      <MenuItem>
        <IconButton color="error" style={{ margin: '0 auto' }}>
          <Favorite />
          <span>{likes || 0}</span>
        </IconButton>
      </MenuItem>
      <MenuItem>
        <Link style={{ width: '100%', textDecoration: 'none' }} to="/profile">
          <Button fullWidth variant="outlined" color="outlined">
            <MultiLingualContent contentID="profile"></MultiLingualContent>
          </Button>
        </Link>
      </MenuItem>
      <MenuItem>
        <Link style={{ width: '100%', textDecoration: 'none' }} to={`/register/${data._id}`}>
          <Button fullWidth variant="outlined" color="outlined">
          <MultiLingualContent contentID="settings"></MultiLingualContent>
          </Button>
        </Link>
      </MenuItem>
      {data?.status === 'admin' && (
        <MenuItem>
          <Link style={{ width: '100%', textDecoration: 'none' }} to="/admin-panel">
            <Button fullWidth variant="outlined" color="outlined">
              <MultiLingualContent contentID="admin"></MultiLingualContent>
            </Button>
          </Link>
        </MenuItem>
      )}
      <MenuItem>
        <Button fullWidth onClick={onClickLogout} variant="contained" color="primary">
          <MultiLingualContent contentID="logout"></MultiLingualContent>
        </Button>
      </MenuItem>
    </Menu>
  );
};
