import { apiSlice } from "../../slice/baseUrl";

export const dashboardApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getStats: builder.query({
            query: () => ({
                url: `/stats/dashboard`,
                method: "GET",
            }),
            invalidatesTags: ["Stats"],
        }),

        getAllMessage: builder.query({
            query: () => ({
                url: "/stats/message",
                method: "GET",
            }),
            providesTags: ["Stats"],
        }),

    }),
    overrideExisting: false,
});

export const {
    useGetAllMessageQuery,
    useGetStatsQuery

} = dashboardApi;
