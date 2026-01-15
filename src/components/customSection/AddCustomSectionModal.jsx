/* eslint-disable react/prop-types */
import { useState } from "react";
import { toast } from "react-toastify";
import ModalContainer from "../../package/modalContainer";
import { Image } from "lucide-react";
import FileUpload from "../course/input/fileUpload";
import { useAddCustomSectionMutation } from "../../redux/features/api/customSection/customSection";
import { useUploadImageMutation } from "../../redux/features/api/upload/uploadApi";

const AddCustomSectionModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        cta: "",
        link: "",
        status: "Active",
        image: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [addCustomSection] = useAddCustomSectionMutation();
    const [uploadImage] = useUploadImageMutation();

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (file) => {
        setFormData((prev) => ({ ...prev, image: file }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let imageUrl = formData.image;

            // Upload image if it's a File object
            if (formData.image instanceof File) {
                setUploadingImage(true);
                const fd = new FormData();
                fd.append("image", formData.image);
                const res = await uploadImage(fd).unwrap();
                imageUrl = res?.data?.secure_url;
                setUploadingImage(false);

                if (!imageUrl) throw new Error("Image upload failed");
            }

            const payload = {
                title: formData.title,
                description: formData.description,
                cta: formData.cta,
                link: formData.link,
                status: formData.status,
                image: imageUrl || "",
            };

            await addCustomSection(payload).unwrap();

            toast.success("Custom section added successfully!");
            onSuccess();
            onClose();
        } catch (err) {
            console.error("API error:", err);
            toast.error(err?.data?.message || err?.message || "Failed to add custom section");
        } finally {
            setIsSubmitting(false);
            setUploadingImage(false);
        }
    };

    return (
        <ModalContainer close={onClose}>
            <h2 className="mb-10 text-center text-2xl font-bold text-blue-400 dark:text-gray-200">Add Custom Section</h2>

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter title"
                        required
                        className="w-full rounded-md border border-gray-300 bg-white p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter description"
                        required
                        className="w-full rounded-md border border-gray-300 bg-white p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">CTA Text</label>
                    <input
                        type="text"
                        name="cta"
                        value={formData.cta}
                        onChange={handleChange}
                        placeholder="Enter CTA text"
                        className="w-full rounded-md border border-gray-300 bg-white p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Link</label>
                    <input
                        type="text"
                        name="link"
                        value={formData.link}
                        onChange={handleChange}
                        placeholder="Enter link URL"
                        className="w-full rounded-md border border-gray-300 bg-white p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <FileUpload
                    label="Section Image"
                    name="image"
                    file={formData.image}
                    onChange={(e) => handleFileChange(e.target.files[0])}
                    accept=".jpg,.jpeg,.png,.gif"
                    IconComponent={Image}
                    maxSizeInfo="JPG, PNG, GIF (Max 5MB)"
                />
                {uploadingImage && <p className="mt-1 text-sm text-blue-500">Uploading image...</p>}

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 bg-white p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                {/* Custom action buttons */}
                <div className="mt-6 flex justify-end gap-x-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting || uploadingImage}
                        className="rounded-lg border border-gray-400 px-4 py-2 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || uploadingImage}
                        className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50 dark:from-blue-500 dark:to-cyan-400 dark:hover:from-blue-600 dark:hover:to-cyan-500"
                    >
                        {isSubmitting || uploadingImage ? "Saving..." : "Add"}
                    </button>
                </div>
            </form>
        </ModalContainer>
    );
};

export default AddCustomSectionModal;
