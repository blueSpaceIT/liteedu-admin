import { useMemo, useState, useEffect } from "react";

import TeacherCreateModal from "../../components/teachers/teacherCreateModal";
import TeacherEditModal from "../../components/teachers/teacherEditModal";
import TeacherDeleteModal from "../../components/teachers/teacherDeleteModal";
import TeacherTable from "../../components/teachers/teachersTable";
import { useGetFacultyQuery } from "../../redux/features/api/faculty/facultyApi";

const Teachers = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);

    const { data, isLoading, isError } = useGetFacultyQuery({ page: currentPage, limit });

    const teachers = useMemo(() => data?.data || [], [data]);

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [genderFilter, setGenderFilter] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, genderFilter, departmentFilter, fromDate, toDate]);

    // Distinct dropdown values
    const distinctStatuses = useMemo(() => Array.from(new Set(teachers.map((t) => t.status).filter(Boolean))), [teachers]);
    const distinctGenders = useMemo(() => Array.from(new Set(teachers.map((t) => t.gender).filter(Boolean))), [teachers]);
    const distinctDepartments = useMemo(() => Array.from(new Set(teachers.map((t) => t.department).filter(Boolean))).filter(Boolean), [teachers]);

    const filteredTeachers = useMemo(() => {
        if (!teachers || !teachers.length) return [];

        const s = searchTerm.trim().toLowerCase();
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        return teachers.filter((t) => {
            if (s) {
                const name = (t.name || "").toLowerCase();
                const phone = (t.phone || "").toLowerCase();
                const email = (t.email || "").toLowerCase();
                if (!(name.includes(s) || phone.includes(s) || email.includes(s))) return false;
            }

            if (statusFilter && (t.status || "") !== statusFilter) return false;
            if (genderFilter && (t.gender || "") !== genderFilter) return false;
            if (departmentFilter && (t.department || "") !== departmentFilter) return false;

            if (from || to) {
                const created = t.createdAt ? new Date(t.createdAt) : null;
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
    }, [teachers, searchTerm, statusFilter, genderFilter, departmentFilter, fromDate, toDate]);

    const totalPages = useMemo(() => Math.max(Math.ceil(filteredTeachers.length / limit), 1), [filteredTeachers.length, limit]);

    const paginatedTeachers = useMemo(() => {
        const start = (currentPage - 1) * limit;
        return filteredTeachers.slice(start, start + limit);
    }, [filteredTeachers, currentPage, limit]);

    const handlePageChange = (newPage) => {
        if (newPage < 1) return;
        if (newPage > totalPages) return;
        setCurrentPage(newPage);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("");
        setGenderFilter("");
        setDepartmentFilter("");
        setFromDate("");
        setToDate("");
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold dark:text-white">Teacher List</h1>

                <div className="flex w-full max-w-4xl gap-2 items-center">
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, phone or email..."
                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />

                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm shadow-sm">
                        <option value="">All Status</option>
                        {distinctStatuses.map((st) => (
                            <option key={st} value={st}>{st}</option>
                        ))}
                    </select>

                    <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm shadow-sm">
                        <option value="">All Gender</option>
                        {distinctGenders.map((g) => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>

                    <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm shadow-sm">
                        <option value="">All Departments</option>
                        {distinctDepartments.map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>

                    <button onClick={() => setIsCreateOpen(true)} className="transform rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white shadow transition-all hover:bg-blue-600">Create</button>
                </div>
            </div>

            {/* Date filters + clear */}
            <div className="mb-4 flex items-center gap-3">
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

            {/* Table / Loader / No Data */}
            {isLoading ? (
                <div className="flex items-center justify-center py-10">
                    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
                </div>
            ) : isError ? (
                <div className="flex items-center justify-center py-10 text-gray-500">Failed to load teachers.</div>
            ) : filteredTeachers.length === 0 ? (
                <div className="flex items-center justify-center py-[20%] text-xl text-gray-500">No Teacher Found 😔</div>
            ) : (
                <>
                    <TeacherTable
                        teachers={paginatedTeachers}
                        onEdit={(teacher) => { setSelectedTeacher(teacher); setIsEditOpen(true); }}
                        onDelete={(teacher) => { setSelectedTeacher(teacher); setIsDeleteOpen(true); }}
                        isLoading={isLoading}
                    />

                    {/* Pagination */}
                    <div className="mt-4 flex items-center justify-end gap-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Page {currentPage} of {totalPages}</p>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handlePageChange(currentPage - 1)} className="rounded px-3 py-1 bg-gray-100 dark:bg-gray-800">Prev</button>
                            <button onClick={() => handlePageChange(currentPage + 1)} className="rounded px-3 py-1 bg-gray-100 dark:bg-gray-800">Next</button>
                        </div>
                    </div>
                </>
            )}

            {/* Modals */}
            <TeacherCreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
            <TeacherEditModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} teacher={selectedTeacher} />
            <TeacherDeleteModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} teacher={selectedTeacher} />
        </div>
    );

};

export default Teachers;
