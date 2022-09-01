import {createSlice} from "@reduxjs/toolkit";

export const userDataSlice = createSlice({
    name: "userData",
    initialState: {
        token: "",
        userName: "",
        nickname: null,
        timerPrimary: null,
        userStatus: "USER_GUEST",
        email: null
    },
    reducers: {
        saveUserData: (state: any, action: any) => {
            state.token = action.payload.token
            state.nickname = action.payload.nickname
            state.userStatus = action.payload.userStatus
            state.timerPrimary = action.payload.timerPrimary
        },
        clearUserData: (state: any) => {
            state.token = null;
            state.nickname = null;
            state.userStatus = null;
            state.timerPrimary = null;

        },
        saveTimerPrimary: (state: any, action: any) => {
            state.timerPrimary = action.payload
        },
        saveUserEmail: (state: any, action: any) => {
            state.email = action.payload
        },
        saveUserToken: (state: any, action: any) => {
            state.token = action.payload
        },
        saveNickname: (state: any, action: any) => {
            state.nickname = action.payload
        }
    },
});

export const {saveUserData, clearUserData, saveTimerPrimary, saveUserEmail, saveUserToken,saveNickname} =
    userDataSlice.actions;
export default userDataSlice.reducer;
