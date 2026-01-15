/* eslint-disable react/prop-types */
import BlogCategoryRow from "./BlogCategoryRow";

const BlogCategoryTable = ({ blogCategory }) => {
    return (
        <div className="mt-6 overflow-x-auto border border-gray-300 shadow-xl dark:border-gray-700">
            <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-200 dark:bg-gray-700 dark:text-white">
                    <tr>
                        <th className="px-2 py-3 text-center">#</th>
                        <th className="px-2 py-3 text-left">Title</th>
                        <th className="px-2 py-3 text-left">Created At</th>
                        <th className="px-2 py-3 text-left">Updated At</th>
                        <th className="px-2 py-3 text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {blogCategory.map((blog, index) => (
                        <BlogCategoryRow
                            key={blog._id}
                            categoryData={blog}
                            index={index}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BlogCategoryTable;
