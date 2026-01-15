import { apiSlice } from "../../slice/baseUrl";


export const cqAttempApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCqAttempQuery: builder.query({
            query: ({ page = 1, limit = 10 }) => ({
                url: "/cq-attemp",
                method: "GET",
                params: { page, limit },
            }),
            providesTags: ["CQAttemp"],
        }),
    }),
    overrideExisting: false,
});

export const { useGetCqAttempQueryQuery } = cqAttempApi;
