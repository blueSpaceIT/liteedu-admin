import { useMemo, useState, useEffect } from "react";
import { useGetAllEnrollmentQuery, useDeleteEnrollmentMutation } from "../../redux/features/api/newEnrollment/newEnrollment";
import { useGetAllCourseQuery } from "../../redux/features/api/course/courseApi";
import Pagination from "../pagination";
import EnrollmentForm from "./enrollmentForm";
import { toast } from "react-toastify";
import EnrollmentRow from "./enrollmentRow";

const EnrollmentList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [localEnrollments, setLocalEnrollments] = useState([]);
    const [editingEnrollment, setEditingEnrollment] = useState(null);
    const limit = 10;

    const { data: courseData, isLoading: courseLoading, isFetching: courseFetching } = useGetAllCourseQuery();
    const {
        data: enrollmentData,
        isLoading: enrollmentLoading,
        isFetching: enrollmentFetching,
    } = useGetAllEnrollmentQuery({ page: 1, limit: 10000 });
    const [deleteEnrollment, { isLoading: deleteLoading }] = useDeleteEnrollmentMutation();

    // Sync local state with server data
    useEffect(() => {
        if (enrollmentData?.data) {
            setLocalEnrollments(enrollmentData.data);
        }
    }, [enrollmentData]);

    // Delete handler
    const handleDelete = async (id) => {
        try {
            await deleteEnrollment(id).unwrap();
            setLocalEnrollments((prev) => prev.filter((e) => e._id !== id));
            toast.success("Enrollment deleted successfully");

            // Adjust page if last item of the current page was deleted
            const start = (currentPage - 1) * limit;
            if (localEnrollments.length - 1 <= start && currentPage > 1) {
                setCurrentPage((prev) => prev - 1);
            }
        } catch (err) {
            console.error("Delete failed:", err);
            toast.error("Failed to delete enrollment");
        }
    };

    // Paginate enrollments
    const paginatedEnrollments = useMemo(() => {
        const start = (currentPage - 1) * limit;
        return localEnrollments.slice(start, start + limit);
    }, [localEnrollments, currentPage, limit]);

    const totalPages = Math.max(Math.ceil(localEnrollments.length / limit), 1);

    if (courseLoading || courseFetching || enrollmentLoading || enrollmentFetching) {
        return (
            <div className="flex items-center justify-center py-10">
                <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!localEnrollments.length) {
        return <div className="py-[20%] text-center text-xl text-gray-500 dark:text-gray-400">No enrollments found.</div>;
    }

    return (
        <div>
            {/* Enrollment Form Modal */}
            {editingEnrollment && (
                <EnrollmentForm
                    initialData={editingEnrollment}
                    onClose={() => setEditingEnrollment(null)}
                />
            )}

            {/* Table */}
            <div className="relative w-full max-w-full overflow-x-auto overflow-y-auto rounded-lg shadow-md [scrollbar-width:_thin] dark:border-gray-700">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-200 text-left dark:bg-gray-700">
                        <tr className="border-b border-gray-300 dark:border-gray-600">
                            <th className="px-4 py-3">#</th>
                            <th className="px-5 py-3">Student</th>
                            <th className="px-2 py-3">Student Role</th>
                            <th className="px-2 py-3">Course</th>
                            <th className="px-2 py-3">Payment</th>
                            <th className="px-2 py-3">Status</th>
                            <th className="px-2 py-3">Enrolled At</th>
                            <th className="px-2 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {paginatedEnrollments.map((enrollment, index) => (
                            <EnrollmentRow
                                key={enrollment._id}
                                enrollment={{ ...enrollment, number: (currentPage - 1) * limit + index + 1 }}
                                onEdit={setEditingEnrollment}
                                onDelete={handleDelete}
                                deleteLoading={deleteLoading}
                                courses={courseData?.data || []}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {localEnrollments.length > 0 && (
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
        </div>
    );
};

export default EnrollmentList;
