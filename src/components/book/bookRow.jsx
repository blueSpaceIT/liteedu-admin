/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Edit, Trash2, User } from "lucide-react";
import DeleteConfirmModal from "../../ui/deleteConfrimModal";
import useFormSubmit from "../../hooks/useFormSubmit";
import { useUpdateBookMutation, useDeleteBookMutation, useGetAllBookCategoryQuery } from "../../redux/features/api/book/bookApi";

const BookRow = ({ book, index, onDelete, onEdit, page, limit }) => {
    const [status, setStatus] = useState(book.status);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { handleSubmitForm } = useFormSubmit();

    const handleDeleteConfirm = () => {
        setIsDeleteModalOpen(false);
        if (onDelete) {
            onDelete(book.slug);
        }
    };

    useEffect(() => {
        setStatus(book.status);
    }, [book.status]);

    const getStatusClass = () => {
        switch (status) {
            case "Active":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case "Drafted":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
        }
    };

    return (
        <>
            <tr className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                <td className="px-2 py-3 text-center font-semibold text-gray-700 dark:text-gray-200">{(page - 1) * limit + index + 1}</td>

                <td className="flex items-center gap-2 px-2 py-3">
                    {book.coverPhoto ? (
                        <img
                            src={book.coverPhoto}
                            alt={"Logo"}
                            className="h-10 w-10 rounded-full border border-gray-300 object-cover dark:border-gray-700"
                        />
                    ) : (
                        <User className="h-10 w-10 text-gray-400" />
                    )}
                </td>

                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{book.title || "-"}</td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{book.description || "-"}</td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{book.bookType || "-"}</td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{book.price || "-"}</td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{book.stock || "-"}</td>
                <td className="flex justify-center gap-2 px-2 py-3 text-center">
                    {/* Edit book details */}
                    <button
                        onClick={() => onEdit && onEdit(book)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <Edit />
                    </button>

                    {/* Delete book */}
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="text-red-600 hover:text-red-800"
                    >
                        <Trash2 />
                    </button>
                </td>
            </tr>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                message={`Are you sure you want to delete "${book.title}"?`}
            />
        </>
    );
};

export default BookRow;
