/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Filters } from './Filters';
import { EnrollmentTable } from './EnrollmentTable';
import { CreateModal } from './CreateModal';
import { EditModal } from './EditModal';
import { PaymentModal } from './PaymentModal';
import { InvoiceModal } from './InvoiceModal';
import { Link } from 'react-router-dom';

// ---------------- Helper Functions ----------------
export const currency = (n) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n || 0);

export const formatDT = (s) => {
  try {
    const d = new Date(s);
    return `${d.toLocaleString(undefined, { month: 'short' })} ${d.getFullYear()}`;
  } catch {
    return "";
  }
};

export const attachMonthTo = (arr) =>
  (arr || []).map((e) => ({
    ...e,
    month:
      e.month && String(e.month).trim()
        ? e.month
        : formatDT(e.createdAt || e.enrollmentDate || (e.payments?.[0]?.paymentDate) || new Date()),
    _postTime: e.createdAt || e.enrollmentDate || (e.payments?.[0]?.paymentDate) || null,
  }));

export default function OfflineEnrollmentAdminPage() {
  // ---------------- States ----------------
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState({ totalCollection:0, totalFee:0, totalDue:0, count:0, outstandingBalance:0 });
  const [isDark, setIsDark] = useState(() => localStorage.getItem('liteedu_dark') === '1');

  // -------- Modals & Forms --------
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const invoiceContentRef = useRef(null);

  const emptyForm = { studentName:'', phone:'', email:'', address:'', className:'', batchName:'', courseFee:'' };
  const [form, setForm] = useState(emptyForm);
  const [paymentForm, setPaymentForm] = useState({ amount: '', method: 'Cash', transactionId: '', paymentDate: '', note: '', invoiceUrl: '', sendSMS: false });
  const [invoiceData, setInvoiceData] = useState(null);

  // ---------------- Effects ----------------
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('liteedu_dark', isDark ? '1' : '0');
  }, [isDark]);

  useEffect(() => {
    fetchEnrollments();
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // ---------------- Helpers ----------------
  const authHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const getLastPayment = (en) => {
    const payments = en?.payments || [];
    if (!payments.length) return null;
    return [...payments].sort((a,b)=>new Date(b.paymentDate)-new Date(a.paymentDate))[0];
  };

  const serialBase = useMemo(() => (page - 1) * limit, [page, limit]);

  // ---------------- API Calls ----------------
  const fetchSummary = async () => {
    try {
      const res = await fetch('https://api.liteedu.com/api/v1/offline-student-mangement/summary', { headers: { ...authHeaders() } });
      if (!res.ok) return;
      const json = await res.json();
      if (json?.data) setSummary(json.data);
    } catch (err) { console.warn('summary', err); }
  };

  const fetchEnrollments = async () => {
    try {
      setLoading(true); setError(null);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (classFilter) params.append('className', classFilter);
      if (batchFilter) params.append('batchName', batchFilter);
      if (paymentFilter) params.append('paymentStatus', paymentFilter);
      if (monthFilter) params.append('month', monthFilter);
      params.append('page', String(page));
      params.append('limit', String(limit));
      const res = await fetch(`https://api.liteedu.com/api/v1/offline-student-mangement?${params.toString()}`, { headers: { ...authHeaders() } });
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();

      let list = [];
      if (data?.data) list = Array.isArray(data.data) ? data.data : data.data.docs || [];
      setEnrollments(attachMonthTo(list));
      setTotalPages(data?.data?.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch');
    } finally { setLoading(false); }
  };

  // ---------------- CRUD ----------------
  const openCreate = () => { setForm(emptyForm); setIsCreateOpen(true); };
  const createEnrollment = async (ev) => {
    ev.preventDefault();
    if (!form.studentName.trim() || !form.phone.trim() || !form.className.trim()) return alert('Required fields missing');
    const courseFee = Number(form.courseFee || 0);
    if (isNaN(courseFee) || courseFee < 0) return alert('Invalid course fee');
    try {
      setLoading(true);
      const payload = { ...form, courseFee, enrollmentDate: new Date().toISOString() };
      const res = await fetch('https://api.liteedu.com/api/v1/offline-student-mangement/create-enrollment', { method:'POST', headers:{'Content-Type':'application/json',...authHeaders()}, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Create failed');
      const created = attachMonthTo([ (await res.json()).data || {} ])[0];
      setEnrollments(prev => [created, ...prev]);
      setIsCreateOpen(false); setForm(emptyForm);
      fetchSummary();
      showToast('Enrollment created');
    } catch (err) { console.error(err); alert(err.message || 'Create failed'); }
    finally { setLoading(false); }
  };

  const openEdit = (item) => { setSelected(item); setForm({ ...item }); setIsEditOpen(true); };
  const updateEnrollment = async (ev) => {
    ev.preventDefault();
    if (!selected) return;
    try {
      setLoading(true);
      const res = await fetch(`https://api.liteedu.com/api/v1/offline-student-mangement/${selected._id}`, { method:'PATCH', headers:{'Content-Type':'application/json', ...authHeaders()}, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Update failed');
      const updated = attachMonthTo([ (await res.json()).data || {} ])[0];
      setEnrollments(prev => prev.map(p => p._id === selected._id ? updated : p));
      setIsEditOpen(false); setSelected(null); setForm(emptyForm);
      fetchSummary(); showToast('Enrollment updated');
    } catch (err) { console.error(err); alert(err.message || 'Update failed'); }
    finally { setLoading(false); }
  };

  const deleteEnrollment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enrollment?')) return;
    try {
      setLoading(true);
      const res = await fetch(`https://api.liteedu.com/api/v1/offline-student-mangement/${id}`, { method:'DELETE', headers:{...authHeaders()} });
      if (!res.ok) throw new Error('Delete failed');
      setEnrollments(prev => prev.filter(p => p._id !== id));
      fetchSummary(); showToast('Enrollment deleted');
    } catch (err) { console.error(err); alert(err.message || 'Delete failed'); }
    finally { setLoading(false); }
  };

  // ---------------- Payment ----------------
  const openAddPayment = (item) => {
    setSelected(item);
    setPaymentForm({ amount:'', method:'Cash', transactionId:'', paymentDate: new Date().toISOString().slice(0,16), note:'', invoiceUrl:'', sendSMS:false });
    setIsPaymentOpen(true);
  };

  const submitPayment = async (ev) => {
    ev.preventDefault();
    if (!selected) return;
    const amount = Number(paymentForm.amount);
    if (isNaN(amount) || amount <= 0) return alert('Enter a valid payment amount');
    try {
      setLoading(true);
      const dt = paymentForm.paymentDate.length === 16 ? new Date(paymentForm.paymentDate).toISOString() : paymentForm.paymentDate || new Date().toISOString();
      const payload = { enrollmentId: selected._id, payment: { ...paymentForm, amount, paymentDate: dt }, autoGenerateInvoice: !paymentForm.invoiceUrl, sendSMS: !!paymentForm.sendSMS };
      const res = await fetch('http://localhost:8000/api/v1/offline-student-mangement/add-payment', { method:'POST', headers:{'Content-Type':'application/json', ...authHeaders()}, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Payment failed');
      const updated = attachMonthTo([ (await res.json()).data || {} ])[0];
      setEnrollments(prev => prev.map(p => p._id === updated._id ? updated : p));
      setIsPaymentOpen(false); setSelected(null);
      fetchSummary(); showToast('Payment saved');
      openInvoice({ enrollment: updated, payment: getLastPayment(updated) || payload.payment });
    } catch (err) { console.error(err); alert(err.message || 'Payment failed'); }
    finally { setLoading(false); }
  };

  // ---------------- Invoice ----------------
  const openInvoice = ({ enrollment, payment }) => { setInvoiceData({ enrollment, payment }); setIsInvoiceOpen(true); };
  const closeInvoice = () => { setIsInvoiceOpen(false); setInvoiceData(null); };
  const printInvoice = () => {
    const printContents = invoiceContentRef.current?.innerHTML;
    if (!printContents) return;
    const w = window.open('', '_blank', 'width=900,height=1200');
    if (!w) return;
    w.document.open();
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Invoice</title><style>body{font-family:ui-sans-serif,system-ui; margin:0;padding:24px}.card{max-width:800px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;padding:24px}.muted{color:#6b7280;font-size:12px}.row{display:flex;justify-content:space-between;gap:16px}.h{font-size:24px;font-weight:700}table{width:100%;border-collapse:collapse;margin-top:16px}th,td{border-bottom:1px solid #e5e7eb;text-align:left;padding:8px}.right{text-align:right}</style></head><body onload="window.print(); setTimeout(()=>window.close(),300)">${printContents}</body></html>`);
    w.document.close();
  };

  // ---------------- Options ----------------
  const classOptions = useMemo(() => Array.from(new Set(enrollments.map(e => e.className).filter(Boolean))).sort(), [enrollments]);
  const batchOptions = useMemo(() => Array.from(new Set(enrollments.map(e => e.batchName).filter(Boolean))).sort(), [enrollments]);
  const monthOptions = useMemo(() => Array.from(new Set(enrollments.map(e => e.month).filter(Boolean))).sort((a,b)=>new Date(a)-new Date(b)), [enrollments]);

  const progressPercent = summary.totalFee ? Math.round((summary.totalCollection / summary.totalFee) * 100) : 0;
  const applyFilters = () => { setPage(1); fetchEnrollments(); fetchSummary(); };

  // ---------------- Render ----------------
  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="mx-auto">

        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold leading-tight">Offline Enrollment Management</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Manage offline students, payments and financial summary</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to={"/classes"}className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-500">Class List</Link>
            <Link to={"/batchs"}className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-500">Batch List</Link>
            <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ New Enrollment</button>
            <button onClick={()=>{ setPage(1); fetchEnrollments(); fetchSummary(); }} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Refresh</button>
          </div>
        </header>

        {/* Summary */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Total Collection */}
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded p-4 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
              <svg className="w-6 h-6 text-green-600 dark:text-green-300" viewBox="0 0 24 24" fill="none"><path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Total Collection</div>
              <div className="text-2xl font-semibold">{currency(summary.totalCollection)}</div>
            </div>
          </div>

          {/* Total Fee */}
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded p-4 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-300" viewBox="0 0 24 24" fill="none"><path d="M3 3h18v4H3zM3 11h18v10H3z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Total Fee</div>
              <div className="text-2xl font-semibold">{currency(summary.totalFee)}</div>
            </div>
          </div>

          {/* Outstanding & Progress */}
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-300">Outstanding</div>
                <div className="text-2xl font-semibold text-red-600 dark:text-red-400">{currency(summary.outstandingBalance)}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-300">Enrollments</div>
                <div className="text-xl font-medium">{summary.count}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded h-2 overflow-hidden">
                <div className="h-2 bg-green-500 dark:bg-green-400" style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }} />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-300 mt-1">Collected {progressPercent}% of total fee</div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <Filters 
          search={search} setSearch={setSearch} 
          classFilter={classFilter} setClassFilter={setClassFilter} 
          batchFilter={batchFilter} setBatchFilter={setBatchFilter} 
          paymentFilter={paymentFilter} setPaymentFilter={setPaymentFilter} 
          classOptions={classOptions} batchOptions={batchOptions} 
          monthFilter={monthFilter} setMonthFilter={setMonthFilter}
          monthOptions={monthOptions}
          apply={applyFilters}
        />

        {/* Table */}
        <EnrollmentTable 
          enrollments={enrollments} 
          loading={loading} 
          serialBase={serialBase} 
          openEdit={openEdit} 
          openAddPayment={openAddPayment} 
          openInvoice={openInvoice} 
          deleteEnrollment={deleteEnrollment} 
        />

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">Showing {enrollments.length} of {summary.count} enrollments</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1,p-1))} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded">Prev</button>
            <div className="px-3 py-1">{page} / {totalPages}</div>
            <button onClick={() => setPage(p => p+1)} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded">Next</button>
          </div>
        </div>

        {/* Modals */}
        <CreateModal isOpen={isCreateOpen} onClose={()=>setIsCreateOpen(false)} form={form} setForm={setForm} onCreate={createEnrollment} loading={loading} />
        <EditModal isOpen={isEditOpen} onClose={()=>{ setIsEditOpen(false); setSelected(null); setForm(emptyForm); }} form={form} setForm={setForm} onUpdate={updateEnrollment} loading={loading} />
        <PaymentModal isOpen={isPaymentOpen} selected={selected} paymentForm={paymentForm} setPaymentForm={setPaymentForm} submitPayment={submitPayment} onClose={()=>{ setIsPaymentOpen(false); setSelected(null); }} />
        <InvoiceModal isOpen={isInvoiceOpen} invoiceData={invoiceData} onClose={closeInvoice} printInvoice={printInvoice} invoiceContentRef={invoiceContentRef} />

        {/* Toast */}
        {toast && <div className="fixed right-4 bottom-6 z-50 bg-black text-white px-4 py-2 rounded shadow">{toast}</div>}

      </div>
    </div>
  );
}
