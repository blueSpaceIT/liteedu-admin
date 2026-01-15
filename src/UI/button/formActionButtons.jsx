// components/FormActionButtons.jsx

export default function FormActionButtons({
  // eslint-disable-next-line react/prop-types
  onCancel,
  // eslint-disable-next-line react/prop-types
  onSubmit,
  // eslint-disable-next-line react/prop-types
  cancelText = "Cancel",
  // eslint-disable-next-line react/prop-types
  submitText = "Create",
  // eslint-disable-next-line react/prop-types
  submitColor = "bg-blue-500",
  // eslint-disable-next-line react/prop-types
  isSubmitting = false,
}) {
  return (
    <div className="flex justify-center gap-3 pt-3">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md"
      >
        {cancelText}
      </button>
      <button
        type="submit"
        onClick={onSubmit}
        disabled={isSubmitting}
        className={`px-4 py-2 ${submitColor} text-white rounded-md disabled:opacity-50`}
      >
        {isSubmitting ? "Processing..." : submitText}
      </button>
    </div>
  );
}
