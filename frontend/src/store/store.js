import { configureStore } from '@reduxjs/toolkit';
import userSlice from './user/userSlice';

// Creating and Exporting the store
const store = configureStore({
    reducer:{
        user: userSlice,
    }
})

export default store;