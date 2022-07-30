import { createSlice } from "@reduxjs/toolkit";
export const recipientSlice = createSlice({
  name: "recipient",
  initialState: {
    recipient: null,
    recipientList: [],
  },
  reducers: {
    saveRecipient: (state: any, action: any) => {
      state.recipient = action.payload;
    },
    saveRecipientList: (state: any, action: any) => {
      state.recipientList = action.payload;
    },
    removeRecipient: (state: any) => {
      state.recipient = null;
    },
    removeRecipientList: (state: any) => {
      state.recipientList = [];
    },
    clearRecipientState: (state: any) => {
      state.recipient = null;
      state.recipientList = [];
    },
  },
});

export const {
  saveRecipient,
  removeRecipient,
  saveRecipientList,
  removeRecipientList,
  clearRecipientState,
} = recipientSlice.actions;
export default recipientSlice.reducer;
