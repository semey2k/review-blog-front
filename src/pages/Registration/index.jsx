import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegister, fetchUpdateUser, selectIsAuth } from '../../redux/slices/auth';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import MultiLingualContent from '../../hooks/context';
import CloseIcon from '@mui/icons-material/Close';
import styles from './Login.module.scss';
import { IconButton } from '@mui/material';
import axios from '../../axios';
import { Image, Transformation } from 'cloudinary-react';

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [avatarUrl, setAvatarUrl] = React.useState('');
  const [publicId, setPublicId] = React.useState();
  const [fullName, setFullName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');
  const navigate = useNavigate();

  console.log(avatarUrl);

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

  console.log(avatarUrl);

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

    console.log(data)
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
            <Avatar sx={{ width: 100, height: 100 }} />
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

      <TextField
        color="outlined"
        className={styles.field}
        label={<MultiLingualContent contentID={'fullName'}></MultiLingualContent>}
        fullWidth
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <TextField
        color="outlined"
        className={styles.field}
        label="E-Mail"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        fullWidth
      />
      {!isEditing && (
        <TextField
          color="outlined"
          onChange={(e) => setPassword(e.target.value)}
          className={styles.field}
          label={<MultiLingualContent contentID={'password'}></MultiLingualContent>}
          fullWidth
          value={password}
        />
      )}
      <Button onClick={onSubmit} type="submit" size="large" variant="contained" fullWidth>
        {id ?<MultiLingualContent contentID={'save'}></MultiLingualContent>: <MultiLingualContent contentID={'signUp'}></MultiLingualContent>}
      </Button>
    </Paper>
  );
};
