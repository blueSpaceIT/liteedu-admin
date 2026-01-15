/* eslint-disable react/prop-types */
import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import DeleteConfirmModal from "../../ui/deleteConfrimModal";
import EditCustomSectionModal from "./EditCustomSectionModal";
import { useDeleteCustomSectionMutation } from "../../redux/features/api/customSection/customSection";
import { toast } from "react-toastify";

const CustomSectionRow = ({ section, index, refetch }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [deleteSection] = useDeleteCustomSectionMutation();

    const handleDelete = async (id) => {
        try {
            await deleteSection(id).unwrap();
            toast.success("Custom Section deleted successfully");
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to delete Custom Section");
        }
    };

    return (
        <>
            <tr className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                <td className="px-2 py-3 text-center font-semibold text-gray-700 dark:text-gray-200">{index + 1}</td>
                <td className="px-2 py-3 font-medium text-gray-800 dark:text-gray-200">{section.title}</td>
                <td className="break-all px-2 py-3 text-gray-600 dark:text-gray-400">{section.description}</td>
                <td className="break-all px-2 py-3 text-gray-600 dark:text-gray-400">{section.cta}</td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">
                    <span className={`rounded-full px-2 py-1 text-sm text-white ${section.status === "Active" ? "bg-green-500" : "bg-red-500"}`}>
                        {section.status}
                    </span>
                </td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">
                    {new Date(section.createdAt).toLocaleString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                    })}
                </td>
                <td className="flex justify-center gap-2 px-2 py-3 text-center">
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="text-red-600 hover:text-red-800"
                    >
                        <Trash2 size={18} />
                    </button>
                </td>
            </tr>

            <EditCustomSectionModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                sectionData={section}
                onSuccess={() => {
                    refetch();
                    setIsEditModalOpen(false);
                }}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                onConfirm={() => handleDelete(section._id)}
                message={`Are you sure you want to delete "${section.title}"?`}
            />
        </>
    );
};

export default CustomSectionRow;
