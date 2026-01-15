/* eslint-disable react/prop-types */
import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { FaCheckCircle, FaLaptopCode, FaTags } from "react-icons/fa";
import SegmentForm from "./segmentFrom";
import { useDeleteSegmentMutation } from "../../../redux/features/api/segment/segmentApi";
import useFormSubmit from "../../../hooks/useFormSubmit";

const SegmentCardSmall = ({ segment, moduleData, courseId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
    const { handleSubmitForm } = useFormSubmit();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [deleteSegment, { isLoading: isDeleting }] = useDeleteSegmentMutation();

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!segment._id) return;
    handleSubmitForm({
      apiCall: deleteSegment,
      params: { id: segment._id }, 
      onSuccess: ()=> setIsDeleteModalOpen(false)
    });
   
  };

  return (
    <>
      <div className="bg-gray-900 rounded-xl p-6 text-white border border-gray-700 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20 cursor-pointer flex flex-col justify-between space-y-4 max-w-sm mx-auto transform hover:-translate-y-1">
        
        {/* Title and Description */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaLaptopCode className="text-amber-400 text-2xl drop-shadow-md" />
            <h3 className="text-xl font-bold text-amber-400 line-clamp-1">
              {segment.segment_title}
            </h3>
          </div>

          <p className="text-sm text-gray-300 mb-3 line-clamp-3">
            {segment.desc}
          </p>

          {/* Modules List */}
          {segment.module && segment.module.length > 0 && (
            <ul className="text-sm text-gray-400 max-h-24 overflow-y-auto space-y-1 mb-2 pr-2">
              {segment.module.map((mod) => (
                <li
                  key={mod._id}
                  title={mod.moduleTitle}
                  className="flex items-start gap-2 hover:text-amber-300 transition-colors"
                >
                  <FaCheckCircle className="text-emerald-400 flex-shrink-0 mt-1" />
                  <span className="truncate">{mod.moduleTitle}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Price and Action Buttons */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 font-semibold text-violet-400 drop-shadow-lg text-lg">
            <FaTags />
            <span>{segment.price?.toLocaleString()} ৳</span>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleEdit}
              className="border p-1 border-gray-300 rounded-md hover:bg-gray-700 transition"
            >
              <Edit size={16} />
            </button>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="border p-1 border-gray-300 rounded-md hover:bg-gray-700 transition"
            >
              <Trash2 size={16} color="red" />
            </button>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {isModalOpen && (
        <SegmentForm
          courseId={courseId}
          moduleData={moduleData}
          onClose={() => setIsModalOpen(false)}
          existingData={segment}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-80">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Are you sure you want to delete this segment?
            </h3>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SegmentCardSmall;
