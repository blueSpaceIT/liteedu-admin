/* eslint-disable react/prop-types */
import { Info } from "lucide-react";
import McqRow from "../mcqrow/mcqrow";

const McqTable = ({ mcqs, categories, onEdit, onDelete }) => {
    if (!mcqs || mcqs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl p-8">
                <Info
                    size={40}
                    className="mr-2 text-red-500 dark:text-red-500"
                />
                <span className="text-2xl font-bold text-red-500 dark:text-red-500">No MCQ found.</span>
            </div>
        );
    }

    return (
        <div className="mt-6 overflow-x-auto border border-gray-300 shadow-xl dark:border-gray-700">
            <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-200 text-black dark:bg-gray-700 dark:text-white">
                    <tr>
                        <th className="border border-white px-4 py-3 text-center text-sm font-semibold">#</th>
                        <th className="border border-white px-4 py-3 text-left text-sm font-semibold">Question</th>
                        <th className="border border-white px-4 py-3 text-left text-sm font-semibold">Category</th>
                        <th className="border border-white px-4 py-3 text-left text-sm font-semibold">Options</th>
                        <th className="border border-white px-4 py-3 text-center text-sm font-semibold">Correct Answer</th>
                        <th className="border border-white px-4 py-3 text-center text-sm font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {mcqs.map((mcq, index) => (
                        <McqRow
                            key={mcq._id}
                            mcq={{ ...mcq, number: index + 1 }}
                            categories={categories}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default McqTable;
