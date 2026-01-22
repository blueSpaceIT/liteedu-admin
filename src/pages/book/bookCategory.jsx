import { useMemo, useState, useEffect } from "react";
import DashboardWrapper from "../../routes/DashboardWrapper";
import {
    useGetAllBookCategoryQuery,
    useAddBookCategoryMutation,
    useUpdateBookCategoryMutation,
    useDeleteBookCategoryMutation,
} from "../../redux/features/api/book/bookApi";
import BookCategoryTable from "../../components/book/bookCategoryTable";
import AddBookCategory from "../../components/book/AddBookCategory";
import Button from "../../UI/button";
import useFormSubmit from "../../hooks/useFormSubmit";
import { toast } from "react-toastify";
import Pagination from "../../components/pagination";

const BookCategory = () => {
    const [addBookCategory, { isLoading: createLoading }] = useAddBookCategoryMutation();
    const [updateBookCategory, { isLoading: updateLoading }] = useUpdateBookCategoryMutation();
    const [deleteBookCategory, { isLoading: deleteLoading }] = useDeleteBookCategoryMutation();
    const { handleSubmitForm } = useFormSubmit();

    // === Debounced search setup ===
    const [searchInput, setSearchInput] = useState(""); // immediate UI input (from DashboardWrapper)
    const [search, setSearch] = useState(""); // debounced value actually sent to API
    const DEBOUNCE_MS = 500;

    // client-side filters
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [includeDeleted, setIncludeDeleted] = useState(false);

    // pagination
    const [page, setPage] = useState(1);
    const [limit] = useState(20);

    // fetch data (server call uses `search` which is debounced)
    const { data, isLoading: listLoading, isError, refetch } = useGetAllBookCategoryQuery({ search });

    // modal / edit state
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // base categories from server
    const bookCategories = useMemo(() => data?.data || [], [data]);

    // debounce effect: update `search` after typing stops for DEBOUNCE_MS
    useEffect(() => {
        const t = setTimeout(() => {
            setSearch(searchInput.trim());
        }, DEBOUNCE_MS);
        return () => clearTimeout(t);
    }, [searchInput]);

    // client-side filtered result (applies date range & deleted filter)
    const filteredCategories = useMemo(() => {
        if (!bookCategories) return [];

        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        return bookCategories.filter((cat) => {
            // deleted filter
            if (!includeDeleted && cat.isDeleted) return false;

            // date range filter on createdAt
            if (from || to) {
                const created = cat.createdAt ? new Date(cat.createdAt) : null;
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
    }, [bookCategories, includeDeleted, fromDate, toDate]);

    // pagination computed from filteredCategories (client-side)
    const totalPages = useMemo(() => Math.max(Math.ceil(filteredCategories.length / limit), 1), [filteredCategories.length, limit]);

    const paginatedCategories = useMemo(() => {
        const start = (page - 1) * limit;
        return filteredCategories.slice(start, start + limit);
    }, [filteredCategories, page, limit]);

    useEffect(() => {
        // whenever server search (debounced) or client filters change, reset page
        setPage(1);
    }, [search, includeDeleted, fromDate, toDate]);

    const handlePageChange = (newPage) => {
        if (newPage < 1) return;
        if (newPage > totalPages) return;
        setPage(newPage);
    };

    // Open Add modal
    const handleCreateClick = () => {
        setEditingCategory(null);
        setModalOpen(true);
    };

    // Close modal
    const handleModalClose = () => {
        setModalOpen(false);
        setEditingCategory(null);
    };

    // Add or update category
    const handleAddOrUpdateCategory = (categoryData) => {
        if (editingCategory) {
            const updateData = {
                ...categoryData,
                id: editingCategory._id || editingCategory.id,
                slug: editingCategory.slug,
            };

            handleSubmitForm({
                apiCall: updateBookCategory,
                data: updateData,
                params: { slug: editingCategory.slug },
                onSuccess: () => {
                    handleModalClose();
                    refetch?.();
                },
                onError: (error) => {
                    toast.error(error?.data?.message || "Failed to update category.");
                },
            });
        } else {
            handleSubmitForm({
                apiCall: addBookCategory,
                data: categoryData,
                onSuccess: () => {
                    handleModalClose();
                    refetch?.();
                },
                onError: (error) => {
                    toast.error(error?.data?.message || "Failed to create category.");
                },
            });
        }
    };

    // Edit category - prepare defaults for form
    const handleEditCategory = (slug) => {
        const category = bookCategories.find((cat) => cat.slug === slug);
        if (category) {
            const categoryForEdit = {
                ...category,
                name: category.name || "",
                description: category.description || "",
                isDeleted: category.isDeleted || false,
            };
            setEditingCategory(categoryForEdit);
            setModalOpen(true);
        } else {
            toast.error("Category not found!");
        }
    };

    // Delete category
    const handleDeleteCategory = async (slug) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            await handleSubmitForm({
                apiCall: deleteBookCategory,
                params: { slug },
            });
            toast.success("Category deleted successfully!");
            refetch?.();
        } catch (err) {
            console.error(err);
            toast.error(err?.data?.message || "Failed to delete category.");
        }
    };

    // Clear client-side filters and the search input
    const clearFilters = () => {
        setFromDate("");
        setToDate("");
        setIncludeDeleted(false);
        setSearchInput("");
        setSearch("");
    };

    return (
        <div className="p-5">
            <DashboardWrapper
                pageTitle="Book Categories"
                // pass the local setter to DashboardWrapper so typing updates local input
                setValue={(val) => setSearchInput(val)}
                actionElement={
                    <Button
                        onClick={handleCreateClick}
                        size="md"
                        disabled={createLoading || updateLoading || deleteLoading}
                    >
                        {createLoading || updateLoading || deleteLoading ? "Saving..." : "Add Category"}
                    </Button>
                }
            >
                {/* Filters row (client-side filters) */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-700 dark:text-gray-300">From:</label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-700 dark:text-gray-300">To:</label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800"
                            />
                        </div>

                        <button
                            onClick={clearFilters}
                            className="ml-2 rounded-md bg-gray-200 px-3 py-1 text-sm transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            Clear
                        </button>
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Showing <span className="font-medium text-gray-800 dark:text-gray-100">{filteredCategories.length}</span> categories
                    </div>
                </div>

                {/* Loader / list */}
                {listLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
                    </div>
                ) : isError ? (
                    <div className="flex items-center justify-center py-10 text-gray-500 dark:text-gray-400">Failed to load categories.</div>
                ) : filteredCategories.length === 0 ? (
                    <div className="flex items-center justify-center py-20 text-lg font-semibold text-gray-500 dark:text-gray-400">
                        No Categories Found 😔
                    </div>
                ) : (
                    <>
                        <BookCategoryTable
                            bookCategory={paginatedCategories}
                            onEdit={handleEditCategory}
                            onDelete={handleDeleteCategory}
                        />

                        {/* Pagination */}
                        {filteredCategories.length > 0 && (
                            <div className="mt-4">
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </>
                )}

                {/* Add/Edit Modal - pass isEditMode flag */}
                {modalOpen && (
                    <AddBookCategory
                        close={handleModalClose}
                        initialData={editingCategory}
                        onSubmit={handleAddOrUpdateCategory}
                        loading={createLoading || updateLoading}
                        isEditMode={!!editingCategory}
                    />
                )}
            </DashboardWrapper>
        </div>
    );
};

export default BookCategory;
