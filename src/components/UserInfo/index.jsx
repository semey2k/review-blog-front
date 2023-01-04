import React from 'react';
import styles from './UserInfo.module.scss';
import Avatar from '@mui/material/Avatar';
import { IconButton } from '@mui/material';
import Favorite from '@mui/icons-material/Favorite';
import { CloudinaryContext, Image, Transformation } from 'cloudinary-react';

export const UserInfo = ({ post, avatarUrl, fullName, additionalText, commentsText }) => {
  console.log(avatarUrl);
  return (
    <div className={styles.root}>
      {avatarUrl ? (
        <Image className={styles.avatar} cloudName="dw0rsewtk" publicId={avatarUrl}>
          <Transformation radius="max" width="40" height="40" crop="fill"/>
        </Image>
      ) : (
        <Avatar className={styles.avatar} alt={fullName} src="/static/images/avatar/1.jpg" />
      )}
      <div className={styles.userDetails}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className={styles.userName}>{fullName}</span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: '10px',
              color: '#d32f2f',
              fontWeight: 'bold',
            }}>
            <span>
              {post?.map((el) => el.likes.length).length > 0
                ? post.map((el) => el.likes.length).reduce((a, b) => a + b)
                : 0}
            </span>
            <Favorite sx={{ height: '19px', mb: '2px' }} color="error" />
          </div>
        </div>
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};
