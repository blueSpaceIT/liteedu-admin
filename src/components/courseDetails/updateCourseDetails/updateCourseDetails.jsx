import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import UpdateCourseDetailsModal from "../../../pages/courseDetails/UpdateCourseDetailsModal";
import { useGetAllCourseQuery } from "../../../redux/features/api/course/courseApi";
import { useGetAllCourseDetailsQuery } from "../../../redux/features/api/courseDetails/courseDetails";

const UpdateCourseDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const { data: allCoursesData, isLoading: coursesLoading } = useGetAllCourseQuery();
    const { data: allCourseDetailsData, isLoading: detailsLoading } = useGetAllCourseDetailsQuery();

    const [course, setCourse] = useState(null);
    const [courseDetails, setCourseDetails] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (allCoursesData?.data) {
            const foundCourse = allCoursesData.data.find((c) => c.slug === slug);
            setCourse(foundCourse);
        }
    }, [allCoursesData, slug]);

    useEffect(() => {
        if (course && allCourseDetailsData?.data) {
            const details = allCourseDetailsData.data.find((cd) => cd.courseId._id === course._id);
            setCourseDetails(details || null);
        }
    }, [allCourseDetailsData, course]);

    const handleNavigateToCreate = () => {
        navigate(`/admin/course/course-details/create-course-details/${slug}`);
    };

    if (coursesLoading || detailsLoading) {
        return (
            <div className="flex h-[70vh] w-full items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-blue-600 dark:border-blue-400"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="pt-24 text-center">
                <div className="mb-4 text-xl font-semibold text-gray-500 dark:text-gray-300">Course not found</div>
            </div>
        );
    }

    return (
        <div className="space-y-4 p-6">
            {/* Image + Info + Buttons */}
            <div className="flex flex-col gap-6 md:flex-row">
                {/* Image */}
                <div className="flex h-[300px] items-center justify-center md:w-1/2">
                    <img
                        src={course.cover_photo}
                        alt={course.course_title}
                        className="h-full w-full rounded-md border border-gray-200 object-cover dark:border-gray-700"
                    />
                </div>

                {/* Info + Buttons */}
                <div className="flex flex-col justify-between py-2 md:w-1/2">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">{course.course_title}</h2>
                        <div className="flex gap-4">
                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{course.prefix}</p>
                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{course.category?.title || "N/A"}</p>
                        </div>
                        <div className="flex gap-4 font-medium text-gray-600 dark:text-gray-400">
                            <p>{course.course_type}</p>
                            <p>{course.duration}</p>
                            <p>${course.price}</p>
                        </div>
                        <p className="mt-2 font-medium text-gray-700 dark:text-gray-300">{course.description}</p>
                    </div>

                    {/* Buttons */}
                    <div className="flex w-[450px] gap-5 mt-5">
                        <button
                            className="flex-1 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                            onClick={() => (courseDetails ? setIsModalOpen(true) : handleNavigateToCreate())}
                        >
                            {courseDetails ? "Update Course Details" : "Create Course Details"}
                        </button>
                        <a
                            href={course.routine}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 rounded-md bg-green-600 px-4 py-2 text-center font-semibold text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                        >
                            Download Routine
                        </a>
                    </div>
                </div>
            </div>

            {courseDetails ? (
                <div className="mx-auto space-y-6">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Course Details</h1>

                    {/* Features */}
                    <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="mb-5 text-xl font-semibold text-gray-900 dark:text-gray-100">Course Features</h2>
                        <div className="flex flex-wrap gap-2">
                            {courseDetails.isCourseExist?.length > 0 ? (
                                courseDetails.isCourseExist.map((f, i) => (
                                    <span
                                        key={i}
                                        className="rounded-full bg-blue-50 px-4 py-1 text-gray-700 dark:bg-blue-900 dark:text-gray-100"
                                    >
                                        {f}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">No features found</p>
                            )}
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="mb-5 text-xl font-semibold text-gray-900 dark:text-gray-100">FAQ</h2>
                        {courseDetails.faq?.length > 0 ? (
                            courseDetails.faq.map((f, i) => (
                                <div
                                    key={i}
                                    className="mt-3 space-y-2 rounded-md border p-3 dark:border-gray-600"
                                >
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{f.question}</p>
                                    {f.answer.map((ans, aIdx) => (
                                        <p
                                            key={aIdx}
                                            className="pl-1 text-gray-700 dark:text-gray-300"
                                        >
                                            - {ans}
                                        </p>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">No FAQs found</p>
                        )}
                    </div>

                    {/* Instructors */}
                    <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">Instructors</h2>
                        {courseDetails.instructors?.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {courseDetails.instructors.map((t) => (
                                    <div
                                        key={t._id}
                                        className="rounded-lg border bg-white p-5 dark:border-gray-600 dark:bg-gray-700"
                                    >
                                        <p className="pb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{t.name}</p>
                                        {t.email && <p className="text-sm text-gray-600 dark:text-gray-300">{t.email}</p>}
                                        {t.phone && <p className="pt-1 text-sm font-medium text-gray-700 dark:text-gray-300">{t.phone}</p>}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">No instructors assigned</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="pt-[10%] text-center text-xl font-semibold text-gray-500 dark:text-gray-400">Course details not yet created.</div>
            )}

            {isModalOpen && (
                <UpdateCourseDetailsModal
                    course={course}
                    courseDetails={courseDetails}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default UpdateCourseDetails;
