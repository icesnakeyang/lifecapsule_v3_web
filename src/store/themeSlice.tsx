import { createSlice } from "@reduxjs/toolkit";

/**
 * themeColor保存用户的主题色系颜色
 * currentThemeId是用户当前选择的主题颜色
 * 用户可以在主题色页面选择主题颜色，选择后，从数据库读取主题色，保存到themeColor
 * 程序启动时通过currentThemeId来读取主题色，保存到themeColor，
 * 如果没有设置currentThemeId，则读取默认的主题色（数据库里查询出来的第一个主题色）
 */

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    themeColor: {},
    currentThemeId: "386ebdaafe19476e9fa677a627d69496",
  },
  reducers: {
    saveThemeColor: (state: any, action: any) => {
      state.themeColor = action.payload;
    },
    saveCurrentThemeId: (state: any, action: any) => {
      state.currentThemeId = action.payload;
    },
    clearThemeState: (state: any) => {
      state.themeColor = {};
      state.currentThemeId = "386ebdaafe19476e9fa677a627d69496";
    },
  },
});

export const { saveThemeColor, saveCurrentThemeId, clearThemeState } =
  themeSlice.actions;

export default themeSlice.reducer;
