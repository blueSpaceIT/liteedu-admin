import { useState } from "react";
import FormActionButtons from "../../ui/button/formActionButtons";
import { toast } from "react-toastify";
import ModalContainer from "../../package/modalContainer";
import { useCreateNotificationMutation } from "../../redux/features/api/notification/notification";
import { useGetAllCourseQuery } from "../../redux/features/api/course/courseApi";

/* eslint-disable react/prop-types */
const AddNotificationModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        type: "ALL",
        courseId: null,
        status: "Active",
    });
    const { data: courseData } = useGetAllCourseQuery();

    const [createNotification, { isLoading }] = useCreateNotificationMutation();

    if (!isOpen) return null;
    const inputClass =
        "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200";

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.message.trim()) {
            toast.error("Title and Message are required");
            return;
        }

        try {
            const response = await createNotification({ data: formData }).unwrap();
            toast.success(response.message || "Notification created successfully");
            onClose();

            // Reset form
            setFormData({
                title: "",
                message: "",
                type: "ALL",
                status: "Active",
            });
        } catch (err) {
            toast.error(err?.data?.message || "Failed to create notification");
        }
    };

    return (
        <ModalContainer close={onClose}>
            {/* Header */}
            <div className="mb-10 text-center">
                <h2 className="mb-1 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-2xl font-bold text-transparent dark:from-blue-400 dark:to-cyan-400 sm:text-3xl">
                    Create Notification
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">Fill the form to send a new notification.</p>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
                {/* Title */}
                <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="Enter notification title..."
                    />
                </div>

                {/* Message */}
                <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">
                        Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="Enter notification message..."
                        rows={4}
                    />
                </div>
                <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Course Id</label>
                    <select
                        name="courseId"
                        value={formData.courseId}
                        onChange={handleInputChange}
                        className={inputClass}
                    >
                        <option
                            value={null}
                            selected
                        >
                            Select Course
                        </option>
                        {courseData?.data?.map((course) => (
                            <option
                                key={course._id}
                                value={course._id}
                            >
                                {course.course_title}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className={inputClass}
                    >
                        <option value="ALL">ALL</option>
                        <option value="COURSE">COURSE</option>
                    </select>
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

export default AddNotificationModal;
