import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCreateExamMutation } from "../../../redux/features/api/exam/exam";
import useFormSubmit from "../../../hooks/useFormSubmit";
import { useCreateModuleDetailsMutation } from "../../../redux/features/api/moduleDetails/moduleDetails";
import { toast } from "react-toastify";

export default function CreateExam() {
    const navigate = useNavigate();
    const [createExam, { isLoading: examCreateLoad, data: examData, isSuccess }] = useCreateExamMutation();
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get("courseId");
    const moduleId = searchParams.get("moduleId");
    const { handleSubmitForm } = useFormSubmit();
    const [
        createModuleDetails,
        { isLoading: moduleDetailsLoading },
    ] = useCreateModuleDetailsMutation();

    const [form, setForm] = useState({
        examTitle: "",
        courseId: courseId,
        moduleId: moduleId,
        examType: "MCQ",
        totalQuestion: 1,
        positiveMark: 1,
        negativeMark: 0,
        mcqDuration: 1,
        cqMark: 0,
        cqDuration: 0,
        status: "published",
    });

    const onChange = (e) => {
        const { name, value, type } = e.target;

        setForm({
            ...form,
            [name]: type === "number" ? Number(value) : value, 
        });
    };


    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmitForm({
            apiCall: createExam,
            data: form,
        });
    };

    useEffect(() => {
        if (isSuccess) {

            const payload = {
                courseId: courseId,
                moduleId: moduleId,
                content_type: "Exam",
                contentId: examData?.data?._id,
                status: "published"
            }
            handleSubmitForm({
                apiCall: createModuleDetails,
                data: payload,
            });

            toast.success("Lecture Create Successfull")
            navigate(-1);
        }
    }, [isSuccess, navigate, courseId, moduleId, examData]);

    const isSubmitting = examCreateLoad || moduleDetailsLoading;

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900 px-4 py-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-4">
                    Create New Exam
                </h1>

                <div className="rounded-lg border bg-card text-card-foreground dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700 shadow-sm">
                    <div className="p-6">
                        <form className="space-y-6" onSubmit={onSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Exam Title */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="examTitle">Exam Title</label>
                                    <input
                                        id="examTitle"
                                        name="examTitle"
                                        className="flex h-10 w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Enter exam title"
                                        value={form.examTitle}
                                        onChange={onChange}
                                    />
                                </div>

                                {/* Exam Type */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="examType">Exam Type</label>
                                    <select
                                        id="examType"
                                        name="examType"
                                        className="flex h-10 w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={form.examType}
                                        onChange={onChange}
                                    >
                                        <option value="MCQ">Multiple Choice</option>
                                        <option value="CQ">Creative Questions</option>

                                    </select>
                                </div>

                                {/* Total Questions */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="totalQuestion">Total Questions</label>
                                    <input
                                        id="totalQuestion"
                                        name="totalQuestion"
                                        type="number"
                                        min={1}
                                        className="flex h-10 w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={form.totalQuestion}
                                        onChange={onChange}
                                    />
                                </div>

                                {/* Conditional Render */}
                                {form.examType === "CQ" ? (
                                    <>
                                        {/* CQ Mark */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium" htmlFor="cqMark">CQ Mark</label>
                                            <input
                                                id="cqMark"
                                                name="cqMark"
                                                type="number"
                                                min={0}
                                                className="flex h-10 w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                value={form.cqMark}
                                                onChange={onChange}
                                            />
                                        </div>

                                        {/* CQ Duration */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium" htmlFor="cqDuration">Exam Duration (minutes)</label>
                                            <input
                                                id="cqDuration"
                                                name="cqDuration"
                                                type="number"
                                                min={1}
                                                className="flex h-10 w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                value={form.cqDuration}
                                                onChange={onChange}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Positive Mark */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium" htmlFor="positiveMark">Positive Mark</label>
                                            <input
                                                id="positiveMark"
                                                name="positiveMark"
                                                type="number"
                                                step="0.01"
                                                min={0}
                                                className="flex h-10 w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                value={form.positiveMark}
                                                onChange={onChange}
                                            />
                                        </div>

                                        {/* Negative Mark */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium" htmlFor="negativeMark">Negative Mark</label>
                                            <input
                                                id="negativeMark"
                                                name="negativeMark"
                                                type="number"
                                                step="0.01"
                                                min={0}
                                                className="flex h-10 w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                value={form.negativeMark}
                                                onChange={onChange}
                                            />
                                        </div>

                                        {/* MCQ Duration */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium" htmlFor="mcqDuration">MCQ Duration (minutes)</label>
                                            <input
                                                id="mcqDuration"
                                                name="mcqDuration"
                                                type="number"
                                                min={1}
                                                className="flex h-10 w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                value={form.mcqDuration}
                                                onChange={onChange}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Status */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="status">Status</label>
                                    <select
                                        id="status"
                                        name="status"
                                        className="flex h-10 w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={form.status}
                                        onChange={onChange}
                                    >
                                        <option value="drafted">Draft</option>
                                        <option value="published">Published</option>
                                    </select>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => navigate(-1)}
                                    type="button"
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-[rgb(95_113_250)] text-white hover:bg-[rgb(95_113_250)]/90"
                                >
                                    {isSubmitting ? "Creating..." : "Create Exam"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
