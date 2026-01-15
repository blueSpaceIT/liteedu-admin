/* eslint-disable react/prop-types */
import { useState } from "react";
import { toast } from "react-toastify";
import { useAddHeadingOfferMutation } from "../../redux/features/api/headingOffer/headingOfferApi";
import ModalContainer from "../../package/modalContainer";
import { Loader2 } from "lucide-react";

const AddHeadingOfferModal = ({ isOpen, onClose, onSuccess }) => {
    const [offer, setOffer] = useState("");
    const [addHeadingOffer, { isLoading }] = useAddHeadingOfferMutation();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!offer.trim()) {
            toast.error("Offer field is required");
            return;
        }

        try {
            await addHeadingOffer({ offer }).unwrap();
            toast.success("Heading offer added successfully");
            setOffer("");
            onClose();
            if (onSuccess) onSuccess();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to add heading offer");
        }
    };

    return (
        <ModalContainer close={onClose}>
            <div className="mb-6 text-center">
                <h2 className="mb-1 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-2xl font-bold text-transparent dark:from-blue-400 dark:to-cyan-400 sm:text-3xl">
                    Add Heading
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">Add a new heading.</p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="my-2 grid grid-cols-1 gap-4"
            >
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200">Offer title</label>
                    <input
                        type="text"
                        value={offer}
                        onChange={(e) => setOffer(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                        placeholder="Enter heading offer"
                        required
                    />
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex justify-end gap-3 border-t border-gray-200 pt-2 dark:border-gray-700">
                    {/* Cancel Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-lg border border-gray-400 px-4 py-2 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50 dark:from-blue-500 dark:to-cyan-400 dark:hover:from-blue-600 dark:hover:to-cyan-500"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Adding...
                            </span>
                        ) : (
                            "Add"
                        )}
                    </button>
                </div>
            </form>
        </ModalContainer>
    );
};

export default AddHeadingOfferModal;
