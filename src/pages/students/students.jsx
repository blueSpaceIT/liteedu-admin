import { useMemo, useState, useEffect } from "react";
import StudentTable from "../../components/students/studentTable";
import { useStudentgetAllQuery } from "../../redux/features/api/student/studentApi";
import Pagination from "../../components/pagination";

const Students = () => {
    // Server query (keeps existing behaviour)
    const [page, setPage] = useState(1);
    const [limit] = useState(20);

    const { data, isLoading } = useStudentgetAllQuery({ page, limit });

    // base students array from server
    const students = useMemo(() => (data?.data ? data.data : []), [data]);

    // --- Filters / Search ---
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState(""); // Active / Inactive etc.
    const [roleFilter, setRoleFilter] = useState(""); // student / admin / superAdmin
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // Reset to page 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [searchTerm, statusFilter, roleFilter, fromDate, toDate]);

    // distinct values for selects
    const distinctStatuses = useMemo(() => Array.from(new Set(students.map((s) => s.status).filter(Boolean))), [students]);
    const distinctRoles = useMemo(() => Array.from(new Set(students.map((s) => s.role).filter(Boolean))), [students]);

    // apply client-side filtering (works well when server returns enough items)
    const filteredStudents = useMemo(() => {
        if (!students || !students.length) return [];

        const s = searchTerm.trim().toLowerCase();
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        return students.filter((stu) => {
            // Search by name, phone, email
            if (s) {
                const name = (stu.name || "").toLowerCase();
                const phone = (stu.phone || "").toLowerCase();
                const email = (stu.email || "").toLowerCase();
                if (!(name.includes(s) || phone.includes(s) || email.includes(s))) return false;
            }

            if (statusFilter && (stu.status || "") !== statusFilter) return false;
            if (roleFilter && (stu.role || "") !== roleFilter) return false;

            if (from || to) {
                const created = stu.createdAt ? new Date(stu.createdAt) : null;
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
    }, [students, searchTerm, statusFilter, roleFilter, fromDate, toDate]);

    // Pagination based on filtered results
    const totalPages = useMemo(() => Math.max(Math.ceil(filteredStudents.length / limit), 1), [filteredStudents.length, limit]);

    const paginatedStudents = useMemo(() => {
        const start = (page - 1) * limit;
        return filteredStudents.slice(start, start + limit);
    }, [filteredStudents, page, limit]);

    const handlePageChange = (newPage) => {
        if (newPage < 1) return;
        if (newPage > totalPages) return;
        setPage(newPage);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("");
        setRoleFilter("");
        setFromDate("");
        setToDate("");
    };

    return (
        <div className="p-4">
            <h1 className="mb-4 text-2xl font-bold dark:text-white">Students</h1>

            {/* Filters */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full max-w-3xl gap-2 items-center">
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, phone or email..."
                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm shadow-sm"
                    >
                        <option value="">All Status</option>
                        {distinctStatuses.map((st) => (
                            <option key={st} value={st}>{st}</option>
                        ))}
                    </select>

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
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <label className="text-sm">From:</label>
                        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-sm" />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm">To:</label>
                        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-sm" />
                    </div>

                    <button onClick={clearFilters} className="ml-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm px-3 py-1 transition-colors">Clear</button>
                </div>
            </div>

            {/* Loader / No Data / Table */}
            {isLoading ? (
                <div className="flex items-center justify-center py-10">
                    <div className="w-12 h-12 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                </div>
            ) : filteredStudents.length === 0 ? (
                <div className="flex items-center justify-center text-lg font-semibold text-gray-500 py-20">No Student Found 😔</div>
            ) : (
                <StudentTable
                    students={paginatedStudents}
                    page={page}
                    limit={limit}
                />
            )}

            {/* Pagination */}
            {filteredStudents.length > 0 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default Students;
