import { apiSlice } from "../../slice/baseUrl";

export const newBatchApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addNewBatch: builder.mutation({
            query: (data) => ({
                url: "/next-batch/create-next-batch",
                method: "POST",
                body: data, 
            }),
            invalidatesTags: ["NewBatch"],
        }),

        getAllNewBatches: builder.query({
            query: () => ({
                url: "/next-batch",
                method: "GET",
            }),
            providesTags: ["NewBatch"],
        }),

        getSingleNewBatch: builder.query({
            query: (slug) => ({
                url: `/next-batch/single-next-batch/${slug}`,
                method: "GET",
            }),
            providesTags: ["NewBatch"],
        }),

        updateNewBatch: builder.mutation({
            query: ({ slug, data }) => ({
                url: `/next-batch/${slug}`,
                method: "PATCH",
                body: data, 
            }),
            invalidatesTags: ["NewBatch"],
        }),

        deleteNewBatch: builder.mutation({
            query: (slug) => ({
                url: `/next-batch/${slug}`,
                method: "DELETE",
            }),
            invalidatesTags: ["NewBatch"],
        }),
    }),
    overrideExisting: false,
});

export const { useAddNewBatchMutation, useGetAllNewBatchesQuery, useGetSingleNewBatchQuery, useUpdateNewBatchMutation, useDeleteNewBatchMutation } =
    newBatchApi;
