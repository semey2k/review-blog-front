import React, { useContext } from 'react';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { Link } from 'react-router-dom';
import styles from './Post.module.scss';
import { UserInfo } from '../UserInfo';
import { PostSkeleton } from './Skeleton';
import PsychologyIcon from '@mui/icons-material/Psychology';
import GroupsIcon from '@mui/icons-material/Groups';
import Divider from '@mui/material/Divider';
import MultiLingualContent, { ColorModeContext } from '../../hooks/context';
import { Box, Grid, Rating, Tooltip, Typography } from '@mui/material';
import Favorite from '@mui/icons-material/Favorite';
import { FullPostContent } from '../FullPostContent';
import { Image, Transformation } from 'cloudinary-react';

export const Post = ({
  _id,
  title,
  createdAt,
  imageUrl,
  user,
  likes,
  commentsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  show,
  setShow,
  showLike,
  authorRating,
  userRating,
  nameOfArt,
}) => {
  const { mode } = React.useContext(ColorModeContext);

  if (isLoading) {
    return <PostSkeleton isFullPost={isFullPost} />;
  }

  return (
    <div
      style={{
        backgroundColor: mode === 'dark' ? '#001e3c' : 'white',
        backgroundImage:
          mode === 'dark'
            ? 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
            : 'none',
      }}
      className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      <Grid container spacing={0}>
        {imageUrl && (
          <Grid
            item
            xs={12}
            sm={isFullPost ? 5 : 3.5}
            md={isFullPost ? 4 : false}
            lg={isFullPost ? 3.5 : false}
            className={clsx(styles.img, { [styles.imgFull]: isFullPost })}>
            <Image
              className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
              cloudName="dw0rsewtk"
              publicId={imageUrl}>
              <Transformation
                width={isFullPost ? '300' : '180'}
                height={isFullPost ? '410' : '260'}
                crop="fill"
              />
            </Image>
          </Grid>
        )}
        <Grid
          item
          xs={12}
          sm={isFullPost ? 7 : 8.5}
          md={isFullPost ? 8 : false}
          lg={isFullPost ? 8.5 : false}
          className={styles.wrapper}>
          <Box>
            <UserInfo {...user} additionalText={createdAt} />
            <div className={styles.rating}>
              <Typography
                style={{
                  marginRight: '10px',
                  color: mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.5)',
                }}>
                <MultiLingualContent contentID={'ratingTitle'}></MultiLingualContent>:
              </Typography>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: '20px',
                }}>
                <Tooltip
                  style={{
                    marginBottom: '5px',
                    marginRight: '5px',
                    color: mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.5)',
                  }}
                  title="Author Rating">
                  <PsychologyIcon color="disabled" />
                </Tooltip>

                <Typography style={{ color: mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.5)' }}>
                  {authorRating}/10
                </Typography>
              </div>
              <Divider
                orientation="vertical"
                flexItem
                variant="middle"
                sx={{ mr: 2, height: '30px', mt: 1.5 }}
                className={styles.divider}
              />
              <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                <Tooltip
                  style={{
                    marginBottom: '2px',
                    marginRight: '10px',
                    color: mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.5)',
                  }}
                  title="Users Rating">
                  <GroupsIcon color="disabled" />
                </Tooltip>
                {userRating && (
                  <Rating
                    name="simple-controlled"
                    value={userRating > 0 ? +userRating.toFixed(1) : 0}
                    readOnly
                    precision={0.5}
                    className={styles.star_rating}
                  />
                )}
              </div>
            </div>
          </Box>
          <div className={styles.indention}>
            <div>
              <Typography
                variant="h2"
                className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
                {title}
              </Typography>
              <Typography
                className={clsx(styles.subtitle, { [styles.subtitleFull]: isFullPost })}
                variant="h5">
                <span style={{ fontWeight: 'bold' }}>
                  <MultiLingualContent contentID={'nameOfArt'}></MultiLingualContent>
                </span>
                {nameOfArt}
              </Typography>
              <ul id={styles.tags}>
                {tags.map((tag, index) => (
                  <li key={index} className={styles.tag}>
                    <p>#{tag}</p>
                  </li>
                ))}
              </ul>
            </div>
            {!isFullPost && (
              <ul className={styles.postDetails}>
                <li>
                  <IconButton
                    style={{ color: mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.5)' }}
                    sx={{ p: 0, mr: 2 }}
                    disabled>
                    <Favorite style={{ opacity: mode === 'dark' ? '1' : '0.5' }} />
                    <Typography style={{ opacity: mode === 'dark' ? '1' : '0.5' }}>
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
                <li>
                  <Link
                    style={{
                      color: mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.5)',
                      marginRight: '10px',
                    }}
                    to={`/posts/${_id}`}>
                    <MultiLingualContent contentID={'more'}></MultiLingualContent>
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </Grid>
      </Grid>
      {children && (
        <FullPostContent
          children={children}
          id={_id}
          commentsCount={commentsCount}
          likes={likes}
          show={show}
          showLike={showLike}
          setShow={setShow}
        />
      )}
    </div>
  );
};
