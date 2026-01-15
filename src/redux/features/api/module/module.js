import { apiSlice } from "../../slice/baseUrl";


export const moduleApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllModule: builder.query({
            query: (params) => ({
                url: `/module${params?.courseId ? `?courseId=${params.courseId}` : ""}`,
                method: "GET",
            }),
            providesTags: ["Module"],
        }),

        createModule: builder.mutation({
            query: ({ data }) => ({
                url: `/module/create-module`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Module"],
        }),

        updateModule: builder.mutation({
            query: ({ data, params }) => ({
                url: `/module/${params?.slug}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Module"],
        }),

        deleteModule: builder.mutation({
            query: ({ params }) => ({
                url: `/module/${params?.slug}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Module"],
        }),
    }),
    overrideExisting: false,
});

export const { useGetAllModuleQuery, useCreateModuleMutation, useDeleteModuleMutation, useUpdateModuleMutation } = moduleApi;
