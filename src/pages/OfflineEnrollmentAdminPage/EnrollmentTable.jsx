/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { currency, formatDT } from "./OfflineEnrollmentAdminPage";
import { InvoiceModal } from "./InvoiceModal";
import { FaInfoCircle } from "react-icons/fa";

export function EnrollmentTable({ enrollments, loading, serialBase, openEdit, openAddPayment, openInvoice, deleteEnrollment }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const invoiceContentRef = useRef(null);

  const openDetails = (student) => {
    setSelectedStudent(student);
    setDetailsOpen(true);
  };

  const openPaymentInvoice = (enrollment, payment) => {
    setInvoiceData({ enrollment, payment });
    setInvoiceOpen(true);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded shadow overflow-hidden">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/60">
              <th className="p-3 text-sm font-medium text-gray-600 dark:text-gray-300">#</th>
              <th className="p-3 text-sm font-medium text-gray-600 dark:text-gray-300">Month</th>
              <th className="p-3 text-sm font-medium text-gray-600 dark:text-gray-300">Name</th>
              <th className="p-3 text-sm font-medium text-gray-600 dark:text-gray-300">Phone</th>
              <th className="p-3 text-sm font-medium text-gray-600 dark:text-gray-300">Class / Batch</th>
              <th className="p-3 text-sm font-medium text-gray-600 dark:text-gray-300">Fee</th>
              <th className="p-3 text-sm font-medium text-gray-600 dark:text-gray-300">Paid</th>
              <th className="p-3 text-sm font-medium text-gray-600 dark:text-gray-300">Due</th>
              <th className="p-3 text-sm font-medium text-gray-600 dark:text-gray-300">Status</th>
              <th className="p-3 text-sm font-medium text-gray-600 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="10" className="p-6 text-center">Loading...</td></tr>
            ) : enrollments.length === 0 ? (
              <tr><td colSpan="10" className="p-6 text-center">No records found.</td></tr>
            ) : enrollments.map((e, i) => {
              const lastPayment = e.payments && e.payments.length
                ? e.payments.slice().sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))[0]
                : null;

              return (
                <tr key={e._id} className={`${i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900/80'} border-t hover:bg-gray-100 dark:hover:bg-gray-800`}>
                  <td className="p-3 align-top w-12">{serialBase + i + 1}</td>
                  <td className="p-3 align-top max-w-xs truncate" title={e._postTime ? formatDT(e._postTime) : ''}>{e.month}</td>
                  <td className="p-3 align-top max-w-xs truncate">{e.studentName}</td>
                  <td className="p-3 align-top">{e.phone}</td>
                  <td className="p-3 align-top">{e.className} <span className="text-sm text-gray-500 dark:text-gray-400">/ {e.batchName}</span></td>
                  <td className="p-3 align-top">{currency(e.courseFee)}</td>
                  <td className="p-3 align-top">{currency(e.paidAmount)}</td>
                  <td className="p-3 align-top">{currency(e.dueAmount)}</td>
                  <td className="p-3 align-top">
                    <span className={`px-2 py-1 rounded text-sm ${e.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/20' : e.paymentStatus === 'Partial' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20' : 'bg-red-100 text-red-800 dark:bg-red-900/20'}`}>
                      {e.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3 align-top">
                    <div className="flex gap-2 flex-wrap">
                      <button className="px-2 py-1 bg-yellow-400 rounded hover:brightness-95" onClick={() => openEdit(e)}>Edit</button>
                      <button className="px-2 py-1 bg-blue-500 text-white rounded hover:brightness-95" onClick={() => openAddPayment(e)}>Add Payment</button>
                      {/* Old Invoice Button */}
                      {lastPayment && (
                        <button className="px-2 py-1 bg-purple-600 text-white rounded hover:brightness-95" onClick={() => openInvoice({ enrollment: e, payment: lastPayment })}>
                          Invoice
                        </button>
                      )}
                      {/* New Details Modal Button */}
                      <button className="px-2 py-1 bg-gray-400 text-white rounded hover:brightness-95 flex items-center gap-1" onClick={() => openDetails(e)}>
                        <FaInfoCircle /> Details
                      </button>
                      <button className="px-2 py-1 bg-red-500 text-white rounded hover:brightness-95" onClick={() => deleteEnrollment(e._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {detailsOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded shadow-lg mt-8 overflow-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-semibold">{selectedStudent.studentName} - Payments</h3>
              <button onClick={()=>setDetailsOpen(false)} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded">Close</button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Phone:</strong> {selectedStudent.phone}</div>
                <div><strong>Email:</strong> {selectedStudent.email || '-'}</div>
                <div><strong>Class / Batch:</strong> {selectedStudent.className} / {selectedStudent.batchName}</div>
                <div><strong>Address:</strong> {selectedStudent.address || '-'}</div>
                <div><strong>Course Fee:</strong> {currency(selectedStudent.courseFee)}</div>
                <div><strong>Paid:</strong> {currency(selectedStudent.paidAmount)}</div>
                <div><strong>Due:</strong> {currency(selectedStudent.dueAmount)}</div>
              </div>

              <table className="min-w-full text-left border-t border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/60">
                  <tr>
                    <th className="p-2 border-b">#</th>
                    <th className="p-2 border-b">Amount</th>
                    <th className="p-2 border-b">Method</th>
                    <th className="p-2 border-b">Date</th>
                    <th className="p-2 border-b">Note</th>
                    <th className="p-2 border-b">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStudent.payments.length === 0 ? (
                    <tr><td colSpan="6" className="p-4 text-center">No payments yet</td></tr>
                  ) : selectedStudent.payments.map((p, idx) => (
                    <tr key={p._id} className={`${idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900/80'}`}>
                      <td className="p-2 border-b">{idx + 1}</td>
                      <td className="p-2 border-b">{currency(p.amount)}</td>
                      <td className="p-2 border-b">{p.method}</td>
                      <td className="p-2 border-b">{formatDT(p.paymentDate)}</td>
                      <td className="p-2 border-b">{p.note || '-'}</td>
                      <td className="p-2 border-b">
                        <button className="px-2 py-1 bg-purple-600 text-white rounded hover:brightness-95" onClick={()=>openPaymentInvoice(selectedStudent, p)}>Invoice</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      <InvoiceModal isOpen={invoiceOpen} invoiceData={invoiceData} onClose={()=>setInvoiceOpen(false)} invoiceContentRef={invoiceContentRef} />
    </>
  );
}
