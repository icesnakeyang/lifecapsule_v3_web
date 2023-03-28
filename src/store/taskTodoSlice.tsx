import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export const taskTodoSlice = createSlice({
    name: "task",
    initialState: {
        todoList: [],
        totalTodo: 0,
        todoPageIndex: 1,
        todoPageSize: 10,
        todoTaskTitle: '',
        todoTaskContent: '',
        todoTaskId: null
    },
    reducers: {
        saveTodoList: (state: any, action: any) => {
            state.todoList = action.payload;
        },
        saveTotalTodo: (state: any, action: PayloadAction<number>) => {
            state.totalTodo = action.payload;
        },
        saveTodoPageIndex: (state: any, action: any) => {
            state.todoPageIndex = action.payload;
        },
        saveTodoPageSize: (state: any, action: any) => {
            state.todoPageSize = action.payload;
        },
        clearTaskTodoState: (state: any) => {
            state.todoList = [];
            state.totalTodo = 0;
        },
        saveTodoTaskTitle: (state: any, action: any) => {
            state.todoTaskTitle = action.payload
        },
        saveTodoTaskContent: (state: any, action: any) => {
            state.todoTaskContent = action.payload
        },
        saveTodoTaskId: (state: any, action: any) => {
            state.todoTaskId = action.payload
        }
    },
});

export const {
    saveTodoList,
    saveTotalTodo,
    clearTaskTodoState,
    saveTodoPageIndex,
    saveTodoPageSize,
    saveTodoTaskTitle,
    saveTodoTaskContent,
    saveTodoTaskId
} = taskTodoSlice.actions;

export default taskTodoSlice.reducer;
