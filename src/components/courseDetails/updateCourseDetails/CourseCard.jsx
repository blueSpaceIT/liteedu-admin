/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useMemo, useEffect } from "react";
import UpdateCourseDetailsModal from "./UpdateCourseDetailsModal";
import { useUsergetAllQuery } from "../../../redux/features/api/user/userApi";
import { ToastContainer } from "react-toastify";

const CourseCard = ({ course: parentCourse, onCourseUpdate, courseDetails }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [course, setCourse] = useState(parentCourse);

    const { data: usersData } = useUsergetAllQuery({ page: 1, limit: 1000 });
    const teachers = useMemo(() => usersData?.data?.filter((u) => u.role === "teacher") || [], [usersData]);

    useEffect(() => {
        setCourse(parentCourse);
    }, [parentCourse]);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleUpdateFromModal = (updatedCourse) => {
        setCourse(updatedCourse);
        onCourseUpdate(updatedCourse);
        handleCloseModal();
    };

    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col">
                <div className="relative aspect-video overflow-hidden rounded-lg md:h-[240px] lg:h-[300px]">
                    <img
                        src={course.courseId?.cover_photo || "/fallback.jpg"}
                        alt={course.courseId?.course_title || "Course Image"}
                        className="w-full object-cover md:h-[240px] lg:h-[300px]"
                    />
                </div>
            </div>

            <div className="sm:space-y-0 lg:space-y-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{course.courseId?.course_title}</h1>
                <div className="flex gap-3 pt-1 text-sm font-medium text-gray-800 dark:text-gray-200">
                    <p>{course.courseId?.prefix}</p>
                    <p>{course.courseId?.course_type}</p>
                </div>
                <div className="flex gap-5 pt-1">
                    {[course.courseId?.course_type, course.courseId?.duration, `৳${course.courseId?.offerPrice}`].map((tag, index) => (
                        <span
                            key={index}
                            className="rounded-full py-1 text-sm font-medium text-gray-800 dark:text-gray-200"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <div
                    className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200"
                    dangerouslySetInnerHTML={{ __html: course.courseId?.description || "" }}
                />
                <div className="flex flex-wrap gap-3 pt-4">
                    <button
                        onClick={handleOpenModal}
                        className="inline-flex h-10 items-center justify-center rounded-md bg-[rgb(95_113_250)] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-600"
                    >
                        Update Course Details
                    </button>
                    {course.courseId?.routine && (
                        <a
                            href={course.courseId.routine}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <button className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-green-700">
                                Download Routine
                            </button>
                        </a>
                    )}
                </div>
            </div>

            {course.isCourseExist?.length > 0 && (
                <div className="col-span-1 space-y-3 rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 md:col-span-2">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Course Features</p>
                    <ul className="flex list-disc gap-10 pl-5 text-gray-700 dark:text-gray-300">
                        {course.isCourseExist.map((feature, i) => (
                            <li key={i}>{feature}</li>
                        ))}
                    </ul>
                </div>
            )}

            {course.faq?.length > 0 && (
                <div className="col-span-1 space-y-3 rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 md:col-span-2">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">FAQ</p>
                    <div className="space-y-4">
                        {course.faq.map((item, i) => (
                            <div
                                key={i}
                                className="rounded-md border p-4 dark:border-gray-600"
                            >
                                <p className="font-semibold text-gray-900 dark:text-gray-100">Q: {item.question}</p>
                                <p className="text-gray-700 dark:text-gray-300">A: {item.answer?.join(", ") || "-"}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="col-span-1 space-y-5 rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 md:col-span-2">
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Teachers</p>

                {(course.instructors || []).length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400">No Teachers Assigned</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {(course.instructors || []).map((teacher) => {
                            const fullTeacher = teachers.find((t) => t._id === teacher._id) || {};
                            return (
                                <div
                                    key={teacher._id}
                                    className="rounded-lg border p-5 shadow-sm dark:border-blue-400 dark:bg-blue-900/30"
                                >
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{teacher.name || fullTeacher.name || "Teacher"}</p>
                                    <p className="text-gray-600 dark:text-gray-300">{teacher.phone || fullTeacher.phone || "-"}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <UpdateCourseDetailsModal
                        course={course}
                        teachers={teachers}
                        onCourseUpdate={handleUpdateFromModal}
                        onClose={handleCloseModal}
                    />
                </div>
            )}

            <ToastContainer
                position="top-right"
                autoClose={2000}
            />
        </div>
    );
};

export default CourseCard;
