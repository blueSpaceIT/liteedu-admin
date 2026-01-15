/* eslint-disable react/prop-types */
import { useState } from "react";
import { Edit, Trash2, User } from "lucide-react";
import DeleteConfirmModal from "../../ui/deleteConfrimModal";
import EditAdminModal from "./adminEditModal";

const AdminRow = ({ admin, index, onAdminUpdate, onAdminDelete }) => {
    const [status, setStatus] = useState(admin.status);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

    return (
        <>
            <tr className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                <td className="px-2 py-3 text-center font-semibold text-gray-700 dark:text-gray-200">{index + 1}</td>

                {/* Profile + Name */}
                <td className="flex items-center gap-2 px-2 py-3">
                    {admin.profile_picture ? (
                        <img
                            src={admin.profile_picture}
                            alt={admin.name}
                            className="h-10 w-10 rounded-full border border-gray-300 object-cover dark:border-gray-700"
                        />
                    ) : (
                        <User className="h-10 w-10 text-gray-400" />
                    )}
                    <span className="font-medium text-gray-800 dark:text-gray-200">{admin.name}</span>
                </td>

                {/* Other Fields */}
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{admin.email || "-"}</td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{admin.phone || "-"}</td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{admin.address || "-"}</td>

                {/* Status */}
                <td className="px-2 py-3 text-center">
                    <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium sm:text-xs ${getStatusClass(status)}`}
                    >
                        {status}
                    </span>
                </td>

                {/* Actions */}
                <td className="flex justify-center gap-2 px-2 py-3 text-center">
                    <button
                        onClick={() => setIsEditModalOpen(true)}
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

            {/* Edit Modal */}
            <EditAdminModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                admin={admin}
                onUpdate={(updatedAdmin) => {
                    setStatus(updatedAdmin.status);
                    onAdminUpdate(updatedAdmin);
                    setIsEditModalOpen(false);
                }}
            />

            {/* Delete Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                onConfirm={() => {
                    onAdminDelete(admin._id);
                    setIsDeleteModalOpen(false);
                }}
                message={`Are you sure you want to delete "${admin.name}"?`}
            />
        </>
    );
};

export default AdminRow;
