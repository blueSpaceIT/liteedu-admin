import { apiSlice } from "../../slice/baseUrl";


export const subCategoryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllSubCategory: builder.query({
            query: (params) => ({
                url: `/sub-category${params?.parentId ? `?parentId=${params.parentId}` : ""}`,
                method: "GET",
            }),
            providesTags: ["SubCategory"],
        }),

        createSubCategory: builder.mutation({
            query: ({ data }) => ({
                url: `/sub-category/create-subcategory`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["SubCategory"],
        }),

        updateSubCategory: builder.mutation({
            query: ({ data, params }) => ({
                url: `/sub-category/${params?.slug}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["SubCategory"],
        }),

        deleteSubCategory: builder.mutation({
            query: ({ params }) => ({
                url: `/sub-category/${params?.slug}`,
                method: "DELETE",
            }),
            invalidatesTags: ["SubCategory"],
        }),
    }),
    overrideExisting: false,
});

export const { useCreateSubCategoryMutation, useGetAllSubCategoryQuery, useUpdateSubCategoryMutation, useDeleteSubCategoryMutation } = subCategoryApi;
