/* eslint-disable react/prop-types */
import CouponRow from "./couponRow";

const CouponsTable = ({ coupons, onDelete, onEdit, page, limit }) => {
    return (
        <div className="mt-6 overflow-x-auto border border-gray-300 rounded shadow-xl dark:border-gray-600">
            <table className="min-w-full border-collapse table-auto">
                <thead className="bg-gray-200 dark:bg-gray-700">
                    <tr>
                        <th className="px-2 py-3 text-center text-gray-900 dark:text-gray-100">#</th>
                        <th className="px-2 py-3 text-left text-gray-900 dark:text-gray-100">Coupons</th>
                        <th className="px-2 py-3 text-left text-gray-900 dark:text-gray-100">Description</th>
                        <th className="px-2 py-3 text-left text-gray-900 dark:text-gray-100">Coupon Type</th>
                        <th className="px-2 py-3 text-left text-gray-900 dark:text-gray-100">Discount Amount</th>
                        <th className="px-2 py-3 text-left text-gray-900 dark:text-gray-100">Status</th>
                        <th className="px-2 py-3 text-left text-gray-900 dark:text-gray-100">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {coupons && coupons.length > 0 ? (
                        coupons.map((coupon, index) => (
                            <CouponRow
                                key={coupon.id}
                                coupon={coupon}
                                index={index}
                                onDelete={onDelete}
                                onEdit={onEdit}
                                page={page}
                                limit={limit}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="py-4 text-center text-gray-900 dark:text-gray-100">
                                No coupons found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CouponsTable;
