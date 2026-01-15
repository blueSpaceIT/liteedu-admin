/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAddNewBatchMutation } from "../../redux/features/api/newBatch/newBatchApi";
import ModalContainer from "../../package/modalContainer";

const AddNewBatch = ({ isOpen, onClose, onSuccess }) => {
    const { register, handleSubmit, reset } = useForm();
    const [addBatch, { isLoading }] = useAddNewBatchMutation();

    const onSubmit = async (data) => {
        try {
            await addBatch({
                title: data.title,
                date: data.date,
                status: data.status,
            }).unwrap();
            toast.success("Batch added successfully");
            reset();
            onClose?.();
            onSuccess?.(); // optional refetch
        } catch (err) {
            toast.error(err?.data?.message || "Failed to add batch");
        }
    };

    if (!isOpen) return null;

    return (
        <ModalContainer close={onClose}>
            <div className="mb-6 text-center">
                <h2 className="mb-1 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-2xl font-bold text-transparent dark:from-blue-400 dark:to-cyan-400 sm:text-3xl">
                    Add New Batch
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">Add a new batch.</p>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
            >
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Batch Title</label>
                    <input
                        type="text"
                        {...register("title", { required: true })}
                        placeholder="Enter batch title"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Batch Date</label>
                    <input
                        type="date"
                        {...register("date", { required: true })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <select
                        {...register("status", { required: true })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-gray-400 px-4 py-2 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50 dark:from-blue-500 dark:to-cyan-400 dark:hover:from-blue-600 dark:hover:to-cyan-500"
                    >
                        {isLoading ? "Adding..." : "Add"}
                    </button>
                </div>
            </form>
        </ModalContainer>
    );
};

export default AddNewBatch;
