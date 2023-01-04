import React from 'react';
import { Hidden, Paper, Tooltip, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';
import Favorite from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { ColorModeContext } from '../../hooks/context';
import axios from '../../axios';
import styles from './FullPostContent.module.scss';

export const FullPostContent = ({ children, showLike, show, likes, commentsCount, setShow, id }) => {
  const { mode } = React.useContext(ColorModeContext);
  const handleClick = async () => {
    try {
      const { data } = await axios.patch(`/likes/${id}`);
      setShow(true);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при создании статьи');
    }
  };

  return (
    <div className={styles.content}>
      {children}
      <ul className={styles.postDetails}>
        <li>
          <IconButton color="error" sx={{ p: 0, mr: 2 }} disabled={showLike || show}>
            {!showLike || !show ? (
              <Favorite onClick={handleClick} style={{ opacity: 1 }} />
            ) : (
              <Favorite
                style={{
                  opacity: mode === 'dark' ? '1' : '0.5',
                  color: mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.5)',
                }}
              />
            )}
            <Typography
              style={{
                opacity: mode === 'dark' ? '1' : '0.5',
                color: mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.5)',
              }}>
              {likes}
            </Typography>
          </IconButton>
          <IconButton
            style={{ color: mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.5)' }}
            sx={{ p: 0 }}
            disabled>
            <CommentIcon style={{ opacity: mode === 'dark' ? '1' : '0.5' }} />
            <Typography style={{ opacity: mode === 'dark' ? '1' : '0.5' }}>
              {commentsCount}
            </Typography>
          </IconButton>
        </li>
      </ul>
    </div>
  );
};
