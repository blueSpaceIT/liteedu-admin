/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import DeleteConfirmModal from "../../ui/deleteConfrimModal";
import useFormSubmit from "../../hooks/useFormSubmit";
import UpdateCoupon from "./UpdateCoupon";
import { useDeleteCouponMutation } from "../../redux/features/api/coupons/couponsApi";
import { toast } from "react-toastify";

const CouponRow = ({ coupon, index, page, limit }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [updateCouponsModal, setUpdateCouponsModal] = useState(false);
    const { handleSubmitForm } = useFormSubmit();
    const [deleteCoupon] = useDeleteCouponMutation();

    const handleDelete = () => {
        setIsDeleteModalOpen(false);
        const payload = {
            _id: coupon?._id
        }
        if (coupon) {
            try {
                const res = handleSubmitForm({
                    apiCall: deleteCoupon,
                    data: payload
                })
            } catch (error) {
                toast.error("Failed to delete")
            }
        }
    };

    const statusStyle =
        coupon.status === "Active"
            ? "bg-green-200 dark:bg-green-800 rounded-2xl  text-green-800 dark:text-green-200"
            : coupon.status === "Expired"
                ? "bg-red-200 dark:bg-red-800 rounded-2xl  text-red-800 dark:text-red-200"
                : "";

    return (
        <>
            <tr className="transition-colors border-t border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
                <td className="px-2 py-3 text-center text-gray-900 dark:text-gray-100">{(page - 1) * limit + index + 1}</td>
                <td className="px-2 py-3 text-gray-900 dark:text-gray-100">{coupon.coupon}</td>
                <td className="px-2 py-3 text-gray-900 dark:text-gray-100">{coupon.description}</td>
                <td className="px-2 py-3 gray-900 text-c dark:text-gray-100">{coupon.discountType}</td>
                <td className="px-2 py-3 text-gray-900 dark:text-gray-100">{coupon.discountAmount}</td>
                <td className="px-2 py-3 text-gray-900 dark:text-gray-100">
                    <span className={`px-3 ${statusStyle}`}>{coupon.status}</span>
                </td>
                <td className="px-2 py-3 space-x-3">
                    <button
                        onClick={() => setUpdateCouponsModal(true)}
                        className="text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        <Edit />
                    </button>

                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="text-red-600 transition-colors hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                        <Trash2 />
                    </button>
                </td>
            </tr>
            {
                updateCouponsModal && <UpdateCoupon initialData={coupon} close={setUpdateCouponsModal} />
            }
            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onConfirm={handleDelete}
                message={`Are you sure you want to delete "${coupon.coupon}"?`}
            />
        </>
    );
};

export default CouponRow;
