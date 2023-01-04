import {configureStore} from '@reduxjs/toolkit';
import { authReducer } from './slices/auth';
import { postsReducer } from './slices/posts';
import { usersReducer } from './slices/users';

const store = configureStore({
    reducer: {
        posts: postsReducer,
        auth: authReducer,
        user: usersReducer,
    },
});

export default store;