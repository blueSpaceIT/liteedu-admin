import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetMcqsQuery } from "../../../redux/features/api/mcq/mcqApi";
import useFormSubmit from "../../../hooks/useFormSubmit";
import { useCreateMcqByIdMutation, useCreateMcqBySerialMutation } from "../../../redux/features/api/examMcq/examMcq";
import { useGetAllMcqCategoryQuery } from "../../../redux/features/api/mcqCategory/mcqCategory";

export default function AddMCQBySerail() {
    const [page, setPage] = useState(1);
    const params = useParams();
    const limit = 10;
    const [addingIds, setAddingIds] = useState([]);
    const navigate = useNavigate();
    const { data: allMcqData, isLoading: allmcqLoading, isFetching } = useGetMcqsQuery({ page, limit });
    const [createMcqByserail] = useCreateMcqBySerialMutation();
    const [createMcqById] = useCreateMcqByIdMutation();
    const { handleSubmitForm } = useFormSubmit();

    // Bulk-add inputs (kept as before)
    const [examId] = useState(params?.id);
    const [fromSerial, setFromSerial] = useState("");
    const [toSerial, setToSerial] = useState("");

    // Filters & search for list display
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [serialMinFilter, setSerialMinFilter] = useState("");
    const [serialMaxFilter, setSerialMaxFilter] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // categories for dropdown
    const { data: catData, isLoading: catLoading, isError: catError } = useGetAllMcqCategoryQuery();
    const categories = useMemo(() => catData?.data ?? [], [catData]);

    const mcqs = useMemo(() => allMcqData?.data ?? [], [allMcqData]);

    // reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [searchTerm, categoryFilter, serialMinFilter, serialMaxFilter, fromDate, toDate]);

    // client-side filtered list
    const filteredMcqs = useMemo(() => {
        if (!mcqs || mcqs.length === 0) return [];

        const s = (searchTerm || "").trim().toLowerCase();
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;
        const serialMin = serialMinFilter !== "" ? Number(serialMinFilter) : null;
        const serialMax = serialMaxFilter !== "" ? Number(serialMaxFilter) : null;

        return mcqs.filter((m) => {
            // category filter (mcq.category is id string)
            if (categoryFilter && (m.category || "") !== categoryFilter) return false;

            // serial filter
            if (serialMin !== null && (typeof m.serial === "number" ? m.serial < serialMin : Number(m.serial) < serialMin)) return false;
            if (serialMax !== null && (typeof m.serial === "number" ? m.serial > serialMax : Number(m.serial) > serialMax)) return false;

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
    }, [mcqs, searchTerm, categoryFilter, serialMinFilter, serialMaxFilter, fromDate, toDate]);

    // bulk add by serial (keep behavior)
    const handleLogInputs = () => {
        const payload = {
            examId,
            fromSerial: Number(fromSerial),
            toSerial: Number(toSerial),
        };
        handleSubmitForm({
            apiCall: createMcqByserail,
            data: payload,
        });
    };

    const handleAddMcq = async (mcqId) => {
        setAddingIds((prev) => [...prev, mcqId]);

        const payload = {
            examId: examId,
            mcqId: mcqId,
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
        setSerialMinFilter("");
        setSerialMaxFilter("");
        setFromDate("");
        setToDate("");
    };

    // Initial loading skeleton
    if (allmcqLoading) {
        return (
            <div className="space-y-4 p-4">
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
        <div className="flex flex-col gap-6 p-4 sm:p-6">
            {/* Bulk-add inputs (kept) */}
            <div className="p-4 border rounded-xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 border-purple-300 dark:border-gray-700 shadow-md">
                <h2 className="text-lg font-bold mb-4 text-purple-700 dark:text-purple-300">
                    Add MCQs by Serial
                </h2>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Exam ID"
                        readOnly
                        disabled
                        value={examId}
                        className="px-3 py-2 border rounded-lg w-full dark:bg-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                    <input
                        type="number"
                        placeholder="From Serial"
                        value={fromSerial}
                        onChange={(e) => setFromSerial(e.target.value)}
                        className="px-3 py-2 border rounded-lg w-full dark:bg-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                        type="number"
                        placeholder="To Serial"
                        value={toSerial}
                        onChange={(e) => setToSerial(e.target.value)}
                        className="px-3 py-2 border rounded-lg w-full dark:bg-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                </div>

                <div className="mt-4">
                    <button
                        onClick={handleLogInputs}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-md hover:scale-105 transition-transform"
                    >
                        Add by Serial Range
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-transform shadow-md text-black dark:text-white"
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

                    <input
                        type="number"
                        placeholder="Serial min"
                        value={serialMinFilter}
                        onChange={(e) => setSerialMinFilter(e.target.value)}
                        className="w-28 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm shadow-sm"
                    />

                    <input
                        type="number"
                        placeholder="Serial max"
                        value={serialMaxFilter}
                        onChange={(e) => setSerialMaxFilter(e.target.value)}
                        className="w-28 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm shadow-sm"
                    />

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

            {/* Table with loading overlay */}
            <div className="overflow-x-auto border rounded-xl dark:border-gray-700 shadow-lg relative">
                {isFetching && (
                    <div className="absolute inset-0 bg-white/70 dark:bg-gray-800/70 flex items-center justify-center z-10">
                        <svg
                            className="animate-spin h-8 w-8 text-purple-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                    </div>
                )}

                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-800 dark:to-blue-900">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-white">#Serial</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-white">Question</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-white">Options</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-white">Category</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-white">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                        {filteredMcqs.map((mcq) => (
                            <tr key={mcq._id} className="hover:bg-purple-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{mcq.serial}</td>
                                <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{mcq.question}</td>
                                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                    <ul className="list-disc list-inside space-y-1">
                                        {mcq.options.map((opt, idx) => (
                                            <li key={idx}>{opt}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                    {categories.find((c) => c._id === mcq.category)?.title ?? mcq.category}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => handleAddMcq(mcq._id)}
                                        disabled={addingIds.includes(mcq._id)}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 
                      text-white rounded-lg focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed 
                      flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-105"
                                    >
                                        {addingIds.includes(mcq._id) && (
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                            </svg>
                                        )}
                                        {addingIds.includes(mcq._id) ? "Adding..." : "Add"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex gap-3 mt-6 justify-center">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || isFetching}
                    className="px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-700 dark:to-gray-900 rounded-lg text-white font-medium disabled:opacity-50 shadow-md hover:scale-105 transition-transform"
                >
                    Previous
                </button>
                <span className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-md">
                    {page}
                </span>
                <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={mcqs.length < limit || isFetching}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-white font-medium disabled:opacity-50 shadow-md hover:scale-105 transition-transform"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
