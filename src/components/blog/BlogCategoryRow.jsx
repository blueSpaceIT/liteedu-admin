/* eslint-disable react/prop-types */
import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import DeleteConfirmModal from "../../ui/deleteConfrimModal";
import { useUpdateBlogCategoryMutation, useDeleteBlogCategoryMutation } from "../../redux/features/api/blog/blogApi";
import useFormSubmit from "../../hooks/useFormSubmit";
import EditBlogCategory from "./EditBlogCategory";
import { toast } from "react-toastify";

const BlogCategoryRow = ({ categoryData, index }) => {
    const [status, setStatus] = useState(categoryData.isDeleted ? "Blocked" : "Active");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const { handleSubmitForm } = useFormSubmit();

    const [updateBlogCategory] = useUpdateBlogCategoryMutation();
    const [deleteBlogCategory] = useDeleteBlogCategoryMutation();

    // Status toggle
    const handleToggleStatus = () => {
        const newStatus = status === "Active" ? "Blocked" : "Active";

        handleSubmitForm({
            apiCall: updateBlogCategory,
            data: { slug: categoryData.slug, data: { isDeleted: newStatus === "Blocked" } },
        });

        setStatus(newStatus);
    };

    // Delete
    const handleDeleteConfirm = async () => {
        try {
            await deleteBlogCategory({ slug: categoryData.slug }).unwrap();
            toast.success(`Category "${categoryData.title}" deleted successfully!`);
            setIsDeleteModalOpen(false);
        } catch (err) {
            toast.error("Failed to delete category. Please try again.");
            console.error(err);
        }
    };

    return (
        <>
            <tr className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                <td className="px-2 py-3 text-center font-semibold text-gray-700 dark:text-gray-200">{index + 1}</td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{categoryData.title || "-"}</td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">
                    {categoryData.createdAt
                        ? new Date(categoryData.createdAt).toLocaleString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                          })
                        : "-"}
                </td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">
                    {categoryData.updatedAt
                        ? new Date(categoryData.updatedAt).toLocaleString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                          })
                        : "-"}
                </td>
                <td className="flex items-center gap-2 px-2 py-3">
                    <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => setIsEditOpen(true)}
                    >
                        <Edit />
                    </button>
                    <button
                        className="text-yellow-600 hover:text-yellow-800"
                        onClick={handleToggleStatus}
                    />
                    <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        <Trash2 />
                    </button>
                </td>
            </tr>

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                message={`Are you sure you want to delete "${categoryData.title}"?`}
            />

            {isEditOpen && (
                <EditBlogCategory
                    close={() => setIsEditOpen(false)}
                    initialData={categoryData}
                />
            )}
        </>
    );
};

export default BlogCategoryRow;
