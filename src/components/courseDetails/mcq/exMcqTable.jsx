import { useState } from "react";
import { SquarePen, Trash2, Plus, Minus } from "lucide-react";
import { useDeleteExamMcqMutation, useUdateExamMcqMutation } from "../../../redux/features/api/examMcq/examMcq";
import { toast } from "react-toastify";

/* eslint-disable react/prop-types */
export default function MCQTable({ mcqs, onEdit }) {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [updateMcq, { isLoading: updateLoading }] = useUdateExamMcqMutation();
    const [deleteMcq, { isLoading: deleteLoading }] = useDeleteExamMcqMutation();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleEditClick = (mcq) => {
        setEditData({ ...mcq });
        setEditModalOpen(true);
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setDeleteModalOpen(true);
    };

    const handleSaveEdit = async () => {
        try {
            await updateMcq({ id: editData._id, data: editData }).unwrap();
            toast.success("MCQ updated successfully!");
            onEdit && onEdit(editData);
            setEditModalOpen(false);
        } catch (err) {
            toast.error("Failed to update MCQ.");
            console.error("Update error:", err);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) {
            toast.error("MCQ ID not found.");
            return;
        }
        try {
            await deleteMcq(deleteId).unwrap();
            toast.success("MCQ deleted successfully!");
            setDeleteModalOpen(false);
        } catch (err) {
            toast.error("Failed to delete MCQ.");
            console.error("Delete error:", err);
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...editData.options];
        newOptions[index] = value;
        setEditData({ ...editData, options: newOptions });
    };

    const addOption = () => {
        if (editData.options.length < 4) {
            setEditData({ ...editData, options: [...editData.options, ""] });
        }
    };

    const removeOption = (index) => {
        const newOptions = editData.options.filter((_, i) => i !== index);
        setEditData({ ...editData, options: newOptions });
        if (editData.correctAnswer === editData.options[index]) {
            setEditData((prev) => ({ ...prev, correctAnswer: "" }));
        }
    };

    if (mcqs.length === 0) {
        return <p className="py-6 text-center text-slate-500 dark:text-slate-400">No MCQs found.</p>;
    }

    return (
        <div className="relative overflow-x-auto text-black dark:text-white">
            <table className="w-full text-sm">
                <thead className="border-b">
                    <tr>
                        <th className="p-4 text-left">#</th>
                        <th className="p-4 text-left">Question</th>
                        <th className="p-4 text-left">Options</th>
                        <th className="p-4 text-left">Answer</th>
                        <th className="flex justify-end p-4 pr-10">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {mcqs.map((mcq) => (
                        <tr
                            key={mcq._id}
                            className="border-b hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                            <td className="p-4">{mcq.serial}</td>
                            <td className="p-4">{mcq.question}</td>
                            <td className="p-4">{mcq.options.join(", ")}</td>
                            <td className="p-4 font-medium">{mcq.correctAnswer}</td>
                            <td className="p-4 text-right align-middle">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => handleEditClick(mcq)}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white p-0 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                                        disabled={updateLoading}
                                    >
                                        {updateLoading ? <span className="loading loading-spinner"></span> : <SquarePen className="h-4 w-4" />}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(mcq._id)}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white p-0 text-red-500 hover:bg-red-50 hover:text-red-700 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-red-900/30"
                                        disabled={deleteLoading}
                                    >
                                        {deleteLoading ? <span className="loading loading-spinner"></span> : <Trash2 className="h-4 w-4" />}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                        <h2 className="mb-4 text-lg font-bold text-gray-800 dark:text-white">Edit MCQ</h2>
                        <div className="flex flex-col gap-3">
                            {/* Question */}
                            <input
                                type="text"
                                value={editData.question}
                                onChange={(e) => setEditData({ ...editData, question: e.target.value })}
                                placeholder="Question"
                                className="rounded border px-3 py-2 dark:bg-gray-700 dark:text-white"
                            />

                            {/* Dynamic Options */}
                            <div className="flex flex-col gap-2">
                                <label className="font-medium text-gray-700 dark:text-gray-300">Options:</label>
                                {editData.options.map((opt, idx) => (
                                    <div
                                        key={idx}
                                        className="flex gap-2"
                                    >
                                        <input
                                            type="text"
                                            value={opt}
                                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                                            className="flex-1 rounded border px-3 py-2 dark:bg-gray-700 dark:text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeOption(idx)}
                                            className="rounded bg-red-500 p-2 text-white"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addOption}
                                    className={`mt-2 inline-flex items-center gap-1 rounded px-3 py-1 text-white ${
                                        editData.options.length >= 4 ? "cursor-not-allowed bg-gray-400" : "bg-green-500"
                                    }`}
                                    disabled={editData.options.length >= 4}
                                >
                                    <Plus className="h-4 w-4" /> Add Option
                                </button>
                            </div>

                            {/* Correct Answer Dropdown */}
                            <select
                                value={editData.correctAnswer}
                                onChange={(e) => setEditData({ ...editData, correctAnswer: e.target.value })}
                                className="rounded border px-3 py-2 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Select Correct Answer</option>
                                {editData.options.map((opt, idx) => (
                                    <option
                                        key={idx}
                                        value={opt}
                                    >
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="rounded bg-gray-300 px-4 py-2 dark:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="rounded bg-blue-500 px-4 py-2 text-white"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                        <h2 className="mb-4 text-lg font-bold text-gray-800 dark:text-white">Confirm Delete</h2>
                        <p className="mb-4 text-gray-600 dark:text-gray-300">Are you sure you want to delete this MCQ?</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="rounded bg-gray-300 px-4 py-2 dark:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="rounded bg-red-500 px-4 py-2 text-white"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
