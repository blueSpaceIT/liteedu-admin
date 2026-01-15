/* eslint-disable react/prop-types */
"use client";

import { useForm, Controller } from "react-hook-form";
import ModalContainer from "../../package/modalContainer";
import { useUpdateBlogCategoryMutation } from "../../redux/features/api/blog/blogApi";
import useFormSubmit from "../../hooks/useFormSubmit";
import { Loader2 } from "lucide-react";

const EditBlogCategory = ({ close, initialData }) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: { title: initialData?.title || "" },
    });

    const [updateBlogCategory, { isLoading }] = useUpdateBlogCategoryMutation();
    const { handleSubmitForm } = useFormSubmit();

    const onSubmit = (data) => {
        handleSubmitForm({
            apiCall: updateBlogCategory,
            data,
            params: { slug: initialData.slug },
            onSuccess: () => close?.(),
        });
    };

    const inputClass =
        "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500";

    return (
        <ModalContainer close={close}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
            >
                {/* Header */}
                <div className="text-center">
                    <h2 className="mb-1 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-2xl font-bold text-transparent dark:from-blue-400 dark:to-cyan-400 sm:text-3xl">
                        Edit Blog Category
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Update the category title.</p>
                </div>

                {/* Title Input */}
                <div>
                    <label
                        htmlFor="title"
                        className="mb-1 block text-gray-800 dark:text-gray-200"
                    >
                        Title <span className="text-red-500">*</span>
                    </label>
                    <Controller
                        name="title"
                        control={control}
                        rules={{ required: "Title is required" }}
                        render={({ field }) => (
                            <input
                                {...field}
                                id="title"
                                className={inputClass}
                                placeholder="Enter category title..."
                            />
                        )}
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex justify-end gap-3 border-t border-gray-200 pt-2 dark:border-gray-700">
                    {/* Cancel */}
                    <button
                        type="button"
                        onClick={close}
                        disabled={isLoading}
                        className="rounded-lg border border-gray-400 px-4 py-2 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50 dark:from-blue-500 dark:to-cyan-400 dark:hover:from-blue-600 dark:hover:to-cyan-500"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Updating...
                            </span>
                        ) : (
                            "Update Category"
                        )}
                    </button>
                </div>
            </form>
        </ModalContainer>
    );
};

export default EditBlogCategory;
