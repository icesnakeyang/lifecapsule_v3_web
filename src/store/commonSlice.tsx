import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const commonSlice = createSlice({
  name: "common",
  initialState: {
    editing: 0,
    richContent: null,
    loadData: false,
    tempId: -1,
    refresh: 0,
  },
  reducers: {
    saveEditing: (state: any, action: PayloadAction<number>) => {
      state.editing = action.payload;
    },
    saveRichContent: (state: any, action: any) => {
      state.richContent = action.payload;
    },
    clearRichContent: (state: any) => {
      state.richContent = null;
    },
    saveLoadData: (state: any, action: PayloadAction<boolean>) => {
      state.loadData = action.payload;
    },
    saveTempId: (state: any, action: any) => {
      state.tempId = action.payload;
    },
    loadRefresh: (state: any) => {
      state.refresh += 1;
    },
    clearRefresh: (state: any) => {
      state.refresh = 0;
    },
    clearCommonState: (state: any) => {
      state.editing = 0;
      state.richContent = null;
      state.loadData = false;
      state.tempId = -1;
      state.refresh = 0;
    },
  },
});

export const {
  saveEditing,
  saveRichContent,
  clearRichContent,
  saveLoadData,
  loadRefresh,
  clearRefresh,
  clearCommonState,
} = commonSlice.actions;

export default commonSlice.reducer;
