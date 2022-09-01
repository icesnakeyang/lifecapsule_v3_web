import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const noteSendSlice = createSlice({
  name: "noteSend",
  initialState: {
    receiveNoteList: [],
    totalReceiveNote: 0,
    totalReceiveNoteUnread: 0,
    totalSendNote: 0,
    totalSendNoteUnread: 0,
    receivePageIndex: 1,
    receivePageSize: 10,
  },
  reducers: {
    saveReceiveNoteList: (state: any, action: PayloadAction<number>) => {
      state.receiveNoteList = action.payload;
    },
    saveTotalReceiveNote: (state: any, action: any) => {
      state.totalReceiveNote = action.payload;
    },
    saveTotalReceiveNoteUnread: (state: any, action: any) => {
      state.totalReceiveNoteUnread = action.payload;
    },
    saveReceivePageIndex: (state: any, action: any) => {
      state.receivePageIndex = action.payload;
    },
    saveReceivePageSize: (state: any, action: any) => {
      state.receivePageSize = action.payload;
    },
    saveTotalSendNote: (state: any, action: any) => {
      state.totalSendNote = action.payload;
    },
    saveTotalSendNoteUnread: (state: any, action: any) => {
      state.totalSendNoteUnread = action.payload;
    },
  },
});

export const {
  saveReceiveNoteList,
  saveTotalReceiveNote,
  saveTotalReceiveNoteUnread,
  saveReceivePageIndex,
  saveReceivePageSize,
  saveTotalSendNote,
  saveTotalSendNoteUnread,
} = noteSendSlice.actions;

export default noteSendSlice.reducer;
