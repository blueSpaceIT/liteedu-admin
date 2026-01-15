import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useUsergetAllQuery } from "../../redux/features/api/user/userApi";
import { useCreateCourseDetailsMutation, useGetAllCourseDetailsQuery } from "../../redux/features/api/courseDetails/courseDetails";
import { useGetAllCourseQuery } from "../../redux/features/api/course/courseApi";
import Button from "../../ui/button";

const CreateCourseDetailsPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    // Fetch all courses
    const { data: allCoursesData } = useGetAllCourseQuery();
    const [courseId, setCourseId] = useState(null);

    // Fetch all course details to check existence
    const { data: allCourseDetailsData } = useGetAllCourseDetailsQuery();

    // Teachers
    const { data: usersData } = useUsergetAllQuery({ page: 1, limit: 100 });
    const [teachers, setTeachers] = useState([]);
    const [selectedTeachers, setSelectedTeachers] = useState([]);

    // Course Details
    const [features, setFeatures] = useState([""]);
    const [faqs, setFaqs] = useState([{ question: "", answer: [""] }]);

    const [createCourseDetails] = useCreateCourseDetailsMutation();

    // Filter teacher users
    useEffect(() => {
        if (usersData?.data) {
            const teacherUsers = usersData.data.filter((u) => u.role === "teacher");
            setTeachers(teacherUsers);
        }
    }, [usersData]);

    // Set courseId from slug
    useEffect(() => {
        if (allCoursesData?.data) {
            const course = allCoursesData.data.find((c) => c.slug === slug);
            if (course) setCourseId(course._id);
        }
    }, [allCoursesData, slug]);

    // Check if course details already exist
    useEffect(() => {
        if (courseId && allCourseDetailsData?.data) {
            const exist = allCourseDetailsData.data.find((cd) => cd.courseId === courseId);
            if (exist) {
                toast.info("Course details already exist. Redirecting to update page...");
                navigate(`/admin/course/course-details/update/${slug}`);
            }
        }
    }, [courseId, allCourseDetailsData, navigate, slug]);

    const toggleTeacher = (tId) => {
        setSelectedTeachers((prev) => (prev.includes(tId) ? prev.filter((id) => id !== tId) : [...prev, tId]));
    };

    const handleSubmit = async () => {
        if (!courseId) return toast.error("Course ID missing!");

        const payload = {
            courseId,
            isCourseExist: features,
            faq: faqs,
            instructors: selectedTeachers,
        };

        try {
            await createCourseDetails({ data: payload }).unwrap();
            toast.success("Course details created successfully!");
            navigate(-1); // Go back
        } catch (err) {
            toast.error(err?.data?.message || "Failed to create course details");
        }
    };

    return (
        <div className="mx-auto space-y-6 p-6">
            <h1 className="text-2xl font-bold">Create Course Details</h1>

            {/* Features */}
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Course Features</h2>
                    <button
                        type="button"
                        onClick={() => setFeatures([...features, ""])}
                        className="rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                    >
                        Add Feature
                    </button>
                </div>
                {features.map((f, i) => (
                    <div
                        key={i}
                        className="mt-2 flex items-center gap-2 rounded-md border p-3"
                    >
                        <input
                            value={f}
                            placeholder="Feature"
                            onChange={(e) => setFeatures(features.map((v, idx) => (idx === i ? e.target.value : v)))}
                            className="flex-1 rounded-md border p-2"
                        />
                        <button
                            type="button"
                            onClick={() => setFeatures(features.filter((_, idx) => idx !== i))}
                            className="text-red-500 hover:text-red-700"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            {/* FAQ */}
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">FAQ</h2>
                    <button
                        type="button"
                        onClick={() => setFaqs([...faqs, { question: "", answer: [""] }])}
                        className="rounded-md bg-green-600 px-3 py-1 text-white hover:bg-green-700"
                    >
                        Add FAQ
                    </button>
                </div>
                {faqs.map((f, i) => (
                    <div
                        key={i}
                        className="mt-2 space-y-2 rounded-md border p-3"
                    >
                        <input
                            value={f.question}
                            onChange={(e) => setFaqs(faqs.map((v, idx) => (idx === i ? { ...v, question: e.target.value } : v)))}
                            placeholder="Question"
                            className="w-full rounded-md border p-2"
                        />
                        {f.answer.map((ans, aIdx) => (
                            <div
                                key={aIdx}
                                className="mt-1 flex items-center gap-2"
                            >
                                <textarea
                                    value={ans}
                                    onChange={(e) =>
                                        setFaqs(
                                            faqs.map((v, idx) =>
                                                idx === i ? { ...v, answer: v.answer.map((a, j) => (j === aIdx ? e.target.value : a)) } : v,
                                            ),
                                        )
                                    }
                                    placeholder="Answer"
                                    className="flex-1 rounded-md border p-2"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFaqs(faqs.map((v, idx) => (idx === i ? { ...v, answer: v.answer.filter((_, j) => j !== aIdx) } : v)))
                                    }
                                    className="text-red-500 hover:text-red-700"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setFaqs(faqs.map((v, idx) => (idx === i ? { ...v, answer: [...v.answer, ""] } : v)))}
                            className="rounded-md bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
                        >
                            Add Answer
                        </button>
                    </div>
                ))}
            </div>

            {/* Teachers */}
            <div>
                <h2 className="mb-2 text-xl font-semibold">Teachers</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {teachers.map((t) => {
                        const selected = selectedTeachers.includes(t._id);
                        return (
                            <div
                                key={t._id}
                                className={`flex cursor-pointer items-center justify-between rounded-md border-2 border-blue-500 p-5 ${selected ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
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
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-5">
                <Button onClick={handleSubmit}>Create Course Details</Button>
            </div>
        </div>
    );
};

export default CreateCourseDetailsPage;
