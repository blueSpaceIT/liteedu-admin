import { useMemo, useState, useEffect } from "react";
import { useGetAllBookQuery, useGetAllBookCategoryQuery } from "../../redux/features/api/book/bookApi";
import DashboardWrapper from "../../routes/DashboardWrapper";
import BookTable from "../../components/book/bookTable";
import Button from "../../UI/button";
import AddBookModal from "../../components/book/AddBookModal";
import Pagination from "../../components/pagination";

const Book = () => {
    const [addBook, setAddBook] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(20);

    // 🔹 New filter states
    const [categoryFilter, setCategoryFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [bookTypeFilter, setBookTypeFilter] = useState("");
    const [priceMin, setPriceMin] = useState("");
    const [priceMax, setPriceMax] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [includeDeleted, setIncludeDeleted] = useState(false);

    // 📚 API Calls
    const { data, isLoading: bookLoading } = useGetAllBookQuery({ search, page, limit });
    const { data: categoryData } = useGetAllBookCategoryQuery();
    const categories = useMemo(() => categoryData?.data || [], [categoryData]);

    const books = useMemo(() => data?.data || [], [data]);

    // 🔹 Apply filters (client-side)
    const filteredBooks = useMemo(() => {
        return books.filter((book) => {
            if (!includeDeleted && book.isDeleted) return false;
            if (categoryFilter && book.categoryId !== categoryFilter) return false;
            if (statusFilter && book.status !== statusFilter) return false;
            if (bookTypeFilter && book.bookType !== bookTypeFilter) return false;
            if (priceMin && Number(book.price) < Number(priceMin)) return false;
            if (priceMax && Number(book.price) > Number(priceMax)) return false;

            if (fromDate || toDate) {
                const created = new Date(book.createdAt);
                if (fromDate && created < new Date(fromDate)) return false;
                if (toDate && created > new Date(toDate)) return false;
            }

            return true;
        });
    }, [books, includeDeleted, categoryFilter, statusFilter, bookTypeFilter, priceMin, priceMax, fromDate, toDate]);

    // 🔹 Pagination
    const totalPages = useMemo(() => {
        return filteredBooks.length < limit ? page : page + 1;
    }, [filteredBooks.length, limit, page]);

    const handlePageChange = (newPage) => {
        if (newPage < 1) return;
        setPage(newPage);
    };

    useEffect(() => {
        setPage(1);
    }, [search, categoryFilter, statusFilter, bookTypeFilter, priceMin, priceMax, fromDate, toDate, includeDeleted]);

    // 🔹 Clear filters
    const handleClearFilters = () => {
        setCategoryFilter("");
        setStatusFilter("");
        setBookTypeFilter("");
        setPriceMin("");
        setPriceMax("");
        setFromDate("");
        setToDate("");
        setIncludeDeleted(false);
    };

    return (
        <div className="p-5">
            <DashboardWrapper
                pageTitle="Books"
                setValue={setSearch}
                loading={bookLoading}
                actionElement={
                    <Button
                        onClick={() => setAddBook(true)}
                        size="md"
                    >
                        Add Books
                    </Button>
                }
            >
                {/* Filters */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Category */}
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option
                                    key={cat._id}
                                    value={cat._id}
                                >
                                    {cat.name || cat.title}
                                </option>
                            ))}
                        </select>

                        {/* Status */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                        >
                            <option value="">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>

                        {/* Type */}
                        <select
                            value={bookTypeFilter}
                            onChange={(e) => setBookTypeFilter(e.target.value)}
                            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                        >
                            <option value="">All Types</option>
                            <option value="Ebook">Ebook</option>
                            <option value="Physical">Physical</option>
                        </select>

                        {/* Price range */}
                        <input
                            type="number"
                            placeholder="Min Price"
                            value={priceMin}
                            onChange={(e) => setPriceMin(e.target.value)}
                            className="w-24 rounded-md border border-gray-300 bg-white px-2 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                        />
                        <input
                            type="number"
                            placeholder="Max Price"
                            value={priceMax}
                            onChange={(e) => setPriceMax(e.target.value)}
                            className="w-24 rounded-md border border-gray-300 bg-white px-2 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                        />

                        {/* Date range */}
                        <div className="flex items-center gap-1">
                            <label className="text-sm text-gray-700 dark:text-gray-300">From:</label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                            />
                        </div>
                        <div className="flex items-center gap-1">
                            <label className="text-sm text-gray-700 dark:text-gray-300">To:</label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                            />
                        </div>
                        {/* Clear */}
                        <button
                            onClick={handleClearFilters}
                            className="rounded-md bg-gray-200 px-3 py-1 text-sm text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                        >
                            Clear
                        </button>
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Showing <span className="font-medium text-gray-800 dark:text-gray-100">{filteredBooks.length}</span> results
                    </div>
                </div>

                {/* Table */}
                {bookLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
                    </div>
                ) : (
                    <BookTable
                        books={filteredBooks}
                        page={page}
                        limit={limit}
                    />
                )}

                {!bookLoading && filteredBooks.length > 0 && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}

                {addBook && <AddBookModal onClose={() => setAddBook(false)} />}
            </DashboardWrapper>
        </div>
    );
};

export default Book;
