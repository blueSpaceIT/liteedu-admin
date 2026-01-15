import { useMemo, useState } from "react";
import CourseForm from "../../components/course/courseCreateModal";
import CourseList from "../../components/course/courseList";
import CourseEditModal from "../../components/course/courseUpdateModal";
import useFormSubmit from "../../hooks/useFormSubmit";
import { useCreateCourseMutation, useGetAllCourseQuery, useUpdateCourseMutation } from "../../redux/features/api/course/courseApi";
import { useGetAllCourseCategoryQuery } from "../../redux/features/api/courseCategory/courseCategory";
import DashboardWrapper from "../../routes/DashboardWrapper";
import Button from "../../ui/button";

const Course = () => {
    const { handleSubmitForm } = useFormSubmit();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);

    const [searchValue, setSearchValue] = useState("");

    const { data: courseData, isLoading: listLoading, refetch: refetchCourses, isError } = useGetAllCourseQuery();
    // const { data: categoryData } = useGetAllCourseCategoryQuery();
    const { data: categoryData } = useGetAllCourseCategoryQuery();

    const [createCourse, { isLoading: createLoading }] = useCreateCourseMutation();
    const [updateCourse, { isLoading: updateLoading }] = useUpdateCourseMutation();

    // Filters
    const [categoryFilter, setCategoryFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // Memoized courses
    const courses = useMemo(() => (courseData?.data ? courseData.data : []), [courseData]);

    // Distinct derived values
    const distinctCategories = useMemo(() => (categoryData?.data ? categoryData.data : []), [categoryData]);
    const distinctStatuses = useMemo(() => Array.from(new Set(courses.map((c) => c.status).filter(Boolean))), [courses]);

    // Filtered courses based on search + filters
    const filteredCourses = useMemo(() => {
        const lowerSearch = (searchValue || "").toLowerCase().trim();

        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        return courses.filter((course) => {
            // Search by title, prefix, or slug
            if (lowerSearch) {
                const title = (course.course_title || "").toLowerCase();
                const prefix = (course.prefix || "").toLowerCase();
                const slug = (course.slug || "").toLowerCase();
                if (!(title.includes(lowerSearch) || prefix.includes(lowerSearch) || slug.includes(lowerSearch))) return false;
            }

            // Category filter (match category._id or title)
            if (categoryFilter) {
                const catId = course.category?._id || "";
                const catTitle = (course.category?.title || "").toString();
                if (!(catId === categoryFilter || catTitle === categoryFilter)) return false;
            }

            if (statusFilter && (course.status || "") !== statusFilter) return false;

            // Price range
            const price = Number(course.price || 0);
            if (minPrice !== "" && !isNaN(Number(minPrice)) && price < Number(minPrice)) return false;
            if (maxPrice !== "" && !isNaN(Number(maxPrice)) && price > Number(maxPrice)) return false;

            // Date range (createdAt)
            if (from || to) {
                const created = course.createdAt ? new Date(course.createdAt) : null;
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
    }, [courses, searchValue, categoryFilter, statusFilter, minPrice, maxPrice, fromDate, toDate]);

    const handleCreateNew = () => setShowCreateForm(true);
    const handleCloseCreateForm = () => setShowCreateForm(false);
    const handleEditCourse = (course) => setEditingCourse(course);

    const handleSaveCourse = (newCourse) => {
        const formattedData = {
            ...newCourse,
            price: Number(newCourse.price),
            offerPrice: Number(newCourse.offerPrice),
        };
        handleSubmitForm({
            apiCall: createCourse,
            data: formattedData,
            onSuccess: () => {
                setShowCreateForm(false);
                refetchCourses();
            },
        });
    };

    const handleUpdateCourse = (updatedCourse) => {
        const formattedData = {
            ...updatedCourse,
            price: Number(updatedCourse.price),
            offerPrice: Number(updatedCourse.offerPrice),
        };
        handleSubmitForm({
            apiCall: updateCourse,
            data: formattedData,
            params: { slug: editingCourse.slug },
            onSuccess: () => setEditingCourse(null),
        });
    };

    // Clear filters helper
    const clearFilters = () => {
        setCategoryFilter("");
        setStatusFilter("");
        setMinPrice("");
        setMaxPrice("");
        setFromDate("");
        setToDate("");
    };

    return (
        <div className="p-5">
            <DashboardWrapper
                pageTitle="Course Management"
                setValue={setSearchValue} // ✅ Search works here
                loading={listLoading}
                actionElement={
                    <Button
                        onClick={handleCreateNew}
                        disabled={createLoading || updateLoading}
                        size="md"
                    >
                        {createLoading || updateLoading ? "Saving..." : "Create New Course"}
                    </Button>
                }
            >
                {/* Filters row */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex w-full max-w-4xl items-center gap-2">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-800"
                        >
                            <option value="">All Categories</option>
                            {distinctCategories.map((c) => (
                                <option
                                    key={c._id}
                                    value={c._id}
                                >
                                    {c.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-800"
                        >
                            <option value="">All Status</option>
                            {distinctStatuses.map((s) => (
                                <option
                                    key={s}
                                    value={s}
                                >
                                    {s}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            placeholder="Min price"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-24 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-800"
                        />

                        <input
                            type="number"
                            placeholder="Max price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-24 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-800"
                        />

                        <button
                            onClick={clearFilters}
                            className="rounded-md bg-gray-200 px-3 py-2 text-sm transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                {/* Date filters */}
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700 dark:text-gray-300">From:</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700 dark:text-gray-300">To:</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800"
                        />
                    </div>
                </div>

                {listLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
                    </div>
                ) : isError ? (
                    <div className="flex items-center justify-center py-20 text-gray-500">Failed to load courses.</div>
                ) : filteredCourses.length === 0 ? (
                    <div className="flex items-center justify-center py-20 text-lg font-semibold text-gray-500">No Courses Found 😔</div>
                ) : (
                    <CourseList
                        courses={filteredCourses}
                        onEdit={handleEditCourse}
                    />
                )}
            </DashboardWrapper>

            {showCreateForm && (
                <CourseForm
                    onSubmit={handleSaveCourse}
                    onClose={handleCloseCreateForm}
                    categories={categoryData?.data}
                    loading={createLoading}
                />
            )}

            {editingCourse && (
                <CourseEditModal
                    initialData={editingCourse}
                    onSubmit={handleUpdateCourse}
                    onClose={() => setEditingCourse(null)}
                    categories={categoryData?.data}
                    loading={updateLoading}
                />
            )}
        </div>
    );
};

export default Course;
