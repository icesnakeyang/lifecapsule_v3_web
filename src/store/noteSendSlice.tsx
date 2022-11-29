import {createSlice, PayloadAction} from "@reduxjs/toolkit";

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
        sendNoteList: [],
        sendPageIndex: 1,
        sendPageSize: 10,
        sendNoteContent: '',
        sendNoteTitle: '',
        sendToName: '',
        sendToEmail: ''
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
        saveSendNoteList: (state: any, action: any) => {
            state.sendNoteList = action.payload;
        },
        saveSendPageIndex: (state: any, action: any) => {
            state.sendPageIndex = action.payload;
        },
        saveSendPageSize: (state: any, action: any) => {
            state.sendPageSize = action.payload;
        },
        saveSendNote: (state: any, action: any) => {
            state.sendNoteContent = action.payload.content
            state.sendNoteTitle = action.payload.title
        },
        saveSendToName: (state: any, action: any) => {
            state.sendToName = action.payload
        },
        saveSendToEmail: (state: any, action: any) => {
            state.sendToEmail = action.payload
        }
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
    saveSendNoteList,
    saveSendPageIndex,
    saveSendPageSize,
    saveSendNote,
    saveSendToName,
    saveSendToEmail
} = noteSendSlice.actions;

export default noteSendSlice.reducer;
