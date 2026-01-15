/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";
import { Image, Loader2 } from "lucide-react";
import FormActionButtons from "../../ui/button/formActionButtons";
import FileUpload from "../course/input/fileUpload";
import { useUploadImageMutation } from "../../redux/features/api/upload/uploadApi";
import { toast } from "react-toastify";
import ModalContainer from "../../package/modalContainer";
import { useCreateAdminMutation } from "../../redux/features/api/admin/adminApi";

const AdminCreateModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        role: "admin",
        profile_picture: "",
        status: "Active",
    });

    const [coverFile, setCoverFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const [createAdmin, { isLoading }] = useCreateAdminMutation();
    const [uploadImage] = useUploadImageMutation();

    if (!isOpen) return null;

    const inputClass =
        "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200";

    // Handle input change including image upload
    const handleInputChange = async (e) => {
        const { name, value, files } = e.target;

        // Image upload
        if (files && files[0]) {
            const file = files[0];
            setCoverFile(file);

            const data = new FormData();
            data.append("image", file);

            try {
                setIsUploading(true);
                const uploaded = await uploadImage(data).unwrap();
                setFormData((prev) => ({
                    ...prev,
                    profile_picture: uploaded?.data?.secure_url || "",
                }));
                toast.success("Profile picture uploaded successfully");
            } catch (err) {
                toast.error("Image upload failed");
            } finally {
                setIsUploading(false);
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        const requiredFields = ["name", "email", "password", "phone", "address"];
        for (let field of requiredFields) {
            if (!formData[field].trim()) {
                toast.error(`Please fill the ${field} field`);
                return;
            }
        }

        try {
            const response = await createAdmin(formData).unwrap();
            toast.success(response.message || "Admin created successfully");
            onClose();
            // Reset form
            setFormData({
                name: "",
                email: "",
                password: "",
                phone: "",
                address: "",
                role: "admin",
                profile_picture: "",
                status: "Active",
            });
            setCoverFile(null);
        } catch (err) {
            toast.error(err?.data?.message || "Failed to create admin");
        }
    };

    return (
        <ModalContainer close={onClose}>
            {/* Header */}
            <div className="mb-10 text-center">
                <h2 className="mb-1 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-2xl font-bold text-transparent dark:from-blue-400 dark:to-cyan-400 sm:text-3xl">
                    Create Admin
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">Fill the form to add a new admin.</p>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
                {/* Name */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="Enter full name..."
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="Enter email..."
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">
                        Password <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="Enter password..."
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">
                        Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="Enter phone number..."
                    />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">
                        Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="Enter address..."
                    />
                </div>

                {/* Role */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Role</label>
                    <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className={inputClass}
                        disabled
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className={inputClass}
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                {/* Profile Picture */}
                <div className="sm:col-span-2">
                    <FileUpload
                        label="Profile Picture"
                        name="profile_picture"
                        accept=".jpg,.jpeg,.png,.gif"
                        onChange={handleInputChange}
                        file={coverFile}
                        maxSizeInfo="JPG, PNG, GIF (Max 5MB)"
                        IconComponent={Image}
                    />
                    {isUploading && (
                        <p className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Uploading ...
                        </p>
                    )}
                </div>

                {/* Submit Buttons */}
                <div className="col-span-2 mt-4 flex justify-end gap-3">
                    <FormActionButtons
                        onCancel={onClose}
                        cancelText="Cancel"
                        submitText="Create"
                        submitColor="bg-green-500"
                        isSubmitting={isLoading}
                    />
                </div>
            </form>
        </ModalContainer>
    );
};

export default AdminCreateModal;
