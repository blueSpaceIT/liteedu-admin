/* eslint-disable react/prop-types */
import { Edit, Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const BannerRow = ({ banner, onEdit, onDelete }) => {
    const getStatusClass = (status) => {
        switch (status) {
            case "Published":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case "Drafted":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
        }
    };
    return (
        <tr className="transition-colors hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800">
            <td className="px-2 py-3 text-center">{banner.position}</td>
            <td className="px-2 py-3">
                <div className="flex items-center justify-start gap-2">
                    {banner?.image && (
                        <img
                            src={banner?.image}
                            className="size-10 rounded-full border border-gray-300 object-cover dark:border-gray-700"
                        />
                    )}
                </div>
            </td>
            <td className="px-2 py-3 text-center">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(banner.status)}`}>
                    {banner.status}
                </span>
            </td>
            <td className="flex justify-center gap-2 px-2 py-3 text-center">
                <Link
                    to={banner.viewLink}
                    className="text-blue-600 hover:text-blue-800"
                >
                    <Eye size={18} />
                </Link>
                <button
                    onClick={() => onEdit(banner)}
                    className="text-blue-600 hover:text-blue-800"
                >
                    <Edit size={18} />
                </button>
                <button
                    onClick={() => onDelete(banner._id)}
                    className="text-red-600 hover:text-red-800"
                >
                    <Trash2 size={18} />
                </button>
            </td>
        </tr>
    );
};

export default BannerRow;
