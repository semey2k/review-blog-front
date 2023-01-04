import React from 'react';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

import styles from './Post.module.scss';
import { ColorModeContext } from '../../hooks/context';
import { Grid } from '@mui/material';
import clsx from 'clsx';

export const PostSkeleton = ({ isFullPost }) => {
  const { mode } = React.useContext(ColorModeContext);

  console.log(isFullPost);

  return (
    <Grid
      className={styles.skeleton}
      style={{ bacgrkoundColor: mode === 'dark' ? '#001e3c' : '#fff' }}
      container
      spacing={0}>
      <Grid item xs={12} sm={3.5}>
        <Skeleton
          className={clsx(styles.skeletonImage, { [styles.skeletonImageFull]: isFullPost })}
          variant="rectangular"
          height={260}
        />
      </Grid>
      <Grid item xs={12} sm={8.5} style={{ padding: '20px 20px' }}>
        <div className={styles.skeletonUser}>
          <Skeleton variant="circular" width={40} height={40} style={{ marginRight: 10 }} />
          <div className={styles.skeletonUserDetails}>
            <Skeleton variant="text" width={60} height={20} />
            <Skeleton variant="text" width={100} height={15} />
          </div>
        </div>
        <div className={styles.skeletonInfo}>
          <Skeleton variant="text" width="100%" height={45} />
          <Skeleton variant="text" width="100%" height={45} />
          <Skeleton variant="text" width="100%" height={45} />
          <div className={styles.skeletonTags}>
            <Skeleton variant="text" width={40} height={30} />
            <Skeleton variant="text" width={40} height={30} />
            <Skeleton variant="text" width={40} height={30} />
          </div>
        </div>
      </Grid>
      {isFullPost && (
        <Grid item xs={12}>
          <div style={{ margin: '20px' }}>
            <Skeleton variant="text" width="100%" height={45} />
            <Skeleton variant="text" width="100%" height={45} />
            <Skeleton variant="text" width="100%" height={45} />
            <Skeleton variant="text" width="100%" height={45} />
          </div>
        </Grid>
      )}
    </Grid>
  );
};
