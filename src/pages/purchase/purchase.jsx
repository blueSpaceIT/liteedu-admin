import { useMemo, useState, useEffect } from "react";
import ProductRow from "../../components/purchase/productrow";
import { useGetPurchaseQuery } from "../../redux/features/api/purchase/purchaseApi";
import Pagination from "../../components/pagination";

export default function Purchase() {
  const { data, isLoading, isError } = useGetPurchaseQuery();

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 7;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const purchase = useMemo(() => (data?.data ? data.data : []), [data]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, paymentStatusFilter, paymentMethodFilter, courseFilter, fromDate, toDate]);

  const filteredPurchases = useMemo(() => {
    if (!purchase || !purchase.length) return [];

    const s = searchTerm.trim().toLowerCase();
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    return purchase.filter((p) => {
      if (s) {
        const studentName = p.studentId?.name?.toLowerCase() || "";
        const studentPhone = p.studentId?.phone?.toLowerCase() || "";
        const courseTitle = p.courseId?.course_title?.toLowerCase() || "";
        const tx = p.paymentInfo?.transactionId?.toLowerCase() || "";
        if (!(
          studentName.includes(s) ||
          studentPhone.includes(s) ||
          courseTitle.includes(s) ||
          tx.includes(s)
        ))
          return false;
      }

      if (courseFilter) {
        const title = p.courseId?.course_title || "";
        if (title !== courseFilter) return false;
      }

      if (statusFilter && (p.status || "").toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (paymentStatusFilter && (p.paymentStatus || "").toLowerCase() !== paymentStatusFilter.toLowerCase()) return false;
      if (paymentMethodFilter && (p.paymentInfo?.method || "").toLowerCase() !== paymentMethodFilter.toLowerCase()) return false;

      if (from || to) {
        const created = p.createdAt ? new Date(p.createdAt) : null;
        if (!created) return false;
        if (from && created < from) return false;
        if (to) {
          const toEnd = new Date(to);
          toEnd.setHours(23, 59, 59, 999);
          if (created > toEnd) return false;
        }
      }
      return true;
    });
  }, [purchase, searchTerm, statusFilter, paymentStatusFilter, paymentMethodFilter, courseFilter, fromDate, toDate]);

  const paginatedPurchases = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filteredPurchases.slice(start, start + limit);
  }, [filteredPurchases, currentPage, limit]);

  const totalPages = Math.max(Math.ceil(filteredPurchases.length / limit), 1);

  const distinctStatuses = useMemo(() => Array.from(new Set(purchase.map((p) => p.status).filter(Boolean))), [purchase]);
  const distinctPaymentStatuses = useMemo(() => Array.from(new Set(purchase.map((p) => p.paymentStatus).filter(Boolean))), [purchase]);
  const distinctPaymentMethods = useMemo(() => Array.from(new Set(purchase.map((p) => p.paymentInfo?.method).filter(Boolean))), [purchase]);
  const distinctCourses = useMemo(() => Array.from(new Set(purchase.map((p) => p.courseId?.course_title).filter(Boolean))), [purchase]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setPaymentStatusFilter("");
    setPaymentMethodFilter("");
    setCourseFilter("");
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Purchase Details</h1>

        <div className="flex w-full max-w-4xl flex-col gap-2 sm:flex-row sm:items-center">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student, phone, course, transaction id..."
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <option value="">All Courses</option>
            {distinctCourses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <option value="">All Statuses</option>
            {distinctStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
{/* 
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <option value="">All Payment Status</option>
            {distinctPaymentStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select> */}

          <select
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <option value="">All Payment Methods</option>
            {distinctPaymentMethods.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="mt-3 flex items-center gap-2 sm:mt-0">
          <div className="flex items-center gap-2">
            <label className="text-sm">From:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">To:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          <button
            onClick={clearFilters}
            className="ml-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm px-3 py-1 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="relative w-full max-w-full overflow-x-auto overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm [scrollbar-width:_thin]">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
          </div>
        ) : isError ? (
          <div className="flex h-[500px] items-center justify-center">
            <p className="text-center text-lg font-medium text-gray-500 dark:text-gray-400">Something went wrong! Please try again 😢</p>
          </div>
        ) : !filteredPurchases.length ? (
          <div className="flex h-[500px] items-center justify-center">
            <p className="text-xl text-gray-500 dark:text-gray-400">No purchases found.</p>
          </div>
        ) : (
          <>
            <table className="hidden w-full table-auto border text-sm sm:table">
              <thead className="bg-gray-200 dark:bg-gray-700 text-left">
                <tr className="border-b border-gray-300 dark:border-gray-600">
                  <th className="px-5 py-3">#</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Payment Info</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {paginatedPurchases.map((product) => (
                  <ProductRow key={product._id} product={product} />
                ))}
              </tbody>
            </table>

            <div className="divide-y divide-gray-200 dark:divide-gray-700 sm:hidden">
              {paginatedPurchases.map((product) => (
                <ProductRow key={product._id} product={product} isMobile />
              ))}
            </div>
          </>
        )}
      </div>

      {!isLoading && filteredPurchases.length > 0 && (
        <div className="mt-4 flex flex-col justify-end gap-1">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          <p className="text-sm text-gray-500 dark:text-gray-400">Page {currentPage} of {totalPages}</p>
        </div>
      )}
    </div>
  );
}
