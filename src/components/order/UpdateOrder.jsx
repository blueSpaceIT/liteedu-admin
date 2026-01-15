/* eslint-disable react/prop-types */
import { useState } from "react";

const UpdateOrder = ({ isOpen, onClose, currentStatus, onUpdate, isLoading }) => {
    const [updatingStatus, setUpdatingStatus] = useState(""); // ✅ track which status is updating

    if (!isOpen) return null;

    const productStatuses = ["Pending", "Processing", "Courier", "Delivered"];

    const handleClick = async (status) => {
        setUpdatingStatus(status);
        await onUpdate(status);
        setUpdatingStatus("");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-[90%] max-w-sm shadow-2xl border border-gray-200 dark:border-gray-700">
                <h3 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Update Order Status
                </h3>

                <div className="flex flex-col gap-4 mb-6">
                    {productStatuses.map((status) => (
                        <button
                            key={status}
                            onClick={() => handleClick(status)}
                            disabled={isLoading} // all buttons disabled while API call
                            className={`px-4 py-2 rounded-lg font-medium border transition-all
                                ${currentStatus === status
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                                }`}
                        >
                            {updatingStatus === status ? "Updating..." : status}
                        </button>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="w-full px-4 py-2 mt-2 font-medium text-gray-800 transition-colors ease-in-out bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default UpdateOrder;
