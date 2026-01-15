import { useMemo, useState, useEffect } from "react";
import CourseCategoryList from "../../components/courseCategory/courseCategoryList";
import CreateCourseCategoryModal from "../../components/courseCategory/courseCategoryFrom";
import DeleteConfirmModal from "../../ui/deleteConfrimModal";
import {
    useCreateCourseCategoryMutation,
    useDeleteCourseCategoryMutation,
    useGetAllCourseCategoryQuery,
    useUpdateCourseCategoryMutation,
} from "../../redux/features/api/courseCategory/courseCategory";
import useFormSubmit from "../../hooks/useFormSubmit";
import Button from "../../ui/button";
import DashboardWrapper from "../../routes/DashboardWrapper";

const CourseCategoryPage = () => {
    const { data: courseData, isLoading: listLoading, refetch: refetchCategories, isError } = useGetAllCourseCategoryQuery();

    const [createCourseCategory, { isLoading: createLoading }] = useCreateCourseCategoryMutation();
    const [updateCourseCategory, { isLoading: updateLoading }] = useUpdateCourseCategoryMutation();
    const [deleteCourseCategory, { isLoading: deleteLoading }] = useDeleteCourseCategoryMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // Filters / Search
    const [searchValue, setSearchValue] = useState("");
    const [yearFilter, setYearFilter] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const categories = useMemo(() => (courseData?.data ? courseData.data : []), [courseData]);

    useEffect(() => {
        // keep DashboardWrapper input in sync; it calls setSearchValue via prop
    }, []);


    const filteredCategories = useMemo(() => {
        if (!categories) return [];
        const s = (searchValue || "").trim().toLowerCase();
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        return categories.filter((item) => {
            // Search by title or slug
            if (s) {
                const title = (item.title || "").toLowerCase();
                const slug = (item.slug || "").toLowerCase();
                if (!(title.includes(s) || slug.includes(s))) return false;
            }

            if (yearFilter && (item.year || "") !== yearFilter) return false;

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
    }, [categories, searchValue, yearFilter, fromDate, toDate]);

    // Delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const { handleSubmitForm } = useFormSubmit();

    const handleCreateClick = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handleAddCategory = (newCategory) => {
        if (editingCategory) {
            handleSubmitForm({
                apiCall: updateCourseCategory,
                data: newCategory,
                params: { slug: editingCategory?.slug },
                onSuccess: () => {
                    handleModalClose();
                    refetchCategories();
                },
            });
        } else {
            handleSubmitForm({
                apiCall: createCourseCategory,
                data: newCategory,
                onSuccess: () => {
                    handleModalClose();
                    refetchCategories();
                },
            });
        }
    };

    const handleEditCategory = (_id) => {
        const categoryToEdit = categories.find((cat) => cat._id === _id);
        if (categoryToEdit) {
            setEditingCategory(categoryToEdit);
            setIsModalOpen(true);
        }
    };

    const handleDeleteClick = (slug) => {
        const cat = categories?.find((c) => c?.slug === slug);
        setCategoryToDelete(cat);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        handleSubmitForm({
            apiCall: deleteCourseCategory,
            params: { slug: categoryToDelete?.slug },
            onSuccess: () => {
                setDeleteModalOpen(false);
                setCategoryToDelete(null);
                refetchCategories();
            },
        });
    };

    const handleDeleteCancel = () => {
        setCategoryToDelete(null);
        setDeleteModalOpen(false);
    };

    const clearFilters = () => {
        setSearchValue("");
        setYearFilter("");
        setFromDate("");
        setToDate("");
    };

    return (
        <div className="p-5">
            <DashboardWrapper
                pageTitle="Course Categories"
                setValue={setSearchValue}
                loading={listLoading}
                actionElement={
                    <Button onClick={handleCreateClick} disabled={createLoading || updateLoading} size="md">
                        {createLoading || updateLoading ? "Saving..." : "Create Course Category"}
                    </Button>
                }
            >
                {/* Filters row */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 w-full max-w-3xl">
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-700 dark:text-gray-300">From:</label>
                            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-sm" />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-700 dark:text-gray-300">To:</label>
                            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-sm" />
                        </div>
                        <button onClick={clearFilters} className="ml-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm px-3 py-1 transition-colors">Clear</button>
                    </div>
                </div>

                {listLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
                    </div>
                ) : isError ? (
                    <div className="flex items-center justify-center py-10 text-gray-500">Failed to load categories.</div>
                ) : filteredCategories.length === 0 ? (
                    <div className="flex items-center justify-center py-20 text-lg font-semibold text-gray-500">No Categories Found 😔</div>
                ) : (
                    <CourseCategoryList categories={filteredCategories} onEdit={handleEditCategory} onDelete={handleDeleteClick} />
                )}
            </DashboardWrapper>
            {isModalOpen && (
                <CreateCourseCategoryModal isOpen={isModalOpen} onClose={handleModalClose} onCreate={handleAddCategory} initialData={editingCategory} loading={createLoading || updateLoading} />
            )}
            <DeleteConfirmModal isOpen={deleteModalOpen} onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} message={deleteLoading ? "Deleting..." : `Are you sure you want to delete "${categoryToDelete?.title}"?`} />
        </div>
    );
};

export default CourseCategoryPage;
