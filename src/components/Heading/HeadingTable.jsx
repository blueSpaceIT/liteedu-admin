/* eslint-disable react/prop-types */
import { toast } from "react-toastify";
import { useDeleteHeadingOfferMutation, useUpdateHeadingOfferMutation } from "../../redux/features/api/headingOffer/headingOfferApi";
import HeadingRow from "./HeadingRow";

const HeadingTable = ({ headings }) => {
    const [deleteHeading] = useDeleteHeadingOfferMutation();
    const [updateHeading] = useUpdateHeadingOfferMutation();

    const handleDelete = async (slug) => {
        console.log("Deleting slug:", slug);
        try {
            await deleteHeading({ slug }).unwrap();
            toast.success("Heading deleted successfully");
        } catch (err) {
            console.error(err);
            toast.error(err?.data?.message || "Failed to delete heading");
        }
    };

    const handleUpdate = async ({ slug, offer }) => {
        try {
            const updated = await updateHeading({ slug, data: { offer } }).unwrap();
            toast.success("Heading offer updated successfully");
            return updated;
        } catch (err) {
            toast.error(err?.data?.message || "Failed to update offer");
            throw err;
        }
    };

    if (!headings || headings.length === 0) return <p className="py-6 text-center text-gray-500">No heading offers found.</p>;

    return (
        <div className="mt-6 overflow-x-auto border border-gray-300 shadow-xl dark:border-gray-700">
            <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-200 dark:bg-gray-700 dark:text-white">
                    <tr>
                        <th className="px-2 py-3 text-center">#</th>
                        <th className="px-2 py-3 text-left">Slug</th>
                        <th className="px-2 py-3 text-left">Offer</th>
                        <th className="px-2 py-3 text-left">Created At</th>
                        <th className="px-2 py-3 text-left">Updated At</th>
                        <th className="px-2 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {headings.map((heading, index) => (
                        <HeadingRow
                            key={heading._id}
                            heading={heading}
                            index={index}
                            onHeadingDelete={handleDelete}
                            onHeadingUpdate={handleUpdate}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HeadingTable;
