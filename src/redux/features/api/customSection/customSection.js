import { apiSlice } from "../../slice/baseUrl";

export const customSectionApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // ➕ Create Custom Section
        addCustomSection: builder.mutation({
            query: (data) => ({
                url: "/custom-section/create-custom-section",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["CustomSection"],
        }),

        // 📥 Get All Custom Sections
        getAllCustomSections: builder.query({
            query: () => ({
                url: "/custom-section",
                method: "GET",
            }),
            providesTags: ["CustomSection"],
        }),

        // ✏️ Update Custom Section
        updateCustomSection: builder.mutation({
            query: ({ id, data }) => ({
                url: `/custom-section/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["CustomSection"],
        }),

        // 🗑️ Delete (Soft Delete) Custom Section
        deleteCustomSection: builder.mutation({
            query: (id) => ({
                url: `/custom-section/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["CustomSection"],
        }),
    }),
    overrideExisting: false,
});

export const { useAddCustomSectionMutation, useGetAllCustomSectionsQuery, useUpdateCustomSectionMutation, useDeleteCustomSectionMutation } =
    customSectionApi;
