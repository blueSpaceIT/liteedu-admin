import { useEffect, useMemo, useState } from "react";
import SubcategoryForm from "./SubcategoryForm";
import { Search, Filter, Plus, Edit3, Trash2, Loader2, GitBranch, AlertTriangle, Hash, Calendar } from "lucide-react";

export default function SubcategoryTable() {
    const [rows, setRows] = useState([]);
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    // parentFilter will now hold the parent's unique ID string, not the title
    const [parentFilter, setParentFilter] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    // --- Data Loading Functions ---

    async function loadRows() {
        setLoading(true);
        try {
            const res = await fetch("https://api.liteedu.com/api/v1/sub-category/");
            const json = await res.json();
            setRows(json?.data || []);
            // eslint-disable-next-line no-unused-vars
        } catch (e) {
            setRows([]);
        } finally {
            setLoading(false);
        }
    }

    async function loadParents() {
        try {
            const res = await fetch("https://api.liteedu.com/api/v1/courseCategory");
            const json = await res.json();
            setParents(json?.data || []);
            // eslint-disable-next-line no-unused-vars
        } catch (e) {
            setParents([]);
        }
    }

    useEffect(() => {
        loadRows();
        loadParents();
    }, []);

    // --- Filtering Logic ---

    const filtered = useMemo(() => {
        const s = (search || "").toLowerCase().trim();
        return rows.filter((r) => {
            // Get the unique ID of the parent from the row data
            const rowParentId = r.parentId?._id || "";
            // Get the title for text search compatibility
            const parentTitle = r.parentId?.title ? String(r.parentId.title).toLowerCase() : "";

            // **FIXED LOGIC: Filter by Parent ID for exact match**
            if (parentFilter) {
                // If a filter is selected, the row's parent ID must exactly match the filter ID
                if (rowParentId !== parentFilter) return false;
            }

            // Search by Name, Slug, or Parent Title using the main search term
            if (!s) return true;
            const name = (r.name || "").toLowerCase();
            const slug = (r.slug || "").toLowerCase();
            return name.includes(s) || slug.includes(s) || parentTitle.includes(s);
        });
    }, [rows, search, parentFilter]);

    // --- CRUD Handlers (Omitted for brevity, they are correct) ---
    // ...

    function openAdd() {
        setEditing(null);
        setModalOpen(true);
    }

    function openEdit(row) {
        setEditing(row);
        setModalOpen(true);
    }

    function confirmDelete(row) {
        setDeleteTarget(row);
    }

    async function doDelete() {
        if (!deleteTarget) return;
        setActionLoading(true);
        try {
            const res = await fetch(`https://api.liteedu.com/api/v1/sub-category/${deleteTarget._id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                await loadRows();
                setDeleteTarget(null);
            }
            // eslint-disable-next-line no-unused-vars, no-empty
        } catch (e) {
        } finally {
            setActionLoading(false);
        }
    }

    function onSaved() {
        loadRows();
        setModalOpen(false); // Close form after successful save/update
    }

    // --- Rendering ---

    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800 ">
            <GitBranch className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-3" />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Subcategories Found</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search filters or add a new subcategory.</p>
        </div>
    );


    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
                <GitBranch className="h-8 w-8 text-indigo-500" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sub Categories</h1>
            </div>

            {/* Controls Bar */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded bg-gray-50 dark:bg-gray-900 shadow-inner">

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-4xl">
                    <div className="relative w-full sm:w-2/3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name, slug, or parent..."
                            className="w-full border rounded pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition"
                        />
                    </div>

                    <div className="relative w-full sm:w-1/3">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        <label className="sr-only">Filter by parent</label>
                        <select
                            value={parentFilter}
                            onChange={(e) => setParentFilter(e.target.value)}
                            className="w-full border rounded pl-10 pr-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition"
                        >
                            <option value="">All Categories</option>
                            {/* **FIX HERE: Use p._id for the value** */}
                            {parents.map((p) => (
                                <option key={p._id} value={p._id}>
                                    {p.title} {p.year ? `(${p.year})` : ""}
                                </option>
                            ))}
                        </select>
                        {/* Custom arrow for select box */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Add Button */}
                <div>
                    <button
                        onClick={openAdd}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    >
                        <Plus className="h-5 w-5" />
                        Add Subcategory
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex items-center justify-center py-10 bg-white dark:bg-gray-800 rounded shadow-lg mt-4">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
                </div>
            ) : (
                <>
                    {/* Unique Desktop Table (hidden on mobile) */}
                    <div className="hidden lg:block overflow-x-auto rounded shadow-xl border border-gray-100 dark:border-gray-700/50">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-indigo-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider rounded-tl-xl">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider">Slug</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider">Parent Category</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider">Created Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider rounded-tr-xl">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                                {filtered.map((r, index) => (
                                    <tr
                                        key={r._id}
                                        // Unique Stripe/Elevation look
                                        className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'} hover:shadow-md transition duration-150`}
                                    >
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">{r.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{r.slug}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className="inline-flex items-center rounded-md bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300">
                                                {r.parentId?.title || "N/A"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openEdit(r)}
                                                    title="Edit Subcategory"
                                                    className="p-2 rounded-full border border-gray-300 dark:border-gray-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-gray-700 transition"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(r)}
                                                    title="Delete Subcategory"
                                                    className="p-2 rounded-full border border-gray-300 dark:border-gray-700 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-0">
                                            <EmptyState />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>


                    {/* Unique Mobile Card View (shown only on mobile/tablet) */}
                    <div className="lg:hidden grid gap-4">
                        {filtered.length > 0 ? (
                            filtered.map((r) => (
                                <div key={r._id} className="bg-white dark:bg-gray-800 rounded p-4 shadow-lg border border-gray-100 dark:border-gray-700/50 hover:shadow-xl transition">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                            {r.name}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openEdit(r)}
                                                title="Edit"
                                                className="p-2 rounded-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-gray-700 transition"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(r)}
                                                title="Delete"
                                                className="p-2 rounded-full text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                        <p className="flex items-center gap-2">
                                            <GitBranch className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                                            <span className="font-semibold text-gray-800 dark:text-gray-100">Parent:</span>
                                            <span className="inline-flex items-center rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300">
                                                {r.parentId?.title || "N/A"}
                                            </span>
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Hash className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                            <span className="font-semibold text-gray-800 dark:text-gray-100">Slug:</span> {r.slug}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                            <span className="font-semibold text-gray-800 dark:text-gray-100">Created:</span> {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "N/A"}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="mt-4">
                                <EmptyState />
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Subcategory Form Modal (passing parents for form use) */}
            {modalOpen && <SubcategoryForm initialData={editing} onClose={() => setModalOpen(false)} onSaved={onSaved} parents={parents} />}

            {/* Delete Confirmation Modal (Omitted for brevity, it is correct) */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteTarget(null)}></div>
                    <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 transform transition-all">
                        <div className="flex items-start gap-4">
                            <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Confirm Deletion</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Are you absolutely sure you want to delete the subcategory:
                                    <span className="font-semibold text-red-600 dark:text-red-400 block mt-1">{deleteTarget.name}</span>
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={doDelete}
                                disabled={actionLoading}
                                className="flex items-center gap-1 px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 disabled:bg-red-400 transition"
                            >
                                {actionLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                                {actionLoading ? "Deleting..." : "Delete Permanently"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}