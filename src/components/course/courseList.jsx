/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useMemo, useState } from "react";
import useFormSubmit from "../../hooks/useFormSubmit";
import Pagination from "../pagination";
import CourseRow from "./courseRow";
import CourseEditModal from "./courseUpdateModal";
import { useDeleteCourseMutation } from "../../redux/features/api/course/courseApi";

const CourseList = ({ courses: allCourses }) => {
    const { handleSubmitForm } = useFormSubmit();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const limit = 10;

    const [deleteCourse, { isLoading: deleteLoading }] = useDeleteCourseMutation();

    const courses = useMemo(() => allCourses || [], [allCourses]);

    const paginatedCourses = useMemo(() => {
        const start = (currentPage - 1) * limit;
        return courses.slice(start, start + limit);
    }, [courses, currentPage, limit]);

    const totalPages = Math.max(Math.ceil(courses.length / limit), 1);

    const handleDelete = (slug) => {
        handleSubmitForm({
            apiCall: deleteCourse,
            params: { slug },
        });
    };

    const handleEdit = (course) => {
        setSelectedCourse(course);
    };

    const handleModalClose = () => setSelectedCourse(null);
    const handleUpdate = async (data) => {
        handleModalClose();
    };

    if (!courses.length) {
        return <div className="py-[20%] text-center text-xl text-gray-500 dark:text-gray-400">No courses found 😔</div>;
    }

    return (
        <div>
            <div className="relative w-full max-w-full overflow-x-auto overflow-y-auto rounded-lg border shadow-md [scrollbar-width:_thin] dark:border-gray-700">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-200 text-left dark:bg-gray-700">
                        <tr className="border-b border-gray-300 dark:border-gray-600">
                            <th className="py-3 pl-5 text-gray-700 dark:text-gray-300">#</th>
                            <th className="px-2 py-3 text-gray-700 dark:text-gray-300">Course Info</th>
                            <th className="px-2 py-3 text-gray-700 dark:text-gray-300">Category</th>
                            <th className="px-2 py-3 text-gray-700 dark:text-gray-300">Price</th>
                            <th className="px-2 py-3 text-gray-700 dark:text-gray-300">Status</th>
                            <th className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {paginatedCourses.map((course, index) => (
                            <CourseRow
                                key={course._id}
                                course={{ ...course, number: (currentPage - 1) * limit + index + 1 }}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                deleteLoading={deleteLoading}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {courses.length > 0 && (
                <div className="mt-4 flex flex-col justify-end gap-1">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Page {currentPage} of {totalPages}
                    </p>
                </div>
            )}

            {selectedCourse && (
                <CourseEditModal
                    courseData={selectedCourse}
                    onSubmit={handleUpdate}
                    onClose={handleModalClose}
                    categories={[]}
                />
            )}
        </div>
    );
};

export default CourseList;
