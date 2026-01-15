/* eslint-disable react/prop-types */
import { useState } from "react";
import { useCreateSegmentMutation, useUpdateSegmentMutation } from "../../../redux/features/api/segment/segmentApi";
import useFormSubmit from "../../../hooks/useFormSubmit";

const SegmentForm = ({ courseId, moduleData, onClose, existingData }) => {
  const { handleSubmitForm } = useFormSubmit();
  const [createSegment, { isLoading: isCreating }] = useCreateSegmentMutation();
  const [updateSegment, { isLoading: isUpdating }] = useUpdateSegmentMutation();

  // Edit modules: array of _id
  const [editModules, setEditModules] = useState(
    existingData?.module?.map(m => m._id) || []
  );

  // New modules: array of _id
  const [newModules, setNewModules] = useState([""]);

  const [formData, setFormData] = useState({
    courseId: courseId || "",
    segment_title: existingData?.segment_title || "",
    desc: existingData?.desc || "",
    price: existingData?.price || 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value
    }));
  };

  const handleEditModuleChange = (index, selectedId) => {
    const updated = [...editModules];
    updated[index] = selectedId;
    setEditModules(updated);
  };

  const removeEditModuleField = (index) => {
    const updated = editModules.filter((_, i) => i !== index);
    setEditModules(updated);
  };

  const handleNewModuleChange = (index, selectedId) => {
    const updated = [...newModules];
    updated[index] = selectedId;
    setNewModules(updated);
  };

  const addNewModuleField = () => {
    setNewModules(prev => [...prev, ""]);
  };

  const removeNewModuleField = (index) => {
    const updated = newModules.filter((_, i) => i !== index);
    setNewModules(updated.length ? updated : [""]);
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  // Merge modules
  const mergedModules = [...editModules, ...newModules.filter(Boolean)];

  // Prepare payload
  const payload = {
    ...formData,
    module: mergedModules,
  };

  if (existingData) {
    // Update mode
    handleSubmitForm({
      apiCall: updateSegment,
      data: payload,
      params: { id: existingData._id }, // send id properly here
      onSuccess: onClose,
    });
  } else {
    // Create mode
    handleSubmitForm({
      apiCall: createSegment,
      data: payload,
      onSuccess: onClose,
    });
  }
};

  const isLoading = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-xl">
          ✖
        </button>

        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
            {existingData ? "Edit Segment" : "Add New Segment"}
          </h2>

          {/* Segment Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Segment Title</label>
            <input
              type="text"
              name="segment_title"
              value={formData.segment_title}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows="3"
            />
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Edit Modules */}
          {editModules.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Edit Selected Modules</label>
              {editModules.map((modId, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <select
                    value={modId}
                    onChange={(e) => handleEditModuleChange(index, e.target.value)}
                    required
                    className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">-- Select Module --</option>
                    {moduleData?.map(m => (
                      <option key={m._id} value={m._id}>{m.moduleTitle}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeEditModuleField(index)}
                    className="bg-red-500 text-white px-3 rounded-md hover:bg-red-600"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Modules */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Add New Modules</label>
            {newModules.map((modId, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <select
                  value={modId}
                  onChange={(e) => handleNewModuleChange(index, e.target.value)}
                  required={!existingData} // required only for new segment
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">-- Select Module --</option>
                  {moduleData?.map(m => (
                    <option key={m._id} value={m._id}>{m.moduleTitle}</option>
                  ))}
                </select>
                {newModules.length > 1 && (
                  <button type="button" onClick={() => removeNewModuleField(index)} className="bg-red-500 text-white px-3 rounded-md hover:bg-red-600">
                    X
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addNewModuleField} className="text-blue-500 text-sm hover:underline">
              + Add another module
            </button>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
            {isLoading ? "Saving..." : existingData ? "Update Segment" : "Create Segment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SegmentForm;
