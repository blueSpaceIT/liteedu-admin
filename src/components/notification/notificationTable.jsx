/* eslint-disable react/prop-types */

import NotificationRow from "./notificationRow";

const NotificationTable = ({ data }) => {
    return (
        <div className="mt-6 overflow-x-auto border border-gray-300 shadow-xl dark:border-gray-700">
            <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-200 dark:bg-gray-700 dark:text-white">
                    <tr>
                        <th className="px-2 py-3 text-center">#</th>
                        <th className="px-2 py-3 text-left">Title</th>
                        <th className="px-2 py-3 text-left">Message</th>
                        <th className="px-2 py-3 text-left">Course</th>
                        <th className="px-2 py-3 text-left">Status</th>
                        <th className="px-2 py-3 text-left">Type</th>
                        <th className="px-2 py-3 text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((notification, index) => (
                        <NotificationRow
                            key={notification._id}
                            notification={notification}
                            index={index}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NotificationTable;
