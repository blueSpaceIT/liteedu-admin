import { apiSlice } from "../../slice/baseUrl";


export const examMcqApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllExamMcq: builder.query({
            query: (params) => {
                const { examId, page = 1, limit = 10 } = params || {};
                const queryParams = new URLSearchParams();
                if (examId) queryParams.append("examId", examId);
                queryParams.append("page", page);
                queryParams.append("limit", limit);

                return {
                    url: `/mcq?${queryParams.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["ExamMcq"],
        }),

        createManualMcq: builder.mutation({
            query: ({ data }) => ({
                url: `/mcq/create-mcq`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["ExamMcq"],
        }),

        createMcqById: builder.mutation({
            query: ({ data }) => ({
                url: `/mcq/add-mcq-id`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["ExamMcq"],
        }),

        createMcqBySerial: builder.mutation({
            query: ({ data }) => ({
                url: `/mcq/add-mcq-serail`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["ExamMcq"],
        }),

        udateExamMcq: builder.mutation({
            query: ({ id, data }) => ({
                url: `/mcq/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["ExamMcq"],
        }),
        deleteExamMcq: builder.mutation({
            query: (id) => ({
                url: `/mcq/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ExamMcq"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useCreateManualMcqMutation,
    useCreateMcqByIdMutation,
    useCreateMcqBySerialMutation,
    useGetAllExamMcqQuery,
    useUdateExamMcqMutation,
    useDeleteExamMcqMutation,
} = examMcqApi;
