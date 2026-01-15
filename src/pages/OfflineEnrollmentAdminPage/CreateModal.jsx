/* eslint-disable react/prop-types */
import { useGetAllBatchQuery } from "../../redux/features/api/batch/batch";
import { useGetAllClassQuery } from "../../redux/features/api/class/class";
import { currency } from "./OfflineEnrollmentAdminPage";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function CreateModal({ isOpen, onClose, form, setForm, onCreate, loading }) {
  const { data: batchData } = useGetAllBatchQuery();
  const { data: classData } = useGetAllClassQuery();

  const previewCourseFee = Number(form.courseFee || 0);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded shadow-lg p-6 mt-8 transform transition-all">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">New Enrollment</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Quickly add an offline student and set initial course fee.
            </p>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 grid grid-cols-1 gap-3">
            <label className="block">
              <div className="text-sm font-medium mb-1">Student Name <span className="text-red-500">*</span></div>
              <input
                className="w-full border rounded px-3 py-2 bg-transparent dark:bg-gray-900"
                placeholder="e.g. Rahim Uddin"
                value={form.studentName}
                onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                required
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label>
                <div className="text-sm font-medium mb-1">Phone <span className="text-red-500">*</span></div>
                <input
                  className="w-full border rounded px-3 py-2 bg-transparent dark:bg-gray-900"
                  placeholder="01XXXXXXXXX"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </label>

              <label>
                <div className="text-sm font-medium mb-1">Email</div>
                <input
                  className="w-full border rounded px-3 py-2 bg-transparent dark:bg-gray-900"
                  placeholder="optional"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>
            </div>

            <label>
              <div className="text-sm font-medium mb-1">Address</div>
              <input
                className="w-full border rounded px-3 py-2 bg-transparent dark:bg-gray-900"
                placeholder="Address (optional)"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Class Dropdown */}
              <label>
                <div className="text-sm font-medium mb-1">Class <span className="text-red-500">*</span></div>
                <select
                  className="w-full border rounded px-3 py-2 bg-transparent dark:bg-gray-900"
                  value={form.className || ""}
                  onChange={(e) => setForm({ ...form, className: e.target.value })}
                  required
                >
                  <option value="">Select Class</option>
                  {classData?.data?.map((cls) => (
                    <option key={cls._id} value={cls.title}>{cls.title}</option>
                  ))}
                </select>
              </label>

              {/* Batch Dropdown */}
              <label>
                <div className="text-sm font-medium mb-1">Batch</div>
                <select
                  className="w-full border rounded px-3 py-2 bg-transparent dark:bg-gray-900"
                  value={form.batchName || ""}
                  onChange={(e) => setForm({ ...form, batchName: e.target.value })}
                >
                  <option value="">Select Batch</option>
                  {batchData?.data?.map((batch) => (
                    <option key={batch._id} value={batch.title}>{batch.title}</option>
                  ))}
                </select>
              </label>
            </div>

            {/* Month Dropdown */}
            <label>
              <div className="text-sm font-medium mb-1">Month</div>
              <select
                className="w-full border rounded px-3 py-2 bg-transparent dark:bg-gray-900"
                value={form.month || ""}
                onChange={(e) => setForm({ ...form, month: e.target.value })}
              >
                <option value="">Select Month (optional)</option>
                {months.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </label>
          </div>

          {/* Fee Preview */}
          <div className="md:col-span-1 bg-gray-50 dark:bg-gray-900/60 rounded p-4 flex flex-col gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Course Fee</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 bg-transparent dark:bg-gray-900"
                value={form.courseFee}
                onChange={(e) => setForm({ ...form, courseFee: e.target.value })}
                required
              />
            </div>

            <div className="mt-2">
              <div className="text-sm text-gray-500 dark:text-gray-300">Preview</div>
              <div className="text-lg font-semibold mt-1">{currency(previewCourseFee)}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Paid: {currency(0)}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Due: {currency(previewCourseFee)}</div>
            </div>

            <div className="mt-auto flex gap-2">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">Cancel</button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
                disabled={!form.studentName || !form.phone || !form.className || previewCourseFee < 0}
              >
                {loading ? 'Saving...' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
