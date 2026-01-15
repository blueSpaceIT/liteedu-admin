import { configureStore } from "@reduxjs/toolkit";

import { authSlice } from "./features/Api/Auth/AuthSlice";
import { apiSlice } from "./features/slice/baseUrl";


export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [authSlice.reducerPath]: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
