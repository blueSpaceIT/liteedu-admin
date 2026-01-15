import { apiSlice } from "../../slice/baseUrl";

export const mcqApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createMcq: builder.mutation({
            query: (payload) => ({
                url: `/allmcq/create-all-mcq`,
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["MCQ"],
        }),

        createBulkMcq: builder.mutation({
            query: (file) => {
                const formData = new FormData();
                formData.append("file", file);
                return {
                    url: "/allmcq/bulk-upolad-mcq",
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["MCQ"],
        }),

        getMcqs: builder.query({
            query: ({ page = 1, limit = 10 }) => ({
                url: "/allmcq",
                method: "GET",
                params: { page, limit },
            }),
            providesTags: ["MCQ"],
        }),

        updateMcq: builder.mutation({
            query: ({ data, params }) => ({
                url: `/allmcq/${params?._id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["MCQ"],
        }),
        
        deleteMcq: builder.mutation({
            query: ({ params }) => ({
                url: `/allmcq/${params?._id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["MCQ"],
        }),
    }),
    overrideExisting: false,
});

export const { useCreateMcqMutation, useGetMcqsQuery, useUpdateMcqMutation, useDeleteMcqMutation, useCreateBulkMcqMutation } = mcqApi;
