import { useParams } from "react-router-dom";
// import { useGetAllCourseDetailsQuery } from "../../redux/features/api/courseDetails/courseDetails";
import CourseDetailsCard from "./courseDetailsCard";
import { useGetAllCourseQuery } from "../../redux/features/api/course/courseApi";
import { useMemo } from "react";

const CourseDetails = () => {
    const { slug } = useParams();
    const { data: courseData, isLoading } = useGetAllCourseQuery({ slug: slug });
    const course = useMemo(() => (courseData?.data ? courseData?.data : []), [courseData]);

    if (isLoading)
        return (
            <div className="flex items-center justify-center py-10">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
            </div>
        );

    return <CourseDetailsCard courseData={course} />;
};

export default CourseDetails;
