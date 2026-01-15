import { apiSlice } from "../../slice/baseUrl";

export const enrollmentApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllEnrollment: builder.query({
            query: ({ page = 1, limit = 10 }) => ({
                url: `/enrollment`,
                method: "GET",
                params: { page, limit },
            }),
            providesTags: ["Enrollment"],
        }),

        getSingleEnrollment: builder.query({
            query: (id) => ({
                url: `/enrollment/${id}`,
                method: "GET",
            }),
            providesTags: ["Enrollment"],
        }),
        createEnrollment: builder.mutation({
            query: (data) => ({
                url: "/enrollment/create-enrollment",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Enrollment"],
        }),
        updateEnrollment: builder.mutation({
            query: ({ id, data }) => ({
                url: `/enrollment/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Enrollment"],
        }),
        deleteEnrollment: builder.mutation({
            query: (id) => ({
                url: `/enrollment/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Enrollment"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetAllEnrollmentQuery,
    useGetSingleEnrollmentQuery,
    useCreateEnrollmentMutation,
    useUpdateEnrollmentMutation,
    useDeleteEnrollmentMutation,
} = enrollmentApi;
