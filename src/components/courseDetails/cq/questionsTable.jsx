/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import { useGetCqsQuery } from "../../../redux/features/api/cq/cq";
import { QuestionRow } from "./questionRow";

export const QuestionsTable = ({ examId, moduleId, onDelete }) => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: cqData, isLoading: cqLoading, isFetching } = useGetCqsQuery({ page, limit });
  const cqQuestions = useMemo(() => (cqData?.data ? cqData.data : []), [cqData]);
  const allCqQuestion = cqQuestions?.filter((note) => note?.moduleId?._id === moduleId?._id);

  const totalItems = allCqQuestion?.length || 0;
  const totalPages = Math.ceil(totalItems / limit);


  if (cqLoading) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        Loading questions...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b">
              <th className="h-12 px-4 text-left font-medium text-gray-500 dark:text-gray-400">
                Question
              </th>
              <th className="h-12 px-4 text-left font-medium text-gray-500 dark:text-gray-400">
                Marks
              </th>
              <th className="h-12 px-4 text-right font-medium text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {allCqQuestion?.length > 0 ? (
              allCqQuestion.map((q) => (
                <QuestionRow
                  key={q._id}
                  question={q}
                  editLink={`/admin/course/edit-cq?_id=${q._id}&examId=${examId}`}
                  onDelete={() => onDelete(q._id)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-6 text-center text-gray-500 dark:text-gray-400">
                  No questions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between p-4">
        <button
          disabled={page === 1 || isFetching}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 text-sm font-medium bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm text-gray-600 dark:text-gray-400">
          Page {page} of {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages || isFetching}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 text-sm font-medium bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
