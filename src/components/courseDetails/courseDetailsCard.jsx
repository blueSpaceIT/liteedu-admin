/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CourseModules from "./module/courseModule";
import CourseInfoCard from "./courseInfoCard";
import LiveClasses from "./liveClass/liveClass";
import Segment from "./segment/segment";
import Subscription from "./subscription/subscription";

const CourseDetailsCard = ({ courseData }) => {
    const navigate = useNavigate();
    if (!courseData) {
        return <p>Course Data is Emty</p>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 text-gray-900 dark:bg-gray-950 dark:text-gray-100 sm:p-10">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 rounded bg-gray-200 px-4 py-2 transition-colors hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
                <ArrowLeft size={18} /> Back
            </button>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-full lg:col-span-8">
                    {/* card overflow-hidden */}
                    <div className="card overflow-hidden">
                        <div className="relative h-64 w-full">
                            <img
                                src={courseData?.cover_photo}
                                alt={courseData?.course_title}
                                className="h-full w-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-6 text-white">
                                <h1 className="text-2xl font-bold md:text-3xl">{courseData?.course_title}</h1>
                                <div className="mt-2 flex items-center">
                                    <span className="bg-primary/80 rounded-full px-3 py-1 text-sm font-medium">{courseData?.course_type}</span>
                                    <span className="ml-2 rounded-full bg-white/20 px-3 py-1 text-sm">
                                        {courseData?.category?.title} {courseData?.category?.year}{" "}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* description */}
                    <div className="card mt-6 p-6">
                        <h2 className="flex items-center text-xl font-semibold">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-book-open text-primary mr-2 h-5 w-5"
                            >
                                <path d="M12 7v14"></path>
                                <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
                            </svg>
                            Course Description
                        </h2>
                        <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">{courseData?.description}</div>
                    </div>
                    {/* routine */}
                    <div className="card mt-6 p-6">
                        <h2 className="mb-4 flex items-center text-xl font-semibold">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-calendar-clock text-primary mr-2 h-5 w-5"
                            >
                                <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"></path>
                                <path d="M16 2v4"></path>
                                <path d="M8 2v4"></path>
                                <path d="M3 10h5"></path>
                                <path d="M17.5 17.5 16 16.3V14"></path>
                                <circle
                                    cx="16"
                                    cy="16"
                                    r="6"
                                ></circle>
                            </svg>
                            Course Schedule
                        </h2>

                        {/* Routine PDF Preview */}
                        <div className="h-[500px] w-full overflow-hidden rounded-lg border">
                            <iframe
                                src={courseData?.routine?.replace("view", "preview")}
                                className="h-full w-full"
                                frameBorder="0"
                                allow="autoplay"
                                title="Course Routine"
                            ></iframe>
                        </div>
                    </div>

                    {/* Course Tag */}
                    <div className="card mt-6 p-6">
                        <h2 className="mb-4 flex items-center text-xl font-semibold">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-tag text-primary mr-2 h-5 w-5"
                            >
                                <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"></path>
                                <circle
                                    cx="7.5"
                                    cy="7.5"
                                    r=".5"
                                    fill="currentColor"
                                ></circle>
                            </svg>
                            Course Tags
                        </h2>

                        <div className="flex flex-wrap gap-2">
                            {courseData?.course_tag?.length > 0 ? (
                                courseData.course_tag.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-primary-50 text-primary-700 rounded-md px-3 py-1.5 text-sm font-medium"
                                    >
                                        {tag}
                                    </span>
                                ))
                            ) : (
                                <span className="text-sm text-gray-500">No tags available</span>
                            )}
                        </div>
                    </div>

                    {/* Module */}
                    <CourseModules course={courseData?._id} />
                    {/* Live Class */}
                    <LiveClasses course={courseData?._id} />

                    {/* Segment */}
                    <Segment courseId={courseData?._id} />
                    <Subscription courseId={courseData?._id} />
                </div>
                <div className="col-span-full lg:col-span-4">
                    <CourseInfoCard course={courseData} />
                </div>
            </div>
        </div>
    );
};

export default CourseDetailsCard;
