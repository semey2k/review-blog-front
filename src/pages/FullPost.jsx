import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import { Post } from '../components/Post';
import { Index } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';
import axios from '../axios';
import MultiLingualContent from '../hooks/context';

import Button from '@mui/material/Button';
import { Rating } from '@mui/material';

export const FullPost = () => {
  const [comments, setComments] = React.useState('');
  const [data, setData] = React.useState('');
  const [isLoading, setLoading] = React.useState(true);
  const { id } = useParams();
  const [rating, setRating] = React.useState(0);
  const [show, setShow] = React.useState(false);
  const userId = useSelector((state) => state.auth.data);

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/posts/${id}`);
      const comments = await axios.get(`/posts/${id}/showComments`);
      setComments(comments.data[0]);
      setData(response.data);
      setLoading(false);
    };
    fetchData();
  }, [rating, show]);

  React.useEffect(() => {
    const interval = setInterval(async () => {
      const response = await axios.get(`/posts/${id}/showComments`);
      setComments(response.data[0]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const showRating =
    data && userId ? data.rate?.map((el) => el.user).some((el) => el === userId._id) : true;
  const showLike =
    data && userId ? data.likes?.map((el) => el.user).some((el) => el === userId._id) : true;
  const avgRating =
    data.rate?.map((el) => el.rate).length > 0
      ? data.rate.map((el) => Number(el.rate)).reduce((a, b) => a + b) / data.rate.length
      : 'Нет оценок';


  const handleRate = async () => {
    if (window.confirm('Вы уверены в своей оценке?')) {
      try {
        const fields = {
          rating,
        };
        const { data } = await axios.patch(`/rating/${id}`, fields);
        setRating('');
      } catch (err) {
        console.warn(err);
        alert('Ошибка при создании статьи');
      }
    }
  };

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      {data && (
        <Post
          _id={data._id}
          title={data.title}
          imageUrl={data.imageUrl ? `${data.imageUrl}` : ''}
          user={data.user}
          createdAt={data.createdAt}
          likes={data.likes?.length}
          commentsCount={comments ? comments.length : data.comments?.length}
          tags={data.tags}
          nameOfArt={data.art}
          setShow={(el) => setShow(el)}
          isEditable
          authorRating={data.userRating}
          show={show}
          userRating={avgRating}
          showLike={showLike}
          isFullPost
          isLoading={isLoading}>
          <ReactMarkdown children={data.text} />
        </Post>
      )}
      {!showRating && (
        <div style={{ display: 'block', marginLeft: '15px' }}>
          <h3 style={{ margin: '0', marginBottom: '10px' }}>
            <MultiLingualContent contentID={'rateReview'}></MultiLingualContent>
          </h3>
          <Rating
            name="simple-controlled"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
          <Button
            onClick={handleRate}
            sx={{ mt: 2, mb: 2, width: '100px', display: 'block' }}
            size="small"
            variant="contained">
            <MultiLingualContent contentID={'rate'}></MultiLingualContent>
          </Button>
        </div>
      )}

      <CommentsBlock items={comments ? comments : data.comments} isLoading={isLoading}>
        <Index />
      </CommentsBlock>
    </>
  );
};
