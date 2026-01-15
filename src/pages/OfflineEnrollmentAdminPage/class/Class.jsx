import { useState } from "react";
// Assuming the following imports are correct for your RTK Query setup
import { 
  useCreateClassMutation, 
  useDeleteClassMutation, 
  useGetAllClassQuery, 
  useUpdateClassMutation 
} from "../../../redux/features/api/class/class";
import { toast } from "react-toastify";

// Icons for a better look (you might need to install 'react-icons' or similar)
// For demonstration, I'll assume you have access to simple icons or use basic symbols.
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;


const ClassManagement = () => {
  const { data: classData, isLoading } = useGetAllClassQuery();
  const [createClass] = useCreateClassMutation();
  const [updateClass] = useUpdateClassMutation();
  const [deleteClass] = useDeleteClassMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [title, setTitle] = useState("");

  const openCreateModal = () => {
    setIsEdit(false);
    setTitle("");
    setIsOpen(true);
  };

  const openEditModal = (cls) => {
    setIsEdit(true);
    setCurrentClass(cls);
    setTitle(cls.title);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setCurrentClass(null);
    setTitle("");
  }

  const handleCreate = async () => {
    if (!title.trim()) return toast.error("Title is required");
    try {
      await createClass({ title }).unwrap();
      handleCloseModal();
      toast.success("Class Created Successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to create class");
    }
  };

  const handleUpdate = async () => {
    if (!title.trim()) return toast.error("Title is required");
    try {
      await updateClass({ id: currentClass._id, title }).unwrap();
      handleCloseModal();
      toast.success("Class Updated Successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update class");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this class? This action cannot be undone.")) return;
    try {
      await deleteClass({ id }).unwrap();
      toast.success("Class Deleted Successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete class");
    }
  };

  if (isLoading) return (
    <div className="p-8 dark:bg-gray-900 min-h-screen flex items-start justify-center">
        <p className="text-xl text-blue-500 dark:text-blue-400 mt-10">Loading class data...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100">
      
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 sm:mb-0">
            📚 Class Management
        </h1>
        <button
          onClick={openCreateModal}
          className="flex items-center px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
        >
          <PlusIcon /> 
          Add New Class
        </button>
      </div>

      {/* Table Card Container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">Title</th>
                <th className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 hidden sm:table-cell">Slug</th>
                <th className="py-4 px-6 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {classData?.data?.length > 0 ? (
                classData.data.map((cls, index) => (
                  <tr 
                    key={cls._id} 
                    className={`transition-all duration-200 ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'} hover:bg-blue-50 dark:hover:bg-gray-700`}
                  >
                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-gray-100">{cls.title}</td>
                    <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">{cls.slug}</td>
                    <td className="py-4 px-6 text-center space-x-3">
                      <button
                        onClick={() => openEditModal(cls)}
                        title="Edit Class"
                        className="p-2 text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-500 rounded-full transition-colors"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(cls._id)}
                        title="Delete Class"
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 rounded-full transition-colors"
                      >
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-10 text-lg text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
                    <p>😔 No Classes Found. Start by adding a new one!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - The overlay and dialog box */}
      {isOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4" 
          onClick={handleCloseModal} // Close modal on backdrop click
        >
          <div 
            className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6 border-b pb-3 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
                {isEdit ? "✏️ Update Class" : "✨ Create New Class"}
              </h2>
              
              <label htmlFor="classTitle" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Class Title
              </label>
              <input
                id="classTitle"
                type="text"
                placeholder="e.g., Grade 10 Science"
                className="w-full px-4 py-3 mb-6 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={handleCloseModal}
                  className="px-5 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={isEdit ? handleUpdate : handleCreate}
                  className={`px-5 py-2 rounded-lg text-white font-semibold shadow-md transition-all duration-300 focus:outline-none focus:ring-4 ${
                    isEdit 
                      ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800" 
                      : "bg-green-600 hover:bg-green-700 focus:ring-green-300 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-800"
                  }`}
                >
                  {isEdit ? "Save Changes" : "Create Class"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagement;