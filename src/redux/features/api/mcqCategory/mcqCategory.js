import { apiSlice } from "../../slice/baseUrl";

export const mcqCategoryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllMcqCategory: builder.query({
            query: () => ({
                url: `/question-category`,
                method: "GET",
            }),
            providesTags: ["MCQCategory"],
        }),

        createMcqCategory: builder.mutation({
            query: ({ data }) => ({
                url: `/question-category`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["MCQCategory"],
        }),

        updateMcqCategory: builder.mutation({
            query: ({ data, params }) => ({
                url: `/question-category/${params?.slug}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["MCQCategory"],
        }),

        deleteMcqCategory: builder.mutation({
            query: ({ params }) => ({
                url: `/question-category/${params?.slug}`,
                method: "DELETE",
            }),
            invalidatesTags: ["MCQCategory"],
        }),
    }),
    overrideExisting: false,
});

export const { useGetAllMcqCategoryQuery, useCreateMcqCategoryMutation, useUpdateMcqCategoryMutation, useDeleteMcqCategoryMutation } = mcqCategoryApi;
