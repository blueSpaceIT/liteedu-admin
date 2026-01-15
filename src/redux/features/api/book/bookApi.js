import { apiSlice } from "../../slice/baseUrl";

export const bookApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addBook: builder.mutation({
            query: ({ data }) => ({
                url: `/product/create-product`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Book"],
        }),

        getAllBook: builder.query({
            query: ({ search, page, limit }) => ({
                url: "/product?search=" + (search || "") + "&page=" + (page || 1) + "&limit=" + (limit ),
                method: "GET",
            }),
            providesTags: ["Book"],
        }),
        updateBook: builder.mutation({
            query: ({ data, params }) => ({
                url: `/product/${params?.slug}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Book"],
        }),
        deleteBook: builder.mutation({
            query: ({ params }) => ({
                url: `/product/${params?.slug}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Book"],
        }),
        getAllBookCategory: builder.query({
            query: ({ search, page, limit } = {}) => ({
                url: `/product-category?search=${search || ""}&page=${page || 1}&limit=${limit }`,
                method: "GET",
            }),
            providesTags: ["Book"],
        }),
        addBookCategory: builder.mutation({
            query: ({ data }) => ({
                url: `/product-category/cretae-product-category`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Book"],
        }),
        updateBookCategory: builder.mutation({
            query: ({ data, params }) => ({
                url: `/product-category/${params?.slug}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Book"],
        }),
        deleteBookCategory: builder.mutation({
            query: ({ params }) => ({
                url: `/product-category/${params?.slug}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Book"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useAddBookMutation,
    useGetAllBookQuery,
    useDeleteBookMutation,
    useUpdateBookMutation,
    useGetAllBookCategoryQuery,
    useUpdateBookCategoryMutation,
    useDeleteBookCategoryMutation,
    useAddBookCategoryMutation,
} = bookApi;
