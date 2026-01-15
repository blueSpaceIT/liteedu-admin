import { apiSlice } from "../../slice/baseUrl";


export const courseApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllCourse: builder.query({
            query: (params) => ({
                url: `/course/${params? params?.slug : ""}`,
                method: "GET",
            }),
            providesTags: ["Course"],
        }),

        createCourse: builder.mutation({
            query: ({data}) => ({
                url: `/course/create-course`,
                method: "POST",
                body:data
            }),
            invalidatesTags: ["Course"],
        }),


        updateCourse: builder.mutation({
            query: ({data, params}) => ({
                url: `/course/${params?.slug}`,
                method: "PATCH",
                body:data
            }),
            invalidatesTags: ["Course"],
        }),

        deleteCourse: builder.mutation({
            query: ({params}) => ({
                url: `/course/${params?.slug}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Course"],
        }),

    }),
    overrideExisting: false,
});

export const { useGetAllCourseQuery, useCreateCourseMutation, useDeleteCourseMutation, useUpdateCourseMutation} = courseApi;
