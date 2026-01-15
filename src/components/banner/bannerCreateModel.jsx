/* eslint-disable react/prop-types */
import { useState } from "react";
import FormActionButtons from "../../ui/button/formActionButtons";
import useFormSubmit from "../../hooks/useFormSubmit";
import FileUpload from "../course/input/fileUpload";
import { Image } from "lucide-react";
import { useUploadImageMutation } from "../../redux/features/api/upload/uploadApi";
import { useAddBannerMutation } from "../../redux/features/api/banner/bannerApi";

const BannerCreateModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        position: "",
        viewLink: "",
        image: "",
        status: "Published",
    });
    const [coverPhotoFile, setCoverPhotoFile] = useState(null);

    const [addBanner, { isLoading }] = useAddBannerMutation();
    const [uploadImages] = useUploadImageMutation();
    const { handleSubmitForm } = useFormSubmit();

    if (!isOpen) return null;

    const handleChange = async (e) => {
        const { name, value, files } = e.target;

        if (files) {
            setCoverPhotoFile(files[0]);
            const form = new FormData();
            form.append("image", files[0]);
            const uploaded = await uploadImages(form);
            const uploadedUrl = uploaded?.data?.data?.secure_url || "";
            setFormData((prev) => ({ ...prev, position: Number(formData.position), image: uploadedUrl }));
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        const dataToSend = {
            ...formData,
            position: Number(formData.position),
        };
        handleSubmitForm({
            e,
            apiCall: addBanner,
            data: dataToSend,
            onSuccess: () => {
                setFormData({ position: "", viewLink: "", image: "", status: "Published" });
                setCoverPhotoFile(null);
                onClose();
            },
        });
    };

    const inputClass = "w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="max-h-[90vh] w-[90%] max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Create Banner</h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    {/* Position & Status */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="flex flex-1 flex-col">
                            <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
                            <input
                                type="number"
                                placeholder="1"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            />
                        </div>

                        <div className="flex flex-1 flex-col">
                            <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            >
                                <option value="Published">Published</option>
                                <option value="Drafted">Drafted</option>
                            </select>
                        </div>
                    </div>

                    {/* View Link */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="flex flex-1 flex-col">
                            <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">View Link</label>
                            <input
                                type="text"
                                name="viewLink"
                                placeholder="https://example.com"
                                value={formData.viewLink}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <FileUpload
                            label="Banner Image"
                            name="image"
                            accept=".jpg,.jpeg,.png,.gif"
                            onChange={handleChange}
                            file={coverPhotoFile}
                            maxSizeInfo="JPG, PNG, GIF (Max 5MB)"
                            IconComponent={Image}
                        />
                    </div>

                    {/* Submit / Cancel */}
                    <FormActionButtons
                        onCancel={onClose}
                        cancelText="Cancel"
                        submitText="Create"
                        submitColor="bg-green-500"
                        isSubmitting={isLoading}
                    />
                </form>
            </div>
        </div>
    );
};

export default BannerCreateModal;
