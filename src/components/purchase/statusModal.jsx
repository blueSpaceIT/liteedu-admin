/* eslint-disable react/prop-types */
import { useState } from "react";
import { useUpdatePurchaseMutation } from "../../redux/features/api/purchase/purchaseApi";
import useFormSubmit from "../../hooks/useFormSubmit";
import FormActionButtons from "../../ui/button/formActionButtons";

const StatusModal = ({ isOpen, onClose,selectId, currentStatus}) => {
    const [updatePurchase,{isLoading}]=useUpdatePurchaseMutation()
    const {handleSubmitForm}=useFormSubmit()


  const [status, setStatus] = useState(currentStatus);

  const handleSubmit = () => {
     handleSubmitForm({
      apiCall: updatePurchase,
      data: {status:status},
      params:{_id:selectId},
      onSuccess: () => onClose(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded-xl p-6 w-[90%] max-w-md shadow-2xl transform transition-all duration-300 scale-100 opacity-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
          Update Course Status
        </h2>

        <div className="space-y-3">
          {["Active", "Archive", "Course Out"].map((opt) => (
            <label
              key={opt}
              className={`block px-4 py-3 rounded-lg cursor-pointer border font-medium transition-colors duration-200 
                ${
                  status === opt
                    ? "bg-blue-600 text-white border-blue-700"
                    : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-gray-700"
                }`}
            >
              <input
                type="radio"
                name="status"
                value={opt}
                checked={status === opt}
                onChange={() => setStatus(opt)}
                className="hidden"
              />
              {opt}
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
         
           <FormActionButtons
                               onCancel={onClose}
                               onSubmit={handleSubmit}
                               cancelText="Cancel"
                               submitText="Update"
                               submitColor="bg-green-500"
                               isSubmitting={isLoading}
                             />









        </div>
      </div>
    </div>
  );
};

export default StatusModal;
