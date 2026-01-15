/* eslint-disable react/prop-types */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import ModalContainer from "../../package/modalContainer";
import FileUpload from "../course/input/fileUpload";
import { Image, Loader2 } from "lucide-react";
import { useUpdateBlogMutation, useGetAllBlogCategoryQuery } from "../../redux/features/api/blog/blogApi";
import { useUploadImageMutation } from "../../redux/features/api/upload/uploadApi";
import useFormSubmit from "../../hooks/useFormSubmit";
import { toast } from "react-toastify";

const EditBlog = ({ close, initialData, onUpdateStatus }) => {
    const {
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            categoryId: initialData?.categoryId || "",
            coverPhoto: initialData?.coverPhoto || "",
            status: initialData?.status || "Draft",
            tags: initialData?.tags ? initialData.tags.join(", ") : "",
        },
    });

    const [coverFile, setCoverFile] = useState(initialData?.coverPhoto || null);
    const [isUploading, setIsUploading] = useState(false);

    const { data: categoriesData } = useGetAllBlogCategoryQuery();
    const categories = useMemo(() => categoriesData?.data || [], [categoriesData]);

    useEffect(() => {
        if (initialData?.categoryId && categories.length > 0) {
            const selectedCategoryId = typeof initialData.categoryId === "object" ? initialData.categoryId._id : initialData.categoryId;

            setValue("categoryId", selectedCategoryId);
        }
    }, [categories, initialData?.categoryId, setValue]);

    const [updateBlog, { isLoading }] = useUpdateBlogMutation();
    const [uploadImage] = useUploadImageMutation();
    const { handleSubmitForm } = useFormSubmit();

    const inputClass =
        "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200";

    const handleCoverChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const data = new FormData();
        data.append("image", file);

        try {
            setIsUploading(true);
            const uploaded = await uploadImage(data).unwrap();
            const imageUrl = uploaded?.data?.secure_url;
            setValue("coverPhoto", imageUrl, { shouldValidate: true });
            setCoverFile(imageUrl);
            toast.success("Cover photo uploaded!");
        } catch (err) {
            console.error("Image upload failed:", err);
            toast.error("Image upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const onSubmit = (data) => {
        const payload = {
            ...data,
            tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
        };

        handleSubmitForm({
            apiCall: updateBlog,
            data: payload,
            params: { slug: initialData.slug },
            onSuccess: () => {
                reset();
                setCoverFile(initialData?.coverPhoto || null);

                // 🔑 Immediately update BlogRow status
                if (data.status && typeof onUpdateStatus === "function") {
                    onUpdateStatus(data.status);
                }

                close?.();
            },
        });
    };

    return (
        <ModalContainer close={close}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full space-y-4"
            >
                <div className="text-center">
                    <h2 className="mb-1 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-2xl font-bold text-transparent dark:from-blue-400 dark:to-cyan-400 sm:text-3xl">
                        Edit Blog
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">Update your blog post details.</p>
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
                    <FileUpload
                        label="Cover Photo (optional)"
                        name="coverPhoto"
                        accept=".jpg,.jpeg,.png,.gif"
                        onChange={handleCoverChange}
                        file={coverFile}
                        maxSizeInfo="JPG, PNG, GIF (Max 5MB)"
                        IconComponent={Image}
                    />
                    {isUploading && (
                        <p className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                            <Loader2 className="h-4 w-4 animate-spin" /> Uploading ...
                        </p>
                    )}
                </div>

                {/* Status */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Status</label>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <select
                                {...field}
                                className={inputClass}
                            >
                                <option value="Drafted">Draft</option>
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
                        onClick={close}
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
                                <Loader2 className="h-4 w-4 animate-spin" /> Updating...
                            </span>
                        ) : (
                            "Update Blog"
                        )}
                    </button>
                </div>
            </form>
        </ModalContainer>
    );
};

export default EditBlog;
