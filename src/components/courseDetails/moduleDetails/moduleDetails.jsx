import { useParams } from "react-router-dom";
import { useGetAllModuleQuery } from "../../../redux/features/api/module/module";
import Lecture from "../lecture/lecture";
import Exam from "../exam/exam";
import Note from "../note/note";


const ModuleDetails = () => {
    const { slug } = useParams();
    const {data:ModuleData} = useGetAllModuleQuery();
    const module = ModuleData?.data?.find(m => m?.slug === slug);
    console.log(module?.courseId?._id)

    return (
        <div>
        <div className="card overflow-hidden">
            <div className="bg-gradient-to-r from-primary/90 to-primary p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white">{module?.moduleTitle}</h1>
            </div>
            </div>

            <Lecture courseId={module?.courseId?._id} moduleId={module?._id}/>
            <Exam moduleId={module}/>
            <Note moduleId={module}/>
        </div>
    );
};

export default ModuleDetails;