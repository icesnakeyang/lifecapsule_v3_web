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
    clearContact: (state: any) => {
      state.contactRemark = null;
    },
  },
});

export const { saveContactList, clearContact } = contactSlic.actions;

export default contactSlic.reducer;
