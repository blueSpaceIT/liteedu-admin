import { apiSlice } from "../../slice/baseUrl";


export const noteApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllNote: builder.query({
            query: (params) => ({
                url: `/note${params?.moduleId ? `?moduleId=${params.moduleId}` : ""}`,
                method: "GET",
            }),
            providesTags: ["Note"],
        }),

        createNote: builder.mutation({
            query: ({ data }) => ({
                url: `/note/create-note`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Note"],
        }),

        updateNote: builder.mutation({
            query: ({ data, params }) => ({
                url: `/note/${params?.slug}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Note"],
        }),

        deleteNote: builder.mutation({
            query: ({ params }) => ({
                url: `/note/${params?.slug}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Note"],
        }),
    }),
    overrideExisting: false,
});

export const { useCreateNoteMutation, useDeleteNoteMutation, useGetAllNoteQuery, useUpdateNoteMutation} = noteApi;
