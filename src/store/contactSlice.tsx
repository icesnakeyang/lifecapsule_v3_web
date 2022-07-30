import { createSlice } from "@reduxjs/toolkit";

export const contactSlice = createSlice({
  name: "contact",
  initialState: {
    contactList: [],
    contactPageIndex:1,
    contactPageSize:10,
    totalContact:0
  },
  reducers: {
    saveContactList: (state: any, action: any) => {
      state.contactList = action.payload;
    },
    saveContactPageIndex:(state:any, action:any)=>{
      state.contactPageIndex=action.paylod
    },
    saveContactPageSize:(state:any, action:any)=>{
      state.contactPageSize=action.paylod
    },
    saveTotalContact:(state:any, action:any)=>{
      state.totalContact=action.paylod
    },
    clearContactState: (state: any) => {
      state.contactList = [];
      state.contactPageIndex=1
      state.contactPageSize=10
      state.totalContact=0
    },
  },
});

export const { saveContactList, clearContactState ,saveContactPageIndex,saveContactPageSize,saveTotalContact} = contactSlice.actions;

export default contactSlice.reducer;
