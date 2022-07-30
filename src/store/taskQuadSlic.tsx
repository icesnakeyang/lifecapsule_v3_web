import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";

export const taskQuadSlice = createSlice({
  name: "taskQuad",
  initialState: {
    taskQuadList: [],
    totalTaskQuad: 0,
    pageIndexTaskQuad: 1,
    pageSizeTaskQuad: 10,
    taskQuead: {},
  },
  reducers: {
    saveTaskQuadList: (state: any, action: PayloadAction<number>) => {
      state.taskQuadList = action.payload;
    },
    saveTotalTaskQuad: (state: any, action: any) => {
      state.totalTaskQuad = action.payload;
    },
    saveTaskQuadPageIndex: (state: any) => {
      state.pageIndexTaskQuad = null;
    },
    saveTaskQuadPageSize: (state: any, action: PayloadAction<boolean>) => {
      state.pageSizeTaskQuad = action.payload;
    },
    saveTaskQuad: (state: any, action: any) => {
      state.taskQuead = action.payload;
    },
    clearTaskQuadState: (state: any) => {
      state.taskQuadList = [];
      state.totalTaskQuad = 0;
      state.pageIndexTaskQuad = 1;
      state.pageSizeTaskQuad = 10;
      state.taskQuead = {};
    },
  },
});

export const {
  saveTaskQuadList,
  saveTotalTaskQuad,
  saveTaskQuadPageIndex,
  saveTaskQuadPageSize,
  saveTaskQuad,
  clearTaskQuadState,
} = taskQuadSlice.actions;

export default taskQuadSlice.reducer;
