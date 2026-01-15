/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import FormActionButtons from "../../ui/button/formActionButtons";
import { toast } from "react-toastify";
import ModalContainer from "../../package/modalContainer";
import { useUpdateNotificationMutation } from "../../redux/features/api/notification/notification";
import { useGetAllCourseQuery } from "../../redux/features/api/course/courseApi";

const EditNotificationModal = ({ isOpen, onClose, notification }) => {
    const { data: courseData } = useGetAllCourseQuery();
    const [updateNotification, { isLoading }] = useUpdateNotificationMutation();

    const [formData, setFormData] = useState({
        title: "",
        message: "",
        type: "ALL",
        courseId: null,
        status: "Active",
    });

    // Prefill form when notification changes
    useEffect(() => {
        if (notification) {
            setFormData({
                title: notification.title || "",
                message: notification.message || "",
                type: notification.type || "ALL",
                courseId: notification.courseId?._id || null,
                status: notification.status || "Active",
            });
        }
    }, [notification]);

    if (!isOpen) return null;

    const inputClass =
        "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200";

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.message.trim()) {
            toast.error("Title and Message are required");
            return;
        }

        try {
            const response = await updateNotification({
                data: formData,
                params: { slug: notification._id },
            }).unwrap();

            toast.success(response.message || "Notification updated successfully");
            onClose();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to update notification");
        }
    };

    return (
        <ModalContainer close={onClose}>
            <div className="mb-10 text-center">
                <h2 className="mb-1 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-2xl font-bold text-transparent dark:from-blue-400 dark:to-cyan-400 sm:text-3xl">
                    Edit Notification
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">Update the notification details below.</p>
            </div>

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

                {/* Course */}
                <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Course</label>
                    <select
                        name="courseId"
                        value={formData.courseId}
                        onChange={handleInputChange}
                        className={inputClass}
                    >
                        <option value={null}>Select Course</option>
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

                {/* Type */}
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

                {/* Submit */}
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

export default EditNotificationModal;
