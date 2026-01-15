/* eslint-disable react/prop-types */

import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import DeleteConfirmModal from "../../ui/deleteConfrimModal";
import useFormSubmit from "../../hooks/useFormSubmit";
import { useDeleteNotificationMutation } from "../../redux/features/api/notification/notification";
import EditNotificationModal from "./editNotification";

const NotificationRow = ({ notification, index }) => {
    const [status] = useState(notification.status === "Active" ? "Active" : "Inactive");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const { handleSubmitForm } = useFormSubmit();

    const [deleteNotification] = useDeleteNotificationMutation();

    const getStatusClass = (status) => {
        switch (status) {
            case "Active":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case "Inactive":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
        }
    };

    // Delete
    const handleDeleteConfirm = () => {
        handleSubmitForm({
            apiCall: deleteNotification,
            params: { slug: notification._id },
        });
        setIsDeleteModalOpen(false);
    };

    return (
        <>
            <tr className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                <td className="px-2 py-3 text-center font-semibold text-gray-700 dark:text-gray-200">{index + 1}</td>

                {/* Title */}
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{notification.title || "-"}</td>

                {/* Created At */}
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{notification.message || "-"}</td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{notification.courseId?.course_title || "-"}</td>

                {/* Status */}
                <td className="px-2 py-3">
                    <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium sm:text-xs ${getStatusClass(status)}`}
                    >
                        {status}
                    </span>
                </td>

                {/* Created At */}
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{notification.type || "-"}</td>

                {/* Actions */}
                <td className="flex items-center gap-2 px-2 py-3">
                    {/* Open Edit Title Modal */}
                    <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => setIsEditOpen(true)}
                    >
                        <Edit />
                    </button>

                    {/* Delete */}
                    <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        <Trash2 />
                    </button>
                </td>
            </tr>

            {/* Delete Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                message={`Are you sure you want to delete "${notification.title}"?`}
            />

            {/* Edit Title Modal */}
            {isEditOpen && (
                <EditNotificationModal
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    notification={notification}
                />
            )}
        </>
    );
};

export default NotificationRow;
