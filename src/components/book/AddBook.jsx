/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";
import ModalContainer from "../../package/modalContainer";
import Button from "../../ui/button";
import FileUpload from "../course/input/fileUpload";
import { Image } from "lucide-react";
import useFormSubmit from "../../hooks/useFormSubmit";
import { useAddBookCategoryMutation, useGetAllBookCategoryQuery } from "../../redux/features/api/book/bookApi";

const AddBook = ({ close }) => {
    const [formData, setFormData] = useState({
        title: "",
        bookType: "",
        price: "",
        stock: "",
        status: "Available",
        coverPhoto: "",
    });

    const [coverFile, setCoverFile] = useState(null);
    const [addBook, { isLoading }] = useAddBookCategoryMutation();
    const { handleSubmitForm } = useFormSubmit();

    // Fetch all book categories
    const { data: categoriesData, isLoading: isCategoriesLoading } = useGetAllBookCategoryQuery();
    const categories = categoriesData?.data || [];

    const inputClass =
        "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setCoverFile(file);
        setFormData((prev) => ({ ...prev, coverPhoto: URL.createObjectURL(file) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSubmitForm({
            e,
            apiCall: addBook,
            data: formData,
            onSuccess: () => {
                setFormData({
                    title: "",
                    bookType: "",
                    price: "",
                    stock: "",
                    status: "Available",
                    coverPhoto: "",
                });
                setCoverFile(null);
                close?.();
            },
        });
    };

    return (
        <ModalContainer close={close}>
            <form
                onSubmit={handleSubmit}
                className="w-full space-y-2"
            >
                <div className="text-center">
                    <h2 className="mb-1 text-2xl font-bold sm:text-3xl">Add Book</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">Fill in book details below.</p>
                </div>

                {/* Cover Photo */}
                <FileUpload
                    label="Cover Photo"
                    name="coverPhoto"
                    accept=".jpg,.jpeg,.png,.gif"
                    onChange={handleCoverChange}
                    file={coverFile}
                    maxSizeInfo="JPG, PNG, GIF (Max 5MB)"
                    IconComponent={Image}
                />

                {/* Title */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter book title..."
                        className={inputClass}
                        required
                    />
                </div>

                {/* Book Type */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">
                        Book Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="bookType"
                        value={formData.bookType}
                        onChange={handleChange}
                        className={inputClass}
                        required
                        disabled={isCategoriesLoading}
                    >
                        <option value="">{isCategoriesLoading ? "Loading..." : "Select Book Type"}</option>
                        {categories.map((cat) => (
                            <option
                                key={cat._id}
                                value={cat._id}
                            >
                                {cat.name} {/* <-- Use "name" here */}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">
                        Price <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Enter book price..."
                        className={inputClass}
                        required
                    />
                </div>

                {/* Stock */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">
                        Stock <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="Enter stock quantity..."
                        className={inputClass}
                        required
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className={inputClass}
                    >
                        <option value="Available">Available</option>
                        <option value="OutOfStock">Out of Stock</option>
                    </select>
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        size="md"
                        disabled={isLoading}
                    >
                        {isLoading ? "Adding..." : "Add Book"}
                    </Button>
                </div>
            </form>
        </ModalContainer>
    );
};

export default AddBook;
