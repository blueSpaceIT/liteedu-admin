/* eslint-disable react/prop-types */
import BlogRow from "./BlogRow";

const BlogTable = ({ blogs, currentPage, limit }) => {
    console.log(blogs);
    return (
        <div className="mt-6 overflow-x-auto border border-gray-300 shadow-xl dark:border-gray-700">
            <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-200 dark:bg-gray-700 dark:text-white">
                    <tr>
                        <th className="px-2 py-3 text-center">#</th>
                        <th className="px-2 py-3 text-left">Cover Photo</th>
                        <th className="px-2 py-3 text-left">Title</th>
                        <th className="px-2 py-3 text-left">Category</th>
                        <th className="px-2 py-3 text-left">Description</th>
                        <th className="px-2 py-3 text-left">Tags</th>
                        <th className="px-2 py-3 text-left">Created At</th>
                        <th className="px-2 py-3 text-left">Updated At</th>
                        <th className="px-2 py-3 text-left">Status</th>
                        <th className="px-2 py-3 text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.map((blog, index) => (
                        <BlogRow
                            key={blog._id}
                            blogData={blog}
                            index={(currentPage - 1) * limit + index} // remove the extra +1
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BlogTable;
