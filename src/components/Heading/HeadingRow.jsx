/* eslint-disable react/prop-types */
import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import DeleteConfirmModal from "../../ui/deleteConfrimModal";
import EditHeadingOfferModal from "./EditHeadingOfferModal";
import { toast } from "react-toastify";

const HeadingRow = ({ heading, index, onHeadingDelete, onHeadingUpdate }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    return (
        <>
            <tr className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                <td className="px-2 py-3 text-center font-semibold text-gray-700 dark:text-gray-200">{index + 1}</td>
                <td className="break-all px-2 py-3 text-gray-600 dark:text-gray-400">{heading.slug ? heading.slug : <span className="text-red-600">No slug available</span>}</td>
                <td className="px-2 py-3 font-medium text-gray-800 dark:text-gray-200">{heading.offer}</td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{new Date(heading.createdAt).toLocaleString()}</td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{new Date(heading.updatedAt).toLocaleString()}</td>
                <td className="flex justify-center gap-2 px-2 py-3 text-center">
                    {/* Edit Button */}
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <Edit size={18} />
                    </button>

                    {/* Delete Button */}
                    <button
                        onClick={() => {
                            if (!heading.slug) {
                                toast.error("Cannot delete heading: slug is missing.");
                                return;
                            }
                            setIsDeleteModalOpen(true);
                        }}
                        className={`text-red-600 hover:text-red-800 ${!heading.slug ? "cursor-not-allowed opacity-50" : ""}`}
                        disabled={!heading.slug}
                    >
                        <Trash2 size={18} />
                    </button>
                </td>
            </tr>

            {/* Edit Modal */}
            <EditHeadingOfferModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                headingOffer={heading}
                onUpdate={onHeadingUpdate}
            />

            {/* Delete Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                onConfirm={() => {
                    onHeadingDelete(heading.slug);
                    setIsDeleteModalOpen(false);
                }}
                message={`Are you sure you want to delete this heading offer?`}
            />
        </>
    );
};

export default HeadingRow;
