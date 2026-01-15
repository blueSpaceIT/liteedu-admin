/* eslint-disable react/prop-types */
"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import ModalContainer from "../../package/modalContainer";
import { generateSlug } from "../../constants";

const AddBookCategory = ({ close, initialData, onSubmit, loading, isEditMode = false }) => {
    const {
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            description: "",
        },
    });

    const inputClass =
        "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200";

    // Populate form when editing
    useEffect(() => {
        if (isEditMode && initialData) {
            setValue("name", initialData.name || "");
            setValue("description", initialData.description || "");
            setValue("status", initialData.status || "active");
        } else {
            // Reset form for add mode
            reset({
                name: "",
                description: "",
                status: "active",
            });
        }
    }, [isEditMode, initialData, setValue, reset]);

    const handleFormSubmit = async (data) => {
        let payload = { ...data };

        // Only generate slug for new categories
        if (!isEditMode) {
            payload.slug = generateSlug(data.name);
        }

        // Call the parent's onSubmit function
        if (onSubmit) {
            onSubmit(payload);
        }
    };

    return (
        <ModalContainer close={close}>
            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="w-full space-y-6"
            >
                {/* Header */}
                <div className="text-center">
                    <h2 className="mb-1 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-2xl font-bold text-transparent dark:from-blue-400 dark:to-cyan-400 sm:text-3xl">
                        {isEditMode ? "Edit Book Category" : "Add Book Category"}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
                        {isEditMode ? "Update the book category details." : "Effortlessly create a new book category."}
                    </p>
                </div>

                {/* Title */}
                <div>
                    <label
                        htmlFor="name"
                        className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base"
                    >
                        Title <span className="text-red-500">*</span>
                    </label>
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: "Title is required" }}
                        render={({ field }) => (
                            <input
                                {...field}
                                id="name"
                                placeholder="Enter category title..."
                                className={inputClass}
                            />
                        )}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                    <label
                        htmlFor="description"
                        className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base"
                    >
                        Description
                    </label>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <textarea
                                {...field}
                                id="description"
                                rows={3}
                                placeholder="Enter category description..."
                                className={`${inputClass} resize-none`}
                            />
                        )}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={close}
                        disabled={loading}
                        className="rounded-lg border border-gray-400 px-6 py-2 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2 font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50 dark:from-blue-500 dark:to-cyan-400 dark:hover:from-blue-600 dark:hover:to-cyan-500"
                    >
                        {loading ? (isEditMode ? "Updating..." : "Adding...") : isEditMode ? "Update Category" : "Add Category"}
                    </button>
                </div>
            </form>
        </ModalContainer>
    );
};

export default AddBookCategory;
