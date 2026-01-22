/* eslint-disable react/prop-types */
import { Trash2 } from "lucide-react";
import FormActionButtons from "../UI/button/formActionButtons";
import useFormSubmit from "../hooks/useFormSubmit";

const ConfirmDeleteModal = ({
    onClose,
    id,
    deleteFn,
    title = "Confirm Deletion",
    message = "Do you really want to delete this item? This action cannot be undone.",
    itemName = "",
}) => {
    const { handleSubmitForm } = useFormSubmit();

    const onConfirm = () => {
        handleSubmitForm({
            apiCall: deleteFn,
            params: { _id: id },
            onSuccess: onClose,
        });
    };

    if (!id) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-sm rounded-xl border border-red-300 bg-white p-6 text-center shadow-xl dark:border-red-700 dark:bg-gray-900">
                <Trash2 className="mx-auto mb-4 h-12 w-12 text-red-500" />
                <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h3>
                <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
                    {message} {itemName && <span className="font-semibold">{itemName}</span>}
                </p>
                <div className="flex justify-center gap-4">
                    <FormActionButtons
                        onCancel={onClose}
                        onSubmit={onConfirm}
                        cancelText="Cancel"
                        submitText="Yes, Delete"
                        submitColor="bg-red-500"
                        isSubmitting={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
