import { useEffect, useMemo, useState } from "react";
import { useUploadPdfMutation } from "../../../redux/features/api/upload/uploadApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUpdateNoteMutation, useGetAllNoteQuery } from "../../../redux/features/api/note/note";
import { toast } from "react-toastify";

export default function EditNote() {
    const [uploadPdf, { isLoading: uploadLoading }] = useUploadPdfMutation();
    const [updateNote, { isLoading: updateLoading }] = useUpdateNoteMutation();
    const [searchParams] = useSearchParams();
    const slug = searchParams.get("slug");
    const { data: allNoteData } = useGetAllNoteQuery();
    const navigate = useNavigate();

    const notes = useMemo(() => (allNoteData?.data ? allNoteData.data : []), [allNoteData]);
    const note = notes?.find((m) => m?.slug === slug);

    const [form, setForm] = useState({
        title: "",
        pdfFile: null,
        description: "",
    });

    useEffect(() => {
        if (note) {
            setForm({
                title: note?.title || "",
                pdfFile: note?.pdfFile || null,
                description: note?.description || "",
            });
        }
    }, [note]);

    // ✅ Handle file upload or text changes
    const handleChange = async (e) => {
        const { name, value, files } = e.target;

        if (files && name === "pdfFile") {
            const file = files[0];
            setForm((prev) => ({ ...prev, [name]: file }));

            try {
                const formData = new FormData();
                formData.append("pdf", file);
                const res = await uploadPdf(formData).unwrap();

                if (res?.data?.secure_url) {
                    setForm((prev) => ({
                        ...prev,
                        pdfFile: res.data.secure_url,
                    }));
                    toast.success("✅ PDF uploaded successfully!");
                }
            } catch (err) {
                console.error("Upload failed:", err);
                toast.error("❌ File upload failed!");
            }
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    // ✅ Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updateNote({ data: form, params: { slug } }).unwrap();
            toast.success("✅ Note updated successfully!");
            navigate(-1);
        } catch (error) {
            console.error("Update failed:", error);
            toast.error(error?.data?.message || "❌ Failed to update note!");
        }
    };

    const isSubmitting = updateLoading || uploadLoading;

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
                            className="text-sm font-medium leading-none"
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
                            disabled={isSubmitting}
                            className="flex h-10 w-full rounded-md border bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 dark:bg-slate-800 md:text-sm"
                        />
                    </div>

                    {/* PDF File */}
                    <div className="col-span-full">
                        <label className="text-sm font-medium leading-none">Note File (PDF)</label>
                        <label
                            htmlFor="pdfFile"
                            className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-lg border border-dashed border-gray-900 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
                        >
                            <input
                                type="file"
                                id="pdfFile"
                                name="pdfFile"
                                accept=".pdf"
                                className="hidden"
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-sm text-gray-500 dark:text-slate-300">
                                    {uploadLoading ? "Uploading..." : form.pdfFile ? "File Uploaded" : "Upload PDF File"}
                                </span>
                            </div>
                        </label>

                        {/* ✅ Uploaded PDF Preview */}
                        {form.pdfFile && !uploadLoading && (
                            <div className="mt-3 text-sm text-green-600 dark:text-green-400">
                                ✅ File ready!{" "}
                                <a
                                    href={form.pdfFile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-indigo-600 underline dark:text-indigo-400"
                                >
                                    View PDF
                                </a>
                            </div>
                        )}

                        {/* 🟦 Show previous PDF if none newly uploaded */}
                        {note?.pdfFile && !form.pdfFile && (
                            <div className="mt-3 text-sm text-indigo-600 dark:text-indigo-400">
                                Current file:{" "}
                                <a
                                    href={note.pdfFile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline"
                                >
                                    View existing PDF
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label
                        htmlFor="description"
                        className="text-sm font-medium leading-none"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Enter note description"
                        value={form.description}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="flex min-h-[100px] w-full rounded-md border bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 dark:bg-slate-800 md:text-sm"
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        disabled={isSubmitting}
                        className="inline-flex h-10 items-center justify-center rounded-md border bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex h-10 items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        {isSubmitting ? "Updating..." : "Update Note"}
                    </button>
                </div>
            </form>
        </div>
    );
}
