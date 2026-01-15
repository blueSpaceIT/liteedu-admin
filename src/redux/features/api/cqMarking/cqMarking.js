import { apiSlice } from "../../slice/baseUrl";


export const cqMarkingApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCqMarkings: builder.query({
            query: ({ page = 1, limit = 10 }) => ({
                url: "/cq-marking",
                method: "GET",
                params: { page, limit },
            }),
            providesTags: ["CQMarking"],
        }),

        createCqMarking: builder.mutation({
            query: ({ data }) => ({
                url: `/cq-marking/create-cqmarking`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["CQMarking"],
        }),

        updateCqMarking: builder.mutation({
            query: ({ data }) => ({
                url: `/cq-marking/update-cqmarking`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["CQ"],
        }),
        deleteCqMarking: builder.mutation({
            query: ({ data }) => ({
                url: `/cq-marking/delete-cqmarking`,
                method: "DELETE",
                body: data,
            }),
            invalidatesTags: ["CQ"],
        }),
    }),
    overrideExisting: false,
});

export const { useCreateCqMarkingMutation, useGetCqMarkingsQuery, useUpdateCqMarkingMutation, useDeleteCqMarkingMutation } = cqMarkingApi;
