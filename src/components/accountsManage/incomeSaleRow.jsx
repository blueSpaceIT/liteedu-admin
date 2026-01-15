/* eslint-disable react/prop-types */
const IncomeSaleRow = ({ sale }) => {
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
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{sale?.customerId?.name || "-"}</td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">৳{sale?.amount || "-"}</td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{sale?.orderId?.status || "-"}</td>
                <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{formatDate(`${sale?.createdAt}`) || "-"}</td>
            </tr>
        </>
    );
};
export default IncomeSaleRow;
