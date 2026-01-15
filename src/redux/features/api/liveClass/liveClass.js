import { apiSlice } from "../../slice/baseUrl";


export const liveClassApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllLiveClass: builder.query({
            query: (params) => ({
                url: `/live-class${params?.courseId ? `?courseId=${params.courseId}` : ""}`,
                method: "GET",
            }),
            providesTags: ["LiveClass"],
        }),

        createLiveClass: builder.mutation({
            query: ({ data }) => ({
                url: `/live-class/create-liveClass`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["LiveClass"],
        }),

        updateLiveClass: builder.mutation({
            query: ({ data, params }) => ({
                url: `/live-class/${params?.slug}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Module"],
        }),

        deleteLiveClass: builder.mutation({
            query: ({ params }) => ({
                url: `/live-class/${params?.slug}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Module"],
        }),
    }),
    overrideExisting: false,
});

export const { useGetAllLiveClassQuery, useCreateLiveClassMutation, useDeleteLiveClassMutation, useUpdateLiveClassMutation } = liveClassApi;
