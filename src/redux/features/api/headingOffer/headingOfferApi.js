import { apiSlice } from "../../slice/baseUrl";

export const headingOfferApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addHeadingOffer: builder.mutation({
            query: ({ offer }) => ({
                url: "/heading-offer/create-heading-offer",
                method: "POST",
                body: { offer },
            }),
            invalidatesTags: ["HeadingOffer"],
        }),

        getAllHeadingOffers: builder.query({
            query: () => ({
                url: "/heading-offer",
                method: "GET",
            }),
            providesTags: ["HeadingOffer"],
        }),

        updateHeadingOffer: builder.mutation({
            query: ({ slug, data }) => ({
                url: `/heading-offer/${slug}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["HeadingOffer"],
        }),

        deleteHeadingOffer: builder.mutation({
            query: ({ slug }) => ({
                url: `/heading-offer/${slug}`,
                method: "DELETE",
            }),
            invalidatesTags: ["HeadingOffer"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useAddHeadingOfferMutation,
    useGetAllHeadingOffersQuery,
    useUpdateHeadingOfferMutation,
    useDeleteHeadingOfferMutation,
} = headingOfferApi;
