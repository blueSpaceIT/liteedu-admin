/* eslint-disable react/prop-types */
import { Edit, Trash2 } from "lucide-react";

export const McqCategoryList = ({ categories, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto rounded-md bg-gray-50 p-4 shadow-md dark:bg-gray-800">
            <table className="min-w-full text-left text-sm text-gray-900 dark:text-gray-100">
                <thead>
                    <tr className="border-b border-gray-300 text-[15px] dark:border-gray-700">
                        <th className="px-4 py-2 font-medium">ID</th>
                        <th className="px-4 py-2 font-medium">Title</th>
                        <th className="px-4 py-2 font-medium">Slug</th>
                        <th className="px-4 py-2 text-center font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories?.length === 0 ? (
                        <tr>
                            <td
                                colSpan={5}
                                className="py-6 text-center text-[16px] font-semibold text-gray-500 dark:text-gray-600"
                            >
                                No MCQ Categories Found 😔
                            </td>
                        </tr>
                    ) : (
                        categories.map(({ _id, title, slug }) => {
                            return (
                                <tr
                                    key={_id}
                                    className="cursor-pointer border-b border-gray-300 transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700"
                                >
                                    <td className="px-4 py-3">{_id}</td>
                                    <td className="px-4 py-3">{title}</td>
                                    <td className="px-4 py-3">{slug}</td>
                                    <td className="space-x-3 px-4 py-3 text-center">
                                        {/* Edit button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEdit(slug);
                                            }}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Edit />
                                        </button>

                                        {/* Delete button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(slug);
                                            }}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default McqCategoryList;
