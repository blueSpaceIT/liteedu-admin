/* eslint-disable react/prop-types */
import { toast } from "react-toastify";
import { useState } from "react";
import { useCreateBulkMcqMutation } from "../../../redux/features/api/mcq/mcqApi";

const BulkUploadModal = ({ onClose }) => {
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const [bulkUploadMcq] = useCreateBulkMcqMutation();

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setErrorMessage("");
        } else {
            setFile(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setErrorMessage("Please select a CSV file to upload.");
            return;
        }

        setIsUploading(true);
        setErrorMessage("");

        try {
            await bulkUploadMcq(file).unwrap(); 
            setFile(null);
            toast.success("MCQ uploaded successfully!");
            onClose();
        } catch (err) {
            toast.error(err?.data?.message || err.message || "Failed to upload MCQ");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                >
                    ✕
                </button>

                <h2 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">Bulk Upload CSV</h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <div className="space-y-2">
                        <label className="block font-semibold text-gray-700 dark:text-gray-300">Select CSV file</label>
                        <label
                            htmlFor="csv-upload"
                            className={`flex h-32 w-full flex-col items-center justify-center border-2 ${
                                file ? "border-green-500 dark:border-green-400" : "border-gray-300 dark:border-gray-600"
                            } cursor-pointer rounded-xl border-dashed bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600`}
                        >
                            <div className="flex flex-col items-center justify-center pb-6 pt-5">
                                {file ? (
                                    <p className="font-semibold text-green-600 dark:text-green-400">File selected: {file.name}</p>
                                ) : (
                                    <>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">CSV files only</p>
                                    </>
                                )}
                            </div>
                            <input
                                id="csv-upload"
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {errorMessage && (
                        <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-800 dark:text-red-200">{errorMessage}</div>
                    )}

                    <button
                        type="submit"
                        className="w-full transform rounded-xl bg-gradient-to-r from-green-500 to-green-600 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                        disabled={isUploading}
                    >
                        {isUploading ? "Uploading..." : "Upload"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BulkUploadModal;
