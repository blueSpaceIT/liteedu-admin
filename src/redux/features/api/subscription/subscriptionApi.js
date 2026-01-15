import { apiSlice } from "../../slice/baseUrl";

export const subscriptionApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      getAllSubscription: builder.query({
            query: (params) => ({
                url: `/subscription${params?.courseId ? `?courseId=${params.courseId}` : ""}`,
                method: "GET",
            }),
            providesTags: ["Subscription"],
        }),

      createSubscription: builder.mutation({
            query: ({ data }) => ({
                url: `/subscription/create-subscription`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Subscription"],
        }),

          updateSubscription: builder.mutation({
            query: ({ data, params }) => ({
                url: `/subscription/${params?.id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Subscription"],
        }),

         deleteSubscription: builder.mutation({
            query: ({ params }) => ({
                url: `/subscription/${params?.id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Subscription"],
        }),
    }),
    overrideExisting: false,
});


export const { 
  useGetAllSubscriptionQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation

} = subscriptionApi;
