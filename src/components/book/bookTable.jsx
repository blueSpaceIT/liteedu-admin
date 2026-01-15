/* eslint-disable react/prop-types */
import { useState } from "react";
import useFormSubmit from "../../hooks/useFormSubmit";
import { useDeleteBookMutation, useUpdateBookMutation } from "../../redux/features/api/book/bookApi";
import BookRow from "./bookRow";
import UpdateBookModal from "./UpdateBookModal";

const BookTable = ({ books, page, limit }) => {
    const { handleSubmitForm } = useFormSubmit();

    const [deleteBook] = useDeleteBookMutation();
    const [updateBook] = useUpdateBookMutation();

    const [editingBook, setEditingBook] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = (slug) => {
        handleSubmitForm({
            apiCall: deleteBook,
            params: { slug: slug },
        });
    };

    const handleEditClick = (book) => {
        setEditingBook(book);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBook(null);
    };

    const handleUpdate = (updatedData) => {
        handleSubmitForm({
            apiCall: updateBook,
            data: updatedData,
            params: { slug: editingBook.slug },
            onSuccess: handleCloseModal,
        });
    };

    if (!books || books.length === 0) {
        return <div className="py-6 pt-[20%] text-center text-xl font-semibold text-gray-500 dark:text-gray-400">No books found</div>;
    }

    return (
        <div className="mt-6 overflow-x-auto border border-gray-300 shadow-xl dark:border-gray-700">
            <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-200 dark:bg-gray-700 dark:text-white">
                    <tr>
                        <th className="px-2 py-3 text-center">#</th>
                        <th className="px-2 py-3 text-left">CoverPhoto</th>
                        <th className="px-2 py-3 text-left">Title</th>
                        <th className="px-2 py-3 text-left">Description</th>
                        <th className="px-2 py-3 text-left">Book Type</th>
                        <th className="px-2 py-3 text-left">Price</th>
                        <th className="px-2 py-3 text-left">Stock</th>
                        <th className="px-2 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book, index) => (
                        <BookRow
                            key={book._id}
                            book={book}
                            onDelete={handleDelete}
                            onEdit={handleEditClick}
                            index={index}
                            page={page}
                            limit={limit}
                        />
                    ))}
                </tbody>
            </table>

            {/* Update Modal */}
            {isModalOpen && (
                <UpdateBookModal
                    initialData={editingBook}
                    close={handleCloseModal}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

export default BookTable;
