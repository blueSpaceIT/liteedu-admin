import { toast } from "react-toastify";

// add delete update

export default function useFormSubmit() {
  const handleSubmitForm = async ({
    e,
    apiCall,
    data = {},
    params = {},
    onSuccess,
  }) => {
    e?.preventDefault();
    try {
      const response = await apiCall({data,params});
      if (response?.data?.status) {
        toast.success(response?.data?.message || "Action successful");
        onSuccess?.(response?.data);
      } else {
        toast.error(response?.error?.data?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error?.message || "Unexpected error occurred");
    }
  };

  return { handleSubmitForm };
}
