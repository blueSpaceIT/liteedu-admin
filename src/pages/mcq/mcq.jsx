/* eslint-disable no-unused-vars */
import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import McqHeader from "../../components/mcq/mcqHeader/mcqHeader";
import McqCreateForm from "../../components/mcq/mcqCreateFrom/mcqCreateForm";
import BulkUploadModal from "../../components/mcq/bulkupload/bulkupload";
import McqTable from "../../components/mcq/mcqtable/mcqtable";
import McqEditModal from "../../components/mcq/mcqeditmodal/mcqeditmodal";
import ConfirmDeleteModal from "../../package/deleteModalOpen";
import { useDeleteMcqMutation, useGetMcqsQuery } from "../../redux/features/api/mcq/mcqApi";
import { useGetAllMcqCategoryQuery } from "../../redux/features/api/mcqCategory/mcqCategory";

const Mcq = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const limit = 10;

    // Fetch MCQs
    const { data, isFetching } = useGetMcqsQuery({ page, limit });

    // Fetch categories
    const { data: categoryData, isLoading: categoriesLoading } = useGetAllMcqCategoryQuery();

    const [deleteMcq] = useDeleteMcqMutation();

    // Modals
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isBulkOpen, setIsBulkOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Edit & Delete handlers
    const handleEdit = (mcq) => {
        setEditData(mcq);
        setEditModalOpen(true);
    };

    const handleSaveEdit = () => {
        setEditData(null);
        setEditModalOpen(false);
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            const result = await deleteMcq({ params: { _id: id } }).unwrap();
            toast.success("MCQ deleted successfully");
            setDeleteModalOpen(false);
        } catch (err) {
            // Do nothing here, suppress global error
            // No toast, no console.error
        }
    };

    const loading = isFetching || categoriesLoading;

    // Filter MCQs
    const filteredMcqs = useMemo(() => {
        if (!data?.data) return [];
        return data.data.filter((mcq) => {
            const matchesSearch = mcq.question.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = selectedCategory ? mcq.category === selectedCategory : true;
            return matchesSearch && matchesCategory;
        });
    }, [data, search, selectedCategory]);

    const handlePageChange = (newPage) => {
        if (newPage < 1) return;
        setPage(newPage);
    };

    return (
        <div className="p-4">
            <McqHeader
                onCreateClick={() => setIsCreateOpen(true)}
                onBulkClick={() => setIsBulkOpen(true)}
                searchValue={search}
                setSearchValue={setSearch}
                loading={loading}
                categories={categoryData?.data}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />

            {loading ? (
                <div className="flex items-center justify-center py-10">
                    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
                </div>
            ) : filteredMcqs.length === 0 ? (
                <div className="mt-20 text-center text-lg font-medium text-gray-500 dark:text-gray-400">No MCQs found 😢</div>
            ) : (
                <>
                    <McqTable
                        mcqs={filteredMcqs}
                        categories={categoryData?.data}
                        onEdit={handleEdit}
                        onDelete={confirmDelete}
                    />
                    <div className="mt-4 flex justify-end gap-3">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1 || loading}
                            className="rounded-lg bg-gray-400 px-4 py-2 text-white disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700">{page}</span>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={filteredMcqs.length < limit || loading}
                            className="rounded-lg bg-gray-600 px-4 py-2 text-white disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg p-6 shadow-lg">
                        <McqCreateForm onClose={() => setIsCreateOpen(false)} />
                    </div>
                </div>
            )}

            {isBulkOpen && <BulkUploadModal onClose={() => setIsBulkOpen(false)} />}

            {editModalOpen && (
                <McqEditModal
                    mcq={editData}
                    selectedCategoryId={editData?.category?._id || ""}
                    onClose={() => setEditModalOpen(false)}
                    onUpdate={handleSaveEdit}
                />
            )}

            {deleteModalOpen && (
                <ConfirmDeleteModal
                    id={deleteId}
                    deleteFn={() => handleDelete(deleteId)}
                    onClose={() => setDeleteModalOpen(false)}
                    title="Delete MCQ"
                    message="Are you sure you want to delete this MCQ?"
                />
            )}
        </div>
    );
};

export default Mcq;
