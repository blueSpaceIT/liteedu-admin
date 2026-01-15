/* eslint-disable react/prop-types */
import { Edit, Trash2 } from "lucide-react";
import DeleteConfirmModal from "../../ui/deleteConfrimModal";
import { useDeleteBookCategoryMutation } from "../../redux/features/api/book/bookApi";
import useFormSubmit from "../../hooks/useFormSubmit";
import { useState } from "react";

const BookCategoryRow = ({ categoryData, index, onEdit }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { handleSubmitForm } = useFormSubmit();
    const [deleteBookCategory] = useDeleteBookCategoryMutation();
    // eslint-disable-next-line no-unused-vars
    const getStatusClass = (status) => {
        switch (status) {
            case "Active":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case "Blocked":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
        }
    };

    const handleDeleteConfirm = () => {
        handleSubmitForm({
            apiCall: deleteBookCategory,
            params: { slug: categoryData.slug },
            onSuccess: () => setIsDeleteModalOpen(false),
            onError: () => alert("Failed to delete category."),
        });
    };

    return (
        <>
            <tr className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                <td className="px-2 py-3 font-semibold text-center text-gray-700 dark:text-gray-200">{index + 1}</td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{categoryData.name || categoryData.title || "-"}</td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{categoryData.description || "-"}</td>
                
                <td className="flex justify-center gap-2 px-2 py-3 text-center">
                    <button
                        onClick={() => onEdit && onEdit(categoryData.slug)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <Edit />
                    </button>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="text-red-600 hover:text-red-800"
                    >
                        <Trash2 />
                    </button>
                </td>
            </tr>

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                message={`Are you sure you want to delete "${categoryData.name || categoryData.title}"?`}
            />
        </>
    );
};

export default BookCategoryRow;