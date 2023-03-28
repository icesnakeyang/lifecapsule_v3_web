import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export const commonSlice = createSlice({
    name: "common",
    initialState: {
        editing: 0,
        tempId: -1,
        refresh: 0,
        language: 'en',
        doNotLoadTodoTask: false
    },
    reducers: {
        saveEditing: (state: any, action: PayloadAction<number>) => {
            state.editing = action.payload;
        },
        saveTempId: (state: any, action: any) => {
            state.tempId = action.payload;
        },
        loadRefresh: (state: any) => {
            state.refresh += 1;
        },
        clearRefresh: (state: any) => {
            state.refresh = 0;
        },
        clearCommonState: (state: any) => {
            state.editing = 0;
            state.loadData = false;
            state.tempId = -1;
            state.refresh = 0;
        },
        saveLanguage: (state: any, action: any) => {
            state.language = action.payload
        },
        saveDoNotLoadToDoTask: (state: any, action: any) => {
            state.doNotLoadTodoTask = action.payload
        }
    },
});

export const {
    saveEditing,
    loadRefresh,
    clearRefresh,
    saveLanguage,
    clearCommonState,
    saveDoNotLoadToDoTask
} = commonSlice.actions;

export default commonSlice.reducer;
