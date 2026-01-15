/* eslint-disable react/prop-types */
import useFormSubmit from "../../hooks/useFormSubmit";
import { useDeleteFacultyMutation } from "../../redux/features/api/faculty/facultyApi";
import FormActionButtons from "../../ui/button/formActionButtons";

const TeacherDeleteModal = ({ isOpen, onClose, teacher }) => {
  const { handleSubmitForm } = useFormSubmit();
  const [deleteFaculty] = useDeleteFacultyMutation();

  if (!isOpen || !teacher) return null;

  const onConfirm = () => {
    handleSubmitForm({
      apiCall: deleteFaculty,
      params:{ _id: teacher._id },
      onSuccess: () => onClose(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-[90%] max-w-sm shadow-xl text-center">
        <h3 className="text-lg font-bold mb-4 text-red-600">
          Confirm Delete
        </h3>
        <p className="mb-6 dark:text-white">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{teacher.name}</span>?
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
