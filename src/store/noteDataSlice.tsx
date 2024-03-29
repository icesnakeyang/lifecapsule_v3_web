import {createSlice} from "@reduxjs/toolkit";

export const noteDataSlice = createSlice({
    name: "noteData",
    initialState: {
        totalNote: 0,
        notePageIndex: 1,
        notePageSize: 10,
        noteList: [],
        tagList: [],
        noteListTags: [],
        noteId: null,
        noteListSearchKey: null
    },
    reducers: {
        saveTotalNote: (state: any, action: any) => {
            state.totalNote = action.payload;
        },
        saveNotePageIndex: (state: any, action: any) => {
            state.notePageIndex = action.payload;
        },
        saveNotePageSize: (state: any, action: any) => {
            state.notePageSize = action.payload;
        },
        saveNoteList: (state: any, action: any) => {
            state.noteList = action.payload;
        },
        clearNoteState: (state: any) => {
            state.totalNote = 0;
            state.notePageIndex = 1;
            state.notePageSize = 10;
            state.noteList = [];
            state.noteId = null
            state.tagList = []
            state.noteListTags = []
        },
        saveTagList: (state: any, action: any) => {
            state.tagList = action.payload
        },
        saveNoteListTags: (state: any, action: any) => {
            state.noteListTags = action.payload
        },
        saveNoteId: (state: any, action: any) => {
            state.noteId = action.payload
        },
        saveNoteListSearchKey: (state: any, action: any) => {
            state.noteListSearchKey = action.payload
        },
        clearNoteListSearchKey: (state: any) => {
            state.noteListSearchKey = null
        }
    },
});

export const {
    saveTotalNote,
    saveNotePageIndex,
    saveNotePageSize,
    saveNoteList,
    clearNoteState,
    saveTagList,
    saveNoteListTags,
    saveNoteId,
    clearNoteListSearchKey,
    saveNoteListSearchKey
} = noteDataSlice.actions;
export default noteDataSlice.reducer;
