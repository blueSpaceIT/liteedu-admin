/* eslint-disable react/prop-types */
import { useMemo } from "react";
import { useGetAllLectureQuery } from "../../../redux/features/api/lecture/lecture";
import LecturesTable from "./lectureTable";

const Lecture = ({ courseId, moduleId }) => {
    // eslint-disable-next-line no-unused-vars
    const { data: lectureData, isLoading } = useGetAllLectureQuery();

    const lectures = useMemo(() => (lectureData?.data ? lectureData?.data : []), [lectureData]);

    const allLectures = lectures?.filter((lect) => lect?.moduleId?._id === moduleId);

    return (
        <div>
            <LecturesTable
                lectures={allLectures}
                moduleId={moduleId}
                courseId={courseId}
            />
        </div>
    );
};

export default Lecture;
