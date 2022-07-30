import { createSlice } from "@reduxjs/toolkit";

export const creativeNoteSlice = createSlice({
  name: "creativeNote",
  initialState: {
    creativeNoteList: [],
    totalCreativeNote: 0,
    detail1: "",
    detail2: "",
    detail3: "",
    pageIndexCreativeNote: 1,
    pageSizeCteativeNote: 10,
  },
  reducers: {
    saveCreativeNoteList: (state: any, action: any) => {
      state.creativeNoteList = action.payload;
    },
    saveTotalCreativeNote: (state: any, action: any) => {
      state.totalCreativeNote = action.payload;
    },
    saveDetail1: (state: any, action: any) => {
      state.detail1 = action.payload;
    },
    saveDetail2: (state: any, action: any) => {
      state.detail2 = action.payload;
    },
    saveDetail3: (state: any, action: any) => {
      state.detail3 = action.payload;
    },
    clearDetail: (state: any) => {
      state.detail1 = "";
      state.detail2 = "";
      state.detail3 = "";
    },
    savePageIndexCreativeNote: (state: any, action: any) => {
      state.pageIndexCreativeNote = action.payload;
    },
    savePageSizeCreativeNote: (state: any, action: any) => {
      state.pageSizeCteativeNote = action.payload;
    },
    clearCreativeNoteState: (state: any) => {
      state.creativeNoteList = [];
      state.totalCreativeNote = 0;
      state.detail1 = "";
      state.detail2 = "";
      state.detail3 = "";
      state.pageIndexCreativeNote = 0;
      state.pageSizeCteativeNote = 10;
    },
  },
});

export const {
  saveCreativeNoteList,
  saveTotalCreativeNote,
  saveDetail1,
  saveDetail2,
  saveDetail3,
  clearDetail,
  savePageIndexCreativeNote,
  savePageSizeCreativeNote,
  clearCreativeNoteState,
} = creativeNoteSlice.actions;

export default creativeNoteSlice.reducer;
