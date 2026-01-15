import { apiSlice } from "../../slice/baseUrl";

export const bannerApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllBanner: builder.query({
            query: () => ({
                url: "/banner",
                method: "GET",
            }),
            providesTags: ["Banner"],
        }),
        addBanner: builder.mutation({
            query: ({ data }) => ({
                url: "/banner/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Banner"],
        }),
        updateBanner: builder.mutation({
            query: ({ params, data }) => ({
                url: `/banner/${params?._id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Banner"],
        }),
        deleteBanner: builder.mutation({
            query: ({params}) => ({
                url: `/banner/${params?._id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Banner"],
        }),
    }),
    overrideExisting: false,
});

export const { useAddBannerMutation, useDeleteBannerMutation, useGetAllBannerQuery, useUpdateBannerMutation } = bannerApi;
