import React from 'react';
import { useParams } from 'react-router-dom';

import styles from './AddComment.module.scss';
import axios from '../../axios';

import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { fetchAuthMe } from '../../redux/slices/auth';
import { useSelector } from 'react-redux';
import MultiLingualContent from '../../hooks/context';

export const Index = ({avatarUrl}) => {
  const { id } = useParams();
  const [text, setText] = React.useState('');

  const onChange = (e) => {
    setText(e.target.value);
  };

  const onSubmit = async () => {
    try {
      const fields = {
        text,
      };
      const { data } = await axios.patch(`/posts/${id}/comments`, fields)

      setText('')
    } catch (err) {
      console.warn(err);
      alert('Ошибка при создании статьи');
    }
  };

  return (
    <>
      <div className={styles.root}>
        <div className={styles.form}>
          <TextField
            label={<MultiLingualContent contentID={'commentsLabel'}></MultiLingualContent>}
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
            color='outlined'
            value={text}
            onChange={onChange}
          />
          <Button onClick={onSubmit} variant="contained"><MultiLingualContent contentID={'commentsBtn'}></MultiLingualContent></Button>
        </div>
      </div>
    </>
  );
};
