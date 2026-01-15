import { useMemo, useState, useEffect } from "react";
import DashboardWrapper from "../../routes/DashboardWrapper";
import BlogTable from "../../components/blog/BlogTable";
import { useGetAllBlogsQuery, useGetAllBlogCategoryQuery } from "../../redux/features/api/blog/blogApi";
import Button from "../../ui/button";
import AddBlog from "../../components/blog/AddBlog";
import Pagination from "../../components/pagination";

const Blog = () => {
    const [addBlog, setAddBlog] = useState(false);

    // search (from DashboardWrapper)
    const [searchValue, setSearchValue] = useState("");
    // filters
    const [categoryFilter, setCategoryFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [tagFilter, setTagFilter] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [includeDeleted, setIncludeDeleted] = useState(false);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    // fetch blogs and categories
    const { data, isLoading, error } = useGetAllBlogsQuery();
    const { data: catData } = useGetAllBlogCategoryQuery();

    const blogs = useMemo(() => data?.data || [], [data]);
    const categories = useMemo(() => catData?.data || [], [catData]);

    // reset to page 1 when filters/search change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchValue, categoryFilter, statusFilter, tagFilter, fromDate, toDate, includeDeleted]);

    // filtered list
    const filteredBlogs = useMemo(() => {
        if (!blogs) return [];

        const s = (searchValue || "").trim().toLowerCase();
        const tagQ = (tagFilter || "").trim().toLowerCase();
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        return blogs.filter((item) => {
            // deleted filter
            if (!includeDeleted && item.isDeleted) return false;

            // title search (also search description)
            if (s) {
                const title = (item.title || "").toLowerCase();
                const desc = (item.description || "").toLowerCase();
                if (!title.includes(s) && !desc.includes(s)) return false;
            }

            // category
            if (categoryFilter) {
                const catId = item.categoryId?._id || (item.categoryId || "");
                if (catId !== categoryFilter) return false;
            }

            // status
            if (statusFilter && ((item.status || "").toLowerCase() !== statusFilter.toLowerCase())) return false;

            // tags (check any tag includes query)
            if (tagQ) {
                const tags = (item.tags || []).map((t) => (t || "").toLowerCase());
                if (!tags.some((t) => t.includes(tagQ))) return false;
            }

            // date range (createdAt)
            if (from || to) {
                const created = item.createdAt ? new Date(item.createdAt) : null;
                if (!created) return false;
                if (from && created < from) return false;
                if (to) {
                    const toEnd = new Date(to);
                    toEnd.setHours(23, 59, 59, 999);
                    if (created > toEnd) return false;
                }
            }

            return true;
        });
    }, [blogs, searchValue, categoryFilter, statusFilter, tagFilter, fromDate, toDate, includeDeleted]);

    // pagination slice
    const paginatedBlogs = useMemo(() => {
        const start = (currentPage - 1) * limit;
        return filteredBlogs.slice(start, start + limit);
    }, [filteredBlogs, currentPage, limit]);

    const totalPages = Math.max(Math.ceil(filteredBlogs.length / limit), 1);

    const handlePageChange = (newPage) => {
        if (newPage < 1) return;
        if (newPage > totalPages) return;
        setCurrentPage(newPage);
    };

    const clearFilters = () => {
        setCategoryFilter("");
        setStatusFilter("");
        setTagFilter("");
        setFromDate("");
        setToDate("");
        setIncludeDeleted(false);
        setSearchValue("");
    };

    return (
        <div className="p-5">
            <DashboardWrapper
                pageTitle="Blogs"
                setValue={setSearchValue}
                loading={isLoading}
                actionElement={
                    <Button onClick={() => setAddBlog(!addBlog)} size="md">
                        Add Blog
                    </Button>
                }
            >
                {/* Filters row */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Category dropdown */}
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-3 py-2 text-sm"
                        >
                            <option value="">All Categories</option>
                            {categories.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.title}
                                </option>
                            ))}
                        </select>

                        {/* Status */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-3 py-2 text-sm"
                        >
                            <option value="">All Status</option>
                            <option value="Drafted">Drafted</option>
                            <option value="Published">Published</option>
                            <option value="Archived">Archived</option>
                        </select>

                        {/* Tag search */}
                        <input
                            type="text"
                            placeholder="Filter by tag"
                            value={tagFilter}
                            onChange={(e) => setTagFilter(e.target.value)}
                            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-3 py-2 text-sm"
                        />

                        {/* Date range */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-700 dark:text-gray-300">From:</label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-2 py-1 text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-700 dark:text-gray-300">To:</label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-2 py-1 text-sm"
                            />
                        </div>
                        {/* Clear */}
                        <button
                            onClick={clearFilters}
                            className="ml-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 px-3 py-1 text-sm transition-colors"
                        >
                            Clear
                        </button>
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Showing <span className="font-medium text-gray-800 dark:text-gray-100">{filteredBlogs.length}</span> results
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center py-20 font-semibold text-red-500">Error loading blogs</div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="flex items-center justify-center py-20 text-lg font-semibold text-gray-500 dark:text-gray-400">No Blog Found 😔</div>
                ) : (
                    <>
                        <BlogTable blogs={paginatedBlogs} currentPage={currentPage} limit={limit} />
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </>
                )}

                {addBlog && <AddBlog close={() => setAddBlog(false)} />}
            </DashboardWrapper>
        </div>
    );
};

export default Blog;
