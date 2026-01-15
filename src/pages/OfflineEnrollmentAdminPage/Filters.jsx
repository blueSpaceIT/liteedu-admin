/* eslint-disable react/prop-types */
export function Filters({
  search,
  setSearch,
  classFilter,
  setClassFilter,
  batchFilter,
  setBatchFilter,
  paymentFilter,
  setPaymentFilter,
  monthFilter,
  setMonthFilter,
  classOptions,
  batchOptions,
  apply,
}) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
      
      {/* Search */}
      <input
        className="border p-2 rounded bg-transparent dark:bg-gray-900 border-gray-200 dark:border-gray-700"
        placeholder="Search by name or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') apply(); }}
      />

      {/* Class Filter */}
      <select
        className="border p-2 rounded bg-transparent dark:bg-gray-900 border-gray-200 dark:border-gray-700"
        value={classFilter}
        onChange={(e) => setClassFilter(e.target.value)}
      >
        <option value="">All Classes</option>
        {classOptions.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      {/* Batch Filter */}
      <select
        className="border p-2 rounded bg-transparent dark:bg-gray-900 border-gray-200 dark:border-gray-700"
        value={batchFilter}
        onChange={(e) => setBatchFilter(e.target.value)}
      >
        <option value="">All Batches</option>
        {batchOptions.map((b) => <option key={b} value={b}>{b}</option>)}
      </select>

      {/* Payment Filter */}
      <select
        className="border p-2 rounded bg-transparent dark:bg-gray-900 border-gray-200 dark:border-gray-700"
        value={paymentFilter}
        onChange={(e) => setPaymentFilter(e.target.value)}
      >
        <option value="">All Payment Status</option>
        <option value="Paid">Paid</option>
        <option value="Partial">Partial</option>
        <option value="Due">Due</option>
      </select>

      {/* Month Filter */}
      <select
        className="border p-2 rounded bg-transparent dark:bg-gray-900 border-gray-200 dark:border-gray-700"
        value={monthFilter}
        onChange={(e) => setMonthFilter(e.target.value)}
      >
        <option value="">All Months</option>
        {months.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>

      {/* Buttons */}
      <div className="md:col-span-5 flex gap-2 mt-2 justify-end">
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded"
          onClick={() => apply(false)}
        >
          Apply
        </button>
        <button
          className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded"
          onClick={() => {
            setSearch('');
            setClassFilter('');
            setBatchFilter('');
            setPaymentFilter('');
            setMonthFilter('');
            apply(true);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
