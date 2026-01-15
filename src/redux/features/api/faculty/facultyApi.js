import { apiSlice } from "../../slice/baseUrl";


export const facultyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createFaculty: builder.mutation({
      query: ({ data }) => {
        return {
          url: `/user/create-faculty`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Teacher"],
    }),
    getFaculty: builder.query({
      query: (params) => ({
        url: `/faculty`,
        method: "GET",
        params,
      }),
      providesTags: ["Teacher"],
    }),
    updateFaculty: builder.mutation({
      query: ({ data, params }) => ({
        url: `/faculty/update-faculty/${params?._id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Teacher"],
    }),

    deleteFaculty: builder.mutation({
      query: ({ params }) => ({
        url: `/faculty/delete-faculty/${params?._id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Teacher"],
    }),




  }),
  overrideExisting: false,
});

export const {
  useCreateFacultyMutation,
  useGetFacultyQuery,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
} = facultyApi;
