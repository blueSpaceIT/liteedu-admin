/* eslint-disable react/prop-types */
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { FaCreditCard, FaClock, FaTags } from "react-icons/fa";
import useFormSubmit from "../../../hooks/useFormSubmit";
import { useDeleteSubscriptionMutation } from "../../../redux/features/api/subscription/subscriptionApi";
import SubscriptionFrom from "./subscriptionFrom";



const SubscriptionCard = ({ subscription, moduleData, courseId}) => {
  // console.log(subscription)
  const [isModalOpen, setIsModalOpen] = useState(false);
    const { handleSubmitForm } = useFormSubmit();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [deleteSubscription, { isLoading: isDeleting }] = useDeleteSubscriptionMutation();

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!subscription._id) return;
    handleSubmitForm({
      apiCall: deleteSubscription,
      params: { id: subscription._id }, 
      onSuccess: ()=> setIsDeleteModalOpen(false)
    });
   
  };


 
 

  return (
    <>
      <section className="max-w-md rounded-xl p-8 bg-gray-900 border border-gray-600 shadow-2xl text-white transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/50 mb-8">
        <div className="flex items-center gap-4 mb-6 border-b border-gray-700 pb-4">
          <FaCreditCard className=" text-2xl" />
          <h2 className="text-2xl font-extrabold tracking-wide drop-shadow-md text-amber-400 ">
            {subscription?.subscription_title}
          </h2>
        </div>

        <div className="mb-4 text-lg flex items-center gap-2">
          <FaClock className="text-teal-400" />
          <span className="font-semibold text-gray-300">Duration: </span>
          <span className="text-white">
            {subscription?.duration} month
            {subscription?.duration > 1 ? "s" : ""}
          </span>
        </div>

        <div className="mb-8 text-xl font-bold tracking-wide drop-shadow-md flex items-center gap-2 justify-between ">
         <div className="flex items-center gap-1">
           <FaTags className="text-teal-400" />
          Price:{" "}
          <span className="text-teal-400">
            {subscription?.price.toLocaleString()}৳
          </span>
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

      <div className="flex justify-center mt-8">
            
            </div>
      </section>


      {/* EDIT MODAL */}
            {isModalOpen && (
              <SubscriptionFrom
                courseId={courseId}
                moduleData={moduleData}
                onClose={() => setIsModalOpen(false)}
                existingData={subscription}
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

export default SubscriptionCard;