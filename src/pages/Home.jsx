import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { fetchSearch, fetchCategory, fetchPostsByTags, fetchTags } from '../redux/slices/posts';
import { ColorModeContext, LanguageContext } from '../hooks/context';

import { Box, Pagination } from '@mui/material';
import Grid from '@mui/material/Grid';
import styles from './home.module.scss';

export const Home = () => {
  const dispatch = useDispatch();
  const { posts, tags } = useSelector((state) => state.posts);
  const [categories, setCategories] = React.useState('New');
  const { tagsId, query } = useParams();
  const { mode } = useContext(ColorModeContext);
  const { getLocaleLanguage, language } = useContext(LanguageContext);
  const [skip, setSkip] = React.useState(1);

  const catEn = ['New', 'Popular', 'Games', 'Cinema', 'Books'];
  const catRu = ['Новое', 'Популярное', 'Игры', 'Фильмы', 'Книги'];

  const changeCategory = (id) => {
    setCategories(catEn[id]);
    setSkip(1);
  };

  React.useEffect(() => {
    if (!query && !tagsId) {
      dispatch(fetchCategory({ categories, skip }));
      dispatch(fetchTags(categories));
    } else if (query) {
      dispatch(fetchSearch({ query, skip }));
    } else if (tagsId) {
      dispatch(fetchPostsByTags({ tagsId, skip }));
    }
  }, [categories, tagsId, query, skip]);

  const handleChange = (event, value) => {
    setSkip(value);
  };

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';

  return (
    <>
      {!tagsId && !query && (
        <div
          className={styles.categories}
          style={{
            marginBottom: 60 /* backgroundColor: mode === 'dark' ? '#f9f9f9' :'#f9f9f9'  */,
          }}>
          <ul>
            {((getLocaleLanguage ? getLocaleLanguage : language) === 'en' ? catEn : catRu).map(
              (categoryName, id) => (
                <li
                  key={id}
                  onClick={() => changeCategory(id)}
                  // color='primary'
                  style={
                    catEn[id] === categories
                      ? {
                          backgroundColor: mode === 'dark' ? '#093868d2' : '#001e3c',
                          color: '#fff',
                          border: '1px solid #fff',
                        }
                      : { backgroundColor: mode === 'dark' ? '#0939684c' : '#f9f9f9' }
                  }>
                  {categoryName}
                </li>
              ),
            )}
          </ul>
        </div>
      )}
      {posts.items.posts?.length === 0 && !isPostsLoading ? (
        <Box
          sx={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}>
            <span style={{ fontSize: '44px' }}>&#128531;</span>
            <p style={{ textAlign: 'center', fontSize: '44px', margin: '0' }}>Ничего не найдено</p>
          </div>
        </Box>
      ) : (
        <Grid container spacing={{ xs: 0, lg: 4 }}>
          <Grid xs={12} md={8} item>
            {(isPostsLoading ? [...Array(5)] : posts.items.posts)?.map((el, index) =>
              isPostsLoading ? (
                <Post key={index} isLoading={true} />
              ) : (
                <Post
                  key={index}
                  _id={el._id}
                  title={el.title}
                  imageUrl={el.imageUrl ? `${el.imageUrl}` : ''}
                  user={el.user}
                  createdAt={el.createdAt}
                  likes={el.likes.length}
                  commentsCount={el.comments.length}
                  tags={el.tags}
                  isLoading={isPostsLoading}
                  authorRating={el.userRating}
                  nameOfArt={el.art}
                  userRating={
                    el.rate?.map((el) => el.rate).length > 0
                      ? el.rate.map((el) => Number(el.rate)).reduce((a, b) => a + b) /
                        el.rate.length
                      : 'Нет оценок'
                  }
                />
              ),
            )}
          </Grid>
          <Grid className={styles.tags_block} xs={3} lg={4} item>
            {!tagsId && !query && <TagsBlock items={tags.items} isLoading={isTagsLoading} />}
          </Grid>
        </Grid>
      )}
      {posts.items?.total > 1 && (posts.items?.posts.length >= 10 || skip > 1) && (
        <Pagination
          count={posts.items.total}
          page={skip}
          variant="outlined"
          shape="rounded"
          onChange={handleChange}
          sx={{ paddingBottom: '20px' }}
        />
      )}
    </>
  );
};
