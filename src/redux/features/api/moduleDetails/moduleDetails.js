import { apiSlice } from "../../slice/baseUrl";



export const moduleDetailsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllModuleDetails: builder.query({
            query: (params) => ({
                url: `/moduleDetails${params?.moduleId ? `?courseId=${params.moduleId}` : ""}`,
                method: "GET",
            }),
            providesTags: ["ModuleDetails"],
        }),

        createModuleDetails: builder.mutation({
            query: ({ data }) => ({
                url: `/moduleDetails/create-moduleDetails`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["ModuleDetails"],
        }),

        updateModuleDetails: builder.mutation({
            query: ({ data}) => ({
                url: `/moduledetails/update-moduledetails`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["ModuleDetails"],
        }),

        deleteModuleDetails: builder.mutation({
            query: ({ data }) => ({
                url: `moduleDetails/delete-moduleDetails`,
                method: "DELETE",
                body:data
            }),
            invalidatesTags: ["ModuleDetails"],
        }),
    }),
    overrideExisting: false,
});

export const { useCreateModuleDetailsMutation, useGetAllModuleDetailsQuery, useDeleteModuleDetailsMutation, useUpdateModuleDetailsMutation } = moduleDetailsApi;
