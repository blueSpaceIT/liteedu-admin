// src/redux/features/api/blog/blogApi.js
import { apiSlice } from "../../slice/baseUrl";

export const blogApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // সব Blog Category লোড করা
        getAllBlogCategory: builder.query({
            query: () => ({
                url: "/blog-category",
                method: "GET",
            }),
            providesTags: ["BlogCategory"],
        }),

        // নতুন Blog Category তৈরি
        addBlogCategory: builder.mutation({
            query: ({ data }) => ({
                url: "/blog-category",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["BlogCategory"],
        }),

        // Blog Category আপডেট
        updateBlogCategory: builder.mutation({
            query: ({ params, data }) => ({
                url: `/blog-category/${params?.slug}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["BlogCategory"],
        }),

        // Blog Category ডিলিট
        deleteBlogCategory: builder.mutation({
            query: (params) => ({
                url: `/blog-category/${params?.slug}`,
                method: "DELETE",
            }),
            invalidatesTags: ["BlogCategory"],
        }),

        // Load All Blogs
        getAllBlogs: builder.query({
            query: () => "/blog", 
            providesTags: ["Blog"],
        }),

        // Add Blog
        addBlog: builder.mutation({
            query: ({ data }) => ({
                url: "/blog/create-blog",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Blog"],
        }),

        // Load Single Blog
        getBlogData: builder.query({
            query: (slug) => `/blog/${slug}`,
            providesTags: ["Blog"],
        }),

        // Update Single Blog
        updateBlog: builder.mutation({
            query: ({ params, data }) => ({
                url: `/blog/${params?.slug}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Blog"],
        }),

        // Delete Single Blog
        deleteBlog: builder.mutation({
            query: (params) => ({
                url: `/blog/${params?.slug}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Blog"],
        }),
    }),
    overrideExisting: false,
});

// Export hooks
export const {
    useGetAllBlogsQuery,
    useAddBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
    useGetBlogDataQuery,
    useGetAllBlogCategoryQuery,
    useAddBlogCategoryMutation,
    useUpdateBlogCategoryMutation,
    useDeleteBlogCategoryMutation,
} = blogApi;
