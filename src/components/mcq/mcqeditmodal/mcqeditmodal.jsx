/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import useFormSubmit from "../../../hooks/useFormSubmit";
import { useUpdateMcqMutation } from "../../../redux/features/api/mcq/mcqApi";
import { useGetAllMcqCategoryQuery } from "../../../redux/features/api/mcqCategory/mcqCategory";

const McqEditModal = ({ onClose, mcq }) => {
    const { data: categoryData, isLoading: categoriesLoading } = useGetAllMcqCategoryQuery();
    const [updatedMcq, { isLoading }] = useUpdateMcqMutation();
    const { handleSubmitForm } = useFormSubmit();

    const { handleSubmit, control, reset, watch } = useForm({
        defaultValues: {
            question: mcq?.question || "",
            options: mcq?.options || ["", "", "", ""],
            correctAnswer: mcq?.correctAnswer || "",
            category: mcq?.category?._id || mcq?.category || "",
        },
    });

    // Reset form whenever the selected MCQ or categories change
    useEffect(() => {
        if (mcq && categoryData?.data) {
            const categoryId = mcq?.category?._id || mcq?.category || "";
            reset({
                question: mcq.question,
                options: mcq.options,
                correctAnswer: mcq.correctAnswer,
                category: categoryId,
            });
        }
    }, [mcq, categoryData, reset]);

    const options = watch("options");
    const selectedAnswer = watch("correctAnswer");

    const onSubmit = (data) => {
        const updateData = {
            question: data.question,
            options: data.options,
            correctAnswer: data.correctAnswer,
            category: data.category,
        };
        handleSubmitForm({
            apiCall: updatedMcq,
            data: updateData,
            params: { _id: mcq?._id },
            onSuccess: () => onClose(),
        });
    };

    const inputClass =
        "w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-6">
            <div className="relative max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-xl border border-gray-300 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900 sm:p-8">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-2xl font-bold text-gray-500 hover:text-red-500 focus:outline-none"
                >
                    &times;
                </button>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    {/* Header */}
                    <div className="text-center">
                        <h2 className="mb-1 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-2xl font-bold text-transparent dark:from-blue-400 dark:to-cyan-400 sm:text-3xl">
                            Edit MCQ
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">Update your multiple-choice question.</p>
                    </div>

                    {/* Question */}
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Question</label>
                        <Controller
                            name="question"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    rows={3}
                                    placeholder="Type your question here..."
                                    className={`${inputClass} resize-none`}
                                    required
                                />
                            )}
                        />
                    </div>

                    {/* Options */}
                    <div>
                        <h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Options</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {options.map((_, index) => (
                                <Controller
                                    key={index}
                                    name={`options.${index}`}
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="text"
                                            placeholder={`Option ${index + 1}`}
                                            className={inputClass}
                                            required
                                        />
                                    )}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Category Dropdown */}
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Select Category</label>
                        <Controller
                            name="category"
                            control={control}
                            render={({ field }) => (
                                <select
                                    {...field}
                                    className={inputClass}
                                    required
                                    disabled={categoriesLoading}
                                >
                                    <option
                                        value=""
                                        disabled
                                    >
                                        Select a Category
                                    </option>
                                    {categoryData?.data?.map((cat) => (
                                        <option
                                            key={cat._id}
                                            value={cat._id}
                                        >
                                            {cat.title}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                    </div>

                    {/* Correct Answer */}
                    <div>
                        <h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Correct Answer</h3>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {options.map((option, index) => (
                                <label
                                    key={index}
                                    className={`flex cursor-pointer items-center space-x-3 rounded-md p-3 transition ${selectedAnswer === option
                                            ? "bg-blue-500/20 text-gray-900 ring-2 ring-blue-500 dark:bg-blue-400/20 dark:text-white dark:ring-blue-400"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    <Controller
                                        name="correctAnswer"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="radio"
                                                value={option}
                                                checked={field.value === option}
                                                className="form-radio h-4 w-4 text-blue-600 focus:ring-0 dark:text-blue-400"
                                                required
                                            />
                                        )}
                                    />
                                    <span className="max-w-xs truncate text-sm font-medium sm:text-base">{option || `Option ${index + 1}`}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-blue-500/30 dark:from-blue-500 dark:to-cyan-400 dark:hover:from-blue-600 dark:hover:to-cyan-500"
                    >
                        {isLoading ? "Loading..." : "Update Question"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default McqEditModal;
