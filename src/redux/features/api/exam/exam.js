import { apiSlice } from "../../slice/baseUrl";


export const examApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllExam: builder.query({
            query: (params) => ({
                url: `/exam${params?.moduleId ? `?moduleId=${params.moduleId}` : ""}`,
                method: "GET",
            }),
            providesTags: ["Exam"],
        }),

        createExam: builder.mutation({
            query: ({ data }) => ({
                url: `/exam/create-exam`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Exam"],
        }),

        updateExam: builder.mutation({
            query: ({ data, params }) => ({
                url: `/exam/${params?.slug}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Exam"],
        }),

        deleteExam: builder.mutation({
            query: ({ params }) => ({
                url: `/exam/${params?.slug}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Exam"],
        }),
    }),
    overrideExisting: false,
});

export const { useCreateExamMutation, useGetAllExamQuery, useDeleteExamMutation, useUpdateExamMutation} = examApi;
