/* eslint-disable react/prop-types */
import { Header } from "./cqHeader";
import { QuestionsTable } from "./questionsTable";

export default function CreativeQuestions({ title,questions, examId, moduleId, courseId, onDelete }) {
  return (
    <div className="main-content px-4 xl:px-0">
      <Header title={title} moduleId={moduleId} courseId={courseId} examId={examId} />
      <div className="card p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center">
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
              className="lucide lucide-clipboard-list h-5 w-5 mr-2 text-indigo-500"
            >
              <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <path d="M12 11h4"></path>
              <path d="M12 16h4"></path>
              <path d="M8 11h.01"></path>
              <path d="M8 16h.01"></path>
            </svg>
            Creative Questions
          </h2>
          <a
            href={`/admin/course/create-cq?examId=${examId}`}
          >
            <button className="flex items-center justify-center text-sm font-medium px-3 h-9 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
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
                className="lucide lucide-plus h-4 w-4 mr-1"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              Add CQ
            </button>
          </a>
        </div>
        <QuestionsTable
          questions={questions}
          examId={examId}
          moduleId={moduleId}
          courseId={courseId}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
