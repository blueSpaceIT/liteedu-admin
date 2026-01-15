/* eslint-disable react/prop-types */
import { Edit, Trash2 } from "lucide-react";

const TeacherRow = ({ teacher, index, onEdit, onDelete }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Block":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-white">
      <td className="px-2 py-3 text-center">{index + 1}</td>
      <td className="px-2 py-3">
        <div className="flex justify-start items-center gap-2">
          {
            teacher?.profile_picture &&  <img src={teacher?.profile_picture}  
            
            className="size-10  rounded-full object-cover border border-gray-300 dark:border-gray-700"/>
          }
         
            <p>{teacher.name}</p>
        </div>
      </td>
      <td className="px-2 py-3">{teacher.phone}</td>
      <td className="px-2 py-3">{teacher.email || "-"}</td>
      <td className="px-2 py-3">{teacher.gender || "-"}</td>
      <td className="px-2 py-3">{teacher.education?.hscName || "-"}</td>
      <td className="px-2 py-3">{teacher.education?.mbbsName || "-"}</td>
      <td className="px-2 py-3">{teacher.education?.session || "-"}</td>
      <td className="px-2 py-3 text-center">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(
            teacher.status
          )}`}
        >
          {teacher.status}
        </span>
      </td>
      <td className="px-2 py-3 text-center flex justify-center gap-2">
        <button
          onClick={() => onEdit(teacher)}
          className="text-blue-600 hover:text-blue-800"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={() => onDelete(teacher._id)}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
};

export default TeacherRow;
