/* eslint-disable react/prop-types */
export default function MCQPagination({ page, setPage, totalPages }) {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <button
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
        disabled={page === 1}
        className="px-3 py-1 bg-slate-200 rounded disabled:opacity-50"
      >
        Prev
      </button>
      <span className="px-3 py-1">{page} / {totalPages}</span>
      <button
        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        disabled={page === totalPages}
        className="px-3 py-1 bg-slate-200 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
