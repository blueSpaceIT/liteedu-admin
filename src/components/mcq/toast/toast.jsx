/* eslint-disable react/prop-types */
const Toast = ({ message, onClose }) => (
  <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-fadeIn">
    <div className="flex items-center justify-between gap-4 max-w-xs">
      <p>{message}</p>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-300 font-bold"
        aria-label="Close toast"
      >
        &times;
      </button>
    </div>
  </div>
);

export default Toast;
