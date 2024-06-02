import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    isAuth: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuth = true;
    },
    logout: (state, action) => {
      state.user = {};
      state.isAuth = false;
    },
  },
});

export const { setUser, logout } = filterSlice.actions;
export default filterSlice.reducer;
