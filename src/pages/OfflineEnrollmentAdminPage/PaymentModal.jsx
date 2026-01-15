/* eslint-disable react/prop-types */
import { currency } from "./OfflineEnrollmentAdminPage";

export function PaymentModal({
  isOpen,
  selected,
  paymentForm,
  setPaymentForm,
  submitPayment,
  onClose,
}) {
  const currentPaid = selected ? Number(selected.paidAmount || 0) : 0;
  const currentFee = selected ? Number(selected.courseFee || 0) : 0;
  const newPaidPreview = currentPaid + Number(paymentForm.amount || 0);
  const newDuePreview = Math.max(0, currentFee - newPaidPreview);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  if (!isOpen || !selected) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-xl rounded shadow-lg p-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Add Payment</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Student: <span className="font-medium">{selected.studentName}</span>
            </p>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <form onSubmit={submitPayment} className="md:col-span-2 grid grid-cols-1 gap-3">

            {/* Amount */}
            <label>
              <div className="text-sm font-medium mb-1">
                Amount <span className="text-red-500">*</span>
              </div>
              <input
                type="number"
                min="0"
                step="1"
                className="w-full border rounded px-3 py-2 bg-transparent dark:bg-gray-900"
                placeholder="0"
                value={paymentForm.amount}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, amount: e.target.value })
                }
                required
              />
            </label>

            {/* Method + Month */}
            <div className="grid grid-cols-2 gap-3">
              <label>
                <div className="text-sm font-medium mb-1">Method</div>
                <select
                  className="w-full border rounded px-3 py-2 bg-transparent dark:bg-gray-900"
                  value={paymentForm.method}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, method: e.target.value })
                  }
                >
                  <option>Cash</option>
                  <option>Bkash</option>
                  <option>Nagad</option>
                  <option>Bank</option>
                </select>
              </label>

              <label>
                <div className="text-sm font-medium mb-1">Month</div>
                <select
                  className="w-full border rounded px-3 py-2 bg-transparent dark:bg-gray-900"
                  value={paymentForm.month}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, month: e.target.value })
                  }
                >
                  <option value="">Select Month</option>
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Transaction ID */}
            <label>
              <div className="text-sm font-medium mb-1">Transaction ID</div>
              <input
                className="w-full border rounded px-3 py-2 bg-transparent dark:bg-gray-900"
                placeholder="Optional"
                value={paymentForm.transactionId}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, transactionId: e.target.value })
                }
              />
            </label>

            {/* Payment Date */}
            <label>
              <div className="text-sm font-medium mb-1">Payment Date</div>
              <input
                type="datetime-local"
                className="w-full border rounded px-3 py-2 bg-transparent dark:bg-gray-900"
                value={paymentForm.paymentDate}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, paymentDate: e.target.value })
                }
              />
            </label>

            {/* Note */}
            <label>
              <div className="text-sm font-medium mb-1">Note</div>
              <input
                className="w-full border rounded px-3 py-2 bg-transparent dark:bg-gray-900"
                placeholder="Optional note"
                value={paymentForm.note}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, note: e.target.value })
                }
              />
            </label>

            {/* Invoice URL */}
            <label>
              <div className="text-sm font-medium mb-1">
                Invoice URL (optional)
              </div>
              <input
                className="w-full border rounded px-3 py-2 bg-transparent dark:bg-gray-900"
                placeholder="https://..."
                value={paymentForm.invoiceUrl}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, invoiceUrl: e.target.value })
                }
              />
            </label>

            {/* SMS Toggle */}
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={paymentForm.sendSMS}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, sendSMS: e.target.checked })
                }
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Send SMS confirmation
              </span>
            </label>

            <div className="flex gap-2 justify-end mt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save Payment
              </button>
            </div>
          </form>

          {/* Summary */}
          <div className="md:col-span-1 bg-gray-50 dark:bg-gray-900/60 p-4 rounded">
            <div className="text-sm text-gray-500 dark:text-gray-300">
              Enrollment Summary
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Course Fee</span>
                <span className="font-medium">{currency(currentFee)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm">Already Paid</span>
                <span className="font-medium">{currency(currentPaid)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm">After this payment</span>
                <span className="font-medium">{currency(newPaidPreview)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm">New Due</span>
                <span
                  className={`font-semibold ${
                    newDuePreview === 0
                      ? "text-green-600 dark:text-green-300"
                      : "text-red-600 dark:text-red-300"
                  }`}
                >
                  {currency(newDuePreview)}
                </span>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-300">
              Tip: If invoice URL is blank, server may auto-generate one.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
