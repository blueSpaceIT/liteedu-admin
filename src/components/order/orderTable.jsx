/* eslint-disable react/prop-types */
import OrderTableRow from "./orderTableRow";

const OrderTable = ({ orderData, page, limit }) => {
    if (!orderData || orderData.length === 0) {
        return <div className="py-20 text-center text-lg text-gray-500 dark:text-gray-400">No orders found 😔</div>;
    }

    return (
        <div className="w-full overflow-x-auto rounded-lg border shadow-md dark:border-gray-700">
            <table className="min-w-full text-sm">
                <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800">
                    <tr className="text-left text-gray-700 dark:text-gray-200">
                        <th className="px-4 py-3 text-center">#</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Phone</th>
                        <th className="px-4 py-3">Address</th>
                        <th className="px-4 py-3">Shipping</th>
                        <th className="px-4 py-3 text-center">Charge</th>
                        <th className="px-4 py-3 text-center">Qty</th>
                        <th className="px-4 py-3">Method</th>
                        <th className="px-4 py-3">Txn ID</th>
                        <th className="px-4 py-3 text-center">Payment</th>
                        <th className="px-4 py-3 text-center">Status</th>
                        <th className="px-4 py-3 text-center">Subtotal</th>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                </thead>

                <tbody className="divide-y dark:divide-gray-700">
                    {orderData.map((order, index) => (
                        <OrderTableRow
                            key={order._id}
                            order={order}
                            index={index}
                            page={page}
                            limit={limit}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderTable;
