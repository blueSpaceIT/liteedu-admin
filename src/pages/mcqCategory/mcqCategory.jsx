import { useMemo, useState, useEffect } from "react";

import { CreateMcqCategoryModal } from "../../components/mcqCategory/mcqCategoryForm";
import DeleteConfirmModal from "../../ui/deleteConfrimModal";
import useFormSubmit from "../../hooks/useFormSubmit";
import {
    useCreateMcqCategoryMutation,
    useDeleteMcqCategoryMutation,
    useGetAllMcqCategoryQuery,
    useUpdateMcqCategoryMutation,
} from "../../redux/features/api/mcqCategory/mcqCategory";
import McqCategoryList from "../../components/mcqCategory/mcqCategoryList"; // styled MCQ table

const McqCategory = () => {
    // Fetch Categories
    const { data: mcqData, isLoading: listLoading, isError } = useGetAllMcqCategoryQuery();

    // Mutations
    const [createCategory, { isLoading: createLoading }] = useCreateMcqCategoryMutation();
    const [updateCategory, { isLoading: updateLoading }] = useUpdateMcqCategoryMutation();
    const [deleteCategory, { isLoading: deleteLoading }] = useDeleteMcqCategoryMutation();

    // States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const mcqCategories = useMemo(() => mcqData?.data || [], [mcqData]);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const { handleSubmitForm } = useFormSubmit();

    // --- Filters / Search / Pagination ---
    const [searchTerm, setSearchTerm] = useState("");
    const [titleFilter, setTitleFilter] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, titleFilter, fromDate, toDate]);

    const distinctTitles = useMemo(() => {
        return Array.from(new Set(mcqCategories.map((c) => c.title).filter(Boolean)));
    }, [mcqCategories]);

    const filteredCategories = useMemo(() => {
        if (!mcqCategories || !mcqCategories.length) return [];

        const s = searchTerm.trim().toLowerCase();
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        return mcqCategories.filter((c) => {
            // Search (title / slug)
            if (s) {
                const title = (c.title || "").toLowerCase();
                const slug = (c.slug || "").toLowerCase();
                if (!(title.includes(s) || slug.includes(s))) return false;
            }

            // Title dropdown filter (exact match)
            if (titleFilter) {
                if ((c.title || "") !== titleFilter) return false;
            }

            // Date range filter (createdAt)
            if (from || to) {
                const created = c.createdAt ? new Date(c.createdAt) : null;
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
    }, [mcqCategories, searchTerm, titleFilter, fromDate, toDate]);

    const paginatedCategories = useMemo(() => {
        const start = (currentPage - 1) * limit;
        return filteredCategories.slice(start, start + limit);
    }, [filteredCategories, currentPage, limit]);

    const totalPages = Math.max(Math.ceil(filteredCategories.length / limit), 1);

    // --- Handlers ---
    const handleCreateClick = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setEditingCategory(null);
        setIsModalOpen(false);
    };

    const handleAddOrUpdateCategory = (newCategory) => {
        if (editingCategory) {
            handleSubmitForm({
                apiCall: updateCategory,
                data: newCategory,
                params: { slug: editingCategory.slug },
                onSuccess: () => handleModalClose(),
            });
        } else {
            handleSubmitForm({
                apiCall: createCategory,
                data: newCategory,
                onSuccess: () => handleModalClose(),
            });
        }
    };

    const handleEditCategory = (slug) => {
        const cat = mcqCategories.find((c) => c.slug === slug);
        if (cat) {
            setEditingCategory(cat);
            setIsModalOpen(true);
        }
    };

    const handleDeleteClick = (slug) => {
        const cat = mcqCategories.find((c) => c.slug === slug);
        if (cat) {
            setCategoryToDelete(cat);
            setDeleteModalOpen(true);
        }
    };

    const handleDeleteConfirm = () => {
        handleSubmitForm({
            apiCall: deleteCategory,
            params: { slug: categoryToDelete.slug },
            onSuccess: () => {
                setDeleteModalOpen(false);
                setCategoryToDelete(null);
            },
        });
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setCategoryToDelete(null);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setTitleFilter("");
        setFromDate("");
        setToDate("");
    };

    return (
        <div className="min-h-screen bg-white p-6 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
            {/* Header + Controls */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-semibold">MCQ Category</h1>

                <div className="flex w-full max-w-3xl flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by title or slug..."
                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />

                    <select
                        value={titleFilter}
                        onChange={(e) => setTitleFilter(e.target.value)}
                        className="rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    >
                        <option value="">All Titles</option>
                        {distinctTitles.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>

                    <button
                        onClick={handleCreateClick}
                        disabled={createLoading || updateLoading}
                        className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {createLoading || updateLoading ? "Saving..." : "Create"}
                    </button>
                </div>
            </div>

            {/* Date filters + Clear */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <label className="text-sm">From:</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm">To:</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                </div>

                <button onClick={clearFilters} className="rounded-md bg-gray-200 dark:bg-gray-700 px-3 py-1 text-sm hover:bg-gray-300 dark:hover:bg-gray-600">Clear</button>
            </div>

            {/* Content (list / loading / empty) */}
            <div>
                {listLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
                    </div>
                ) : isError ? (
                    <div className="flex items-center justify-center py-10 text-gray-500">Failed to load categories.</div>
                ) : !filteredCategories.length ? (
                    <div className="flex items-center justify-center py-10 text-gray-500">No categories found.</div>
                ) : (
                    <>
                        <McqCategoryList
                            categories={paginatedCategories}
                            onEdit={handleEditCategory}
                            onDelete={handleDeleteClick}
                        />

                        {/* Pagination */}
                        <div className="mt-4 flex items-center justify-end gap-3">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Page {currentPage} of {totalPages}</p>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="rounded px-3 py-1 bg-gray-100 dark:bg-gray-800">Prev</button>
                                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} className="rounded px-3 py-1 bg-gray-100 dark:bg-gray-800">Next</button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Create / Edit Modal */}
            <CreateMcqCategoryModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onCreate={handleAddOrUpdateCategory}
                initialData={editingCategory}
                loading={createLoading || updateLoading}
            />

            {/* Delete Confirmation */}
            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                message={deleteLoading ? "Deleting..." : `Are you sure you want to delete "${categoryToDelete?.title}"?`}
            />
        </div>
    );
};

export default McqCategory;
