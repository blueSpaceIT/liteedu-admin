/* eslint-disable react/prop-types */


// ===================== Header Component =====================
export const Header = ({ title, courseId, moduleId,  examId}) => (
  <div className="card overflow-hidden mb-6">
    <div className="bg-gradient-to-r from-primary/90 to-primary p-6 flex justify-between items-center">
      <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white">{title}</h1>
      <a href={`/admin/course/exam-students?examId=${examId}&moduleId=${moduleId}&courseId=${courseId}`}>
        <button className="flex items-center justify-center text-sm font-medium px-3 h-9 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
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
            className="lucide lucide-square-pen h-4 w-4 mr-1"
          >
            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
          </svg>
          Students
        </button>
      </a>
    </div>
  </div>
);

