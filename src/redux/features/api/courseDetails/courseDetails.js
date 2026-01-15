import { apiSlice } from "../../slice/baseUrl";

export const courseDetailsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllCourseDetails: builder.query({
            query: (params) => ({
                url: `/course-details/${params ? params : ""}`,
                method: "GET",
            }),
            providesTags: ["CourseDetails"],
        }),

        createCourseDetails: builder.mutation({
            query: ({ data }) => ({
                url: `/course-details/create-course-details`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["CourseDetails"],
        }),

        updateCourseDetails: builder.mutation({
            query: ({ data, params }) => ({
                url: `/course-details/${params?._id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["CourseDetails"],
        }),

        deleteCourseDetails: builder.mutation({
            query: ({ params }) => ({
                url: `/course-details/${params?._id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["CourseDetails"],
        }),
    }),
    overrideExisting: false,
});

export const { useGetAllCourseDetailsQuery, useCreateCourseDetailsMutation, useDeleteCourseDetailsMutation, useUpdateCourseDetailsMutation } = courseDetailsApi;
