/* eslint-disable react/prop-types */

import IncomeSaleRow from "./incomeSaleRow";


const IncomeSaleTable = ({ sales }) => {
    return (
        <div className="mt-6 overflow-x-auto border border-gray-300 shadow-xl dark:border-gray-700">
            <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-200 dark:bg-gray-700 dark:text-white">
                    <tr>
                        <th className="px-2 py-3 text-left">Transaction ID</th>
                        <th className="px-2 py-3 text-left">Amount</th>
                        <th className="px-2 py-3 text-left">Source</th>
                        <th className="px-2 py-3 text-left">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {sales?.map((sale, index) => (
                        <IncomeSaleRow
                            key={sale._id}
                            sale={sale}
                            index={index}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default IncomeSaleTable;
