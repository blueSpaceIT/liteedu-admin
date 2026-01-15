/* eslint-disable react/prop-types */
import { useState } from "react";
import { useGetAllExamMcqQuery } from "../../../redux/features/api/examMcq/examMcq";
import MCQTable from "./exMcqTable";
import MCQPagination from "./mcqPaginantion";
import { useNavigate } from "react-router-dom";
import GenericModal from "./genericModal";
import AddManualMCQModal from "./addManualMcqModal";
import PrintMcq from "./printMcq";

export default function MCQList({ examId }) {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [manualModalOpen, setManualModalOpen] = useState(false);
    const [byOneModalOpen, setByOneModalOpen] = useState(false);
    const [bySerialModalOpen, setBySerialModalOpen] = useState(false);

    const { data, isLoading, isError } = useGetAllExamMcqQuery({ examId, page, limit });
    const navigate = useNavigate();

    if (isLoading) return <p className="py-6 text-center text-slate-500">Loading MCQs...</p>;
    if (isError) return <p className="py-6 text-center text-red-500">Error fetching MCQs</p>;

    const mcqs = data?.data || [];
    console.log(mcqs);
    const totalPages = Math.ceil((data?.total || 0) / limit);

    return (
        <div className="card mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex flex-wrap items-start justify-between lg:flex-row lg:items-center">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-md bg-gray-200 px-2 py-1 text-black dark:bg-gray-700 dark:text-white"
                    >
                        Back
                    </button>
                    <h2 className="text-xl font-semibold text-black dark:text-white">MCQ List</h2>
                </div>

                <div className="flex flex-col gap-4 md:mt-5 md:flex-wrap lg:flex-row">
                    <button className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600">
                        <PrintMcq mcqs={mcqs} />
                    </button>

                    <button
                        onClick={() => setManualModalOpen(true)}
                        className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
                    >
                        Add Manual MCQ
                    </button>

                    <a
                        href={`/admin/course/exam/create-mcq/${examId}`}
                        className="rounded-md bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600"
                    >
                        Add By One
                    </a>

                    <a
                        href={`/admin/course/exam/create-mcq-by-serail/${examId}`}
                        className="rounded-md bg-purple-500 px-4 py-2 text-white transition-colors hover:bg-purple-600 dark:bg-purple-700 dark:hover:bg-purple-600"
                    >
                        Add By Serial
                    </a>

                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-md bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            <MCQTable mcqs={mcqs} />
            {totalPages > 1 && (
                <MCQPagination
                    page={page}
                    setPage={setPage}
                    totalPages={totalPages}
                />
            )}

            {/* Limit selector */}
            <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Show:</span>
                <select
                    className="rounded-md border px-2 py-1 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    value={limit}
                    onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                    }}
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>

            {/* Manual MCQ Modal */}
            <AddManualMCQModal
                isOpen={manualModalOpen}
                onClose={() => setManualModalOpen(false)}
                examId={examId}
            />

            {/* Add By One Modal */}
            <GenericModal
                isOpen={byOneModalOpen}
                onClose={() => setByOneModalOpen(false)}
                title="Add By One"
            >
                <input
                    type="text"
                    placeholder="Enter question"
                    className="w-full rounded-md border px-3 py-2"
                />
            </GenericModal>

            {/* Add By Serial Modal */}
            <GenericModal
                isOpen={bySerialModalOpen}
                onClose={() => setBySerialModalOpen(false)}
                title="Add By Serial"
            >
                <input
                    type="text"
                    placeholder="Enter questions in serial"
                    className="w-full rounded-md border px-3 py-2"
                />
            </GenericModal>
        </div>
    );
}
