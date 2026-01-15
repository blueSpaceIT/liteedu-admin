/* eslint-disable react/prop-types */
import UserRow from "./UserRow";

const UserTable = ({ users, page, limit }) => {
    return (
        <div className="mt-6 overflow-x-auto border border-gray-300 shadow-xl dark:border-gray-700 dark:bg-gray-900">
            <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-200 dark:bg-gray-700">
                    <tr>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">#</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Phone</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Role</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user, index) => (
                        <UserRow
                            key={user._id}
                            user={user}
                            index={index}
                            page={page}
                            limit={limit}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
