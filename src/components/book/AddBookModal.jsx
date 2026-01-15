/* eslint-disable react/prop-types */
"use client";

import { useForm } from "react-hook-form";
import ModalContainer from "../../package/modalContainer";
import useFormSubmit from "../../hooks/useFormSubmit";
import FileUpload from "../course/input/fileUpload";
import { Image, Loader2 } from "lucide-react";
import { useAddBookMutation, useGetAllBookCategoryQuery } from "../../redux/features/api/book/bookApi";
import { useMemo, useState } from "react";
import { useUploadImageMutation } from "../../redux/features/api/upload/uploadApi";
import { toast } from "react-toastify";

const AddBookModal = ({ onClose }) => {
    const [loading, setLoading] = useState(false);
    const [coverPhotoUrl, setCoverPhotoUrl] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);

    const [uploadImage] = useUploadImageMutation();
    const { data } = useGetAllBookCategoryQuery();
    const categories = useMemo(() => data?.data || [], [data]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const [addBook] = useAddBookMutation();
    const { handleSubmitForm } = useFormSubmit();
    const handleChange = async (e) => {
        const { name, type, files } = e.target;
        if (type === "file" && files && files.length > 0 && name === "cover_photo") {
            const file = files[0];
            const fd = new FormData();
            fd.append("image", file);

            setUploadingImage(true);
            try {
                const res = await uploadImage(fd).unwrap();
                setCoverPhotoUrl(res?.data?.secure_url);
            } catch (error) {
                console.error(error);
                toast.error("Image upload failed, try again.");
            } finally {
                setUploadingImage(false);
            }
        }
    };

    const onSubmit = async (data) => {
        if (!coverPhotoUrl) {
            toast.error("Please upload a cover photo before submitting.");
            return;
        }

        if (!data.categoryId) {
            toast.error("Please select a category.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                title: data.title,
                description: data.description || undefined,
                categoryId: data.categoryId,
                pdf: data.pdf || undefined,
                uploadLink: data.uploadLink || undefined,
                previewPdf: data.previewPdf || undefined,
                trailer: data.trailer || undefined,
                status: data.status,
                bookType: data.bookType,
                price: Number(data.price),
                offerPrice: data.offerPrice ? Number(data.offerPrice) : undefined,
                stock: data.stock,
                coverPhoto: coverPhotoUrl,
                tags: data.tags
                    ? data.tags
                          .split(",")
                          .map((t) => t.trim())
                          .filter((t) => t)
                    : [],
            };
            await handleSubmitForm({ apiCall: addBook, data: payload, showToast: false });
            reset();
            setCoverPhotoUrl("");
            onClose();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to add book");
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400";

    return (
        <ModalContainer close={onClose}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex h-full flex-col"
            >
                <div className="flex-1 space-y-6 overflow-y-auto px-2">
                    <div className="text-center">
                        <h2 className="mb-1 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                            Add New Book
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">Fill out the details to add a new book.</p>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Title</label>
                        <input
                            {...register("title", { required: "Title is required" })}
                            placeholder="Enter book title..."
                            className={inputClass}
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Description</label>
                        <textarea
                            {...register("description")}
                            rows={3}
                            placeholder="Enter description..."
                            className={`${inputClass} resize-none`}
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Category</label>
                        <select
                            {...register("categoryId")}
                            className={inputClass}
                        >
                            <option value="">Select a category</option>
                            {categories?.map((cat) => (
                                <option
                                    key={cat._id}
                                    value={cat._id}
                                >
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">PDF Link</label>
                            <input
                                {...register("pdf")}
                                placeholder="PDF link"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Preview PDF Link</label>
                            <input
                                {...register("previewPdf")}
                                placeholder="Preview PDF link"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Upload Link</label>
                            <input
                                {...register("uploadLink")}
                                placeholder="Upload link"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Trailer Link</label>
                            <input
                                {...register("trailer")}
                                placeholder="Trailer link"
                                className={inputClass}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Status</label>
                            <select
                                {...register("status")}
                                className={inputClass}
                            >
                                <option value="Active">Active</option>
                                <option value="Drafted">Drafted</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Book Type</label>
                            <select
                                {...register("bookType")}
                                className={inputClass}
                            >
                                <option value="Ebook">Ebook</option>
                                <option value="Hard copy">Hard copy</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Stock</label>
                            <select
                                {...register("stock")}
                                className={inputClass}
                            >
                                <option value="In Stock">In Stock</option>
                                <option value="Out Off Stock">Out Off Stock</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">Pricing</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                                <input
                                    {...register("price")}
                                    type="number"
                                    placeholder="Enter price"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Offer Price</label>
                                <input
                                    {...register("offerPrice")}
                                    type="number"
                                    placeholder="Enter offer price"
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </div>
                    <FileUpload
                        label="Book Cover Photo"
                        name="cover_photo"
                        accept=".jpg,.jpeg,.png,.gif"
                        onChange={handleChange}
                        file={coverPhotoUrl}
                        maxSizeInfo="JPG, PNG, GIF (Max 5MB)"
                        IconComponent={Image}
                    />
                    {uploadingImage && (
                        <p className="mt-2 flex items-center text-sm text-blue-500">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                        </p>
                    )}
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Tags</label>
                        <input
                            {...register("tags")}
                            placeholder="Tags (comma separated)"
                            className={inputClass}
                        />
                    </div>
                </div>
                <div className="mt-4 flex justify-end gap-3 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onClose} 
                        disabled={loading || uploadingImage}
                        className="rounded-lg border border-gray-400 px-4 py-2 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50 dark:from-blue-500 dark:to-cyan-400 dark:hover:from-blue-600 dark:hover:to-cyan-500"
                    >
                        {loading ? "Adding..." : "Add Book"}
                    </button>
                </div>
            </form>
        </ModalContainer>
    );
};

export default AddBookModal;
