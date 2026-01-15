/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Image, Loader2 } from "lucide-react";
import FileUpload from "../course/input/fileUpload";
import { useUploadImageMutation } from "../../redux/features/api/upload/uploadApi";
import FormActionButtons from "../../ui/button/formActionButtons";
import useFormSubmit from "../../hooks/useFormSubmit";
import { toast } from "react-toastify";
import ModalContainer from "../../package/modalContainer";
import { useUpdateAdminMutation } from "../../redux/features/api/admin/adminApi";

const EditAdminModal = ({ isOpen, onClose, admin }) => {
    const [profileFile, setProfileFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadImages] = useUploadImageMutation();
    const [updateAdmin, { isLoading }] = useUpdateAdminMutation();
    const { handleSubmitForm } = useFormSubmit();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        role: "admin",
        profile_picture: "",
        status: "Active",
    });

    useEffect(() => {
        if (admin) {
            setProfileFile(admin?.profile_picture || null);
            setFormData({
                name: admin?.name || "",
                email: admin?.email || "",
                phone: admin?.phone || "",
                address: admin?.address || "",
                role: "admin",
                profile_picture: admin?.profile_picture || "",
                status: admin?.status || "Active",
            });
        }
    }, [admin]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const data = new FormData();
        data.append("image", file);

        try {
            setIsUploading(true);
            const uploaded = await uploadImages(data).unwrap();
            const imageUrl = uploaded?.data?.secure_url;
            if (imageUrl) {
                setFormData((prev) => ({ ...prev, profile_picture: imageUrl }));
                setProfileFile(imageUrl);
                toast.success("Profile picture uploaded");
            }
        } catch (error) {
            toast.error("Image upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSubmitForm({
            e,
            apiCall: updateAdmin,
            data: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                status: formData.status,
                profile_picture: formData.profile_picture,
            },
            params: { id: admin._id },
            onSuccess: () => onClose(),
        });
    };

    const inputClass =
        "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200";

    return (
        <ModalContainer close={onClose}>
            {/* Header */}
            <div className="mb-10 text-center">
                <h2 className="mb-1 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-2xl font-bold text-transparent dark:from-blue-400 dark:to-cyan-400 sm:text-3xl">
                    Edit Admin
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">Update the details of the admin.</p>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
                {/* Name */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                {/* Address */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                {/* Role */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Role</label>
                    <input
                        type="text"
                        value="Admin"
                        disabled
                        className={`${inputClass} dark:bg-gray-700`}
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
                        <option value="Active">Active</option>
                        <option value="Blocked">Blocked</option>
                    </select>
                </div>

                {/* Profile Picture */}
                <div className="sm:col-span-2">
                    <FileUpload
                        label="Profile Picture"
                        name="profile_picture"
                        accept=".jpg,.jpeg,.png,.gif"
                        onChange={handleFileChange}
                        file={profileFile}
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
                        submitText="Update"
                        submitColor="bg-blue-500"
                        isSubmitting={isLoading}
                    />
                </div>
            </form>
        </ModalContainer>
    );
};

export default EditAdminModal;
