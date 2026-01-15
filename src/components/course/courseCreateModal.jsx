/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client";

import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { FileText, Image, Loader2 } from "lucide-react";
import FileUpload from "./input/fileUpload";
import ModalContainer from "../../package/modalContainer";
import { useUploadImageMutation, useUploadPdfMutation } from "../../redux/features/api/upload/uploadApi";

const CourseForm = ({ onSubmit, onClose, categories = [], loading = false, initialData = {} }) => {
    const [formData, setFormData] = useState({
        prefix: initialData?.prefix || "",
        course_title: initialData?.course_title || "",
        description: initialData?.description || "",
        duration: initialData?.duration || "",
        course_type: initialData?.course_type || "online",
        category: initialData?.category?._id || "",
        price: initialData?.price || 0,
        offerPrice: initialData?.offerPrice || 0,
        takeReview: initialData?.takeReview || "on",
        status: initialData?.status || "active",
        cover_photo: initialData?.cover_photo || "",
        routine: initialData?.routine || "",
    });

    const [coverPhotoFile, setCoverPhotoFile] = useState(null);
    const [routineFile, setRoutineFile] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingFile, setUploadingFile] = useState(false);

    const [uploadImage] = useUploadImageMutation();
    const [uploadFile] = useUploadPdfMutation();

    const toastRef = useRef(false);

    const handleChange = async (e) => {
        const { name, value, type, files } = e.target;

        if (type === "file" && files?.length > 0) {
            const file = files[0];
            if (name === "cover_photo") {
                setCoverPhotoFile(file);
                setUploadingImage(true);
                const fd = new FormData();
                fd.append("image", file);
                try {
                    const res = await uploadImage(fd).unwrap();
                    setFormData((prev) => ({ ...prev, cover_photo: res?.data?.secure_url }));
                } catch (error) {
                    toast.error("Image upload failed!");
                } finally {
                    setUploadingImage(false);
                }
            }
            if (name === "routine") {
                setRoutineFile(file);
                setUploadingFile(true);
                const fd = new FormData();
                fd.append("image", file);
                try {
                    const res = await uploadFile(fd).unwrap();
                    setFormData((prev) => ({ ...prev, routine: res?.data?.secure_url }));
                } catch (error) {
                    toast.error("File upload failed!");
                } finally {
                    setUploadingFile(false);
                }
            }
        } else {
            setFormData((prev) => {
                const newData = { ...prev, [name]: value };
                const priceNum = Number(name === "price" ? value : prev.price);
                const offerNum = Number(name === "offerPrice" ? value : prev.offerPrice);

                if (offerNum > priceNum) {
                    // Only show toast once until corrected
                    if (!toastRef.current) {
                        toast.error("Offer Price cannot be greater than Price!");
                        toastRef.current = true;
                    }
                    newData.offerPrice = priceNum;
                } else {
                    toastRef.current = false; // Reset when valid
                }

                return newData;
            });
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...formData });
    };

    const inputClass =
        "w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-transparent transition focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400";

    return (
        <ModalContainer close={onClose}>
            <form
                onSubmit={handleFormSubmit}
                className="flex h-full flex-col"
            >
                <div className="flex-1 space-y-6 overflow-y-auto px-2">
                    {/* Header */}
                    <div className="text-center">
                        <h2 className="mb-1 bg-clip-text text-2xl font-bold text-blue-400 sm:text-3xl">Create New Course</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">Effortlessly create a new course.</p>
                    </div>

                    {/* Course Title & Prefix */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Course Title</label>
                            <input
                                type="text"
                                name="course_title"
                                value={formData.course_title}
                                onChange={handleChange}
                                placeholder="Enter course title"
                                className={inputClass}
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Prefix</label>
                            <input
                                type="text"
                                name="prefix"
                                value={formData.prefix}
                                onChange={handleChange}
                                placeholder="e.g., FSWD"
                                className={inputClass}
                                required
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter course description..."
                            className={`${inputClass} resize-none`}
                            rows={3}
                            required
                        />
                    </div>

                    {/* Price & Offer Price */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0"
                                min={0}
                                className={inputClass}
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Offer Price</label>
                            <input
                                type="number"
                                name="offerPrice"
                                value={formData.offerPrice}
                                onChange={handleChange}
                                placeholder="0"
                                min={0}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Duration & Category */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Duration</label>
                            <input
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="e.g., 3 months"
                                className={inputClass}
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            >
                                <option
                                    value=""
                                    disabled
                                >
                                    Select a category
                                </option>
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
                    </div>

                    {/* Status & Course Type */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Course Type</label>
                            <select
                                name="course_type"
                                value={formData.course_type}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="online">Online</option>
                                <option value="offline">Offline</option>
                            </select>
                        </div>
                    </div>

                    {/* File Uploads */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FileUpload
                            label="Course Cover Photo"
                            name="cover_photo"
                            file={coverPhotoFile}
                            onChange={handleChange}
                            accept=".jpg,.jpeg,.png,.gif"
                            IconComponent={Image}
                            maxSizeInfo="JPG, PNG, GIF (Max 5MB)"
                        />
                        {uploadingImage && (
                            <p className="mt-2 flex items-center text-sm text-blue-500">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading image...
                            </p>
                        )}

                        <FileUpload
                            label="Course Routine File"
                            name="routine"
                            file={routineFile}
                            onChange={handleChange}
                            accept=".jpg,.jpeg,.png,.gif"
                            IconComponent={FileText}
                            maxSizeInfo="JPG, PNG, GIF (Max 5MB)"
                        />
                        {uploadingFile && (
                            <p className="mt-2 flex items-center text-sm text-blue-500">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading file...
                            </p>
                        )}
                    </div>

                    {/* Take Review */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Take Review</label>
                        <select
                            name="takeReview"
                            value={formData.takeReview}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option
                                value=""
                                disabled
                            >
                                Select Review Option
                            </option>
                            <option value="on">On</option>
                            <option value="off">Off</option>
                        </select>
                    </div>
                </div>

                {/* Buttons */}
                <div className="mt-4 flex justify-end gap-3 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading || uploadingImage || uploadingFile}
                        className="rounded-lg border border-gray-400 px-4 py-2 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || uploadingImage || uploadingFile}
                        className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50 dark:from-blue-500 dark:to-cyan-400 dark:hover:from-blue-600 dark:hover:to-cyan-500"
                    >
                        {loading || uploadingImage || uploadingFile ? "Saving..." : "Save Course"}
                    </button>
                </div>
            </form>
        </ModalContainer>
    );
};

export default CourseForm;
