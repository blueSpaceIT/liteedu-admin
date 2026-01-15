/* eslint-disable react/prop-types */
import { useState } from "react";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import DeleteConfirmModal from "../../ui/deleteConfrimModal";
import EditBlog from "./EditBlog";
import { useUpdateBlogMutation, useDeleteBlogMutation } from "../../redux/features/api/blog/blogApi";

const BlogRow = ({ blogData, index }) => {
    const [status, setStatus] = useState(blogData?.status || "Draft");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [updateBlog] = useUpdateBlogMutation();
    const [deleteBlog] = useDeleteBlogMutation();

    // Toggle Published / Draft (Optimistic Update)
    const handleToggleStatus = async () => {
        const newStatus = status === "Published" ? "Draft" : "Published";

        // Optimistically update UI immediately
        setStatus(newStatus);

        try {
            await updateBlog({
                params: { slug: blogData.slug },
                data: { status: newStatus },
            }).unwrap();

            toast.success(`Status changed to ${newStatus}`);
        } catch (err) {
            console.error("Status update failed:", err);

            // Rollback UI if API failed
            setStatus(status === "Published" ? "Draft" : "Published");
            toast.error("Failed to update status");
        }
    };

    // Delete Blog
    const handleDeleteConfirm = async () => {
        if (!blogData?.slug) {
            console.error("Slug missing, cannot delete blog:", blogData);
            return;
        }

        setDeleting(true);
        try {
            await deleteBlog({ slug: blogData.slug }).unwrap();
            toast.success(`Blog "${blogData.title}" deleted successfully!`);
        } catch (err) {
            console.error("Delete failed:", err);
            toast.error("Failed to delete the blog.");
        } finally {
            setDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    if (!blogData) return null;

    return (
        <>
            <tr className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                <td className="px-2 py-3 text-center font-semibold text-gray-700 dark:text-gray-200">{index + 1}</td>
                <td className="px-2 py-3">
                    {blogData.coverPhoto ? (
                        <img
                            src={blogData.coverPhoto}
                            alt={blogData.title}
                            className="h-10 w-10 rounded-full object-cover"
                        />
                    ) : (
                        <span className="text-gray-400 dark:text-gray-500">No Image</span>
                    )}
                </td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{blogData.title || "-"}</td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{blogData.categoryId?.title || "-"}</td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">
                    {blogData.description ? (
                        <p className="max-w-[500px] truncate sm:w-[190px] md:w-[190px] lg:w-full">{blogData.description}</p>
                    ) : (
                        <span className="text-gray-400 dark:text-gray-500">No description</span>
                    )}
                </td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">
                    {blogData.tags && blogData.tags.length > 0 ? blogData.tags.join(", ") : "-"}
                </td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">
                    {blogData.createdAt ? new Date(blogData.createdAt).toLocaleString() : "-"}
                </td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">
                    {blogData.updatedAt ? new Date(blogData.updatedAt).toLocaleString() : "-"}
                </td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">
                    {/* Toggle status button */}
                    <button
                        onClick={handleToggleStatus}
                        className={`rounded-xl px-2 text-sm ${status === "Published" ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-800"}`}
                    >
                        {status}
                    </button>
                </td>
                <td className="flex gap-2 px-2 py-3 text-center">
                    {/* Edit button */}
                    <button
                        onClick={() => setIsEditOpen(true)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <Edit />
                    </button>

                    {/* Delete button */}
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800"
                        disabled={deleting}
                    >
                        {deleting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Deleting...</span>
                            </>
                        ) : (
                            <Trash2 />
                        )}
                    </button>
                </td>
            </tr>

            {/* Delete confirmation modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                message={`Are you sure you want to delete "${blogData.title}"?`}
            />

            {/* Edit modal */}
            {isEditOpen && (
                <EditBlog
                    close={() => setIsEditOpen(false)}
                    initialData={{
                        ...blogData,
                        tags: blogData.tags || [],
                        createdAt: blogData.createdAt,
                        updatedAt: blogData.updatedAt,
                        categoryTitle: blogData.categoryId?.title || "",
                        categoryId: blogData.categoryId?._id || "",
                    }}
                    onUpdateStatus={(newStatus) => setStatus(newStatus)} // 🔑 Callback added
                />
            )}
        </>
    );
};

export default BlogRow;
