/* eslint-disable react/prop-types */
import { useState } from "react";
import { ClipboardList, Plus, SquarePen, Trash2 } from "lucide-react";
import { useDeleteExamMutation } from "../../../redux/features/api/exam/exam";
import useFormSubmit from "../../../hooks/useFormSubmit";

export default function ExamsCard({ moduleId, courseId, exams }) {
  const [deleteExam] = useDeleteExamMutation();
  const [selectedExam, setSelectedExam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleSubmitForm } = useFormSubmit();

  const openDeleteModal = (exam) => {
    setSelectedExam(exam);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedExam) return;
    handleSubmitForm({
      apiCall: deleteExam,
      params: { slug: selectedExam?.slug },
      onSuccess: () => setIsModalOpen(false)
    });
    setSelectedExam(null);
  };

  return (
    <div className="card mt-6 p-6 rounded-lg border bg-white text-slate-900 shadow-sm border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <ClipboardList className="h-5 w-5 mr-2 text-indigo-500" />
          Exams
        </h2>
        <a href={`/admin/course/create-exam?moduleId=${moduleId}&courseId=${courseId}`}>
          <button className="justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[rgb(95_113_250)] text-white hover:bg-[rgb(95_113_250)]/90 h-9 rounded-md px-3 flex items-center ring-offset-background">
            <Plus className="h-4 w-4 mr-1" /> Add Exam
          </button>
        </a>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b">
                <Th>Title</Th>
                <Th>Type</Th>
                <Th>Questions</Th>
                <Th>Status</Th>
                <Th>Created At</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>

            <tbody className="[&_tr:last-child]:border-0">
              {exams?.map((exam) => (
                <tr key={exam._id || exam.slug} className="border-b transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-4 align-middle font-medium">
                    <a
                      href={
                        exam?.examType === "MCQ"
                          ? `/admin/course/exam-mcq/${exam._id}`
                          : `/admin/course/exam-cq/${exam._id}`
                      }
                      className="hover:underline"
                    >
                      {exam?.examTitle}
                    </a>
                  </td>
                  <td className="p-4 align-middle">{exam?.examType}</td>
                  <td className="p-4 align-middle">{exam?.totalQuestion}</td>
                  <td className="p-4 align-middle">
                    <span
                      className={[
                        "px-2 py-1 rounded-full text-xs font-medium",
                        exam?.status?.toLowerCase() === "published"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
                      ].join(" ")}
                    >
                      {exam?.status}
                    </span>
                  </td>
                  <td className="p-4 align-middle">{exam?.createdAt}</td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex justify-end gap-2">
                      <a href={`/admin/course/edit-exam?slug=${exam.slug}&moduleId=${moduleId}&courseId=${courseId}`}>
                        <button className="inline-flex items-center justify-center rounded-md h-8 w-8 p-0 border bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700">
                          <SquarePen className="h-4 w-4" />
                        </button>
                      </a>
                      <button
                        type="button"
                        onClick={() => openDeleteModal(exam)}
                        className="inline-flex items-center justify-center rounded-md h-8 w-8 p-0 border bg-white hover:bg-red-50 text-red-500 hover:text-red-700 dark:bg-slate-900 dark:hover:bg-red-900/30 border-slate-200 dark:border-slate-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Fallback */}
              {exams.length === 0 && (
                <tr>
                  <td className="p-6 text-center text-sm text-slate-500 dark:text-slate-400" colSpan={6}>
                    No exams found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg w-96 p-6">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
              Confirm Delete
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              Are you sure you want to delete `{selectedExam?.examTitle}`? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Helpers */
function Th({ children, className = "" }) {
  return (
    <th
      className={`h-12 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400 ${className}`}
    >
      {children}
    </th>
  );
}
