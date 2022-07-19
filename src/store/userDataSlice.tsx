import { createSlice } from "@reduxjs/toolkit";
export const userDataSlice = createSlice({
  name: "userData",
  initialState: {
    token: "",
    userInfo: {},
  },
  reducers: {
    saveToken: (state: any, action: any) => {
      state.token = action.payload;
    },
    saveUserInfo: (state: any, action: any) => {
      state.userInfo = action.payload;
    },
    clearUserInfo: (state: any) => {
      state.userInfo = {};
    },
  },
});

export const { saveToken, saveUserInfo, clearUserInfo } = userDataSlice.actions;
export default userDataSlice.reducer;
