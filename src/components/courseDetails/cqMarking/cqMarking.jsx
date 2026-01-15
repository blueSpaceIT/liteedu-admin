import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetCqAttempQueryQuery } from "../../../redux/features/api/cqAttemp/cqAttemp";
import { useMemo } from "react";

export default function ExamStudentsTable() {
  const [searchParams] = useSearchParams();
  const examId = searchParams.get("examId");
  const navigate = useNavigate();

  const {
    data: cqAttempData,
    isLoading,
    isError,
    error,
  } = useGetCqAttempQueryQuery({ page: 1, limit: 10 });

  const allCqAttemps = useMemo(
    () => (cqAttempData?.data ? cqAttempData.data : []),
    [cqAttempData]
  );
  const cqAttemps = useMemo(
    () => allCqAttemps.filter((item) => item?.examId?._id === examId),
    [allCqAttemps, examId]
  );

  

  return (
    <div className="main-content xl:ml-4 px-4 group-data-[theme-width=box]:xl:px-0 transition-all">
      <div className="card p-0 lg:min-h-[calc(100vh-5rem)] xl:min-h-[calc(100vh-6rem)]">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 py-5 sm:p-7 bg-gray-200/30 dark:bg-gray-800">
          <button
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-3 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <div>
            <h6 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Exam Students
            </h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All Students in this Exam
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="p-3 sm:p-4">
          <div className="overflow-x-auto scrollbar-thin">
            {isLoading ? (
              <div className="text-center py-10 text-gray-600 dark:text-gray-400">
                Loading students...
              </div>
            ) : isError ? (
              <div className="text-center py-10 text-red-500">
                Error: {error?.data?.message || "Failed to load students"}
              </div>
            ) : (
              <table className="table-auto w-full whitespace-nowrap text-left text-gray-700 dark:text-gray-300 leading-none">
                <thead className="border-b border-gray-200 dark:border-gray-700 font-semibold">
                  <tr>
                    <th className="px-4 py-4">Student</th>
                    <th className="px-4 py-4">Phone</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Joined At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {cqAttemps.length > 0 ? (
                    cqAttemps.map((attempt) => (
                      <tr
                        key={attempt._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                      >
                        {/* Student Name */}
                        <td
                          className="px-4 py-4 font-medium text-blue-600 dark:text-blue-400 cursor-pointer underline"
                        >
                       <a href={`/admin/course/exam/cq-marking?attemptId=${attempt._id}`} className="">
                           {attempt?.studentId?.name || "N/A"}
                       </a>
                        </td>

                        {/* Phone */}
                        <td className="px-4 py-4">
                          {attempt?.studentId?.phone || "N/A"}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          {attempt?.submitedPdf ? (
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              Submitted
                            </span>
                          ) : (
                            <span className="text-red-600 dark:text-red-400 font-medium">
                              Pending
                            </span>
                          )}
                        </td>

                        {/* Joined At */}
                        <td className="px-4 py-4">
                          {attempt?.submittedTime
                            ? new Date(attempt.submittedTime).toLocaleString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 py-8 text-center text-gray-600 dark:text-gray-400"
                      >
                        No students found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
