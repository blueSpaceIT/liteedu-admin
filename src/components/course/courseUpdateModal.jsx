/* eslint-disable react/prop-types */
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { FileText, Image, Loader2 } from "lucide-react";
import FileUpload from "./input/fileUpload";
import ModalContainer from "../../package/modalContainer";
import { toast } from "react-toastify";
import { useUploadImageMutation, useUploadPdfMutation } from "../../redux/features/api/upload/uploadApi";
import { useUpdateCourseMutation } from "../../redux/features/api/course/courseApi";
import useFormSubmit from "../../hooks/useFormSubmit";
import { useGetAllSubCategoryQuery } from "../../redux/features/api/subcategory/subcategory";

const CourseEditModal = ({ courseData, onClose }) => {
    const [coverFile, setCoverFile] = useState(courseData?.cover_photo || null);
    const [routineFile, setRoutineFile] = useState(courseData?.routine || null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [isUploadingFile, setIsUploadingFile] = useState(false);

    const [uploadImage] = useUploadImageMutation();
    const [uploadFile] = useUploadPdfMutation();
    const [updateCourse] = useUpdateCourseMutation();
    const { handleSubmitForm } = useFormSubmit();

    const { data: subcategoryData, isLoading: catLoading } = useGetAllSubCategoryQuery();
    const categories = useMemo(() => {
        const arr = Array.isArray(subcategoryData?.data) ? subcategoryData.data : [];
        return arr.filter(Boolean);
    }, [subcategoryData]);

    const toastRef = useRef(false);

    const [formData, setFormData] = useState({
        prefix: "",
        course_title: "",
        description: "",
        duration: "",
        course_type: "online",
        category: "",
        price: 0,
        offerPrice: 0,
        takeReview: "on",
        status: "active",
        cover_photo: "",
        routine: "",
    });

    useEffect(() => {
        if (!courseData) return;
        setFormData({
            prefix: courseData.prefix || "",
            course_title: courseData.course_title || "",
            description: courseData.description || "",
            duration: courseData.duration || "",
            course_type: courseData.course_type || "online",
            category: (courseData.category && typeof courseData.category === "object") ? courseData.category._id : (courseData.category || ""),
            price: Number(courseData.price) || 0,
            offerPrice: Number(courseData.offerPrice) || 0,
            takeReview: courseData.takeReview || "on",
            status: courseData.status || "active",
            cover_photo: courseData.cover_photo || "",
            routine: courseData.routine || "",
        });
        setCoverFile(courseData.cover_photo || null);
        setRoutineFile(courseData.routine || null);
    }, [courseData]);

    useEffect(() => {
        if (!courseData || categories.length === 0) return;
        const selectedCatId = courseData.category && typeof courseData.category === "object" ? courseData.category._id : courseData.category;
        if (!selectedCatId) return;
        const exists = categories.some((c) => c && c._id === selectedCatId);
        if (exists) setFormData((p) => ({ ...p, category: selectedCatId }));
    }, [categories, courseData]);

    const inputClass =
        "w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-transparent transition focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400";

    const handleChange = async (e) => {
        const { name, value, type, files } = e.target;

        if (type === "file" && files?.length > 0) {
            const file = files[0];
            const fd = new FormData();

            if (name === "cover_photo") {
                setCoverFile(file);
                setIsUploadingImage(true);
                fd.append("image", file);
                try {
                    const res = await uploadImage(fd).unwrap();
                    setFormData((p) => ({ ...p, cover_photo: res?.data?.secure_url || "" }));
                    toast.success("Cover photo uploaded!");
                } catch {
                    toast.error("Image upload failed");
                } finally {
                    setIsUploadingImage(false);
                }
            }

            if (name === "routine") {
                setRoutineFile(file);
                setIsUploadingFile(true);
                fd.append("pdf", file);
                try {
                    const res = await uploadFile(fd).unwrap();
                    setFormData((p) => ({ ...p, routine: res?.data?.secure_url || "" }));
                    toast.success("Routine file uploaded!");
                } catch {
                    toast.error("File upload failed");
                } finally {
                    setIsUploadingFile(false);
                }
            }
        } else {
            setFormData((prev) => {
                const newData = { ...prev, [name]: value };
                const priceNum = Number(name === "price" ? value : prev.price);
                const offerNum = Number(name === "offerPrice" ? value : prev.offerPrice);

                if (offerNum > priceNum) {
                    if (!toastRef.current) {
                        toast.error("Offer Price cannot be greater than Price!");
                        toastRef.current = true;
                    }
                    newData.offerPrice = priceNum;
                } else {
                    toastRef.current = false;
                }

                return newData;
            });
        }
    };

    const handleSubmit = () => {
        if (!formData.category) {
            toast.error("Please select a category");
            return;
        }

        const payload = {
            prefix: formData.prefix,
            course_title: formData.course_title,
            description: formData.description,
            duration: formData.duration,
            course_type: formData.course_type,
            category: formData.category,
            price: Number(formData.price) || 0,
            offerPrice: Number(formData.offerPrice) || 0,
            takeReview: formData.takeReview,
            status: formData.status,
            cover_photo: formData.cover_photo,
            routine: formData.routine,
        };

        handleSubmitForm({
            apiCall: updateCourse,
            data: payload,
            params: { slug: courseData?.slug },
            showToast: true,
            onSuccess: () => onClose(),
        });
    };

    return (
        <ModalContainer close={onClose}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                className="flex h-full flex-col"
            >
                <div className="flex-1 space-y-6 overflow-y-auto px-2">
                    <div className="text-center">
                        <h2 className="mb-1 bg-clip-text text-2xl font-bold text-blue-400 sm:text-3xl">Update Course</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">Effortlessly edit course.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Course Title</label>
                            <input
                                type="text"
                                name="course_title"
                                value={formData.course_title}
                                onChange={handleChange}
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
                                className={inputClass}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className={`${inputClass} resize-none`}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min={0}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Offer Price</label>
                            <input
                                type="number"
                                name="offerPrice"
                                value={formData.offerPrice}
                                onChange={handleChange}
                                min={0}
                                className={inputClass}
                            />
                        </div>
                    </div>

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
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="">{catLoading ? "Loading categories..." : "Select a category"}</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name || cat.title || cat._id}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

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

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FileUpload
                            label="Cover Photo"
                            name="cover_photo"
                            file={coverFile}
                            onChange={handleChange}
                            accept=".jpg,.jpeg,.png,.gif"
                            IconComponent={Image}
                            maxSizeInfo="JPG, PNG, GIF (Max 5MB)"
                        />
                        {isUploadingImage && (
                            <p className="mt-1 flex items-center gap-2 text-sm text-blue-500">
                                <Loader2 className="h-4 w-4 animate-spin" /> Uploading image...
                            </p>
                        )}

                        <FileUpload
                            label="Routine File"
                            name="routine"
                            file={routineFile}
                            onChange={handleChange}
                            accept=".pdf,.doc,.docx"
                            IconComponent={FileText}
                            maxSizeInfo="PDF, DOC, DOCX (Max 10MB)"
                        />
                        {isUploadingFile && (
                            <p className="mt-1 flex items-center gap-2 text-sm text-blue-500">
                                <Loader2 className="h-4 w-4 animate-spin" /> Uploading file...
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex justify-end gap-3 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isUploadingImage || isUploadingFile}
                        className="rounded-lg border border-gray-400 px-4 py-2 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isUploadingImage || isUploadingFile}
                        className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50 dark:from-blue-500 dark:to-cyan-400 dark:hover:from-blue-600 dark:hover:to-cyan-500"
                    >
                        {isUploadingImage || isUploadingFile ? "Saving..." : "Save Course"}
                    </button>
                </div>
            </form>
        </ModalContainer>
    );
};

export default CourseEditModal;
