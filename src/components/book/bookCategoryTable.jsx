/* eslint-disable react/prop-types */
import BookCategoryRow from "./bookCategoryRow";

const BookCategoryTable = ({ bookCategory, onEdit, onDelete }) => {
    if (!bookCategory || bookCategory.length === 0) {
        return <div className="py-6 text-center text-xl pt-[20%] font-semibold text-gray-500 dark:text-gray-400">No categories found</div>;
    }

    return (
        <div className="mt-6 overflow-x-auto border border-gray-300 shadow-xl dark:border-gray-700">
            <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-200 dark:bg-gray-700 dark:text-white">
                    <tr>
                        <th className="px-2 py-3 text-center">#</th>
                        <th className="px-2 py-3 text-left">Name</th>
                        <th className="px-2 py-3 text-left">Description</th>
                        <th className="px-2 py-3 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {bookCategory.map((category, index) => (
                        <BookCategoryRow
                            key={category._id}
                            categoryData={category}
                            index={index}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookCategoryTable;
