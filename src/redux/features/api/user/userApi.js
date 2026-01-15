import { apiSlice } from "../../slice/baseUrl";


export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        userProfile: builder.query({
            query: (data) => ({
                url: "/user/profile",
                method: "GET",
                body: data,
            }),
            providesTags: ["User", "Student"],
        }),

        usergetAll: builder.query({
            query: ({ page, limit }) => ({
                url: `/user?page=${page}&limit=${limit}`,
                method: "GET",
                // body: data,
            }),
            providesTags: ["User", "Student"],
        }),

    }),
    overrideExisting: false,
});

export const { useUserProfileQuery, useUsergetAllQuery } = userApi;
