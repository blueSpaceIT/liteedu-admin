/* eslint-disable react/prop-types */
import { useState } from "react";
import { FileText, Plus, SquarePen, Trash2 } from "lucide-react";
import { useDeleteNoteMutation } from "../../../redux/features/api/note/note";
import useFormSubmit from "../../../hooks/useFormSubmit";

export default function NotesCard({ notes = [], moduleId, courseId, isLoading }) {
    const [deleteNote] = useDeleteNoteMutation();
    const { handleSubmitForm } = useFormSubmit();
    const [selectedNote, setSelectedNote] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openDeleteModal = (note) => {
        setSelectedNote(note);
        setIsModalOpen(true);
    };

    const handleDelete = () => {
        if (!selectedNote) return;
        handleSubmitForm({
            apiCall: deleteNote,
            params: { slug: selectedNote.slug },
            onSuccess: () => setIsModalOpen(false),
        });
        setSelectedNote(null);
    };

    return (
        <div className="card mt-6 rounded-lg border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center text-xl font-semibold">
                    <FileText className="mr-2 h-5 w-5 text-indigo-500" />
                    Notes
                </h2>

                {/* Add Note Button */}
                <a href={`/admin/course/create-note?moduleId=${moduleId}&courseId=${courseId}`}>
                    <button className="hover:bg-[rgb(95_113_250)]/90 flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-[rgb(95_113_250)] px-3 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
                        <Plus className="mr-1 h-4 w-4" /> Add Note
                    </button>
                </a>
            </div>

            {/* Notes Table */}
            <div className="overflow-x-auto">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead>
                            <tr className="border-b">
                                <Th>Title</Th>
                                <Th>Description</Th>
                                <Th>View Note</Th>
                                <Th>Created At</Th>
                                <Th>Updated At</Th>
                                <Th className="text-right">Actions</Th>
                            </tr>
                        </thead>

                        <tbody className="[&_tr:last-child]:border-0">
                            {/* Show loading first */}
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="p-6 text-center text-sm text-slate-500 dark:text-slate-400"
                                    >
                                        Loading notes...
                                    </td>
                                </tr>
                            ) : notes.length > 0 ? (
                                notes.map((note) => (
                                    <tr
                                        key={note._id || note.slug}
                                        className="border-b transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                    >
                                        <td className="p-4 align-middle font-medium">{note.title}</td>
                                        <td className="max-w-md truncate p-4 align-middle">{note.description}</td>
                                        <td className="p-4 align-middle">
                                            {note.noteFile ? (
                                                <a
                                                    href={
                                                        note.noteFile.startsWith("http")
                                                            ? note.noteFile
                                                            : `https://api.liteedu.com/api/v1/${note.noteFile}`
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ml-2 cursor-pointer text-indigo-600 underline dark:text-indigo-400"
                                                >
                                                    View PDF
                                                </a>
                                            ) : (
                                                <a
                                                    href={`/admin/course/edit-note?slug=${note.slug}`}
                                                    className="ml-2 cursor-pointer text-yellow-600 underline dark:text-yellow-400"
                                                    title="No PDF uploaded yet. Click to upload."
                                                >
                                                    Upload PDF
                                                </a>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {note.createdAt
                                                ? new Date(note.createdAt).toLocaleString("en-GB", {
                                                      day: "2-digit",
                                                      month: "short",
                                                      year: "numeric",
                                                      hour: "2-digit",
                                                      minute: "2-digit",
                                                  })
                                                : "N/A"}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {note.updatedAt
                                                ? new Date(note.updatedAt).toLocaleString("en-GB", {
                                                      day: "2-digit",
                                                      month: "short",
                                                      year: "numeric",
                                                      hour: "2-digit",
                                                      minute: "2-digit",
                                                  })
                                                : "N/A"}
                                        </td>
                                        <td className="p-4 text-right align-middle">
                                            <div className="flex justify-end gap-2">
                                                <a href={`/admin/course/edit-note?slug=${note.slug}`}>
                                                    <button className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800">
                                                        <SquarePen className="h-4 w-4" />
                                                    </button>
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => openDeleteModal(note)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-red-500 hover:bg-red-50 hover:text-red-700 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-red-900/30"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="p-6 text-center text-sm text-slate-500 dark:text-slate-400"
                                    >
                                        No notes found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-96 rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
                        <h3 className="mb-4 text-lg font-medium text-slate-900 dark:text-slate-100">Confirm Delete</h3>
                        <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
                            Are you sure you want to delete <b>{selectedNote?.title}</b>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-md bg-slate-200 px-4 py-2 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
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

/* Helper */
function Th({ children, className = "" }) {
    return <th className={`h-12 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400 ${className}`}>{children}</th>;
}
