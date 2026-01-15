/* eslint-disable react/prop-types */
import { Trash } from "lucide-react";
import { useState } from "react";

const EnrollmentRow = ({ enrollment, onDelete, deleteLoading }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDeleteConfirm = () => {
        setIsDeleteModalOpen(false);
        if (onDelete) {
            onDelete(enrollment._id);
        }
    };
    console.log(enrollment);

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });

    return (
        <>
            <tr className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                <td className="px-4 py-3 text-xs font-semibold md:text-sm">{enrollment.number}</td>

                <td className="px-5 py-3 text-xs md:text-sm">
                    <p className="font-semibold">{enrollment.studentId?.name || "N/A"}</p>
                    <p className="text-gray-500">{enrollment.studentId?.phone || "N/A"}</p>
                </td>

                <td className="px-2 py-3 text-xs md:text-sm">{enrollment.studentId?.role || "N/A"}</td>

                <td className="px-2 py-3 text-xs md:text-sm">
                    <div className="flex items-center gap-3">
                        {enrollment.courseId?.cover_photo ? (
                            <img
                                src={enrollment.courseId.cover_photo}
                                alt={enrollment.courseId.course_title || "Course"}
                                className="h-12 w-12 rounded object-cover"
                            />
                        ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-200 text-xs text-gray-400 dark:bg-gray-700">
                                No Image
                            </div>
                        )}

                        <div className="flex flex-col">
                            <span className="font-semibold">{enrollment.courseId?.course_title || "N/A"}</span>
                            <span className="text-sm text-gray-500">{enrollment.courseId?.duration || "N/A"}</span>
                        </div>
                    </div>
                </td>

                {/* Payment */}
                <td className="px-2 py-3 text-xs md:text-sm">৳ {enrollment.paidAmont || 0}</td>

                {/* Status */}
                <td className="px-2 py-3 text-xs md:text-sm">
                    <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium sm:text-xs ${
                            enrollment.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : enrollment.status === "inactive"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        }`}
                    >
                        {enrollment.status || "N/A"}
                    </span>
                </td>

                {/* Enrolled At */}
                <td className="px-2 py-3 text-xs md:text-sm">{enrollment.createdAt ? formatDate(enrollment.createdAt) : "N/A"}</td>

                {/* Actions */}
                <td className="py-3">
                    <div className="pl-5">
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="rounded-full bg-red-100 p-1.5 text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-700"
                            title="Delete Enrollment"
                        >
                            <Trash size={16} />
                        </button>
                    </div>
                </td>
            </tr>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-[90%] max-w-sm rounded-lg bg-white p-6 text-center shadow-xl dark:bg-gray-900">
                        <h3 className="mb-4 text-xl font-semibold dark:text-white">Confirm Deletion</h3>
                        <p className="mb-6 dark:text-gray-300">
                            Are you sure you want to delete <strong>{enrollment.studentId?.name || "this enrollment"}</strong>?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="rounded bg-gray-300 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                                disabled={deleteLoading}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EnrollmentRow;
