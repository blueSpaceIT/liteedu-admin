import { apiSlice } from "../../slice/baseUrl";

export const ClasssApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Add a Class
        createClass: builder.mutation({
            query: ({ title }) => ({
                url: "/class/create-class",
                method: "POST",
                body: { title },
            }),
            invalidatesTags: ["Class"],
        }),

        // Get all Classs with search and pagination
        getAllClass: builder.query({
            query: ({ search = "", page = 1, limit = 10 } = {}) => ({
                url: `/class?search=${search}&page=${page}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["Class"],
        }),

        // Update Class
        updateClass: builder.mutation({
            query: ({ id, title }) => ({
                url: `/class/${id}`,
                method: "PATCH",
                body: { title },
            }),
            invalidatesTags: ["Class"],
        }),

        // Delete Class
        deleteClass: builder.mutation({
            query: ({ id }) => ({
                url: `/class/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Class"],
        }),
    }),
    overrideExisting: false,
});

export const { useCreateClassMutation, useGetAllClassQuery, useUpdateClassMutation, useDeleteClassMutation } = ClasssApi;
