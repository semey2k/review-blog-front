import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import styles from './Login.module.scss';
import { fetchAuth, fetchAuthGoogle, fetchAuthMe, selectIsAuth } from '../../redux/slices/auth';
import MultiLingualContent, { ColorModeContext } from '../../hooks/context';
import { LoginSocialGoogle, LoginSocialFacebook } from 'reactjs-social-login';

import { FacebookLoginButton, GoogleLoginButton } from 'react-social-login-buttons';

export const Login = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const {mode} = React.useContext(ColorModeContext)

  const loginSocials = async (data) => {
    const value = {
      email: data.email,
      avatarUrl: data.picture.data ? data.picture.data.url : data.picture,
      fullName: data.name,
    };
    const { payload } = await dispatch(fetchAuthGoogle(value));

    if (!payload) {
      return alert('Не удалось авторизоваться');
    }
    if ('token' in payload) {
      window.localStorage.setItem('token', payload.token);
    } else {
      alert('Не удалось авторизоваться');
    }
    dispatch(fetchAuthMe());
  };

  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values));

    if (!data.payload) {
      return alert('Не удалось авторизоваться');
    }

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    } else {
      alert('Не удалось авторизоваться');
    }
    dispatch(fetchAuthMe());
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        <MultiLingualContent contentID={'signInTitle'}></MultiLingualContent>
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          color="outlined"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', { required: 'Укажите почту' })}
          fullWidth
        />
        <TextField
          className={styles.field}
          error={Boolean(errors.password?.message)}
          color="outlined"
          helperText={errors.password?.message}
          type="password"
          {...register('password', { required: 'Укажите пароль' })}
          label={<MultiLingualContent contentID={'password'}></MultiLingualContent>}
          fullWidth
        />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          <MultiLingualContent contentID={'signIn'}></MultiLingualContent>
        </Button>
      </form>
      <p className={styles.divider} style={{borderBottom: mode === 'dark' ? '1px solid #fff' : '1px solid rgba(0, 0, 0, 0.12)'}}><span style={{backgroundColor: mode === 'dark' ? '#001e3c' : '#fff'}}>Or</span></p>
      <LoginSocialFacebook
        appId={process.env.REACT_APP_APP_ID || ''}
        onResolve={({ response, data }) => {
          loginSocials(data);
        }}
        onReject={(err) => {
          console.log(err);
        }}>
        <FacebookLoginButton style={{width: '100%', margin: '10px 0'}} />
      </LoginSocialFacebook>
      <LoginSocialGoogle
        client_id={process.env.REACT_APP_CLIENT_ID}
        onResolve={({ response, data }) => {
          loginSocials(data);
        }}
        onReject={(err) => {
          console.log(err);
        }}>
        <GoogleLoginButton style={{width: '100%', margin: '10px 0'}} />
      </LoginSocialGoogle>
    </Paper>
  );
};
