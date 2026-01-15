/* eslint-disable react/prop-types */
export default function GenericModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitButtonProps = {}, 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-md p-6 relative shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
          <button
            onClick={() => onClose(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="mb-6">{children}</div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => onClose(false)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            {...submitButtonProps} // loading & custom text handle
          >
            {submitButtonProps.children || "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
