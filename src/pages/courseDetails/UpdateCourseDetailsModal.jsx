/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useUpdateCourseDetailsMutation, useGetAllCourseDetailsQuery } from "../../redux/features/api/courseDetails/courseDetails";
import { useUsergetAllQuery } from "../../redux/features/api/user/userApi";

const UpdateCourseDetailsModal = ({ courseDetails, onClose }) => {
    const [features, setFeatures] = useState(courseDetails?.isCourseExist ?? [""]);
    const [faqs, setFaqs] = useState(courseDetails?.faq ?? [{ question: "", answer: [""] }]);
    const [selectedTeachers, setSelectedTeachers] = useState([]);

    const { data: usersData } = useUsergetAllQuery({ page: 1, limit: 100 });
    const [teachers, setTeachers] = useState([]);
    const { data: allCourseDetailsData } = useGetAllCourseDetailsQuery();

    useEffect(() => {
        if (usersData?.data) {
            const teacherUsers = usersData.data.filter((u) => u.role === "teacher");
            setTeachers(teacherUsers);
        }
        if (allCourseDetailsData?.data && courseDetails?.courseId?.slug) {
            const matchedCourse = allCourseDetailsData.data.find((c) => c.courseId.slug === courseDetails.courseId.slug);
            if (matchedCourse?.instructors) {
                setSelectedTeachers(matchedCourse.instructors.map((t) => t._id));
            }
        }
    }, [usersData, allCourseDetailsData, courseDetails]);

    const [updateCourseDetails, { isLoading }] = useUpdateCourseDetailsMutation();

    const toggleTeacher = (tId) => {
        setSelectedTeachers((prev) => (prev.includes(tId) ? prev.filter((id) => id !== tId) : [...prev, tId]));
    };

    const handleSubmit = async () => {
        if (!courseDetails?._id) {
            toast.error("Course ID is missing!");
            return;
        }

        // FAQ validation
        for (let i = 0; i < faqs.length; i++) {
            const faq = faqs[i];
            if (!faq.question?.trim()) {
                toast.error(`FAQ #${i + 1}: Question is required`);
                return;
            }
            for (let j = 0; j < faq.answer.length; j++) {
                if (!faq.answer[j]?.trim()) {
                    toast.error(`FAQ #${i + 1}, Answer #${j + 1}: Answer must not be empty`);
                    return;
                }
            }
        }

        try {
            await updateCourseDetails({
                data: {
                    isCourseExist: features,
                    faq: faqs,
                    instructors: selectedTeachers,
                },
                params: { _id: courseDetails._id },
            }).unwrap();

            toast.success("Course details updated successfully!");
            onClose();
        } catch (err) {
            console.error(err);
            toast.error(err?.data?.message || "Failed to update course details!");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="max-h-[90vh] w-full max-w-7xl overflow-y-auto rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
                {/* Header */}
                <div className="mb-1 flex justify-center">
                    <h2 className="mb-1 text-2xl font-bold text-blue-400 sm:text-3xl">Update Course Details</h2>
                </div>
                <p className="text-center text-gray-600 dark:text-gray-300 sm:text-base">Update course details</p>

                <div className="space-y-6 pt-2">
                    {/* Features */}
                    <div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Course Features</h3>
                            <button
                                className="rounded bg-blue-600 px-5 py-1 font-semibold text-white hover:bg-blue-700"
                                onClick={() => setFeatures([...features, ""])}
                            >
                                Add
                            </button>
                        </div>
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="mt-3 flex gap-2"
                            >
                                <input
                                    value={f}
                                    onChange={(e) => setFeatures(features.map((v, idx) => (idx === i ? e.target.value : v)))}
                                    className="flex-1 rounded-lg border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                />
                                <button
                                    className="font-medium text-red-500 hover:text-red-700"
                                    onClick={() => setFeatures(features.filter((_, idx) => idx !== i))}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* FAQ */}
                    <div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">FAQ</h3>
                            <button
                                className="rounded bg-green-600 px-2 py-1 text-white hover:bg-green-700"
                                onClick={() => setFaqs([...faqs, { question: "", answer: [""] }])}
                            >
                                Add FAQ
                            </button>
                        </div>

                        {faqs.map((f, i) => (
                            <div
                                key={i}
                                className="mt-3 space-y-2 rounded-lg border p-3 shadow-sm dark:border-gray-600 dark:bg-gray-700"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <input
                                        value={f.question}
                                        onChange={(e) => setFaqs(faqs.map((v, idx) => (idx === i ? { ...v, question: e.target.value } : v)))}
                                        placeholder="Question"
                                        className="flex-1 rounded-lg border p-2 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFaqs(faqs.filter((_, idx) => idx !== i))}
                                        className="font-bold text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>

                                {f.answer.map((ans, aIdx) => (
                                    <div
                                        key={aIdx}
                                        className="flex items-start gap-2"
                                    >
                                        <textarea
                                            value={ans}
                                            onChange={(e) =>
                                                setFaqs(
                                                    faqs.map((v, idx) =>
                                                        idx === i
                                                            ? {
                                                                  ...v,
                                                                  answer: v.answer.map((a, j) => (j === aIdx ? e.target.value : a)),
                                                              }
                                                            : v,
                                                    ),
                                                )
                                            }
                                            placeholder="Answer"
                                            className="w-full rounded-lg border p-2 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFaqs(
                                                    faqs.map((v, idx) => (idx === i ? { ...v, answer: v.answer.filter((_, j) => j !== aIdx) } : v)),
                                                )
                                            }
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => setFaqs(faqs.map((v, idx) => (idx === i ? { ...v, answer: [...v.answer, ""] } : v)))}
                                    className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
                                >
                                    Add Answer
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Teachers */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Teachers</h3>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {teachers.map((t) => {
                                const selected = selectedTeachers.includes(t._id);
                                return (
                                    <div
                                        key={t._id}
                                        className={`flex cursor-pointer items-center justify-between rounded-md border-2 p-4 ${
                                            selected ? "border-blue-500 bg-blue-50 dark:bg-blue-900" : "border-gray-300 dark:border-gray-600"
                                        }`}
                                        onClick={() => toggleTeacher(t._id)}
                                    >
                                        <div>
                                            <p className="pb-2 font-semibold text-gray-900 dark:text-gray-100">{t.name}</p>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">{t.phone}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {selectedTeachers.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-md mb-2 font-medium text-gray-900 dark:text-gray-100">Selected Teachers:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedTeachers.map((tId) => {
                                        const teacher = teachers.find((t) => t._id === tId);
                                        if (!teacher) return null;
                                        return (
                                            <div
                                                key={tId}
                                                className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
                                            >
                                                <span>{teacher.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedTeachers(selectedTeachers.filter((id) => id !== tId))}
                                                    className="font-bold text-red-500"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Save & Cancel Buttons */}
                <div className="mt-4 flex justify-end gap-3 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-lg border border-gray-400 px-4 py-2 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50 dark:from-blue-500 dark:to-cyan-400 dark:hover:from-blue-600 dark:hover:to-cyan-500"
                    >
                        {isLoading ? "Updating..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateCourseDetailsModal;
