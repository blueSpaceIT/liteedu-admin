import { apiSlice } from "../../slice/baseUrl";

export const BatchsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Add a Batch
        createBatch: builder.mutation({
            query: ({ title }) => ({
                url: "/batch/create-batch",
                method: "POST",
                body: { title }, // ✅ wrap in `body` to match Zod
            }),
            invalidatesTags: ["Batch"],
        }),

        // Get all Batchs with search and pagination
        getAllBatch: builder.query({
            query: ({ search = "", page = 1, limit = 10 } = {}) => ({
                url: `/batch?search=${search}&page=${page}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["Batch"],
        }),

        // Update Batch
        updateBatch: builder.mutation({
            query: ({ id, title }) => ({
                url: `/batch/${id}`,
                method: "PATCH",
                body: { title }, // ✅ wrap in body
            }),
            invalidatesTags: ["Batch"],
        }),

        // Delete Batch
        deleteBatch: builder.mutation({
            query: ({ id }) => ({
                url: `/batch/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Batch"],
        }),
    }),
    overrideExisting: false,
});

export const { useCreateBatchMutation, useGetAllBatchQuery, useUpdateBatchMutation, useDeleteBatchMutation } = BatchsApi;
