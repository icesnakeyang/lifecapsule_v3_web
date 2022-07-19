import { createSlice } from "@reduxjs/toolkit";
export const noteDataSlice = createSlice({
  name: "noteData",
  initialState: {
    note_content: "",
    categoryList: [],
    currentCategoryId: "",
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
    saveNoteCategoryCurrent: (state: any, action: any) => {
      state.currentCategoryId = action.payload;
    },
  },
});

export const {
  saveNote,
  clearNote,
  saveNoteCategoryList,
  saveNoteCategoryCurrent,
} = noteDataSlice.actions;
export default noteDataSlice.reducer;
