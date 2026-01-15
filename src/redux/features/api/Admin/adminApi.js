import { apiSlice } from "../../slice/baseUrl";

export const adminApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        adminProfile: builder.query({
            query: () => ({
                url: "/admin/profile",
                method: "GET",
            }),
            providesTags: ["Admin"],
        }),

        // working
        admingetAll: builder.query({
            query: () => ({
                url: "/admin",
                method: "GET",
            }),
            providesTags: ["Admin"],
        }),

        createAdmin: builder.mutation({
            query: (data) => ({
                url: "/user/create-admin",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Admin"],
        }),

        updateAdmin: builder.mutation({
            query: ({data ,params}) => ({
                url: `/admin/${params.id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Admin"],
        }),

        deleteAdmin: builder.mutation({
            query: (params) => ({
                url: `/admin/${params.id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Admin"],
        }),
    }),
    overrideExisting: false,
});

export const { useAdminProfileQuery, useAdmingetAllQuery, useCreateAdminMutation, useUpdateAdminMutation, useDeleteAdminMutation } = adminApi;
