import { apiSlice } from "../../slice/baseUrl";

export const notificationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllNotification: builder.query({
            query: (params) => ({
                url: `/notification?${params}`,
                method: "GET",
            }),
            providesTags: ["Notification"],
        }),

        createNotification: builder.mutation({
            query: ({ data }) => ({
                url: `/notification`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Notification"],
        }),

        updateNotification: builder.mutation({
            query: ({ data, params }) => ({
                url: `/notification/${params?.slug}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Notification"],
        }),

        deleteNotification: builder.mutation({
            query: ({ params }) => ({
                url: `/notification/${params?.slug}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Notification"],
        }),
    }),
    overrideExisting: false,
});

export const { useCreateNotificationMutation, useDeleteNotificationMutation, useUpdateNotificationMutation, useGetAllNotificationQuery } =
    notificationApi;
