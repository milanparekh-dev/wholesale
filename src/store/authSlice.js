// store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  membership_level: "wholesale", // default fallback
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      state.membership_level = action.payload?.membership_level || "wholesale";
    },
    register(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
      state.membership_level = "wholesale";
    },
  },
});

export const { login, register, logout } = authSlice.actions;
export default authSlice.reducer;
