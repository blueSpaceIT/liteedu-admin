/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import { Video, Plus, SquarePen, Trash2 } from "lucide-react";
import { useDeleteLiveClassMutation, useGetAllLiveClassQuery } from "../../../redux/features/api/liveClass/liveClass";
import useFormSubmit from "../../../hooks/useFormSubmit";

export default function LiveClasses({ course }) {
  const { data: liveClasses, isLoading } = useGetAllLiveClassQuery({ courseId: course });
  const [deleteLiveClass, { isLoading: deleteLoading }] = useDeleteLiveClassMutation();
  const liveClass = useMemo(() => (liveClasses?.data ? liveClasses?.data : []), [liveClasses]);
  const { handleSubmitForm } = useFormSubmit();

  const [openModal, setOpenModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const handleDeleteClick = (cls) => {
    setSelectedClass(cls);
    setOpenModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedClass) return;
    handleSubmitForm({
      apiCall: deleteLiveClass,
      params: { slug: selectedClass?.slug },
      onSuccess: () => setOpenModal(false),
    });
    setSelectedClass(null);
  };

  return (
    <div className="card mt-6 p-6 bg-white dark:bg-gray-900 shadow-md rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
          <Video className="h-5 w-5 mr-2 text-primary" />
          Live Classes
        </h2>
        <a href={`/admin/course/create-live-class?courseId=${course}`}>
          <button className="justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-[rgb(95_113_250)] text-white hover:bg-[rgb(95_113_250)]/90 h-9 rounded-md px-3 flex items-center">
            <Plus className="h-4 w-4 mr-1" />
            Add Live Class
          </button>
        </a>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="relative w-full overflow-auto">
          {isLoading ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              Loading live classes...
            </div>
          ) : (
            <table className="w-full caption-bottom text-sm">
              <thead className="border-b dark:border-gray-700">
                <tr className="border-b dark:border-gray-700 transition-colors hover:bg-muted/50">
                  <th className="h-12 px-4 text-left font-medium text-gray-600 dark:text-gray-300">Title</th>
                  <th className="h-12 px-4 text-left font-medium text-gray-600 dark:text-gray-300">Status</th>
                  <th className="h-12 px-4 text-left font-medium text-gray-600 dark:text-gray-300">Created At</th>
                  <th className="h-12 px-4 font-medium text-gray-600 dark:text-gray-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {liveClass.length > 0 ? (
                  liveClass.map((cls) => (
                    <tr key={cls._id} className="border-b dark:border-gray-700 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-4 font-medium text-gray-800 dark:text-gray-100">{cls.title}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            cls.status === "Published"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}
                        >
                          {cls.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-700 dark:text-gray-400">
                        {new Date(cls.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          {/* Edit */}
                          <a href={`/admin/course/edit-live-class?slug=${cls.slug}&courseId=${course}`}>
                            <button className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
                              <SquarePen className="h-4 w-4" />
                            </button>
                          </a>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteClick(cls)}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-800/30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No live classes found for this course
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete <strong>{selectedClass?.title}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center"
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
