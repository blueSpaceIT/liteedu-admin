/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { statusOptions } from "../../constants";

const AdminStatusModal = ({ isOpen, onClose, currentStatus, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
    } else {
      setTimeout(() => setShowModal(false), 300); // Wait for transition to finish
    }
  }, [isOpen]);

  if (!showModal) return null;

  const handleChange = (status) => {
    onUpdate(status);
  };



  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl p-6 w-[90%] max-w-sm shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-in-out ${
          isOpen ? "scale-100" : "scale-90"
        }`}
      >
        <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Update Status
        </h3>

        <div className="flex flex-col gap-4 mb-6">
          {statusOptions.map((option) => (
            <button
              key={option.label}
              onClick={() => handleChange(option.label)}
              className={`flex items-center gap-4 px-6 py-4 rounded-xl font-semibold border-2 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2
                ${
                  currentStatus === option.label
                    ? `bg-${option.color}-600 text-white border-${option.color}-600`
                    : `bg-${option.color}-50 dark:bg-gray-700 text-${option.color}-600 dark:text-${option.color}-400 border-${option.color}-300 hover:bg-${option.color}-100 dark:hover:bg-gray-600 focus:ring-${option.color}-500`
                }`}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-2 w-full px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AdminStatusModal;