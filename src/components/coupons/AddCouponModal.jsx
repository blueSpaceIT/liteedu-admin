/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import ModalContainer from "../../package/modalContainer";
import Button from "../../ui/button";
import { useAddCouponMutation } from "../../redux/features/api/coupons/couponsApi";
import useFormSubmit from "../../hooks/useFormSubmit";
import { toast } from "react-toastify";
import { useState } from "react";

const AddCouponModal = ({ close }) => {
    const [loading, setLoading] = useState(false);
    const [addCoupon] = useAddCouponMutation();
    const { handleSubmitForm } = useFormSubmit()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {

        const payload = {
            coupon: data.coupon,
            description: data.description,
            discountType: data.discountType,
            discountAmount: data.discountAmount !== "" ? Number(data.discountAmount) : null,
            status: data.status,
        }
        console.log(payload)
        setLoading(true);
        try {
            const response = await handleSubmitForm({
                apiCall: addCoupon,
                data: payload
            })

            if (response) {
                setLoading(false);
                reset()
                close()
                toast.success("Coupon Added Successfully");
            }

        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error(error.message)

        } finally {
            setLoading(false)
            close()
        }

    };
    const inputClass =
        "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200";

    return (
        <ModalContainer close={close}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col h-full"
            >
                <div className="flex-1 pr-1 space-y-6 overflow-y-auto">
                    <div className="text-center">
                        <h2 className="mb-1 text-2xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text sm:text-3xl">
                            Add New Coupon
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">Fill out the details to add a new Coupon.</p>
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">
                            Coupon
                        </label>
                        <input
                            {...register("coupon", { required: "Coupon is required" })}
                            placeholder="Enter Coupon..."
                            className={inputClass}
                        />
                        {errors.coupon && <p className="mt-1 text-sm text-red-500">{errors.coupon.message}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">
                            Coupon
                        </label>
                        <textarea
                            {...register("description", { required: "Coupon is required" })}
                            placeholder="Enter Description..."
                            className={inputClass}
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
                    </div>




                    <div>
                        <label className="block mb-1 text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Discount Type</label>
                        <select
                            {...register("discountType", { required: "This field is required" })}
                            className={inputClass}
                            placeholder="Select Discount Type"
                        >
                            <option value="">Select Discount Type</option>
                            <option value="Percentage">Percentage</option>
                            <option value="Fixed">Fixed</option>
                        </select>
                        {errors.discountType && <p className="mt-1 text-sm text-red-500">{errors.discountType.message}</p>}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">
                            Discount Amount
                        </label>
                        <input
                            type="number"
                            {...register("discountAmount", { required: "This field is required" })}
                            placeholder="Enter Discount Account (% 1-100)"
                            className={inputClass}
                        />
                        {errors.discountAmount && <p className="mt-1 text-sm text-red-500">{errors.discountAmount.message}</p>}
                    </div>

                    <div >
                        <label className="block mb-1 text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Status</label>
                        <select
                            {...register("status", { required: "Status is Required" })}
                            className={inputClass}
                        >
                            <option value="Active">Active</option>
                            <option value="Expired">Expired</option>
                        </select>
                        {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>}
                    </div>
                </div>
                <div className="flex justify-end pt-2 mt-8 border-t border-gray-200 dark:border-gray-700">
                    <Button type="submit">
                        {loading ? "Adding Coupon..." : "Add Coupon"}
                    </Button>
                </div>
            </form>
        </ModalContainer>
    );
};

export default AddCouponModal;
