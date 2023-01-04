import {createSlice , createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios'

export const fetchRemoveUsers = createAsyncThunk('users/fetchRemoveUsers', async(id) => {
    const {data} = await axios.delete(`/users/${id}`)
})

export const fetchUsers = createAsyncThunk('auth/fetchUsers', async() => {
    const {data} = await axios.get('/users');
    return data;
})

export const fetchStatusAdmin = createAsyncThunk('block/fetchStatusAdmin', async(id) => {
    const {data} = await axios.patch(`/statusAdmin/${id}`)

    return data;
})

export const fetchStatusUser = createAsyncThunk('unblock/fetchStatusUser', async(id) => {
    const {data} = await axios.patch(`/statusUser/${id}`)

    return data;
})


const initialState = {
    users: {
        items: [],
        status: 'loading'
    }
}

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchUsers.pending]: (state)=>{
            state.users.items = []
            state.users.status = 'loading'
        },
        [fetchUsers.fulfilled]: (state,action)=>{
            state.users.items = action.payload
            state.users.status = 'loaded'
        },
        [fetchUsers.rejected]: (state)=>{
            state.users.items = []
            state.users.status = 'error'
        },
        [fetchRemoveUsers.pending]: (state, action)=>{
            state.users.items = state.users.items.filter(obj => obj._id !== action.meta.arg);
        },
        [fetchStatusAdmin.pending]: (state)=>{
            state.users.items = []
            state.users.status = 'loading'
        },
        [fetchStatusAdmin.fulfilled]: (state,action)=>{
            state.users.items = action.payload
            state.users.status = 'loaded'
        },
        [fetchStatusUser.pending]: (state)=>{
            state.users.items = []
            state.users.status = 'loading'
        },
        [fetchStatusUser.fulfilled]: (state,action)=>{
            state.users.items = action.payload
            state.users.status = 'loaded'
        },

    }
})

export const usersReducer = usersSlice.reducer;