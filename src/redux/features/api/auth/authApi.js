import { apiSlice } from "../../slice/baseUrl";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                body: data,
            }),
        }),
        changePassword: builder.mutation({
            query: (data) => ({
                url: "/user/change-password",
                method: "PATCH",
                body: data,
            }),
        }),
    }),
    overrideExisting: false,
});

export const { useLoginMutation, useChangePasswordMutation} = authApi;
