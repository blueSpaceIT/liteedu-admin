import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useFormSubmit from "../../../hooks/useFormSubmit";
import { useCreateModuleMutation } from "../../../redux/features/api/module/module";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

export default function CreateCourseModule() {
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get("courseId");
    const { handleSubmitForm } = useFormSubmit();
    const navigate = useNavigate();

    const [createModule, { isLoading: createLoading, isSuccess }] = useCreateModuleMutation();

    const [formData, setFormData] = useState({
        moduleTitle: "",
        courseId: courseId,
    });

    // Input change handle
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Submit handle
    const handleSubmit = (e) => {
        e.preventDefault();
        handleSubmitForm({
            apiCall: createModule,
            data: formData,
        });
    };

    // Redirect after success
    useEffect(() => {
        if (isSuccess) {
            toast.success("Module Create Successfull")
            navigate(-1);

        }
    }, [isSuccess, navigate, courseId]);

    return (
        <div className="main-content group-data-[sidebar-size=lg]:xl:ml-[16px] group-data-[sidebar-size=sm]:xl:ml-[16px] px-4 group-data-[theme-width=box]:xl:px-0 ac-transition">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
                <ArrowLeft size={18} /> Back
            </button>
            <div className="card p-6 bg-white dark:bg-gray-900 shadow-md rounded-xl">
                <h6 className="card-title mb-4 text-gray-800 dark:text-gray-100">
                    Create New Module
                </h6>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Module Title */}
                    <div className="space-y-2">
                        <label
                            className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300"
                            htmlFor="moduleTitle"
                        >
                            Module Title
                        </label>
                        <input
                            className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-background dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-base ring-offset-background placeholder:text-gray-400 dark:placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            id="moduleTitle"
                            placeholder="Enter module title"
                            name="moduleTitle"
                            value={formData.moduleTitle}
                            onChange={handleChange}
                            disabled={createLoading}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-gray-300 dark:border-gray-700 bg-background dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white h-10 px-4 py-2 transition"
                            type="button"
                            onClick={() => navigate(-1)}
                            disabled={createLoading}
                        >
                            Cancel
                        </button>
                        <button
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-[rgb(95_113_250)] text-white hover:bg-[rgb(95_113_250)]/90 h-10 px-4 py-2 transition disabled:opacity-50"
                            type="submit"
                            disabled={createLoading}
                        >
                            {createLoading ? "Creating..." : "Create Module"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
