/* eslint-disable react/prop-types */

import { BookOpen } from "lucide-react";
import LectureRow from "./lectureRow";
import AddLectureButton from "./lectureAddButton";

const LecturesTable = ({ lectures, moduleId, courseId}) => {
  return (
    <div className="card mt-6 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center text-gray-900 dark:text-gray-100">
          <BookOpen className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          Lectures
        </h2>
        <AddLectureButton href={`/admin/course/create-lecture?moduleId=${moduleId}&courseId=${courseId}`} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm caption-bottom">
          <thead className="border-b dark:border-gray-700">
            <tr>
              <th className="p-4 text-left font-medium text-gray-500 dark:text-gray-400">Title</th>
              <th className="p-4 text-left font-medium text-gray-500 dark:text-gray-400">Duration</th>
              <th className="p-4 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
              <th className="p-4 text-left font-medium text-gray-500 dark:text-gray-400">Server</th>
              <th className="p-4 text-left font-medium text-gray-500 dark:text-gray-400">Video Id</th>
              <th className="p-4 text-right font-medium text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lectures.map((lecture) => (
              <LectureRow key={lecture._id} lecture={lecture} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LecturesTable;
