/* eslint-disable react/prop-types */
import { useState } from "react";
import FormActionButtons from "../../ui/button/formActionButtons";
import { useCreateExpenseMutation } from "../../redux/features/api/accounts/accountsApi";
import useFormSubmit from "../../hooks/useFormSubmit";

const AccountCreateExpensModel = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        amount: "",
        category: "",
        paymentMethod: "",
    });

    const [addExpense, { isLoading }] = useCreateExpenseMutation();
    const { handleSubmitForm } = useFormSubmit();
    if (!isOpen) return null;

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitdata = {
            ...formData,
            amount: Number(formData.amount),
        };
        handleSubmitForm({
            apiCall: addExpense,
            data: submitdata,
            onSuccess: () => {
                setFormData({
                    title: "",
                    description: "",
                    amount: "",
                    category: "",
                    paymentMethod: "",
                });
                onClose()
            },
        });
    };

    const inputClass = "w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="max-h-[90vh] w-[90%] max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Create Expense</h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    {/* Title & Amount */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="flex flex-1 flex-col">
                            <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Expense title"
                                value={formData.title}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            />
                        </div>

                        <div className="flex flex-1 flex-col">
                            <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                            <input
                                type="number"
                                name="amount"
                                placeholder="0"
                                value={formData.amount}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                            name="description"
                            placeholder="Description (optional)"
                            value={formData.description}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>

                    {/* Category & Payment Method */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="flex flex-1 flex-col">
                            <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="rent">Rent</option>
                                <option value="electricity">Electricity</option>
                                <option value="internet">Internet</option>
                                <option value="salary">Salary</option>
                                <option value="transport">Transport</option>
                                <option value="others">Others</option>
                            </select>
                        </div>

                        <div className="flex flex-1 flex-col">
                            <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
                            <select
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            >
                                <option value="">Select Payment Method</option>
                                <option value="cash">Cash</option>
                                <option value="bkash">Bkash</option>
                                <option value="nagad">Nagad</option>
                                <option value="bank">Bank</option>
                                <option value="card">Card</option>
                            </select>
                        </div>
                    </div>

                    {/* Submit / Cancel */}
                    <FormActionButtons
                        onCancel={onClose}
                        cancelText="Cancel"
                        submitText="Create"
                        submitColor="bg-green-500"
                        isSubmitting={isLoading}
                    />
                </form>
            </div>
        </div>
    );
};

export default AccountCreateExpensModel;
