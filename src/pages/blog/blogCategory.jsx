import { useMemo, useState, useEffect } from "react";
import DashboardWrapper from "../../routes/DashboardWrapper";
import { useGetAllBlogCategoryQuery } from "../../redux/features/api/blog/blogApi";
import Button from "../../UI/button";
import AddBlogCategory from "../../components/blog/AddBlogCategory";
import BlogCategoryTable from "../../components/blog/BlogCategoryTable";
import Pagination from "../../components/pagination";

const BlogCategory = () => {
    const [addCategory, setAddCategory] = useState(false);

    // 🔍 Filters & search
    const [searchValue, setSearchValue] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [includeDeleted, setIncludeDeleted] = useState(false);

    // 📄 Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 15;

    // 🧩 Fetch API
    const { data, isLoading } = useGetAllBlogCategoryQuery();
    const categories = useMemo(() => data?.data || [], [data]);

    // 🔹 Filtering logic
    const filteredCategories = useMemo(() => {
        return categories.filter((cat) => {
            // search filter
            const matchesSearch = cat.title.toLowerCase().includes(searchValue.toLowerCase());

            // deleted filter
            if (!includeDeleted && cat.isDeleted) return false;

            // date filter
            const created = new Date(cat.createdAt);
            const from = fromDate ? new Date(fromDate) : null;
            const to = toDate ? new Date(toDate) : null;

            const matchesDate = (!from || created >= from) && (!to || created <= new Date(to.setHours(23, 59, 59, 999)));

            return matchesSearch && matchesDate;
        });
    }, [categories, searchValue, includeDeleted, fromDate, toDate]);

    // 🔹 Paginate filtered results
    const paginatedCategories = useMemo(() => {
        const start = (currentPage - 1) * limit;
        return filteredCategories.slice(start, start + limit);
    }, [filteredCategories, currentPage, limit]);

    const totalPages = Math.ceil(filteredCategories.length / limit);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchValue, fromDate, toDate, includeDeleted]);

    const handleClearFilters = () => {
        setSearchValue("");
        setFromDate("");
        setToDate("");
        setIncludeDeleted(false);
    };

    return (
        <div className="p-5">
            <DashboardWrapper
                pageTitle="Blog Category"
                setValue={setSearchValue}
                loading={isLoading}
                actionElement={
                    <Button
                        onClick={() => setAddCategory(true)}
                        size="md"
                    >
                        Add Category
                    </Button>
                }
            >
                {/* 🔹 Filters */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* From Date */}
                        <div className="flex items-center gap-1">
                            <label className="text-sm text-gray-700 dark:text-gray-300">From:</label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                            />
                        </div>

                        {/* To Date */}
                        <div className="flex items-center gap-1">
                            <label className="text-sm text-gray-700 dark:text-gray-300">To:</label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                            />
                        </div>

                        {/* Include Deleted */}
                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                checked={includeDeleted}
                                onChange={(e) => setIncludeDeleted(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800"
                            />
                            Include Deleted
                        </label>

                        {/* Clear */}
                        <button
                            onClick={handleClearFilters}
                            className="rounded-md bg-gray-200 px-3 py-1 text-sm text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                        >
                            Clear
                        </button>
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Showing <span className="font-medium text-gray-800 dark:text-gray-100">{filteredCategories.length}</span> results
                    </div>
                </div>

                {/* 🔹 Table / Loader */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div className="flex items-center justify-center py-40 text-lg font-semibold text-gray-500 dark:text-gray-400">
                        No Category Found 😔
                    </div>
                ) : (
                    <>
                        <BlogCategoryTable blogCategory={paginatedCategories} />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}

                {addCategory && <AddBlogCategory close={() => setAddCategory(false)} />}
            </DashboardWrapper>
        </div>
    );
};

export default BlogCategory;
