import { useMemo, useState, useEffect } from "react";
import AdminTable from "../../components/admins/adminTable";
import Pagination from "../../components/pagination";
import AdminCreateModal from "../../components/admins/adminCreateModal";
import EditAdminModal from "../../components/admins/adminEditModal";
import AdminDeleteModal from "../../components/admins/adminDeleteModal";
import { useAdmingetAllQuery } from "../../redux/features/api/Admin/adminApi";

const Admins = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    // server page (used to fetch data)
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);

    const { data, isLoading, isError } = useAdmingetAllQuery({ page: currentPage, limit });

    const admins = useMemo(() => (Array.isArray(data?.data) ? data.data : []), [data]);

    // --- Filters / Search / Client-side pagination over fetched page ---
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // reset local page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, roleFilter, fromDate, toDate]);

    // distinct values
    const distinctStatuses = useMemo(() => Array.from(new Set(admins.map((a) => a.status).filter(Boolean))), [admins]);
    const distinctRoles = useMemo(() => Array.from(new Set(admins.map((a) => a.role).filter(Boolean))), [admins]);

    const filteredAdmins = useMemo(() => {
        if (!admins || !admins.length) return [];

        const s = searchTerm.trim().toLowerCase();
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        return admins.filter((adm) => {
            if (s) {
                const name = (adm.name || "").toLowerCase();
                const phone = (adm.phone || "").toLowerCase();
                const email = (adm.email || "").toLowerCase();
                if (!(name.includes(s) || phone.includes(s) || email.includes(s))) return false;
            }

            if (statusFilter && (adm.status || "") !== statusFilter) return false;
            if (roleFilter && (adm.role || "") !== roleFilter) return false;

            if (from || to) {
                const created = adm.createdAt ? new Date(adm.createdAt) : null;
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
    }, [admins, searchTerm, statusFilter, roleFilter, fromDate, toDate]);

    // client-side pagination for filtered results
    const totalPages = useMemo(() => Math.max(Math.ceil(filteredAdmins.length / limit) || 1, 1), [filteredAdmins.length, limit]);

    const paginatedAdmins = useMemo(() => {
        const start = (currentPage - 1) * limit;
        return filteredAdmins.slice(start, start + limit);
    }, [filteredAdmins, currentPage, limit]);

    const handlePageChange = (newPage) => {
        if (newPage < 1) return;
        if (newPage > totalPages) return;
        setCurrentPage(newPage);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("");
        setRoleFilter("");
        setFromDate("");
        setToDate("");
    };

    return (
        <div className="p-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold dark:text-white">Admins</h1>

                <div className="flex w-full max-w-3xl items-center gap-2">
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search name, phone or email..."
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-blue-400"
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-800"
                    >
                        <option value="">All Status</option>
                        {distinctStatuses.map((st) => (
                            <option
                                key={st}
                                value={st}
                            >
                                {st}
                            </option>
                        ))}
                    </select>

                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-800"
                    >
                        <option value="">All Roles</option>
                        {distinctRoles.map((r) => (
                            <option
                                key={r}
                                value={r}
                            >
                                {r}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white shadow hover:bg-blue-600"
                    >
                        Create
                    </button>
                </div>
            </div>

            <div className="mb-4 flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <label className="text-sm">From:</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm">To:</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800"
                    />
                </div>

                <button
                    onClick={clearFilters}
                    className="ml-2 rounded-md bg-gray-200 px-3 py-1 text-sm transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                    Clear
                </button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-10">
                    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
                </div>
            ) : isError ? (
                <div className="flex items-center justify-center py-10 text-gray-500">Failed to load admins.</div>
            ) : filteredAdmins.length === 0 ? (
                <div className="flex items-center justify-center py-80 text-lg font-semibold text-gray-500">No Admin Found 😔</div>
            ) : (
                <>
                    <AdminTable
                        admins={paginatedAdmins}
                        onEdit={(admin) => {
                            setSelectedAdmin(admin);
                            setIsEditOpen(true);
                        }}
                        onDelete={(admin) => {
                            setSelectedAdmin(admin);
                            setIsDeleteOpen(true);
                        }}
                    />

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}

            <AdminCreateModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />
            <EditAdminModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                admin={selectedAdmin}
            />
            <AdminDeleteModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                admin={selectedAdmin}
            />
        </div>
    );
};

export default Admins;
