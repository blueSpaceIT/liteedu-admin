/* eslint-disable react/prop-types */
import { Edit, Trash2 } from "lucide-react";
import AccountEditExpensModel from "./accountEditExpensModel";
import AccountDeleteExpensModel from "./accountDeleteExpensModel";
import { useState } from "react";

const ExpensManageRow = ({ expense }) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const formatDate = (isoDateString) => {
        const dateObject = new Date(isoDateString);
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return dateObject.toLocaleDateString("en-US", options);
    };
    const getPaymentMethodColor = (method) => {
        const lowerMethod = method?.toLowerCase();
        switch (lowerMethod) {
            case "rent":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
            case "electricity":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
            case "internet":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
            case "salary":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case "transport":
                return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
            case "others":
                return "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200";
            default:
                return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
        }
    };
    const category = expense?.category || "others";
    const colorClasses = getPaymentMethodColor(category);
    return (
        <>
            <tr className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{expense?.title || "-"}</td>
                <td className={`px-2 py-3`}>
                    <span className={`rounded-xl px-3 ${colorClasses}`}>{expense?.category || "-"}</span>
                </td>
                <td className="px-2 py-3 font-medium text-gray-600 dark:text-gray-400"> ৳{expense?.amount || "-"}</td>
                <td className="px-2 py-3 capitalize text-gray-600 dark:text-gray-400">{expense?.paymentMethod || "-"}</td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{formatDate(`${expense?.createdAt}`) || "-"}</td>
                <td className="flex justify-center gap-2 px-2 py-3 text-center">
                    <button
                        onClick={setIsEditOpen}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <Edit />
                    </button>
                    <button
                        onClick={setIsDeleteOpen}
                        className="text-red-600 hover:text-red-800"
                    >
                        <Trash2 />
                    </button>
                </td>
            </tr>
            <AccountEditExpensModel
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                expense={expense}
            />
            <AccountDeleteExpensModel
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                expense={expense}
            />
        </>
    );
};
export default ExpensManageRow;
