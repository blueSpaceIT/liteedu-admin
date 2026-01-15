import { useMemo, useState, useEffect } from "react";
import UserTable from "../../components/user/userTable";
import { useUsergetAllQuery } from "../../redux/features/api/user/userApi";
import Pagination from "../../components/pagination";

const User = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(11);

    const { data, isLoading, isError } = useUsergetAllQuery({ page, limit });

    const users = useMemo(() => (data?.data ? data.data : []), [data]);

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [searchTerm, roleFilter, statusFilter, fromDate, toDate]);

    // distinct dropdown values
    const distinctRoles = useMemo(() => Array.from(new Set(users.map((u) => u.role).filter(Boolean))), [users]);
    const distinctStatuses = useMemo(() => Array.from(new Set(users.map((u) => u.status).filter(Boolean))), [users]);

    // Apply client-side filtering
    const filteredUsers = useMemo(() => {
        if (!users || !users.length) return [];

        const s = searchTerm.trim().toLowerCase();
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        return users.filter((u) => {
            if (s) {
                const name = (u.name || "").toLowerCase();
                const phone = (u.phone || "").toLowerCase();
                const email = (u.email || "").toLowerCase();
                if (!(name.includes(s) || phone.includes(s) || email.includes(s))) return false;
            }

            if (roleFilter && (u.role || "") !== roleFilter) return false;
            if (statusFilter && (u.status || "") !== statusFilter) return false;

            if (from || to) {
                const created = u.createdAt ? new Date(u.createdAt) : null;
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
    }, [users, searchTerm, roleFilter, statusFilter, fromDate, toDate]);

    // Pagination based on filteredUsers
    const totalPages = useMemo(() => Math.max(Math.ceil(filteredUsers.length / limit), 1), [filteredUsers.length, limit]);

    const paginatedUsers = useMemo(() => {
        const start = (page - 1) * limit;
        return filteredUsers.slice(start, start + limit);
    }, [filteredUsers, page, limit]);

    const handlePageChange = (newPage) => {
        if (newPage < 1) return;
        if (newPage > totalPages) return;
        setPage(newPage);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setRoleFilter("");
        setStatusFilter("");
        setFromDate("");
        setToDate("");
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-200">
            <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">User List</h2>

            {/* Filters */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full max-w-4xl gap-2 items-center">
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, phone or email..."
                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />

                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm shadow-sm"
                    >
                        <option value="">All Roles</option>
                        {distinctRoles.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm shadow-sm"
                    >
                        <option value="">All Status</option>
                        {distinctStatuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700 dark:text-gray-300">From:</label>
                        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-sm" />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700 dark:text-gray-300">To:</label>
                        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-sm" />
                    </div>

                    <button onClick={clearFilters} className="ml-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm px-3 py-1 transition-colors">Clear</button>
                </div>
            </div>

            {/* Loader / No Data / Table */}
            {isLoading ? (
                <div className="flex items-center justify-center py-10">
                    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
                </div>
            ) : isError ? (
                <div className="flex items-center justify-center py-20 text-gray-500">Failed to load users.</div>
            ) : filteredUsers.length === 0 ? (
                <div className="flex items-center justify-center py-20 text-lg font-semibold text-gray-500">No User Found 😔</div>
            ) : (
                <UserTable
                    users={paginatedUsers}
                    page={page}
                    limit={limit}
                />
            )}

            {/* Pagination */}
            {filteredUsers.length > 0 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );

    
};

export default User;
