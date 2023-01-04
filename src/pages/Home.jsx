import React, { useContext } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styles from './home.module.scss';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { fetchSearch, fetchCategory, fetchPostsByTags, fetchTags } from '../redux/slices/posts';
import MultiLingualContent, { ColorModeContext, LanguageContext } from '../hooks/context';
import { Box } from '@mui/material';
import { selectIsAuth } from '../redux/slices/auth';

export const Home = () => {
  const dispatch = useDispatch();
  const { posts, tags } = useSelector((state) => state.posts);
  const userData = useSelector((state) => state.auth.data);
  const [categories, setCategories] = React.useState('New');
  const { tagsId, query } = useParams();
  const { mode } = useContext(ColorModeContext);
  const { getLocaleLanguage, language } = useContext(LanguageContext);
  const isAuth = useSelector(selectIsAuth);

  const catEn = ['New', 'Popular', 'Games', 'Cinema', 'Books'];
  const catRu = ['Новое', 'Популярное', 'Игры', 'Фильмы', 'Книги'];

  React.useEffect(() => {
    if (!query && !tagsId) {
      dispatch(fetchCategory(categories));
      dispatch(fetchTags(categories));
    } else if (query) {
      dispatch(fetchSearch(query));
    } else if (tagsId) {
      dispatch(fetchPostsByTags(tagsId));
    }
  }, [categories, tagsId, query]);

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';

  console.log(posts)


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
                  onClick={() => setCategories(catEn[id])}
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
      <Grid container spacing={{xs: 0, lg: 4}}>
        <Grid xs={12} md={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((el, index) =>
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
                    ? el.rate.map((el) => Number(el.rate)).reduce((a, b) => a + b) / el.rate.length
                    : 'Нет оценок'
                }
              />
            ),
          )}
        </Grid>
        <Grid className={styles.tags_block} xs={3} lg={4} item>
          {!tagsId && !query && <TagsBlock  items={tags.items} isLoading={isTagsLoading} />}
        </Grid>
      </Grid>
    </>
  );
};
