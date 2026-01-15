/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const CreateCourseCategoryModal = ({
  isOpen,
  onClose,
  onCreate,
  initialData = {},
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    year: "", // optional
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: initialData?.title || "",
        year:
          initialData?.year === 0 || initialData?.year
            ? String(initialData.year)
            : "",
      });
    } else {
      setFormData({ title: "", year: "" });
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData?.title.trim()) return;

    const payload = {
      title: formData.title.trim(),
      ...(formData.year?.toString().trim()
        ? { year: Number(formData.year) }
        : {}), // include only if provided
    };

    onCreate(payload);
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm sm:p-6">
      <div className="relative w-full max-w-md overflow-y-auto rounded-xl border border-gray-300 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900 sm:p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl font-bold text-gray-500 hover:text-red-500 focus:outline-none"
          disabled={loading}
        >
          &times;
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="mb-1 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-2xl font-bold text-transparent dark:from-blue-400 dark:to-cyan-400 sm:text-3xl">
            {initialData?.title ? "Edit Course Category" : "Create Course Category"}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
            {initialData?.title ? "Update your category details." : "Add a new course category."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block font-medium text-gray-700 dark:text-gray-300 sm:text-sm">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. HSC"
              className={inputClass}
              required
              disabled={loading}
            />
          </div>

          {/* Keep hidden year field (optional) */}
          <div className="hidden">
            <label className="mb-1 block font-medium text-gray-700 dark:text-gray-300 sm:text-sm">
              Year (optional)
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="e.g. 2026"
              min="1900"
              max="2100"
              className={inputClass}
              disabled={loading}
            />
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-400 px-4 py-2 text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50 dark:from-blue-500 dark:to-cyan-400 dark:hover:from-blue-600 dark:hover:to-cyan-500"
              disabled={loading}
            >
              {loading ? "Saving..." : initialData?.title ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourseCategoryModal;
