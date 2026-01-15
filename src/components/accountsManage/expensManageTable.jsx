/* eslint-disable react/prop-types */

import ExpensManageRow from "./expensManageRow";

const ExpensManageTable = ({ expenses }) => {
    return (
        <div className="mt-6 overflow-x-auto border border-gray-300 shadow-xl dark:border-gray-700">
            <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-200 dark:bg-gray-700 dark:text-white">
                    <tr>
                        <th className="px-2 py-3 text-left">Title</th>
                        <th className="px-2 py-3 text-left">Category</th>
                        <th className="px-2 py-3 text-left">Amount</th>
                        <th className="px-2 py-3 text-left">Payment Method</th>
                        <th className="px-2 py-3 text-left">Date</th>
                        <th className="px-2 py-3 text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses?.map((expense, index) => (
                        <ExpensManageRow
                            key={expense._id}
                            expense={expense}
                            index={index}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExpensManageTable;
