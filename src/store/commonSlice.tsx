import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const commonSlice = createSlice({
  name: "common",
  initialState: {
    editing: 0,
    richContent: null,
  },
  reducers: {
    saveEditing: (state: any, action: PayloadAction<number>) => {
      state.editing = action.payload;
    },
    saveRichContent: (state: any, action: any) => {
      state.richContent = action.payload;
    },
  },
});

export const { saveEditing, saveRichContent } = commonSlice.actions;

export default commonSlice.reducer;
