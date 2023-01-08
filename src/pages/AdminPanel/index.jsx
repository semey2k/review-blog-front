import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { Link  } from 'react-router-dom';
import Button from '@mui/material/Button';
import styles from './AdminPanel.module.scss';
import {Stack } from '@mui/material';
import {
  fetchRemoveUsers,
  fetchStatusAdmin,
  fetchStatusUser,
  fetchUsers,
} from '../../redux/slices/users';
import MultiLingualContent, { ColorModeContext } from '../../hooks/context';

const columns = [
  {
    field: 'fullName',
    headerName: <MultiLingualContent contentID={'fullName'}></MultiLingualContent>,
    width: 130,
  },
  { field: 'email', headerName: 'Email', width: 170 },
  {
    field: 'status',
    headerName: <MultiLingualContent contentID={'status'}></MultiLingualContent>,
    width: 130,
  },
  {
    field: '_id',
    headerName: <MultiLingualContent contentID={'usersProfile'}></MultiLingualContent>,
    width: 200,
    renderCell: (params) => (
      <Button variant="outlined" color="primary">
        <Link style={{ textDecoration: 'none', color: '#4361ee' }} to={`/profile/${params.value}`}>
          <MultiLingualContent contentID={'goToProfile'}></MultiLingualContent>
        </Link>
      </Button>
    ),
  },
];

export const AdminPanel = () => {
  const dispatch = useDispatch();
  const [data, setData] = React.useState([]);
  const userId = useSelector((action) => action.auth.data);
  const { posts } = useSelector((state) => state.posts);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const users = useSelector((state) => state.user.users);
  const {mode} = React.useContext(ColorModeContext)

  React.useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  const onClickRemove = () => {
    if (window.confirm('Вы действительно хотите удалить пользователя?')) {
      selectedRows.forEach((el) => dispatch(fetchRemoveUsers(el)));
    }
  };

  const onClickAdmin = () => {
    if (window.confirm('Вы действительно хотите заблокировать пользователя?')) {
      selectedRows.forEach((el) => dispatch(fetchStatusAdmin(el)));
    }
  };

  const onClickUser = () => {
    if (window.confirm('Вы действительно хотите удалить пользователя?')) {
      selectedRows.forEach((el) => dispatch(fetchStatusUser(el)));
    }
  };
  const isUsersLoading = users?.status === 'loading';

  return (
    <div style={{ height: 400, width: '100%' }}>
      <div className={styles.btns}>
        <Button onClick={onClickRemove} variant="outlined" color="error">
          {selectedRows.length > 1 ? (
            <MultiLingualContent contentID={'deleteUsers'}></MultiLingualContent>
          ) : (
            <MultiLingualContent contentID={'deleteUser'}></MultiLingualContent>
          )}
        </Button>
        <Button onClick={onClickAdmin} variant="outlined" color="outlined">
        <MultiLingualContent contentID={'setStatusAdmin'}></MultiLingualContent>
        </Button>
        <Button onClick={onClickUser} variant="outlined" color="outlined">
        <MultiLingualContent contentID={'setStatusUser'}></MultiLingualContent>
        </Button>
      </div>

      <DataGrid
        rows={users?.items}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        sx={{
          '& .MuiDataGrid-checkboxInput': {
            color: mode === 'dark' && '#fff!important'
          },
        }}
        loading={isUsersLoading}
        getRowId={(row) => row._id}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              У вас нет созданных постов
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
