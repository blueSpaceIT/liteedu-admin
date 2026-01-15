/* eslint-disable react/prop-types */
import { useState } from "react";
import { Trash2, SquarePen } from "lucide-react";
import useFormSubmit from "../../../hooks/useFormSubmit";
import { useDeleteLectureMutation } from "../../../redux/features/api/lecture/lecture";

const LectureRow = ({ lecture }) => {
  const { handleSubmitForm } = useFormSubmit();
  const [deleteLecture, { isLoading }] = useDeleteLectureMutation();
  const { title, duration, status, server, videoId, slug } = lecture;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    handleSubmitForm({
      apiCall: deleteLecture,
      params: { slug },
    });
    setIsModalOpen(false);
  };

  return (
    <>
      <tr className="border-b transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-700">
        <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{title}</td>
        <td className="p-4 text-gray-700 dark:text-gray-300">{duration} min.</td>
        <td className="p-4">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              status === "Published"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            {status}
          </span>
        </td>
        <td className="p-4 text-gray-700 dark:text-gray-300">{server}</td>
        <td className="p-4 text-gray-700 dark:text-gray-300">{videoId}</td>
        <td className="p-4 text-right">
          <div className="flex justify-end gap-2">
            <a href={`/admin/course/edit-lecture?slug=${slug}`}>
              <button className="h-8 w-8 p-0 rounded-md bg-background border border-input hover:bg-gray-200 dark:hover:bg-gray-700 dark:border-gray-600 flex items-center justify-center">
                <SquarePen className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </button>
            </a>
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isLoading}
              className="h-8 w-8 p-0 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-96 shadow-xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Confirm Delete
            </h2>
            <p className="text-sm mb-6 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete the lecture <strong>{title}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isLoading}
                className="px-4 py-2 rounded-md border bg-gray-100 text-gray-800 hover:bg-gray-200 
                dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LectureRow;
