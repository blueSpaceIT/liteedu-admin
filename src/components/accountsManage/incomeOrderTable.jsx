/* eslint-disable react/prop-types */

import IncomeOrderRow from "./incomeOrderRow";

const IncomeOrderTable = ({ orders }) => {
    console.log("orders", orders);
    return (
        <div className="mt-6 overflow-x-auto border border-gray-300 shadow-xl dark:border-gray-700">
            <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-200 dark:bg-gray-700 dark:text-white">
                    <tr>
                        <th className="px-2 py-3 text-left">Customer</th>
                        <th className="px-2 py-3 text-left">Amount</th>
                        <th className="px-2 py-3 text-left">Status</th>
                        <th className="px-2 py-3 text-left">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {orders?.map((order, index) => (
                        <IncomeOrderRow
                            key={order._id}
                            order={order}
                            index={index}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default IncomeOrderTable;
