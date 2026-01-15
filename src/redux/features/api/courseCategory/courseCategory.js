import { apiSlice } from "../../slice/baseUrl";

export const courseCategoryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllCourseCategory: builder.query({
            query: (params) => ({
                url: `/courseCategory/${params?params:''}`,
                method: "GET",
             
            }),
            providesTags: ["CourseCategory"],
        }),
        createCourseCategory: builder.mutation({
            query: ({data}) => ({
                url:`/courseCategory`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["CourseCategory"],
        }),
         updateCourseCategory: builder.mutation({
            query: ({data, params}) => ({
                url:`/courseCategory/${params?.slug}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["CourseCategory"],
        }),

        deleteCourseCategory: builder.mutation({
            query: ({params}) => ({
                url:`/courseCategory/${params?.slug}`,
                method: "DELETE",
            }),
            invalidatesTags: ["CourseCategory"],
        }),



    }),
    overrideExisting: false,
});

export const { useCreateCourseCategoryMutation, useGetAllCourseCategoryQuery, useUpdateCourseCategoryMutation, useDeleteCourseCategoryMutation} = courseCategoryApi;
