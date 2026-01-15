/* eslint-disable react/prop-types */
import { Plus } from "lucide-react";

const AddLectureButton = ({ href }) => (
  <a href={href}>
    <button className="flex items-center justify-center h-9 px-3 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      <Plus className="w-4 h-4 mr-1" />
      Add Lecture
    </button>
  </a>
);

export default AddLectureButton;
