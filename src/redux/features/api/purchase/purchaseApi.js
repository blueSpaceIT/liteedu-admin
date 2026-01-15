import { apiSlice } from "../../slice/baseUrl";


export const purchaseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPurchase: builder.query({
      query: (params) => ({
        url: "/purchase",
        method: "GET",
        params,
      }),
      providesTags: ["Purchase"],
    }),

    updatePurchase: builder.mutation({
      query: ({ data, params }) => ({
        url: `/purchase/${params?._id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Purchase"],
    }),

    deletePurchase: builder.mutation({
      query: ({ params }) => ({
        url: `/purchase/${params?._id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Purchase"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPurchaseQuery,
  useUpdatePurchaseMutation,
  useDeletePurchaseMutation,
} = purchaseApi;
