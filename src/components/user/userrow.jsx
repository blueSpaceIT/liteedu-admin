/* eslint-disable react/prop-types */
import { User2 } from "lucide-react"; // default icon

// Function to get role color
const getRoleColor = (role) => {
  switch (role.toLowerCase()) {
    case "teacher":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "student":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "admin":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

const UserRow = ({ user, index, page, limit }) => {
  return (
    <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
      {/* Index */}
      <td className="px-4 py-3 font-semibold text-center text-gray-700 dark:text-gray-200">
        {(page - 1) * limit + index + 1}
      </td>

      {/* Name */}
      <td className="flex items-center gap-3 px-4 py-3">
        {user.profile_picture ? (
          <img
            src={user.profile_picture}
            alt={user.name}
            className="object-cover w-10 h-10 border border-gray-300 rounded-full dark:border-gray-700"
          />
        ) : (
          <div className="flex items-center justify-center w-10 h-10 text-gray-600 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">
            <User2 className="w-5 h-5" />
          </div>
        )}
        <span className="font-medium text-gray-800 dark:text-gray-200">
          {user.name}
        </span>
      </td>

      {/* Email */}
      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
        {user.email || "-"}
      </td>

      {/* Phone */}
      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
        {user.phone || "-"}
      </td>

      {/* Role */}
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] sm:text-xs font-medium ${getRoleColor(
            user.role
          )}`}
        >
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3 text-center">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] sm:text-xs font-medium ${user.status === "Active"
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            : user.status === "Block"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            }`}
        >
          {user.status}
        </span>
      </td>
    </tr>
  );
};

export default UserRow;
