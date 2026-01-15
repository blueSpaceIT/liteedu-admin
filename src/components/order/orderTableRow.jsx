/* eslint-disable react/prop-types */
import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import UpdateOrder from "./UpdateOrder";
import DeleteConfirmModal from "../../ui/deleteConfrimModal";

import {
    useUpdateOrderMutation,
    useDeleteOrderMutation
} from "../../redux/features/api/order/orderApi";

const OrderTableRow = ({ order, index, page, limit }) => {
    const [updateModal, setUpdateModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [updateOrder] = useUpdateOrderMutation();
    const [deleteOrderMutation] = useDeleteOrderMutation();

    const badge = {
        Pending: "bg-gray-200 text-gray-700",
        Processing: "bg-yellow-100 text-yellow-700",
        Courier: "bg-blue-100 text-blue-700",
        Delivered: "bg-green-100 text-green-700",
        Cancel: "bg-red-100 text-red-700",
        Paid: "bg-green-200 text-green-800",
    };

    const handleUpdate = async (newStatus) => {
        setIsUpdating(true);
        try {
            await updateOrder({
                data: { status: newStatus },
                params: { id: order._id }
            }).unwrap();

            toast.success("Order updated successfully");
            setUpdateModal(false);
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error("Error updating");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteOrderMutation({ id: order._id }).unwrap();
            toast.success("Order deleted");
        } catch {
            toast.error("Delete failed");
        }
        setIsDeleteModalOpen(false);
    };

    return (
        <>
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <td className="px-4 py-3 text-center font-medium">
                    {(page - 1) * limit + index + 1}
                </td>

                <td className="px-4 py-3">{order?.name}</td>
                <td className="px-4 py-3">{order?.phone}</td>

                {/* Address */}
                <td className="px-4 py-3 max-w-[180px] truncate">
                    {order?.address || "—"}
                </td>

                {/* Shipping Method */}
                <td className="px-4 py-3">{order?.shippingMethod || "—"}</td>

                {/* Shipping Charge */}
                <td className="px-4 py-3 text-center">
                    ৳ {order?.shippingCharge ?? 0}
                </td>

                {/* Quantity */}
                <td className="px-4 py-3 text-center font-semibold">
                    {order?.quantity ?? 1}
                </td>

                {/* Payment Method */}
                <td className="px-4 py-3">{order?.paymentInfo?.method || "—"}</td>

                {/* Txn ID */}
                <td className="px-4 py-3 text-xs">
                    {order?.paymentInfo?.transactionId || "—"}
                </td>

                {/* Payment Status */}
                <td className="px-4 py-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge[order?.paymentStatus]}`}>
                        {order?.paymentStatus}
                    </span>
                </td>

                {/* Order Status */}
                <td className="px-4 py-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge[order?.status]}`}>
                        {order?.status}
                    </span>
                </td>

                {/* Subtotal */}
                <td className="px-4 py-3 text-center font-semibold">
                    ৳ {order?.subTotal}
                </td>

                {/* Product Name */}
                <td className="px-4 py-3">
                    {order?.productId?.title || "N/A"}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                        <button
                            onClick={() => setUpdateModal(true)}
                            className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                        >
                            {isUpdating ? "..." : <Edit size={16} />}
                        </button>

                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </td>
            </tr>

            {updateModal && (
                <UpdateOrder
                    isOpen={updateModal}
                    onClose={() => setUpdateModal(false)}
                    currentStatus={order?.status}
                    onUpdate={handleUpdate}
                    isLoading={isUpdating}
                />
            )}

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                message={`Are you sure you want to delete this order?`}
            />
        </>
    );
};

export default OrderTableRow;
