/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import ModalContainer from "../../package/modalContainer";
import { Loader2 } from "lucide-react";

const EditHeadingOfferModal = ({ isOpen, onClose, headingOffer, onUpdate }) => {
    const [offer, setOffer] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize offer state when headingOffer changes
    useEffect(() => {
        if (headingOffer) setOffer(headingOffer.offer || "");
    }, [headingOffer]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onUpdate({ slug: headingOffer.slug, offer });
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass =
        "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200";

    return (
        <ModalContainer close={onClose}>
            {/* Header */}
            <div className="mb-6 text-center">
                <h2 className="mb-1 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-2xl font-bold text-transparent dark:from-blue-400 dark:to-cyan-400 sm:text-3xl">
                    Edit Heading
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">Update this Heading.</p>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-4"
            >
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">Offer Title</label>
                    <input
                        type="text"
                        name="offer"
                        value={offer}
                        onChange={(e) => setOffer(e.target.value)}
                        className={inputClass}
                        placeholder="Enter offer text"
                        required
                    />
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex justify-end gap-3 border-t border-gray-200 pt-2 dark:border-gray-700">
                    {/* Cancel Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-lg border border-gray-400 px-4 py-2 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50 dark:from-blue-500 dark:to-cyan-400 dark:hover:from-blue-600 dark:hover:to-cyan-500"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Updating...
                            </span>
                        ) : (
                            "Update"
                        )}
                    </button>
                </div>
            </form>
        </ModalContainer>
    );
};

export default EditHeadingOfferModal;
