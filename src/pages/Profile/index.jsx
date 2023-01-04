import * as React from 'react';

import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
// import {
//   fetchRemoveUsers,
//   fetchBlockUsers,
//   fetchUsers,
//   fetchUnblockUsers,
// } from '../../redux/slices/user';
// import { selectIsAuth, authMe, logout } from '../../redux/slices/auth';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import Button from '@mui/material/Button';

import styles from './Profile.module.scss';
import { fetchProfilePosts, fetchRemovePost } from '../../redux/slices/posts';
import { Checkbox, Paper, Stack, Typography } from '@mui/material';
import MultiLingualContent, { ColorModeContext } from '../../hooks/context';
import { useContext } from 'react';

const columns = [
  {
    field: 'title',
    headerName: <MultiLingualContent contentID={'title'}></MultiLingualContent>,
    width: 130,
  },
  {
    field: 'tags',
    headerName: <MultiLingualContent contentID={'tags'}></MultiLingualContent>,
    width: 130,
  },
  {
    field: 'userRating',
    headerName: <MultiLingualContent contentID={'authorRating'}></MultiLingualContent>,
    width: 130,
  },
  {
    field: 'likes',
    headerName: <MultiLingualContent contentID={'likes'}></MultiLingualContent>,
    width: 130,
    renderCell: (params) => <p>{params.value.length}</p>,
  },
  {
    field: '_id',
    headerName: <MultiLingualContent contentID={'links'}></MultiLingualContent>,
    width: 130,
    renderCell: (params) => (
      <Button variant="outlined" color="outlined">
        <Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/posts/${params.value}`}>
          Go to Post
        </Link>
      </Button>
    ),
  },
  {
    field: <MultiLingualContent contentID={'edit'}></MultiLingualContent>,
    width: 150,
    renderCell: (cellValues) => {
      return (
        <Button variant="contained" color="primary">
          <Link
            style={{ textDecoration: 'none', color: '#fff' }}
            to={`/posts/${cellValues.id}/edit`}>
            <MultiLingualContent contentID={'edit'}></MultiLingualContent>
          </Link>
        </Button>
      );
    },
  },
];

export const Profile = () => {
  const dispatch = useDispatch();
  //   const { posts } = useSelector((state) => state.posts);
  const { id } = useParams();
  const userId = useSelector((action) => action.auth.data);
  const { posts } = useSelector((state) => state.posts);
  const [selectedRows, setSelectedRows] = React.useState([]);

  const {mode} = useContext(ColorModeContext)

  //   const isAuth = useSelector(selectIsAuth);
  //   const isAuthMe = useSelector(authMe);

  const isPostsLoading = posts.status === 'loading';
  React.useEffect(() => {
    if (userId) {
      !id ? dispatch(fetchProfilePosts(userId?._id)) : dispatch(fetchProfilePosts(id));
    }
  }, [userId, id]);

  const onClickRemove = () => {
    if (window.confirm('Вы действительно хотите удалить пользователя?')) {
      selectedRows.forEach((el) => dispatch(fetchRemovePost(el)));
    }
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <div className={styles.btns}>
        <Link
          style={{ textDecoration: 'none', marginRight: '10px' }}
          to={id ? `/add-post/${id}` : '/add-post'}>
          <Button variant="contained">
            <MultiLingualContent contentID={'write'}></MultiLingualContent>
          </Button>
        </Link>
        <Button onClick={onClickRemove} variant="outlined" color="error">
          {selectedRows.length > 1 ? (
            <MultiLingualContent contentID={'deleteMultiple'}></MultiLingualContent>
          ) : (
            <MultiLingualContent contentID={'delete'}></MultiLingualContent>
          )}
        </Button>
      </div>

      <DataGrid
        rows={posts.items}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        loading={isPostsLoading}
        sx={{
          '& .MuiDataGrid-checkboxInput': {
            color: mode === 'dark' && '#fff!important'
          },
        }}
        checkboxSelection
        getRowId={(row) => row._id}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              <MultiLingualContent contentID={'noRows'}></MultiLingualContent>
            </Stack>
          ),
        }}
        onSelectionModelChange={(ids) => {
          setSelectedRows(ids);
        }}
      />
    </div>
  );
};
