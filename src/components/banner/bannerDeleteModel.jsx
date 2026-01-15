/* eslint-disable react/prop-types */
import useFormSubmit from "../../hooks/useFormSubmit";
import { useDeleteBannerMutation } from "../../redux/features/api/banner/bannerApi";
import FormActionButtons from "../../ui/button/formActionButtons";

const BannerDeleteModal = ({ isOpen, onClose, banner }) => {
    const { handleSubmitForm } = useFormSubmit();
    const [deleteBanner] = useDeleteBannerMutation();


    if (!isOpen || !banner) return null;

    const onConfirm = () => {
        handleSubmitForm({
            apiCall: deleteBanner,
            params: { _id: banner },
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-[90%] max-w-sm rounded-lg bg-white p-6 text-center shadow-xl dark:bg-gray-900">
                <h3 className="mb-4 text-lg font-bold text-red-600">Confirm Delete</h3>
                <p className="mb-6 dark:text-white">
                    Are you sure you want to delete <span className="font-semibold">{banner.position}</span>?
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

export default BannerDeleteModal;
