/* eslint-disable react/prop-types */
import { useMemo } from "react";
import { useGetAllExamQuery } from "../../../redux/features/api/exam/exam";
import ExamsCard from "./examCard";


const Exam = ({moduleId}) => {
    // eslint-disable-next-line no-unused-vars
    const {data:examData, isLoading} = useGetAllExamQuery();
    
 const exams = useMemo(
    () => (examData?.data ? examData?.data : []),
    [examData]
  );
  const allExam = exams?.filter(lect => lect?.moduleId?._id === moduleId?._id);
    return (
       <ExamsCard
  moduleId={moduleId?._id}
  courseId={moduleId?.courseId?._id}
  exams={allExam}
/>

    );
};

export default Exam;