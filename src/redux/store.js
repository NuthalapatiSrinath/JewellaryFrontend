// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // if you store non-serializable in state (like errors), toggle as needed
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
