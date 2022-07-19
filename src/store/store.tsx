import { configureStore } from "@reduxjs/toolkit";
import userDataSlice from "./userDataSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import noteDataSlice from "./noteDataSlice";
import { combineReducers } from "redux";
import contactSlice from "./contactSlice";
import recipientSlice from "./recipinetSlice";
import triggerSlice from "./triggerSlice";
import commonSlice from "./commonSlice";
const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  userDataSlice,
  noteDataSlice,
  contactSlice,
  recipientSlice,
  triggerSlice,
  commonSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);
