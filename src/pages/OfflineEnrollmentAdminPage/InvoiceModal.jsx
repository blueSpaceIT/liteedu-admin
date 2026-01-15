/* eslint-disable react/prop-types */
import { currency, formatDT } from "./OfflineEnrollmentAdminPage";
import logo from '../../assets/Logo-01.png';

export function InvoiceModal({ isOpen, invoiceData, onClose, invoiceContentRef }) {
  if (!isOpen || !invoiceData) return null;

  const printInvoice = () => {
    const printContents = invoiceContentRef.current?.innerHTML;
    if (!printContents) return;

    const w = window.open('', '_blank', 'width=900,height=1200');
    if (!w) return;

    w.document.open();
    w.document.write(`
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Invoice</title>
        <style>
          body{ font-family: ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial; margin:0; padding:24px; }
          .card{ max-width:800px; margin:0 auto; border:1px solid #e5e7eb; border-radius:12px; padding:24px; }
          .muted{ color:#6b7280; font-size:12px; }
          .row{ display:flex; justify-content:space-between; gap:16px; }
          .h{ font-size:24px; font-weight:700; }
          table{ width:100%; border-collapse:collapse; margin-top:16px; }
          th,td{ border-bottom:1px solid #e5e7eb; text-align:left; padding:8px; }
          .right{ text-align:right; }
          img{ max-width: 60px; height: auto; } /* logo size fix */
        </style>
      </head>
      <body onload="window.focus(); window.print(); setTimeout(() => window.close(), 300);">
        ${printContents}
      </body>
      </html>
    `);

    w.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-start justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-3xl rounded shadow-lg mt-8">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-lg font-semibold">Invoice Preview</h3>
          <div className="flex items-center gap-2">
            <button onClick={printInvoice} className="px-3 py-1.5 bg-purple-600 text-white rounded">Print</button>
            <button onClick={onClose} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 rounded">Close</button>
          </div>
        </div>

        <div ref={invoiceContentRef} className="p-6">
          <div className="card">
            <div className="row">
              <div>
                <div className="h">
                  <img className="h-10 w-20" src={logo} alt="LiteEdu Logo" />
                </div>
                <div className="muted">Offline Enrollment Invoice</div>
                <div className="muted">Date: {new Date().toLocaleDateString()}</div>
                <div className="muted">Month: {invoiceData.enrollment?.month || '-'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div><strong>Invoice #</strong>: {(invoiceData.payment?._id || invoiceData.payment?.transactionId || invoiceData.enrollment?._id || '').toString().slice(-8)}</div>
                <div><strong>Payment Date</strong>: {formatDT(invoiceData.payment?.paymentDate)}</div>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <div><strong>Student:</strong> {invoiceData.enrollment?.studentName}</div>
              <div className="muted">
                Phone: {invoiceData.enrollment?.phone} • Class: {invoiceData.enrollment?.className} / {invoiceData.enrollment?.batchName}
              </div>
              {invoiceData.enrollment?.address && (
                <div className="muted">Address: {invoiceData.enrollment.address}</div>
              )}
            </div>

            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Method</th>
                  <th>Date</th>
                  <th className="right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Course Fee Payment</td>
                  <td>{invoiceData.payment?.method || '-'}</td>
                  <td>{formatDT(invoiceData.payment?.paymentDate)}</td>
                  <td className="right">{currency(invoiceData.payment?.amount)}</td>
                </tr>
              </tbody>
            </table>

            <div className="row" style={{ marginTop: 12 }}>
              <div />
              <div style={{ minWidth: 260 }}>
                <div className="row"><div className="muted">Course Fee</div><div>{currency(invoiceData.enrollment?.courseFee)}</div></div>
                <div className="row"><div className="muted">Paid (after this)</div><div>{currency(invoiceData.enrollment?.paidAmount)}</div></div>
                <div className="row"><div className="muted">Due (after this)</div><div>{currency(invoiceData.enrollment?.dueAmount)}</div></div>
                <div className="row" style={{ borderTop: '1px solid #e5e7eb', marginTop: 8, paddingTop: 8 }}>
                  <div><strong>Total</strong></div>
                  <div><strong>{currency(invoiceData.payment?.amount)}</strong></div>
                </div>
              </div>
            </div>

            {invoiceData.payment?.note && (
              <div style={{ marginTop: 12 }} className="muted">Note: {invoiceData.payment.note}</div>
            )}

            {invoiceData.payment?.transactionId && (
              <div style={{ marginTop: 4 }} className="muted">Txn: {invoiceData.payment.transactionId}</div>
            )}

            <div className="muted" style={{ marginTop: 24 }}>Thank you for your payment.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
