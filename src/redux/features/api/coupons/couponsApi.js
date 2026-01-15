import { apiSlice } from "../../slice/baseUrl";

export const couponsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Add a coupon
        addCoupon: builder.mutation({
            query: ({ data }) => ({
                url: "/coupon/create-coupon",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Coupon"],
        }),

        // Get all coupons with search and pagination
        getAllCoupon: builder.query({
            query: ({ search = "", page = 1, limit = 10 } = {}) => ({
                url: `/coupon?search=${search}&page=${page}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["Coupon"],
        }),

        // Update coupon
        updateCoupon: builder.mutation({
            query: ({ data }) => ({
                url: `/coupon/update-coupon`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Coupon"],
        }),

        // Delete coupon
        deleteCoupon: builder.mutation({
            query: ({ data }) => ({
                url: `/coupon/delete-coupon`,
                method: "DELETE",
                body: data
            }),
            invalidatesTags: ["Coupon"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useAddCouponMutation,
    useGetAllCouponQuery,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
} = couponsApi;
