/* eslint-disable react/prop-types */

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function EditModal({ isOpen, onClose, form, setForm, onUpdate }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded shadow-lg p-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Edit Enrollment</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">Update student information</p>
          </div>
          <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={onUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 grid grid-cols-1 gap-3">
            <input
              className="border p-2 rounded bg-transparent dark:bg-gray-900"
              placeholder="Student Name"
              value={form.studentName}
              onChange={(e) => setForm({ ...form, studentName: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                className="border p-2 rounded bg-transparent dark:bg-gray-900"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
              <input
                className="border p-2 rounded bg-transparent dark:bg-gray-900"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <input
              className="border p-2 rounded bg-transparent dark:bg-gray-900"
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                className="border p-2 rounded bg-transparent dark:bg-gray-900"
                placeholder="Class"
                value={form.className}
                onChange={(e) => setForm({ ...form, className: e.target.value })}
                required
              />
              <input
                className="border p-2 rounded bg-transparent dark:bg-gray-900"
                placeholder="Batch"
                value={form.batchName}
                onChange={(e) => setForm({ ...form, batchName: e.target.value })}
              />
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

          <div className="md:col-span-1 flex flex-col gap-3">
            <input
              type="number"
              className="border p-2 rounded bg-transparent dark:bg-gray-900"
              placeholder="Course Fee"
              value={form.courseFee}
              onChange={(e) => setForm({ ...form, courseFee: e.target.value })}
              required
            />
            <div className="mt-auto flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
