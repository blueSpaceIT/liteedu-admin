import { useParams } from "react-router-dom";
import CreativeQuestions from "./creativeQuestions";




const CQ = () => {
    const params = useParams();
    return (
        <div>
         <CreativeQuestions examId={params?.id}/>
        </div>
    );
};

export default CQ;