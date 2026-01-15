/* eslint-disable react/prop-types */
import { PencilLine, Trash } from "lucide-react";
import { useState } from "react";
import StatusModal from "./statusModal";
import { useDeletePurchaseMutation } from "../../redux/features/api/purchase/purchaseApi";
import ConfirmDeleteModal from "../../package/deleteModalOpen";

const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-BD", {
        dateStyle: "medium",
        timeStyle: "short",
    });

const getPaymentColor = (method) => {
    switch (method?.toLowerCase()) {
        case "bkash":
            return "text-pink-600 dark:text-pink-400";
        case "nagad":
            return "text-orange-600 dark:text-orange-400";
        case "rocket":
            return "text-blue-600 dark:text-blue-400";
        default:
            return "text-gray-800 dark:text-gray-200";
    }
};

const ProductRow = ({ product, isMobile = false }) => {
    const status = product?.status;
    const [deletePurchase] = useDeletePurchaseMutation();
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    if (!isMobile) {
        return (
            <>
                <tr className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="px-2 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-200 md:text-sm">
                        {product?._id.slice(5, 10)}
                    </td>

                    {/* Course */}
                    <td className="whitespace-normal break-words px-2 py-3">
                        <div className="flex min-w-0 max-w-xs flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
                            <img
                                src={product?.courseId?.cover_photo}
                                alt={product?.courseId?.course_title}
                                className="size-14 rounded-lg border border-gray-300 object-cover dark:border-gray-700"
                            />
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-blue-600 dark:text-blue-400">{product?.courseId?.course_title}</p>
                                <p className="line-clamp-2 text-xs text-gray-600 dark:text-gray-400">{product?.courseId?.description}</p>
                                <p className="mt-1 inline-block rounded bg-blue-100 px-2 py-0.5 text-[11px] text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    {product?.course_type}
                                </p>
                            </div>
                        </div>
                    </td>

                    {/* Price */}
                    <td className="px-2 py-3 text-xs md:text-sm">
                        <p className="font-medium text-gray-800 dark:text-gray-100">৳ {product?.courseId?.offerPrice}</p>
                        <p className="text-sm font-semibold text-green-600 dark:text-green-400">Total: ৳ {product?.totalAmount}</p>
                    </td>

                    {/* Student */}
                    <td className="px-2 py-3 text-xs md:text-sm">
                        <div className="rounded-md bg-gray-100 p-2 dark:bg-gray-800">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{product?.studentId?.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">📞 {product?.studentId?.phone}</p>
                        </div>
                    </td>

                    {/* Payment */}
                    <td className="max-w-[200px] whitespace-normal break-words px-2 py-3 text-xs md:text-sm">
                        <div className="flex flex-col gap-1">
                            <span className={`font-semibold ${getPaymentColor(product?.paymentInfo?.method)}`}>
                                Txn ID: {product?.paymentInfo?.transactionId}
                            </span>
                            <span className="text-xs">
                                <strong>Method:</strong> {product?.paymentInfo?.method}
                            </span>
                            <span className="text-[11px] text-gray-500 dark:text-gray-400">{formatDate(product?.paymentInfo?.paymentDate)}</span>
                        </div>
                    </td>

                    {/* Status */}
                    <td className="px-2 py-3 text-xs md:text-sm">
                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium sm:text-xs ${
                                status === "Active"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : status === "Archive"
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                        >
                            {status}
                        </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-x-2 sm:gap-x-4">
                            <button
                                onClick={() => setIsStatusModalOpen(true)}
                                className="rounded-full bg-blue-100 p-1.5 text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-700"
                                title="Edit Status"
                            >
                                <PencilLine size={16} />
                            </button>
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="rounded-full bg-red-100 p-1.5 text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-700"
                                title="Delete Product"
                            >
                                <Trash size={16} />
                            </button>
                        </div>
                    </td>
                </tr>

                {/* Modals */}
                <StatusModal
                    isOpen={isStatusModalOpen}
                    onClose={() => setIsStatusModalOpen(false)}
                    currentStatus={status}
                    selectId={product?._id}
                />
                {isDeleteModalOpen && (
                    <ConfirmDeleteModal
                        id={product?._id}
                        deleteFn={deletePurchase}
                        onClose={() => setIsDeleteModalOpen(false)}
                        title="Delete Purchase"
                        message="Are you sure you want to delete this Purchase?"
                        itemName={product?.courseId?.course_title}
                    />
                )}
            </>
        );
    }

    // 🟢 Mobile card view
    return (
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">ID: {product?._id.slice(5, 10)}</span>
                <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : status === "Archive"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                >
                    {status}
                </span>
            </div>

            {/* Course */}
            <div className="mb-3 flex gap-3">
                <img
                    src={product?.courseId?.cover_photo}
                    alt={product?.courseId?.course_title}
                    className="h-16 w-16 rounded-md object-cover"
                />
                <div className="min-w-0">
                    <p className="truncate font-semibold text-blue-600 dark:text-blue-400">{product?.courseId?.course_title}</p>
                    <p className="line-clamp-2 text-xs text-gray-600 dark:text-gray-400">{product?.courseId?.description}</p>
                    <span className="mt-1 inline-block rounded bg-blue-100 px-2 py-0.5 text-[11px] text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {product?.course_type}
                    </span>
                </div>
            </div>

            {/* Student + Payment */}
            <div className="space-y-2 text-xs">
                <div>
                    <strong>Student:</strong> {product?.studentId?.name} ({product?.studentId?.phone})
                </div>
                <div>
                    <strong>Payment:</strong> <span className={getPaymentColor(product?.paymentInfo?.method)}>{product?.paymentInfo?.method}</span>
                    <div>Txn ID: {product?.paymentInfo?.transactionId}</div>
                    <div>{formatDate(product?.paymentInfo?.paymentDate)}</div>
                </div>
                <div>
                    <strong>Total:</strong> ৳ {product?.totalAmount}
                </div>
            </div>

            {/* Actions */}
            <div className="mt-3 flex justify-end gap-2">
                <button
                    onClick={() => setIsStatusModalOpen(true)}
                    className="rounded-full bg-blue-100 p-1.5 text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-700"
                    title="Edit Status"
                >
                    <PencilLine size={16} />
                </button>
                <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="rounded-full bg-red-100 p-1.5 text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-700"
                    title="Delete Product"
                >
                    <Trash size={16} />
                </button>
            </div>

            {/* Modals */}
            <StatusModal
                isOpen={isStatusModalOpen}
                onClose={() => setIsStatusModalOpen(false)}
                currentStatus={status}
                selectId={product?._id}
            />
            {isDeleteModalOpen && (
                <ConfirmDeleteModal
                    id={product?._id}
                    deleteFn={deletePurchase}
                    onClose={() => setIsDeleteModalOpen(false)}
                    title="Delete Purchase"
                    message="Are you sure you want to delete this Purchase?"
                    itemName={product?.courseId?.course_title}
                />
            )}
        </div>
    );
};

export default ProductRow;
