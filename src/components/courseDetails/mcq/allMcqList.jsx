import { useMemo, useState, useEffect } from "react";
import { useGetMcqsQuery } from "../../../redux/features/api/mcq/mcqApi";
import { useNavigate, useParams } from "react-router-dom";
import useFormSubmit from "../../../hooks/useFormSubmit";
import { useCreateMcqByIdMutation } from "../../../redux/features/api/examMcq/examMcq";
import { useGetAllMcqCategoryQuery } from "../../../redux/features/api/mcqCategory/mcqCategory";

export default function AllMcqList() {
  const [page, setPage] = useState(1);
  const params = useParams();
  const limit = 10;
  const [addingIds, setAddingIds] = useState([]);
  const navigate = useNavigate();
  const { data: allMcqData, isLoading: allmcqLoading, isFetching } = useGetMcqsQuery({ page, limit });
  const [createMcqById] = useCreateMcqByIdMutation();
  const { handleSubmitForm } = useFormSubmit();

  // filters & search
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // categories for dropdown
  const { data: catData, isLoading: catLoading, isError: catError } = useGetAllMcqCategoryQuery();
  const categories = useMemo(() => catData?.data ?? [], [catData]);

  const mcqs = useMemo(() => allMcqData?.data ?? [], [allMcqData]);

  // reset page when filters/search change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, categoryFilter, fromDate, toDate]);

  // client-side filtering (works on fetched page)
  const filteredMcqs = useMemo(() => {
    if (!mcqs || mcqs.length === 0) return [];

    const s = (searchTerm || "").trim().toLowerCase();
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    return mcqs.filter((m) => {
      // category filter (mcq.category is id string)
      if (categoryFilter && (m.category || "") !== categoryFilter) return false;

      // search in question, options, correctAnswer
      if (s) {
        const q = (m.question || "").toLowerCase();
        const correct = (m.correctAnswer || "").toLowerCase();
        const optionsText = (m.options || []).join(" ").toLowerCase();
        if (!(q.includes(s) || correct.includes(s) || optionsText.includes(s))) return false;
      }

      // date range on createdAt
      if (from || to) {
        const created = m.createdAt ? new Date(m.createdAt) : null;
        if (!created) return false;
        if (from && created < from) return false;
        if (to) {
          const toEnd = new Date(to);
          toEnd.setHours(23, 59, 59, 999);
          if (created > toEnd) return false;
        }
      }

      return true;
    });
  }, [mcqs, searchTerm, categoryFilter, fromDate, toDate]);

  const handleAddMcq = async (mcqId) => {
    setAddingIds((prev) => [...prev, mcqId]);

    const payload = {
      examId: params?.id,
      mcqId,
    };

    try {
      await handleSubmitForm({
        apiCall: createMcqById,
        data: payload,
      });
    } finally {
      setAddingIds((prev) => prev.filter((id) => id !== mcqId));
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setFromDate("");
    setToDate("");
  };

  if (allmcqLoading) {
    // Skeleton Loading
    return (
      <div className="space-y-4">
        {Array.from({ length: limit }).map((_, idx) => (
          <div
            key={idx}
            className="p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 animate-pulse"
          >
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 dark:bg-gray-700 px-2 py-2 rounded-md font-semibold text-black dark:text-white"
          >
            Cancel
          </button>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap gap-2 items-center">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search question, option or answer..."
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm shadow-sm"
          >
            <option value="">All Categories</option>
            {catLoading ? (
              <option value="">Loading...</option>
            ) : catError ? (
              <option value="">Failed to load</option>
            ) : (
              categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))
            )}
          </select>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">From:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">To:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-sm"
            />
          </div>

          <button
            onClick={clearFilters}
            className="ml-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm px-3 py-1 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* List */}
      {filteredMcqs.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">No MCQs found.</div>
      ) : (
        filteredMcqs.map((mcq) => (
          <div
            key={mcq._id}
            className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-800 dark:text-gray-100">{mcq.question}</p>
              <ul className="mt-2 list-disc list-inside text-gray-600 dark:text-gray-300">
                {mcq.options.map((opt, idx) => (
                  <li key={idx}>{opt}</li>
                ))}
              </ul>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Category:{" "}
                {categories.find((c) => c._id === mcq.category)?.title ?? mcq.category}
              </div>
            </div>

            <button
              onClick={() => handleAddMcq(mcq._id)}
              disabled={addingIds.includes(mcq._id)}
              className="mt-3 sm:mt-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {addingIds.includes(mcq._id) && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              )}
              {addingIds.includes(mcq._id) ? "Adding..." : "Add"}
            </button>
          </div>
        ))
      )}

      {/* Pagination */}
      <div className="flex gap-2 mt-4 justify-center">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || isFetching}
          className="px-3 py-1 border rounded disabled:opacity-50 text-black dark:text-white bg-white dark:bg-gray-800"
        >
          Previous
        </button>
        <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded text-black dark:text-white">{page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={mcqs.length < limit || isFetching}
          className="px-3 py-1 border rounded disabled:opacity-50 text-black dark:text-white bg-white dark:bg-gray-800"
        >
          Next
        </button>
      </div>
    </div>
  );
}
