/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import ModalContainer from "../../package/modalContainer";
import Button from "../../ui/button";
import { useGetAllBookCategoryQuery, useUpdateBookMutation } from "../../redux/features/api/book/bookApi";
import useFormSubmit from "../../hooks/useFormSubmit";
import FileUpload from "../course/input/fileUpload";
import { useUploadImageMutation } from "../../redux/features/api/upload/uploadApi";
import { toast } from "react-toastify";
import { Image } from "lucide-react";

const UpdateBookModal = ({ isOpen, close, initialData }) => {
    const [coverPhotoUrl, setCoverPhotoUrl] = useState(initialData?.coverPhoto || "");
    const [uploadingImage, setUploadingImage] = useState(false);
    const [loading, setLoading] = useState(false);

    const [uploadImage] = useUploadImageMutation();
    const [updateBook] = useUpdateBookMutation();
    const { handleSubmitForm } = useFormSubmit();
    const { data } = useGetAllBookCategoryQuery();
    const categories = useMemo(() => data?.data || [], [data]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            categoryId: initialData?.categoryId || "",
            pdf: initialData?.pdf || "",
            uploadLink: initialData?.uploadLink || "",
            previewPdf: initialData?.previewPdf || "",
            trailer: initialData?.trailer || "",
            status: initialData?.status || "Active",
            bookType: initialData?.bookType || "Ebook",
            price: initialData?.price || 0,
            offerPrice: initialData?.offerPrice || 0,
            stock: initialData?.stock || "In Stock",
            tags: initialData?.tags?.join(", ") || "",
        },
    });

    const handleChange = async (e) => {
        const { files } = e.target;
        if (files && files.length > 0) {
            const fd = new FormData();
            fd.append("image", files[0]);
            setUploadingImage(true);
            try {
                const res = await uploadImage(fd).unwrap();
                setCoverPhotoUrl(res?.data?.secure_url);
            } catch (err) {
                toast.error("Image upload failed, try again.");
            } finally {
                setUploadingImage(false);
            }
        }
    };

    const onSubmit = async (formData) => {
        if (!coverPhotoUrl) {
            toast.error("Please upload a cover photo.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                offerPrice: formData.offerPrice ? Number(formData.offerPrice) : undefined,
                tags: formData.tags
                    ? formData.tags
                          .split(",")
                          .map((t) => t.trim())
                          .filter((t) => t)
                    : [],
                coverPhoto: coverPhotoUrl,
            };

            await handleSubmitForm({
                apiCall: updateBook,
                data: payload,
                params: { slug: initialData.slug },
                showToast: true,
            });

            close();
        } catch (err) {
            toast.error("Failed to update book. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";
    const labelClass = "block mb-1 font-semibold text-gray-800 dark:text-gray-200";

    return (
        <ModalContainer
            isOpen={isOpen}
            close={close}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex h-full flex-col space-y-4"
            >
                <div className="text-center">
                    <h2 className="mb-1 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                        Update Book
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">Update the book details below.</p>
                </div>

                {/* Title & Description */}
                <div>
                    <label className={labelClass}>
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("title", { required: "Title is required" })}
                        placeholder="Book title"
                        className={inputClass}
                    />
                    {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                </div>
                <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                        {...register("description")}
                        rows={3}
                        placeholder="Book description"
                        className={`${inputClass} resize-none`}
                    />
                </div>

                {/* Category */}
                <div>
                    <label className={labelClass}>
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        {...register("categoryId")}
                        className={inputClass}
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option
                                key={cat._id}
                                value={cat._id}
                            >
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Links */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className={labelClass}>PDF URL</label>
                        <input
                            {...register("pdf")}
                            placeholder="PDF URL"
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Preview PDF</label>
                        <input
                            {...register("previewPdf")}
                            placeholder="Preview PDF"
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Upload Link</label>
                        <input
                            {...register("uploadLink")}
                            placeholder="Upload link"
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Trailer Link</label>
                        <input
                            {...register("trailer")}
                            placeholder="Trailer URL"
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Status, Type, Stock */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                        <label className={labelClass}>Status</label>
                        <select
                            {...register("status")}
                            className={inputClass}
                        >
                            <option value="Active">Active</option>
                            <option value="Drafted">Drafted</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Book Type</label>
                        <select
                            {...register("bookType")}
                            className={inputClass}
                        >
                            <option value="Ebook">Ebook</option>
                            <option value="Hard copy">Hard copy</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Stock</label>
                        <select
                            {...register("stock")}
                            className={inputClass}
                        >
                            <option value="In Stock">In Stock</option>
                            <option value="Out Off Stock">Out Off Stock</option>
                        </select>
                    </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className={labelClass}>Price</label>
                        <input
                            type="number"
                            {...register("price")}
                            placeholder="Price"
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Offer Price</label>
                        <input
                            type="number"
                            {...register("offerPrice")}
                            placeholder="Offer price"
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Cover photo */}
                <FileUpload
                    label="Cover Photo"
                    name="cover_photo"
                    accept=".jpg,.jpeg,.png,.gif"
                    onChange={handleChange}
                    file={coverPhotoUrl}
                    maxSizeInfo="JPG, PNG, GIF (Max 5MB)"
                    IconComponent={Image}
                />
                {uploadingImage && <p className="mt-2 flex animate-pulse items-center text-sm text-blue-500">Uploading...</p>}

                {/* Tags */}
                <div>
                    <label className={labelClass}>Tags</label>
                    <input
                        {...register("tags")}
                        placeholder="JavaScript, Programming, ..."
                        className={inputClass}
                    />
                </div>

                {/* Buttons */}
                <div className="mt-4 flex justify-end gap-3 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={close}
                        disabled={loading || uploadingImage}
                        className="rounded-lg border border-gray-400 px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50 dark:from-blue-500 dark:to-cyan-400 dark:hover:from-blue-600 dark:hover:to-cyan-500"
                    >
                        {loading ? "Updating..." : "Update Book"}
                    </button>
                </div>
            </form>
        </ModalContainer>
    );
};

export default UpdateBookModal;
