import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/slice/baseUrl";
import { authSlice } from "./features/api/auth/authSlice";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        [authSlice.reducerPath]: authSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});
