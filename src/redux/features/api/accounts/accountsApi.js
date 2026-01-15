import { apiSlice } from "../../slice/baseUrl";

export const accountsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createExpense: builder.mutation({
            query: ({ data }) => ({
                url: "/accounts/create-expense",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["accounts"],
        }),
        updateExpense: builder.mutation({
            query: ({ params, data }) => ({
                url: `/accounts/update-expense/${params?._id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["accounts"],
        }),

        deleteExpense: builder.mutation({
            query: ({ params }) => ({
                url: `/accounts/delete-expense/${params?._id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["accounts"],
        }),

        getExpenseReport: builder.query({
            query: () => ({
                url: "/accounts/expence-report",
                method: "GET",
            }),
            providesTags: ["accounts"],
        }),
        getIncomeReport: builder.query({
            query: () => ({
                url: "/accounts/income-report",
                method: "GET",
            }),
            providesTags: ["accounts"],
        }),
        getIncomeOrderReport: builder.query({
            query: () => ({
                url: "/accounts/all-income-order",
                method: "GET",
            }),
            providesTags: ["accounts"],
        }),
        getIncomeSalesReport: builder.query({
            query: () => ({
                url: "/accounts/all-income-sales",
                method: "GET",
            }),
            providesTags: ["accounts"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useCreateExpenseMutation,
    useGetExpenseReportQuery,
    useGetIncomeOrderReportQuery,
    useGetIncomeReportQuery,
    useGetIncomeSalesReportQuery,
    useDeleteExpenseMutation,
    useUpdateExpenseMutation,
} = accountsApi;
