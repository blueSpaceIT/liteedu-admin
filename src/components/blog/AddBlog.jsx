/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import ModalContainer from "../../package/modalContainer";
import FileUpload from "../course/input/fileUpload";
import { Image, Loader2 } from "lucide-react";
import { useAddBlogMutation, useGetAllBlogCategoryQuery } from "../../redux/features/api/blog/blogApi";
import { useUploadImageMutation } from "../../redux/features/api/upload/uploadApi";
import useFormSubmit from "../../hooks/useFormSubmit";
import { toast } from "react-toastify";

const AddBlog = ({ close }) => {
    const {
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    const [coverFile, setCoverFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const { data: categoriesData } = useGetAllBlogCategoryQuery();
    const categories = categoriesData?.data || [];

    const [addBlog, { isLoading }] = useAddBlogMutation();
    const [uploadImage] = useUploadImageMutation();
    const { handleSubmitForm } = useFormSubmit();

    const inputClass =
        "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200";

    // Handle image upload
    const handleCoverChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setCoverFile(file);
        const data = new FormData();
        data.append("image", file);

        try {
            setIsUploading(true);
            const uploaded = await uploadImage(data).unwrap();
            setValue("coverPhoto", uploaded?.data?.secure_url || "", { shouldValidate: true });
            toast.success("Cover photo uploaded successfully");
        } catch (err) {
            console.error("Image upload failed:", err);
            toast.error("Image upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const onSubmit = (data) => {
        if (!data.coverPhoto) {
            toast.error("Please upload a cover photo before submitting.");
            return;
        }

        const payload = {
            ...data,
            tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
        };

        handleSubmitForm({
            apiCall: addBlog,
            data: payload,
            onSuccess: () => {
                reset();
                setCoverFile(null);
                close(false);
            },
        });
    };

    return (
        <ModalContainer close={() => close(false)}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full space-y-4"
            >
                <div className="text-center">
                    <h2 className="mb-1 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-2xl font-bold text-transparent dark:from-blue-400 dark:to-cyan-400 sm:text-3xl">
                        Add Blog
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">Create a new blog post quickly.</p>
                </div>

                {/* Title */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <Controller
                        name="title"
                        control={control}
                        rules={{ required: "Title is required" }}
                        render={({ field }) => (
                            <input
                                {...field}
                                className={inputClass}
                                placeholder="Enter blog title..."
                            />
                        )}
                    />
                    {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <Controller
                        name="description"
                        control={control}
                        rules={{ required: "Description is required" }}
                        render={({ field }) => (
                            <textarea
                                {...field}
                                className={inputClass}
                                rows={4}
                                placeholder="Enter blog description..."
                            />
                        )}
                    />
                    {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                </div>

                {/* Category */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <Controller
                        name="categoryId"
                        control={control}
                        rules={{ required: "Category is required" }}
                        render={({ field }) => (
                            <select
                                {...field}
                                className={inputClass}
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
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
                    {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
                </div>

                {/* Cover Photo */}
                <div>
                    <Controller
                        name="coverPhoto"
                        control={control}
                        render={() => (
                            <>
                                <FileUpload
                                    label="Cover Photo"
                                    name="coverPhoto"
                                    accept=".jpg,.jpeg,.png,.gif"
                                    onChange={handleCoverChange}
                                    file={coverFile}
                                    maxSizeInfo="JPG, PNG, GIF (Max 5MB)"
                                    IconComponent={Image}
                                />
                                {isUploading && (
                                    <p className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                                        <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                                    </p>
                                )}
                            </>
                        )}
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Status</label>
                    <Controller
                        name="status"
                        control={control}
                        defaultValue="Drafted" // <- match backend enum
                        render={({ field }) => (
                            <select
                                {...field}
                                className={inputClass}
                            >
                                <option value="Drafted">Drafted</option>
                                <option value="Published">Published</option>
                            </select>
                        )}
                    />
                </div>

                {/* Tags */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Tags (comma separated)</label>
                    <Controller
                        name="tags"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                className={inputClass}
                                placeholder="e.g. JavaScript, Programming"
                            />
                        )}
                    />
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex justify-end gap-3 border-t border-gray-200 pt-2 dark:border-gray-700">
                    {/* Cancel */}
                    <button
                        type="button"
                        onClick={() => close(false)}
                        disabled={isLoading || isUploading}
                        className="rounded-lg border border-gray-400 px-4 py-2 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading || isUploading}
                        className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50 dark:from-blue-500 dark:to-cyan-400 dark:hover:from-blue-600 dark:hover:to-cyan-500"
                    >
                        {isLoading || isUploading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" /> Adding...
                            </span>
                        ) : (
                            "Add Blog"
                        )}
                    </button>
                </div>
            </form>
        </ModalContainer>
    );
};

export default AddBlog;
