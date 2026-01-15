/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState } from "react";
import StdentStatusModal from "./StdentStatusModal";
import { Edit, Trash2, User } from "lucide-react";
import DeleteConfirmModal from "../../ui/deleteConfrimModal";
import { useStudentUpdateProfileMutation, useStudentDeleteMutation } from "../../redux/features/api/student/studentApi";
import useFormSubmit from "../../hooks/useFormSubmit";

const StudentRow = ({ student, index, page, limit }) => {
  const [status, setStatus] = useState(student.status);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { handleSubmitForm } = useFormSubmit()
  const [studentUpdateStatus] = useStudentUpdateProfileMutation()
  const [studentDelete] = useStudentDeleteMutation()

  const handleUpdateStatus = (newStatus) => {
    handleSubmitForm({
      apiCall: studentUpdateStatus,
      data: { status: newStatus },
      params: { id: student?._id },
    });
    setStatus(newStatus);
    setIsStatusModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    handleSubmitForm({
      apiCall: studentDelete,
      params: { id: student?._id },
    });
    setIsDeleteModalOpen(false);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Block":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <>
      <tr className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
        <td className="px-2 py-3 font-semibold text-center text-gray-700 dark:text-gray-200">
          {(page - 1) * limit + index + 1}
        </td>

        <td className="flex items-center gap-2 px-2 py-3">
          {student.profile_picture ? (
            <img
              src={student.profile_picture}
              alt={student.name}
              className="object-cover w-10 h-10 border border-gray-300 rounded-full dark:border-gray-700"
            />
          ) : (
            <User className="w-10 h-10 text-gray-400" />
          )}
          <span className="font-medium text-gray-800 dark:text-gray-200">{student.name}</span>
        </td>

        <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{student.email || "-"}</td>
        <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{student.phone || "-"}</td>
        <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{student.gurdianName || "-"}</td>
        <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{student.gurdianPhone || "-"}</td>
        <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{student.address || "-"}</td>
        <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{student.ssc?.sscGpa || "-"}</td>
        <td className="px-2 py-3 text-gray-600 dark:text-gray-400">{student.hsc?.hscGpa || "-"}</td>

        <td className="px-2 py-3 text-center">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] sm:text-xs font-medium ${getStatusClass(
              status
            )}`}
          >
            {status}
          </span>
        </td>

        <td className="flex justify-center gap-2 px-2 py-3 text-center">
          <button
            onClick={() => setIsStatusModalOpen(true)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit />
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 />
          </button>
        </td>
      </tr>

      {/* Status Modal */}
      <StdentStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        currentStatus={status}
        onUpdate={handleUpdateStatus}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        message={`Are you sure you want to delete "${student.name}"?`}
      />
    </>
  );
};

export default StudentRow;
