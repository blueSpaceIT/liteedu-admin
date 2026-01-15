/* eslint-disable react/prop-types */
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useState, useMemo } from "react";
import JoditEditor from "jodit-react";

import { useGetAllMcqCategoryQuery } from "../../../redux/features/api/mcqCategory/mcqCategory";
import { useCreateMcqMutation } from "../../../redux/features/api/mcq/mcqApi";

const McqCreateForm = ({ onClose }) => {
    const { data } = useGetAllMcqCategoryQuery();
    const categories = data?.data || [];

    const {
        handleSubmit,
        control,
        watch,
        reset,
    } = useForm({
        defaultValues: {
            question: "",
            category: "",
            options: ["", "", "", ""],
            correctAnswer: "",
        },
    });

    const options = watch("options");
    const selectedAnswer = watch("correctAnswer");
    const [loading, setLoading] = useState(false);

    const [createMcq] = useCreateMcqMutation();

    // Jodit Config (Question)
    const questionEditorConfig = useMemo(() => ({
        height: 220,
        placeholder: "Type your question here...",
        toolbarAdaptive: false,
        buttons: [
            "bold",
            "italic",
            "underline",
            "|",
            "ul",
            "ol",
            "|",
            "link",
            "|",
            "eraser",
            "source",
        ],
    }), []);

    // Jodit Config (Options - smaller)
    const optionEditorConfig = useMemo(() => ({
        height: 120,
        placeholder: "Type option...",
        toolbarAdaptive: false,
        buttons: [
            "bold",
            "italic",
            "underline",
            "|",
            "ul",
            "ol",
            "|",
            "eraser",
        ],
    }), []);

    const onSubmit = async (formData) => {
        setLoading(true);
        try {
            await createMcq({
                question: formData.question,   // HTML
                category: formData.category,
                options: formData.options,     // HTML array
                correctAnswer: formData.correctAnswer, // HTML
            }).unwrap();

            toast.success("MCQ created successfully!");
            reset();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error(err?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border bg-white p-6 shadow-lg dark:bg-gray-900">

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-2xl font-bold text-gray-500 hover:text-red-500"
                >
                    &times;
                </button>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <h2 className="text-center text-2xl font-bold text-blue-600 dark:text-blue-400">
                        Create MCQ
                    </h2>

                    {/* Question */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold">
                            Question
                        </label>
                        <Controller
                            name="question"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <JoditEditor
                                    value={field.value}
                                    config={questionEditorConfig}
                                    onBlur={(content) => field.onChange(content)}
                                />
                            )}
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="mb-1 block text-sm font-semibold">
                            Category
                        </label>
                        <Controller
                            name="category"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <select {...field} className={inputClass}>
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.title}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                    </div>

                    {/* Options with Jodit */}
                    <div>
                        <h3 className="mb-2 text-sm font-semibold">Options</h3>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {options.map((_, index) => (
                                <div key={index}>
                                    <label className="mb-1 block text-xs font-semibold">
                                        Option {index + 1}
                                    </label>

                                    <Controller
                                        name={`options.${index}`}
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <JoditEditor
                                                value={field.value}
                                                config={optionEditorConfig}
                                                onBlur={(content) => field.onChange(content)}
                                            />
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Correct Answer */}
                    <div>
                        <h3 className="mb-2 text-sm font-semibold">
                            Correct Answer
                        </h3>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {options.map((option, index) => (
                                <label
                                    key={index}
                                    className={`flex cursor-pointer items-center space-x-3 rounded-md p-3 transition
                                    ${selectedAnswer === option
                                            ? "bg-blue-500/20 ring-2 ring-blue-500"
                                            : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    <Controller
                                        name="correctAnswer"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="radio"
                                                value={option}
                                                checked={field.value === option}
                                                className="h-4 w-4"
                                            />
                                        )}
                                    />
                                    <span className="text-sm">
                                        Option {index + 1}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white hover:bg-blue-700"
                    >
                        {loading ? "Submitting..." : "Submit Question"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default McqCreateForm;
