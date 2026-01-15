import { apiSlice } from "../../slice/baseUrl";

export const studentApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        studentProfile: builder.query({
            query: (data) => ({
                url: "/student/profile",
                method: "GET",
                body: data,
            }),
            providesTags: ["Student"],
        }),
        studentgetAll: builder.query({
            query: ({ page, limit }) => ({
                url: `/student?page=${page}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["Student"],
        }),
        studentUpdateProfile: builder.mutation({
            query: ({ data, params }) => ({
                url: `/student/update-student/${params?.id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["User", "Student"],
        }),
        studentDelete: builder.mutation({
            query: ({ params }) => ({
                url: `/student/delete-student/${params?.id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User", "Student"],
        }),

    }),
    overrideExisting: false,
});

export const {
    useStudentProfileQuery,
    useStudentUpdateProfileMutation,
    useStudentgetAllQuery,
    useStudentDeleteMutation } = studentApi;
