/* eslint-disable react/prop-types */
import { PencilLine, Trash } from "lucide-react";

const CourseCategoryList = ({ categories, onEdit, onDelete }) => {
    if (!categories || categories.length === 0) {
        return (
            <div className="py-20 text-center text-lg text-gray-500 dark:text-gray-400">
                No categories found 😔
            </div>
        );
    }

    return (
        <div className="relative w-full max-w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <table className="w-full border-collapse text-left">
                <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                        <th className="py-3 pl-5 text-sm font-semibold text-gray-600 dark:text-gray-300">#</th>
                        <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                            Category
                        </th>
                        <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                            Slug
                        </th>
                        <th className="py-3 px-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-300">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {categories.map(({ _id, title, slug }, index) => (
                        <tr
                            key={_id}
                            className="border-t border-gray-200 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/60"
                        >
                            <td className="py-3 pl-5 text-gray-700 dark:text-gray-300 text-sm">
                                {index + 1}
                            </td>
                            <td className="py-3 px-4 text-gray-800 dark:text-gray-200 font-medium text-sm">
                                {title}
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                                {slug}
                            </td>
                            <td className="py-3 px-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => onEdit(_id)}
                                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-300 dark:hover:bg-blue-800 transition"
                                        title="Edit Category"
                                    >
                                        <PencilLine size={16} />
                                    </button>

                                    <button
                                        onClick={() => onDelete(slug)}
                                        className="rounded-lg p-2 text-red-600 hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-800 transition"
                                        title="Delete Category"
                                    >
                                        <Trash size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CourseCategoryList;
