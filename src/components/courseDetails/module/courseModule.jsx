/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import { Plus, List, SquarePen, Trash2, Inbox } from "lucide-react";
import { useDeleteModuleMutation, useGetAllModuleQuery } from "../../../redux/features/api/module/module";
import useFormSubmit from "../../../hooks/useFormSubmit";

export default function CourseModules({ onDelete, course }) {
  const { data: moduleData, isLoading } = useGetAllModuleQuery({ courseId: course });
  const modules = useMemo(() => (moduleData?.data ? moduleData?.data : []), [moduleData]);
  const [deleteModule, { isLoading: deleteLoading }] = useDeleteModuleMutation();
  const { handleSubmitForm } = useFormSubmit();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  const handleDeleteClick = (module) => {
    setSelectedModule(module);
    setShowConfirm(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (onDelete && selectedModule) {
      onDelete(selectedModule.slug);
    } else if (selectedModule) {
      await handleSubmitForm({
        apiCall: deleteModule,
        params: { slug: selectedModule?.slug },
      });
    }
    setShowConfirm(false);
    setSelectedModule(null);
  };

  // Cancel delete
  const handleCancelDelete = () => {
    if (!deleteLoading) {
      setShowConfirm(false);
      setSelectedModule(null);
    }
  };

  return (
    <div className="card mt-6 p-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <List className="h-5 w-5 mr-2 text-primary" />
          Course Modules
        </h2>
        <a href={`/admin/course/create-module?courseId=${course}`}>
          <button className="justify-center whitespace-nowrap text-sm font-medium bg-[rgb(95_113_250)] text-white hover:bg-[rgb(95_113_250)]/90 h-9 rounded-md px-3 flex items-center">
            <Plus className="h-4 w-4 mr-1" />
            Add Module
          </button>
        </a>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center p-6 text-muted-foreground">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent mr-2"></div>
          Loading modules...
        </div>
      ) : modules.length === 0 ? (
        // Empty state
        <div className="flex flex-col justify-center items-center p-10 text-muted-foreground">
          <Inbox className="h-10 w-10 mb-2 text-gray-400" />
          <p>No modules found for this course.</p>
        </div>
      ) : (
        // Table
        <div className="overflow-x-auto">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                    Module Title
                  </th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                    Created At
                  </th>
                  <th className="h-12 px-4 font-medium text-muted-foreground text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {modules.map((m) => (
                  <tr key={m._id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 font-medium">
                      <a href={`/admin/course/module/${m.slug}`}>{m.moduleTitle}</a>
                    </td>
                    <td className="p-4">{new Date(m.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <a href={`/admin/course/edit-module/${m.slug}`}>
                          <button className="inline-flex items-center justify-center border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md h-8 w-8 p-0">
                            <SquarePen className="h-4 w-4" />
                          </button>
                        </a>
                        <button
                          onClick={() => handleDeleteClick(m)}
                          className="inline-flex items-center justify-center border border-input bg-background rounded-md h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete <strong>{selectedModule?.moduleTitle}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-background dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 flex items-center justify-center"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
