import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useFormSubmit from "../../../hooks/useFormSubmit";
import { toast } from "react-toastify";
import { useGetAllExamQuery, useUpdateExamMutation } from "../../../redux/features/api/exam/exam";

export default function EditExam() {
    const navigate = useNavigate();
    const [updateExam, { isLoading, isSuccess }] = useUpdateExamMutation();
    const [searchParams] = useSearchParams();
    const slug = searchParams.get("slug");
    const { handleSubmitForm } = useFormSubmit();
    const { data: allExamData } = useGetAllExamQuery();
    const exams = useMemo(() => (allExamData?.data ? allExamData?.data : []), [allExamData]);
    const exam = exams?.find(m => m?.slug === slug);

    const [form, setForm] = useState({
        examTitle: "",
        courseId: "",
        moduleId: "",
        examType: "MCQ",
        totalQuestion: 1,
        positiveMark: 1,
        negativeMark: 0,
        mcqDuration: 1,
        cqMark: 0,
        cqDuration: 0,
        status: "published",
    });

    // 🟢 Prefill form on exam load
    useEffect(() => {
        if (exam) {
            setForm({
                examTitle: exam.examTitle || "",
                examType: exam.examType || "MCQ",
                totalQuestion: exam.totalQuestion || 1,
                positiveMark: exam.positiveMark || 1,
                negativeMark: exam.negativeMark || 0,
                mcqDuration: exam.mcqDuration || 1,
                cqMark: exam.cqMark || 0,
                cqDuration: exam.cqDuration || 0,
                status: exam.status || "published",
            });
        }
    }, [exam]);

    const onChange = (e) => {
        const { name, value, type } = e.target;
        setForm({
            ...form,
            [name]: type === "number" ? Number(value) : value,
        });
    };

    // 🟢 Submit updated exam
    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmitForm({
            apiCall: updateExam,
            data: form,
            params: { slug: slug }
        });
    };

    // 🟢 Success effect
    useEffect(() => {
        if (isSuccess) {
            toast.success("Exam updated successfully!");
            navigate(-1);
        }
    }, [isSuccess, navigate]);

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900 px-4 py-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-4">
                    Edit Exam
                </h1>

                <div className="rounded-lg border bg-card text-card-foreground dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700 shadow-sm">
                    <div className="p-6">
                        <form className="space-y-6" onSubmit={onSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Exam Title */}
                                <div className="space-y-2">
                                    <label htmlFor="examTitle" className="text-sm font-medium">Exam Title</label>
                                    <input
                                        id="examTitle"
                                        name="examTitle"
                                        value={form.examTitle}
                                        onChange={onChange}
                                        placeholder="Enter exam title"
                                        className="flex h-10 w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {/* Exam Type */}
                                <div className="space-y-2">
                                    <label htmlFor="examType" className="text-sm font-medium">Exam Type</label>
                                    <select
                                        id="examType"
                                        name="examType"
                                        value={form.examType}
                                        onChange={onChange}
                                        className="flex h-10 w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="MCQ">Multiple Choice</option>
                                        <option value="CQ">Creative Questions</option>
                                    </select>
                                </div>

                                {/* Total Questions */}
                                <div className="space-y-2">
                                    <label htmlFor="totalQuestion" className="text-sm font-medium">Total Questions</label>
                                    <input
                                        id="totalQuestion"
                                        name="totalQuestion"
                                        type="number"
                                        min={1}
                                        value={form.totalQuestion}
                                        onChange={onChange}
                                        className="flex h-10 w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {/* Conditional fields */}
                                {form.examType === "CQ" ? (
                                    <>
                                        <div className="space-y-2">
                                            <label htmlFor="cqMark" className="text-sm font-medium">CQ Mark</label>
                                            <input
                                                id="cqMark"
                                                name="cqMark"
                                                type="number"
                                                min={0}
                                                value={form.cqMark}
                                                onChange={onChange}
                                                className="flex h-10 w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="cqDuration" className="text-sm font-medium">CQ Duration (minutes)</label>
                                            <input
                                                id="cqDuration"
                                                name="cqDuration"
                                                type="number"
                                                min={1}
                                                value={form.cqDuration}
                                                onChange={onChange}
                                                className="flex h-10 w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <label htmlFor="positiveMark" className="text-sm font-medium">Positive Mark</label>
                                            <input
                                                id="positiveMark"
                                                name="positiveMark"
                                                type="number"
                                                step="0.01"
                                                min={0}
                                                value={form.positiveMark}
                                                onChange={onChange}
                                                className="flex h-10 w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="negativeMark" className="text-sm font-medium">Negative Mark</label>
                                            <input
                                                id="negativeMark"
                                                name="negativeMark"
                                                type="number"
                                                step="0.01"
                                                min={0}
                                                value={form.negativeMark}
                                                onChange={onChange}
                                                className="flex h-10 w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="mcqDuration" className="text-sm font-medium">MCQ Duration (minutes)</label>
                                            <input
                                                id="mcqDuration"
                                                name="mcqDuration"
                                                type="number"
                                                min={1}
                                                value={form.mcqDuration}
                                                onChange={onChange}
                                                className="flex h-10 w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Status */}
                                <div className="space-y-2">
                                    <label htmlFor="status" className="text-sm font-medium">Status</label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={form.status}
                                        onChange={onChange}
                                        className="flex h-10 w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="drafted">Draft</option>
                                        <option value="published">Published</option>
                                    </select>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-[rgb(95_113_250)] text-white hover:bg-[rgb(95_113_250)]/90"
                                >
                                    {isLoading ? "Updating..." : "Update Exam"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
