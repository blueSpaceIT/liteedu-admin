import { useParams } from "react-router-dom";
import MCQList from "./examMcqList";


const ExamMcq = () => {
    const params = useParams();
    return (
        <div>
           <MCQList examId={params?.id} />
        </div>
    );
};

export default ExamMcq;