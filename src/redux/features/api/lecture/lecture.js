import { apiSlice } from "../../slice/baseUrl";

export const lectureApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllLecture: builder.query({
            query: (params) => ({
                url: `/lecture${params?.moduleId ? `?moduleId=${params.moduleId}` : ""}`,
                method: "GET",
            }),
            providesTags: ["Lecture"],
        }),

        createLecture: builder.mutation({
            query: ({ data }) => ({
                url: "/lecture/create-lecture",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Lecture"],
        }),

        updateLecture: builder.mutation({
            query: ({ data, params }) => ({
                url: `/lecture/${params?.slug}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Lecture"],
        }),

        deleteLecture: builder.mutation({
            query: ({ params }) => ({
                url: `/lecture/${params?.slug}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Lecture"],
        }),

        uploadChunk: builder.mutation({
            query: ({ uploadId, chunkIndex, chunk }) => ({
                url: "/media/upload-chunk",
                method: "POST",
                body: chunk,
                headers: {
                    uploadid: uploadId,
                    chunkindex: String(chunkIndex),
                    "Content-Type": "application/octet-stream",
                },
            }),
        }),

        finalizeUpload: builder.mutation({
            query: (body) => ({
                url: "/media/finalize-upload",
                method: "POST",
                body,
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useCreateLectureMutation,
    useGetAllLectureQuery,
    useDeleteLectureMutation,
    useUpdateLectureMutation,
    useUploadChunkMutation,
    useFinalizeUploadMutation,
} = lectureApi;
