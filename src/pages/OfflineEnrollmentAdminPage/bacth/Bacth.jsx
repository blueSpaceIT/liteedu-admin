import { useState } from "react";
import { 
    useCreateBatchMutation, 
    useDeleteBatchMutation, 
    useGetAllBatchQuery, 
    useUpdateBatchMutation 
} from "../../../redux/features/api/batch/batch";
import { toast } from "react-toastify";
import { FiPlus, FiEdit, FiTrash2, FiX, FiCheckCircle, FiAlertCircle } from "react-icons/fi"; 


const Batch = () => {
    // --- RTK Query Hooks (Adding descriptive loading states) ---
    const { 
        data: batchData, 
        isLoading: isBatchDataLoading, 
        isError: isBatchDataError, 
        error: batchDataError 
    } = useGetAllBatchQuery();
    
    const [createBatch, { isLoading: isCreating }] = useCreateBatchMutation();
    const [updateBatch, { isLoading: isUpdating }] = useUpdateBatchMutation();
    const [deleteBatch] = useDeleteBatchMutation(); // Delete loading state is often omitted for faster UX

    // --- State Management ---
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentBatch, setCurrentBatch] = useState(null);
    const [title, setTitle] = useState("");

    // --- Helper Function for State Reset ---
    const resetFormAndCloseModal = () => {
        setIsOpen(false);
        setIsEdit(false);
        setCurrentBatch(null);
        setTitle("");
    };

    // --- Modal Handlers ---
    const openCreateModal = () => {
        // Ensures clean state every time
        setTitle("");
        setIsEdit(false);
        setIsOpen(true);
    };

    const openEditModal = (batch) => {
        setIsEdit(true);
        setCurrentBatch(batch);
        setTitle(batch.title);
        setIsOpen(true);
    };

    // --- CRUD Handlers ---
    const handleCreate = async () => {
        const trimmedTitle = title.trim();
        if (!trimmedTitle) {
            toast.error("Batch Title is required!");
            return;
        }
        
        try {
            // Using the trimmed title
            await createBatch({ title: trimmedTitle }).unwrap(); 
            resetFormAndCloseModal();
            toast.success("Batch created successfully!");
        } catch (err) {
            console.error("CREATE BATCH ERROR:", err);
            // Display specific error message from the backend if available
            toast.error(err.data?.message || "Failed to create batch.");
        }
    };

    const handleUpdate = async () => {
        const trimmedTitle = title.trim();
        if (!trimmedTitle) {
            toast.error("Batch Title is required!");
            return;
        }

        if (!currentBatch?._id) {
            toast.error("Current batch ID is missing.");
            return;
        }

        try {
            await updateBatch({ id: currentBatch._id, title: trimmedTitle }).unwrap();
            resetFormAndCloseModal();
            toast.success("Batch updated successfully!");
        } catch (err) {
            console.error("UPDATE BATCH ERROR:", err);
            toast.error(err.data?.message || "Failed to update batch.");
        }
    };

    const handleDelete = async (id) => {
        // Using window.confirm for a native, immediate confirmation
        if (window.confirm("Are you sure you want to delete this batch? This action cannot be undone.")) {
            try {
                // RTK Query passes the id directly as the payload
                await deleteBatch(id).unwrap(); 
                toast.success("Batch deleted successfully!");
            } catch (err) {
                console.error("DELETE BATCH ERROR:", err);
                toast.error(err.data?.message || "Failed to delete batch.");
            }
        }
    };

    // --- Loading and Error States ---
    if (isBatchDataLoading) {
        return (
            <div className="flex justify-center items-center h-screen dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="ml-4 text-gray-700 dark:text-gray-300">Loading Batch Data...</p>
            </div>
        );
    }

    if (isBatchDataError) {
        return (
            <div className="p-8 text-center dark:bg-gray-900 dark:text-white">
                <FiAlertCircle className="w-10 h-10 mx-auto text-red-500 mb-3" />
                <p className="text-xl font-semibold text-red-600 dark:text-red-400">Error Loading Data</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Details: {batchDataError.error || batchDataError.data?.message || "Unknown error"}</p>
            </div>
        );
    }

    // --- Component Render (UI is retained from previous improvement) ---
    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            
            <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">🎓 Batch Management</h1>
                <button
                    onClick={openCreateModal}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 ease-in-out transform hover:scale-105"
                >
                    <FiPlus className="w-5 h-5" />
                    <span>Add New Batch</span>
                </button>
            </header>

            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Slug
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {batchData?.data?.map((batch) => (
                                <tr key={batch.slug} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        {batch.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {batch.slug}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="inline-flex space-x-3">
                                            <button
                                                onClick={() => openEditModal(batch)}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-gray-600 transition"
                                                title="Edit Batch"
                                            >
                                                <FiEdit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(batch._id)}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-full hover:bg-red-100 dark:hover:bg-gray-600 transition"
                                                title="Delete Batch"
                                            >
                                                <FiTrash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {batchData?.data?.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="text-center p-10 text-gray-500 dark:text-gray-400">
                                        <FiAlertCircle className="w-6 h-6 mx-auto mb-2" />
                                        No batches found. Click Add New Batch to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={resetFormAndCloseModal}>
                    <div 
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out scale-100 opacity-100"
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {isEdit ? "Update Batch" : "Create New Batch"}
                            </h2>
                            <button onClick={resetFormAndCloseModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full transition">
                                <FiX className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            <label htmlFor="batch-title" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Batch Title</label>
                            <input
                                id="batch-title"
                                type="text"
                                className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="e.g., Spring 2024, Python Bootcamp"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="p-6 pt-0 flex justify-end space-x-3">
                            <button
                                onClick={resetFormAndCloseModal}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                disabled={isCreating || isUpdating}
                            >
                                Cancel
                            </button>

                            {isEdit ? (
                                <button
                                    onClick={handleUpdate}
                                    disabled={isUpdating}
                                    className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:bg-indigo-400"
                                >
                                    {isUpdating ? 'Updating...' : <><FiCheckCircle className="w-4 h-4" /> <span>Update</span></>}
                                </button>
                            ) : (
                                <button
                                    onClick={handleCreate}
                                    disabled={isCreating}
                                    className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:bg-green-400"
                                >
                                    {isCreating ? 'Creating...' : <><FiPlus className="w-4 h-4" /> <span>Create</span></>}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Batch;