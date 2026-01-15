/* eslint-disable react/prop-types */
import { useDeleteAdminMutation, useUpdateAdminMutation } from "../../redux/features/api/Admin/adminApi";
import AdminRow from "./adminRow";
import { toast } from "react-toastify";

const AdminTable = ({ admins }) => {
    const [deleteAdmin] = useDeleteAdminMutation();
    const [updateAdmin] = useUpdateAdminMutation();

    // delete handler
    const handleDelete = async (id) => {
        try {
            await deleteAdmin({ id }).unwrap();
            toast.success("Admin deleted successfully");
        } catch (error) {
            toast.error(error?.data?.message || "Failed to delete admin");
        }
    };

    // update handler
    const handleUpdate = async (updatedAdmin) => {
        try {
            await updateAdmin({
                params: { id: updatedAdmin._id },
                data: updatedAdmin,
            }).unwrap();
            toast.success("Admin updated successfully");
        } catch (error) {
            toast.error(error?.data?.message || "Failed to update admin");
        }
    };

    return (
        <div className="mt-6 overflow-x-auto border border-gray-300 shadow-xl dark:border-gray-700">
            <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-200 dark:bg-gray-700 dark:text-white">
                    <tr>
                        <th className="px-2 py-3 text-center">#</th>
                        <th className="px-2 py-3 text-left">Name</th>
                        <th className="px-2 py-3 text-left">Email</th>
                        <th className="px-2 py-3 text-left">Phone</th>
                        <th className="px-2 py-3 text-left">Address</th>
                        <th className="px-2 py-3 text-center">Status</th>
                        <th className="px-2 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.map((admin, index) => (
                        <AdminRow
                            key={admin._id}
                            admin={admin}
                            index={index}
                            onAdminDelete={handleDelete}
                            onAdminUpdate={handleUpdate}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminTable;
