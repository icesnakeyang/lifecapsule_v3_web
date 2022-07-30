import { createSlice } from "@reduxjs/toolkit";
export const triggerSlice = createSlice({
  name: "trigger",
  initialState: {
    triggerTime: null,
    trigger: null,
  },
  reducers: {
    saveTriggerTime: (state: any, action: any) => {
      state.triggerTime = action.payload;
    },
    saveTrigger: (state: any, action: any) => {
      state.trigger = action.payload;
    },
    removeTrigger: (state: any) => {
      state.trigger = null;
    },
    clearTriggerState: (state: any) => {
      state.triggerTime = null;
      state.trigger = null;
    },
  },
});

export const {
  saveTriggerTime,
  saveTrigger,
  removeTrigger,
  clearTriggerState,
} = triggerSlice.actions;
export default triggerSlice.reducer;
