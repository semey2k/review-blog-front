import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios'

export const fetchTags = createAsyncThunk('posts/fetchTags', async(cat)=>{
    const {data} = await axios.get(`/tags/${cat}`);
    return data;
})

export const fetchProfilePosts = createAsyncThunk('posts/fetchProfilePosts', async(userId)=>{
    const {data} = await axios.get(`/profile/${userId}`);
    return data;
})

export const fetchPostsByTags = createAsyncThunk('posts/fetchPostsByTags', async(tagsId)=>{
    const {data} = await axios.get(`/posts/tags/${tagsId}`);
    return data;
})

export const fetchCategory = createAsyncThunk('posts/fetchCategory', async(el)=>{
    const {data} = await axios.get(`/posts/categories/${el.categories}?skip=${el.skip}`);
    return data;
})

export const fetchSearch = createAsyncThunk('posts/fetchSearch', async(query)=>{
    const {data} = await axios.get(`/posts/search/${query}`);
    return data;
})

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async(id)=>{
    await axios.delete(`/posts/${id}`);
})
const initialState = {
    posts: {
        items:[],
        status: 'loading',
    },
    tags:{
        items: [],
        status: 'loading',
    },

}

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers:{

        [fetchTags.pending]: (state) => {
            state.tags.status = 'loading';
            state.tags.items = [];
        },
        [fetchTags.fulfilled]: (state,action) => {
            state.tags.status = 'loaded';
            state.tags.items = action.payload;
        },
        [fetchTags.rejected]: (state) => {
            state.tags.status = 'error';
            state.tags.items = [];
        },

        [fetchRemovePost.pending]: (state,action) => {
            state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg)
        },
        
        [fetchCategory.pending]: (state) => {
            state.posts.status = 'loading';
            state.posts.items = [];
        },
        [fetchCategory.fulfilled]: (state,action) => {
            state.posts.status = 'loaded';
            state.posts.items = action.payload;
        },
        [fetchCategory.rejected]: (state) => {
            state.posts.status = 'error';
            state.posts.items = [];
        },
        
        [fetchProfilePosts.pending]: (state) => {
            state.posts.status = 'loading';
            state.posts.items = [];
        },
        [fetchProfilePosts.fulfilled]: (state,action) => {
            state.posts.status = 'loaded';
            state.posts.items = action.payload;
        },
        [fetchProfilePosts.rejected]: (state) => {
            state.posts.status = 'error';
            state.posts.items = [];
        },

        [fetchSearch.pending]: (state) => {
            state.posts.status = 'loading';
            state.posts.items = [];
        },
        [fetchSearch.fulfilled]: (state,action) => {
            state.posts.status = 'loaded';
            state.posts.items = action.payload;
        },
        [fetchSearch.rejected]: (state) => {
            state.posts.status = 'error';
            state.posts.items = [];
        },

        [fetchPostsByTags.pending]: (state) => {
            state.posts.status = 'loading';
            state.posts.items = [];
        },
        [fetchPostsByTags.fulfilled]: (state,action) => {
            state.posts.status = 'loaded';
            state.posts.items = action.payload;
        },
        [fetchPostsByTags.rejected]: (state) => {
            state.posts.status = 'error';
            state.posts.items = [];
        },
    },
});

export const postsReducer = postSlice.reducer;