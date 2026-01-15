/* eslint-disable react/prop-types */
import { useState } from "react";
import { DollarSign } from "lucide-react";
import InputGroup from "../course/input/inputGroup";
import { useCreateEnrollmentMutation, useUpdateEnrollmentMutation } from "../../redux/features/api/newEnrollment/newEnrollment";
import { useGetAllCourseQuery } from "../../redux/features/api/course/courseApi";
import { toast } from "react-toastify";

const EnrollmentForm = ({ onClose, initialData = {} }) => {
    const [createEnrollment, { isLoading: createLoading }] = useCreateEnrollmentMutation();
    const [updateEnrollment, { isLoading: updateLoading }] = useUpdateEnrollmentMutation();

    // Form State
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        phone: initialData?.phone || "",
        courseId: initialData?.courseId?._id || initialData?.courseId || "",
        paidAmont: initialData?.paidAmont || 0,
        discount: initialData?.discount || 0,
        due: initialData?.due || 0,
        paymentMethod: initialData?.paymentMethod || "bikash",
        paymentNumber: initialData?.paymentNumber || "",
        discountReason: initialData?.discountReason || "",
        transctionId: initialData?.transctionId || "",
    });

    // Fetch all courses
    const { data: courseData, isLoading: courseLoading } = useGetAllCourseQuery();
    const courses = courseData?.data || [];

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            courseId: formData.courseId,
            course_type: "online",
            paidAmont: Number(formData.paidAmont),
            discount: Number(formData.discount),
            due: Number(formData.due),
            paymentMethod: formData.paymentMethod,
            paymentNumber: formData.paymentNumber,
            name: formData.name,
            phone: formData.phone,
            transctionId: formData.transctionId || "",
            discountReason: formData.discountReason || "",
        };

        try {
            if (initialData?._id) {
                // Update enrollment
                await updateEnrollment({ id: initialData._id, data: payload }).unwrap();
                toast.success("Enrollment updated successfully");
            } else {
                // Create enrollment
                await createEnrollment(payload).unwrap();
                toast.success("Enrollment created successfully");
            }
            onClose();
        } catch (error) {
            toast.error(error?.data?.message || "Failed to save enrollment");
            console.error("Enrollment operation failed:", error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50 backdrop-blur-sm dark:bg-opacity-75">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800 md:p-8">
                <div className="mb-8">
                    <h2 className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text pb-2 text-center text-2xl font-bold text-transparent dark:from-blue-400 dark:to-cyan-400 sm:text-3xl">
                        {initialData?._id ? "Edit Enrollment" : "Add a New Enrollment"}
                    </h2>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 sm:text-base">
                        {initialData?._id ? "Edit Enrollment" : "Add a New Enrollment"}
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {/* Student Info */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium">Student Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-md border p-3"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium">Student Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-md border p-3"
                            />
                        </div>
                    </div>

                    {/* Course Dropdown */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">Course</label>
                        <select
                            name="courseId"
                            value={formData.courseId}
                            onChange={handleChange}
                            required
                            className="block w-full rounded-md border p-3"
                        >
                            <option
                                value=""
                                disabled
                            >
                                Select a course
                            </option>
                            {courseLoading && <option>Loading...</option>}
                            {courses.map((course) => (
                                <option
                                    key={course._id}
                                    value={course._id}
                                >
                                    {course.course_title} ({course.duration})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Payment Info */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <InputGroup
                            id="paidAmont"
                            label="Paid Amount"
                            type="number"
                            icon={DollarSign}
                            name="paidAmont"
                            value={formData.paidAmont}
                            onChange={handleChange}
                            required
                        />
                        <InputGroup
                            id="due"
                            label="Due Amount"
                            type="number"
                            name="due"
                            value={formData.due}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <InputGroup
                            id="discount"
                            label="Discount"
                            type="number"
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
                        />
                        <InputGroup
                            id="discountReason"
                            label="Discount Reason"
                            name="discountReason"
                            value={formData.discountReason}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <InputGroup
                            id="paymentNumber"
                            label="Payment Number"
                            name="paymentNumber"
                            value={formData.paymentNumber}
                            onChange={handleChange}
                        />
                        <InputGroup
                            id="paymentMethod"
                            label="Payment Method"
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                            type="select"
                        >
                            <option value="bikash">Bikash</option>
                            <option value="rocket">Rocket</option>
                            <option value="cash">Cash</option>
                            <option value="nagad">Nagad</option>
                        </InputGroup>
                    </div>

                    <InputGroup
                        id="transctionId"
                        label="Transaction ID"
                        name="transctionId"
                        value={formData.transctionId}
                        onChange={handleChange}
                    />

                    {/* Buttons */}
                    <div className="flex justify-end gap-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={createLoading || updateLoading}
                            className="rounded-md bg-gray-200 px-6 py-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={createLoading || updateLoading}
                            className="rounded-md bg-blue-600 px-6 py-2 text-white"
                        >
                            {createLoading || updateLoading ? "Saving..." : "Save Enrollment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EnrollmentForm;
