import { createSlice } from "@reduxjs/toolkit";

export const contactSlic = createSlice({
  name: "contact",
  initialState: {
    contactList: [],
  },
  reducers: {
    saveContactList: (state: any, action: any) => {
      state.contactList = action.payload;
    },
    clearContactList: (state: any) => {
      state.contactList = [];
    },
  },
});

export const { saveContactList, clearContactList } = contactSlic.actions;

export default contactSlic.reducer;
