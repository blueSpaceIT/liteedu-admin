import { apiSlice } from "../../slice/baseUrl";

export const segmentApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      getAllSegment: builder.query({
            query: (params) => ({
                url: `/segment${params?.courseId ? `?courseId=${params.courseId}` : ""}`,
                method: "GET",
            }),
            providesTags: ["Segment"],
        }),

      createSegment: builder.mutation({
            query: ({ data }) => ({
                url: `/segment/create-segment`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Segment"],
        }),

          updateSegment: builder.mutation({
            query: ({ data, params }) => ({
                url: `/segment/${params?.id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Segment"],
        }),

         deleteSegment: builder.mutation({
            query: ({ params }) => ({
                url: `/segment/${params?.id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Segment"],
        }),



    }),
    overrideExisting: false,
});


export const { 
    useGetAllSegmentQuery, 
    useCreateSegmentMutation,
    useDeleteSegmentMutation,
    useUpdateSegmentMutation

} = segmentApi;
