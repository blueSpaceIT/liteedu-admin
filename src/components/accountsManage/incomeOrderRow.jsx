/* eslint-disable react/prop-types */

const IncomeOrderRow = ({ order }) => {
    const formatDate = (isoDateString) => {
        const dateObject = new Date(isoDateString);
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return dateObject.toLocaleDateString("en-US", options);
    };
    return (
        <>
            <tr className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{order?.customerId?.name || "-"}</td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">৳{order?.amount || "-"}</td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{order?.orderId?.status || "-"}</td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{formatDate(`${order?.createdAt}`) || "-"}</td>
            </tr>
        </>
    );
};
export default IncomeOrderRow;
