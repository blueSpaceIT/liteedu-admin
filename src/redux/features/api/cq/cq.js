import { apiSlice } from "../../slice/baseUrl";


export const cqApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCqs: builder.query({
            query: ({ page = 1, limit = 10 }) => ({
                url: "/cq-question",
                method: "GET",
                params: { page, limit },
            }),
            providesTags: ["CQ"],
        }),

        createCq: builder.mutation({
            query: ({ data }) => ({
                url: `/cq-question/create-cqquestion`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["CQ"],
        }),

        updateCq: builder.mutation({
            query: ({ data }) => ({
                url: `/cq-question/update-cqquestion`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["CQ"],
        }),
        deleteCq: builder.mutation({
            query: ({ data }) => ({
                url: `/cq-question/delete-cqquestion`,
                method: "DELETE",
                body: data,
            }),
            invalidatesTags: ["CQ"],
        }),
    }),
    overrideExisting: false,
});

export const { useCreateCqMutation, useDeleteCqMutation, useGetCqsQuery, useUpdateCqMutation } = cqApi;
