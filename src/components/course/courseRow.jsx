/* eslint-disable react/prop-types */
import { PencilLine, Trash } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CourseRow = ({ course, onEdit, onDelete }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleDeleteConfirm = () => {
        setIsDeleteModalOpen(false);
        onDelete?.(course.slug);
    };

    return (
        <>
            <tr className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                {/* Number */}
                <td className="py-3 pr-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-200 md:text-sm">{course.number}</td>

                {/* Course Info */}
                <td className="px-2 py-3">
                    <div className="flex max-w-xs flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
                        <img
                            src={course.cover_photo}
                            alt={course.course_title}
                            className="size-14 rounded-lg border border-gray-300 object-cover dark:border-gray-700"
                        />
                        <div
                            className="cursor-pointer"
                            onClick={() => navigate(`/course/${course.slug}`)}
                        >
                            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{course.course_title}</p>
                            <p className="line-clamp-2 text-xs text-gray-600 dark:text-gray-400">{course.description}</p>
                            <p className="mt-1 inline-block rounded bg-blue-100 px-2 py-0.5 text-[11px] text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {course.prefix}
                            </p>
                        </div>
                    </div>
                </td>

                {/* Category */}
                <td className="px-2 py-3 text-start text-xs font-semibold text-gray-700 dark:text-gray-200 md:text-sm">
                    {course.category?.name}
                </td>

                {/* Price */}
                <td className="px-2 py-3 text-xs md:text-sm">
                    <p className="font-medium text-gray-800 dark:text-gray-100">৳ {course.price}</p>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">Offer: ৳ {course.offerPrice}</p>
                </td>

                {/* Status */}
                <td className="px-2 py-3 text-xs md:text-sm">
                    <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium sm:text-xs ${
                            course.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : course.status === "archived"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                    >
                        {course.status}
                    </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-x-2 sm:gap-x-4">
                        <button
                            onClick={() => onEdit(course)} // ✅ send to root
                            className="... rounded-full bg-blue-100 p-1.5 text-blue-700"
                            title="Edit Course"
                        >
                            <PencilLine size={16} />
                        </button>

                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="rounded-full bg-red-100 p-1.5 text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-700"
                            title="Delete Course"
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
                            Are you sure you want to delete <strong>{course.course_title}</strong>?
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

export default CourseRow;
