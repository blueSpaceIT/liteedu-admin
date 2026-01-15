/* eslint-disable react/prop-types */
import { PencilLine, Trash } from "lucide-react";

const McqRow = ({ mcq, categories, onEdit, onDelete }) => {
    const categoryTitle = categories?.find((cat) => cat._id === mcq.category)?.title || "—";
    
    return (
        <tr className="border-b border-gray-300 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
            <td className="border-r border-gray-300 px-4 py-3 text-center text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
                {mcq.number}
            </td>

            <td className="break-words border-r border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100">
                {mcq.question}
            </td>

            <td className="border-r border-gray-300 px-4 py-3 text-sm text-gray-800 dark:border-gray-700 dark:text-gray-200">{categoryTitle}</td>

            <td className="flex flex-wrap gap-2 border-r border-gray-300 px-4 py-3 text-sm dark:border-gray-700">
                {mcq.options.map((opt, idx) => (
                    <span
                        key={idx}
                        className={`truncate rounded-full px-3 py-1 text-xs font-medium ${
                            opt === mcq.correctAnswer
                                ? "bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-200"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200"
                        }`}
                    >
                        {opt}
                    </span>
                ))}
            </td>

            <td className="border-r border-gray-300 px-4 py-3 text-center text-sm font-semibold text-blue-700 dark:border-gray-700 dark:text-blue-300">
                {mcq.correctAnswer}
            </td>

            <td className="flex justify-center gap-2 px-4 py-3 text-center">
                <button
                    onClick={() => onEdit(mcq)}
                    className="rounded-lg border border-blue-300 bg-blue-200 p-2 text-blue-800 transition-all hover:bg-blue-300 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                >
                    <PencilLine size={16} />
                </button>
                <button
                    onClick={() => onDelete(mcq._id)}
                    className="rounded-lg border border-red-300 bg-red-200 p-2 text-red-800 transition-all hover:bg-red-300 dark:border-red-700 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                >
                    <Trash size={16} />
                </button>
            </td>
        </tr>
    );
};

export default McqRow;
