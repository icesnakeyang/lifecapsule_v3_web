import {createSlice} from '@reduxjs/toolkit';

export const antiDelaySlice = createSlice({
  name: 'antiDelaySlice',
  initialState: {
    antiDelayTodoListNew: [],
    antiDelayTodoListEdit: [],
    happyYesterday: '',
    myThought: '',
    longGoal: '',
    todayGoal: '',
    antiDelayNoteTitle: '',
    antiDelayNotePageIndex:1,
    antiDelayNotePageSize:10
  },

  reducers: {
    saveAntiDelayTodoListNew: (state: any, action: any) => {
      state.antiDelayTodoListNew = action.payload;
    },
    clearAntiDelayTodoList: (state: any) => {
      state.antiDelayTodoList = [];
    },
    saveHappyYesterday: (state: any, action: any) => {
      state.happyYesterday = action.payload;
    },
    saveMyThought: (state: any, action: any) => {
      state.myThought = action.payload;
    },
    saveLongGoal: (state: any, action: any) => {
      state.longGoal = action.payload;
    },
    saveTodayGoal: (state: any, action: any) => {
      state.todayGoal = action.payload;
    },
    saveAntiDelayNoteTitle: (state: any, action: any) => {
      state.antiDelayNoteTitle = action.payload;
    },
    clearAntiDelayNoteRedux: (state: any) => {
      state.antiDelayTodoListNew = [];
      state.happyYesterday = '';
      state.myThought = '';
      state.longGoal = '';
      state.todayGoal = '';
      state.antiDelayNoteTitle = '';
    },
    saveAntiDelayTodoListEdit: (state: any, action: any) => {
      state.antiDelayTodoListEdit = action.payload;
    },
    saveAntiDelayNotePageIndex:(state:any, action:any)=>{
      state.antiDelayNotePageIndex=action.payload
    },
    saveAntiDelayNotePageSize:(state:any, action:any)=>{
      state.antiDelayNotePageSize=action.payload
    }
  },
});

export const {
  saveAntiDelayTodoListNew,
  clearAntiDelayTodoList,
  saveHappyYesterday,
  saveMyThought,
  saveLongGoal,
  saveTodayGoal,
  saveAntiDelayNoteTitle,
  clearAntiDelayNoteRedux,
  saveAntiDelayTodoListEdit,
  saveAntiDelayNotePageIndex,
  saveAntiDelayNotePageSize
} = antiDelaySlice.actions;
export default antiDelaySlice.reducer;
