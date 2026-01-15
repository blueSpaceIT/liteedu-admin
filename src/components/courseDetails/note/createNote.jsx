/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useUploadPdfMutation } from "../../../redux/features/api/upload/uploadApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import useFormSubmit from "../../../hooks/useFormSubmit";
import { useCreateNoteMutation } from "../../../redux/features/api/note/note";
import { useCreateModuleDetailsMutation } from "../../../redux/features/api/moduleDetails/moduleDetails";
import { toast } from "react-toastify";

export default function NoteForm() {
    const [uploadPdf, { isLoading: uploadLoading }] = useUploadPdfMutation();
    const [createNote, { isLoading: noteLoading, data: noteData, isSuccess }] = useCreateNoteMutation();
    const [createModuleDetails, { isLoading: moduleLoading }] = useCreateModuleDetailsMutation();

    const [searchParams] = useSearchParams();
    const courseId = searchParams.get("courseId");
    const moduleId = searchParams.get("moduleId");

    const { handleSubmitForm } = useFormSubmit();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        noteFile: "", 
        moduleId: moduleId,
        courseId: courseId,
        description: "",
    });

    const handleChange = async (e) => {
        const { name, value, files } = e.target;

        if (files && name === "noteFile") {
            const file = files[0];
            setForm((prev) => ({ ...prev, [name]: file }));

            try {
                const formData = new FormData();
                formData.append("pdf", file);

                const res = await uploadPdf(formData).unwrap();
                if (res?.data?.secure_url) {
                    setForm((prev) => ({
                        ...prev,
                        noteFile: res.data.secure_url,
                    }));
                }
            } catch (err) {
                console.error("Upload failed:", err);
                toast.error("File upload failed!");
            }
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            noteFile: form.noteFile || "", // always send noteFile
        };

        handleSubmitForm({
            apiCall: createNote,
            data: payload,
        });
    };

    useEffect(() => {
        if (isSuccess && noteData?.data?._id) {
            // ✅ Show success toast immediately after note creation

            const payload = {
                courseId: courseId,
                moduleId: moduleId,
                content_type: "Note",
                contentId: noteData.data._id,
                status: "published",
            };

            handleSubmitForm({
                apiCall: createModuleDetails,
                data: payload,
            });

            // ✅ Navigate back after a small delay for smoother UX
            setTimeout(() => {
                navigate(-1);
            }, 800);
        }
    }, [isSuccess, noteData, courseId, moduleId, navigate]);

    const isSubmitting = noteLoading || moduleLoading;

    return (
        <div className="card mt-6 rounded-lg border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
            <form
                className="space-y-6"
                onSubmit={handleSubmit}
            >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Note Title */}
                    <div className="space-y-2">
                        <label
                            htmlFor="title"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Note Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Enter note title"
                            value={form.title}
                            onChange={handleChange}
                            disabled={isSubmitting || uploadLoading}
                            className="border-input flex h-10 w-full rounded-md border bg-white px-3 py-2 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800 dark:text-slate-100 md:text-sm"
                        />
                    </div>

                    {/* PDF File */}
                    <div className="col-span-full">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Note File (PDF)
                        </label>
                        <label
                            htmlFor="noteFile"
                            className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-lg border border-dashed border-gray-900 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
                        >
                            <input
                                type="file"
                                id="noteFile"
                                name="noteFile"
                                accept=".pdf"
                                className="hidden"
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                            <div className="flex flex-col items-center justify-center">
                                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-200 dark:bg-indigo-900">
                                    {uploadLoading ? (
                                        <svg
                                            className="h-6 w-6 animate-spin text-indigo-600 dark:text-indigo-300"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8z"
                                            ></path>
                                        </svg>
                                    ) : (
                                        <svg
                                            className="h-6 w-6 text-indigo-600 dark:text-indigo-300"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-sm text-gray-500 dark:text-slate-300">
                                    {uploadLoading ? "Uploading..." : form.noteFile ? "File Uploaded" : "Upload PDF File"}
                                </span>
                            </div>
                        </label>

                        {form.noteFile && !uploadLoading && (
                            <div className="mt-3 text-sm text-green-600 dark:text-green-400">
                                ✅ File uploaded successfully!{" "}
                                <a
                                    href={form.noteFile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-indigo-600 underline dark:text-indigo-400"
                                >
                                    View PDF
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label
                        htmlFor="description"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Enter note description"
                        value={form.description}
                        onChange={handleChange}
                        disabled={isSubmitting || uploadLoading}
                        className="border-input flex min-h-[100px] w-full rounded-md border bg-white px-3 py-2 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800 dark:text-slate-100 md:text-sm"
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        disabled={isSubmitting}
                        className="ring-offset-background border-input inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-800 dark:hover:bg-slate-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || uploadLoading}
                        className="ring-offset-background inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <svg
                                className="h-5 w-5 animate-spin text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8z"
                                ></path>
                            </svg>
                        ) : (
                            "Create Note"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
