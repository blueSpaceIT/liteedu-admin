/* eslint-disable react/prop-types */
import { Trash2 } from "lucide-react";
import FormActionButtons from "../ui/button/formActionButtons";
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-sm p-6 text-center border border-red-300 dark:border-red-700">
        <Trash2 className="mx-auto mb-4 text-red-500 w-12 h-12" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
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
