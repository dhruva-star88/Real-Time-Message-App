import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name:"user",
    initialState:{
        selectedUser: null
    },
    reducers:{
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        }
    }
})

// Action
export const { setSelectedUser } = userSlice.actions;

export default userSlice.reducer;