import React from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { fetchRegister, selectIsAuth } from '../../redux/slices/auth';
import MultiLingualContent from '../../hooks/context';
import axios from '../../axios';

import { Image, Transformation } from 'cloudinary-react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

import styles from './Login.module.scss';

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [avatarUrl, setAvatarUrl] = React.useState('')
  const [fullName, setFullName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onSubmit',
  });

  function handleRemoving(imgObj) {
    axios
      .delete(`/${avatarUrl}`)
      .then(() => {
        setAvatarUrl('');
      })
      .catch((e) => console.log(e));
  }

  function handleOpenWidget() {
    var myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dw0rsewtk',
        uploadPreset: 'y13jvujf',
        sources: ['local'],
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          setAvatarUrl(result.info.public_id);
        }
      },
    );
    myWidget.open();
  }

  const isEditing = Boolean(id);

  const onSubmit = async () => {
    const values = {
      fullName,
      avatarUrl,
      password,
      email,
    };

    if (isEditing) {
      const { data } = await axios.patch(`/register/${id}`, values);

      if (!data) {
        return alert('Не удалось авторизоваться');
      }

      if ('token' in data) {
        window.localStorage.setItem('token', data.token);
      } else {
        alert('Не удалось авторизоваться');
      }
      return navigate('/');
    }
    const data = await dispatch(fetchRegister(values));

    if (!data.payload) {
      return alert('Не удалось авторизоваться');
    }
    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    } else {
      alert('Не удалось авторизоваться');
    }
    navigate('/');
  };

  React.useEffect(() => {
    if (id) {
      axios.get(`/auth/me`).then(({ data }) => {
        setFullName(data.fullName);
        setEmail(data.email);
        setAvatarUrl(data.avatarUrl ? data.avatarUrl : avatarUrl);
        setPassword(data.password);
      });
    }
  }, []);

  if (isAuth && !id) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        <MultiLingualContent contentID={'signUpTitle'}></MultiLingualContent>
      </Typography>
      <div style={{ position: 'relative' }} className={styles.avatar}>
        <button
          style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
          onClick={() => handleOpenWidget()}>
          {!avatarUrl ? (
            <Avatar sx={{ width: 100, height: 100, color: 'white' }} />
          ) : (
            <Image
              style={{ width: '100px', height: '100px', borderRadius: '100%' }}
              cloudName="dw0rsewtk"
              publicId={avatarUrl}>
              <Transformation radius="max" width="100" height="100" crop="fill" />
            </Image>
          )}
        </button>
        {avatarUrl && (
          <IconButton
            onClick={() => handleRemoving()}
            style={{
              position: 'absolute',
              top: '0',
              right: '85px',
              width: '20px',
              height: '20px',
            }}>
            <CloseIcon />
          </IconButton>
        )}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          color="outlined"
          className={styles.field}
          label={<MultiLingualContent contentID={'fullName'}></MultiLingualContent>}
          fullWidth
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register('fullName', {
            required: <MultiLingualContent contentID={'validFullName'}></MultiLingualContent>,
          })}
          onChange={(e) => setFullName(e.target.value)}
          value={fullName}
        />
        <TextField
          color="outlined"
          className={styles.field}
          label="E-Mail"
          type="email"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', { required: <MultiLingualContent contentID={'validEmail'}></MultiLingualContent> })}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          fullWidth
        />
        {!isEditing && (
          <TextField
            color="outlined"
            className={styles.field}
            error={Boolean(errors.password?.message)}
            helperText={errors.password?.message}
            {...register('password', { required: <MultiLingualContent contentID={'validPassword'}></MultiLingualContent> })}
            label={<MultiLingualContent contentID={'password'}></MultiLingualContent>}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            fullWidth
          />
        )}
        <Button onClick={onSubmit} type="submit" size="large" variant="contained" fullWidth>
          {id ? (
            <MultiLingualContent contentID={'save'}></MultiLingualContent>
          ) : (
            <MultiLingualContent contentID={'signUp'}></MultiLingualContent>
          )}
        </Button>
      </form>
    </Paper>
  );
};
