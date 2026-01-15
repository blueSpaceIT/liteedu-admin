import { apiSlice } from "../../slice/baseUrl";

export const bookApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addOrder: builder.mutation({
            query: ({ data }) => ({
                url: `/order/create-order`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Order"],
        }),

        getAllOrder: builder.query({
            query: ({ search, page, limit }) => ({
                url: "/order?search=" + (search || "") + "&page=" + (page || 1) + "&limit=" + (limit),
                method: "GET",
            }),
            providesTags: ["Order"],
        }),
        updateOrder: builder.mutation({
            query: ({ data, params }) => ({
                url: `/order/${params?.id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Order"],
        }),
        deleteOrder: builder.mutation({
            query: (params) => ({
                url: `/order/${params.id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Order'], // Refresh orders list after delete
        }),

    }),
    overrideExisting: false,
});

export const {
    useAddOrderMutation,
    useGetAllOrderQuery,
    useUpdateOrderMutation,
    useDeleteOrderMutation,
} = bookApi;