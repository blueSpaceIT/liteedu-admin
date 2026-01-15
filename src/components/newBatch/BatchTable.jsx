/* eslint-disable react/prop-types */
import BatchRow from "./BatchRow";

const BatchTable = ({ batches, currentPage, limit }) => {
    return (
        <div className="mt-6 overflow-x-auto border border-gray-300 shadow-xl dark:border-gray-700">
            <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-200 dark:bg-gray-700 dark:text-white">
                    <tr>
                        <th className="px-2 py-3 text-center">#</th>
                        <th className="px-2 py-3 text-left">Title</th>
                        <th className="px-2 py-3 text-left">Status</th>
                        <th className="px-2 py-3 text-left">Created At</th>
                        <th className="px-2 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {batches.map((batch, index) => (
                        <BatchRow
                            key={batch._id}
                            batchData={batch}
                            index={(currentPage - 1) * limit + index}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BatchTable;
