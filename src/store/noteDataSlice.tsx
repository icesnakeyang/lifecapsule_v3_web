import { createSlice } from "@reduxjs/toolkit";
export const noteDataSlice = createSlice({
  name: "noteData",
  initialState: {
    note_content: "",
    categoryList: [],
    totalNote: 0,
    currentCategoryId: "",
    notePageIndex: 1,
    notePageSize: 10,
    noteList: [],
  },
  reducers: {
    saveNote: (state: any, action: any) => {
      state.note_content = action.payload;
    },
    clearNote: (state: any) => {
      state.note_content = "";
      state.categoryList = [];
      state.currentCategoryId = "";
    },
    saveNoteCategoryList: (state: any, action: any) => {
      state.categoryList = action.payload;
    },
    saveTotalNote: (state: any, action: any) => {
      state.totalNote = action.payload;
    },
    saveNoteCategoryCurrent: (state: any, action: any) => {
      state.currentCategoryId = action.payload;
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
      state.note_content = "";
      state.categoryList = [];
      state.totalNote = 0;
      state.currentCategoryId = "";
      state.notePageIndex = 1;
      state.notePageSize = 10;
      state.noteList = [];
    },
  },
});

export const {
  saveNote,
  clearNote,
  saveNoteCategoryList,
  saveNoteCategoryCurrent,
  saveTotalNote,
  saveNotePageIndex,
  saveNotePageSize,
  saveNoteList,
  clearNoteState,
} = noteDataSlice.actions;
export default noteDataSlice.reducer;
