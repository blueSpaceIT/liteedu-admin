/* eslint-disable react/prop-types */
import { useState } from "react";
import useFormSubmit from "../../../hooks/useFormSubmit";
import { useCreateSubscriptionMutation, useUpdateSubscriptionMutation } from "../../../redux/features/api/subscription/subscriptionApi";

const SubscriptionFrom = ({ courseId, onClose, existingData }) => {
  const { handleSubmitForm } = useFormSubmit();
  const [createSubscription, { isLoading: isCreating }] = useCreateSubscriptionMutation();
  const [updateSubscription, { isLoading: isUpdating }] = useUpdateSubscriptionMutation();


  const [formData, setFormData] = useState({
    courseId: courseId || "",
    subscription_title: existingData?.subscription_title || "",
    price: existingData?.price || 0,
    duration: existingData?.duration || 0,
  });

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: name === "price" || name === "duration" ? Number(value) : value
  }));
};



 const handleSubmit = (e) => {
  e.preventDefault();

 
  // Prepare payload
  const payload = {
    ...formData,
  };

  if (existingData) {
    // Update mode
    handleSubmitForm({
      apiCall: updateSubscription,
      data: payload,
      params: { id: existingData._id }, 
      onSuccess: onClose,
    });
  } else {
    handleSubmitForm({
      apiCall: createSubscription,
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
            {existingData ? "Edit Subscription" : "Add New Subscription"}
          </h2>

          {/* Segment Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Subscription Title</label>
            <input
              type="text"
              name="subscription_title"
              value={formData.subscription_title}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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


          {/* Price */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Duration</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
            {isLoading ? "Saving..." : existingData ? "Update Segment" : "Create Segment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionFrom;
