import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export const tagSlice = createSlice({
    name: "tagSlice",
    initialState: {
        //笔记当前保存的标签
        noteTags: [],
        //推荐的标签
        hotTags: [],
        //当前正在编辑的标签
        editTags: []
    },
    reducers: {
        saveEditTags: (state: any, action: any) => {
            state.editTags = action.payload;
        },
        clearAllTags: (state: any) => {
            state.noteTags = [];
            state.hotTags = [];
            state.editTags = [];
        },
    },
});

export const {
    saveEditTags,
    clearAllTags,
} = tagSlice.actions;

export default tagSlice.reducer;
