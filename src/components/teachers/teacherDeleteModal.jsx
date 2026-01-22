/* eslint-disable react/prop-types */
import useFormSubmit from "../../hooks/useFormSubmit";
import { useDeleteFacultyMutation } from "../../redux/features/api/faculty/facultyApi";
import FormActionButtons from "../../UI/button/formActionButtons";

const TeacherDeleteModal = ({ isOpen, onClose, teacher }) => {
    const { handleSubmitForm } = useFormSubmit();
    const [deleteFaculty] = useDeleteFacultyMutation();

    if (!isOpen || !teacher) return null;

    const onConfirm = () => {
        handleSubmitForm({
            apiCall: deleteFaculty,
            params: { _id: teacher._id },
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-[90%] max-w-sm rounded-lg bg-white p-6 text-center shadow-xl dark:bg-gray-900">
                <h3 className="mb-4 text-lg font-bold text-red-600">Confirm Delete</h3>
                <p className="mb-6 dark:text-white">
                    Are you sure you want to delete <span className="font-semibold">{teacher.name}</span>?
                </p>

                <FormActionButtons
                    onCancel={onClose}
                    onSubmit={onConfirm}
                    cancelText="Cancel"
                    submitText="Yes, Delete"
                    submitColor="bg-red-500"
                    isSubmitting={false}
                />
            </div>
        </div>
    );
};

export default TeacherDeleteModal;
