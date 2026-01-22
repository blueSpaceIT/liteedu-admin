import { useState } from "react";
import { useCreateEnrollmentMutation, useUpdateEnrollmentMutation } from "../../redux/features/api/newEnrollment/newEnrollment";
import useFormSubmit from "../../hooks/useFormSubmit";
import EnrollmentList from "../../components/newEnrollment/entrollmentList";
import EnrollmentForm from "../../components/newEnrollment/enrollmentForm";

const NewEnrollment = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingEnrollment, setEditingEnrollment] = useState(null);

    const [createEnrollment, { isLoading: createLoading }] = useCreateEnrollmentMutation();
    const [updateEnrollment, { isLoading: updateLoading }] = useUpdateEnrollmentMutation();

    const { handleSubmitForm } = useFormSubmit();

    const handleOpenForm = () => {
        setEditingEnrollment(null);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setEditingEnrollment(null);
        setShowForm(false);
    };

    const handleEditEnrollment = (enrollment) => {
        setEditingEnrollment(enrollment);
        setShowForm(true);
    };

    const handleSaveEnrollment = (enrollmentData) => {
        if (editingEnrollment) {
            handleSubmitForm({
                apiCall: updateEnrollment,
                data: enrollmentData,
                params: { id: editingEnrollment._id },
                onSuccess: () => setShowForm(false),
            });
        } else {
            handleSubmitForm({
                apiCall: createEnrollment,
                data: enrollmentData,
                onSuccess: () => setShowForm(false),
            });
        }
        setEditingEnrollment(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 text-gray-900 dark:bg-gray-950 dark:text-gray-100 sm:p-8">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">New Enrollment</h1>
                <button
                    onClick={handleOpenForm}
                    className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Add Enrollment
                </button>
            </div>

            {/* Enrollment Table */}
            <EnrollmentList onEdit={handleEditEnrollment} />

            {/* Enrollment Form Modal */}
            {showForm && (
                <EnrollmentForm
                    initialData={editingEnrollment}
                    onSubmit={handleSaveEnrollment}
                    onClose={handleCloseForm}
                    loading={createLoading || updateLoading}
                />
            )}
        </div>
    );
};

export default NewEnrollment;
