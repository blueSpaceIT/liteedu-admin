/* eslint-disable react/prop-types */
import { useEffect } from "react";

const ModalContainer = ({ children, close }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") close?.();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [close]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/60"
      onClick={() => close(false)}
    >
      <div
        className="relative flex flex-col w-full max-w-3xl p-6 overflow-scroll bg-white shadow-lg max-h-[90vh] dark:bg-gray-800 rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {close && (
          <button
            onClick={() => close(false)}
            className="absolute text-gray-500 transition-colors top-3 right-3 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            aria-label="Close Modal"
          >
            X
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default ModalContainer;
