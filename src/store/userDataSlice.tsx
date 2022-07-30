import { createSlice } from "@reduxjs/toolkit";
export const userDataSlice = createSlice({
  name: "userData",
  initialState: {
    token: "",
    userInfo: {},
    userName: "",
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
      state.userName = "";
    },
    saveUserName: (state: any, action: any) => {
      state.userName = action.payload;
    },
  },
});

export const { saveToken, saveUserInfo, clearUserInfo, saveUserName } =
  userDataSlice.actions;
export default userDataSlice.reducer;
