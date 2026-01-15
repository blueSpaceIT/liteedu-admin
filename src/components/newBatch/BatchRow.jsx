/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useDeleteNewBatchMutation } from "../../redux/features/api/newBatch/newBatchApi";
import EditBatch from "./EditBatch"; // adjust path
import DeleteConfirmModal from "../../ui/deleteConfrimModal";

const BatchRow = ({ batchData, index }) => {
    const [deleteBatch, { isLoading }] = useDeleteNewBatchMutation();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });

    const handleDelete = async () => {
        if (window.confirm(`Delete "${batchData.title}"?`)) {
            try {
                await deleteBatch(batchData.slug).unwrap(); // pass slug directly
                toast.success("Batch deleted successfully");
            } catch (err) {
                toast.error(err?.data?.message || "Failed to delete batch");
            }
        }
    };

    return (
        <>
            <tr className="border-b transition-colors duration-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                <td className="px-2 py-3 text-center text-gray-900 dark:text-gray-100">{index + 1}</td>
                <td className="px-2 py-3 text-gray-900 dark:text-gray-100">{batchData.title}</td>
                <td className="px-2 py-3">
                    <span
                        className={`rounded-xl px-2 py-1 text-xs font-medium ${
                            batchData.status === "Active"
                                ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100"
                                : "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100"
                        }`}
                    >
                        {batchData.status}
                    </span>
                </td>
                <td className="px-2 py-3 text-gray-900 dark:text-gray-100">{formatDate(batchData.createdAt)}</td>
                <td className="flex justify-center gap-2 px-2 py-3 text-center">
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="text-blue-600 transition-colors duration-200 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="text-red-600 transition-colors duration-200 hover:text-red-800 disabled:opacity-50 dark:text-red-400 dark:hover:text-red-200"
                    >
                        <Trash2 size={18} />
                    </button>
                </td>
            </tr>

            {/* Edit Batch Modal */}
            {isEditModalOpen && (
                <EditBatch
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    batchData={batchData}
                    onUpdateSuccess={() => {
                        // Optional: refetch or handle post-update actions here
                    }}
                />
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <DeleteConfirmModal
                    isOpen={isDeleteModalOpen}
                    onCancel={() => setIsDeleteModalOpen(false)}
                    onConfirm={async () => {
                        try {
                            await deleteBatch(batchData.slug).unwrap();
                            toast.success("Batch deleted successfully");
                            setIsDeleteModalOpen(false);
                        } catch (err) {
                            toast.error(err?.data?.message || "Failed to delete batch");
                        }
                    }}
                    message={`Are you sure you want to delete "${batchData.title}"?`}
                />
            )}
        </>
    );
};

export default BatchRow;
