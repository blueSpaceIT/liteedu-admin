import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useFormSubmit from "../../../hooks/useFormSubmit";
import { useCreateLiveClassMutation } from "../../../redux/features/api/liveClass/liveClass";
import { toast } from "react-toastify";

export default function CreateLiveClass() {
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get("courseId");
    const { handleSubmitForm } = useFormSubmit();
    const [createLiveClass, { isLoading: createLoading, isSuccess }] = useCreateLiveClassMutation();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        courseId: courseId,
        link: "",
        status: "Drafted",
    });
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSubmitForm({
            apiCall: createLiveClass,
            data: formData,
        });
    };
    useEffect(() => {
        if (isSuccess) {
            toast.success("Live Class Create Successfull")
            navigate(-1);

        }
    }, [isSuccess, navigate, courseId]);


    return (
        <div className="card p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 jusc">
                <button
                    onClick={() => navigate(-1)}
                    className=" flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                    <ArrowLeft size={18} />
                </button>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                    Create Live Class
                </h1>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Title */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter live class title"
                        className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-gray-800 dark:border-gray-700 px-3 py-2 text-base text-gray-800 dark:text-gray-100 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter live class description"
                        className="flex w-full rounded-md border border-input bg-background dark:bg-gray-800 dark:border-gray-700 px-3 py-2 text-base text-gray-800 dark:text-gray-100 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[100px]"
                    />
                </div>

                {/* Live Class Link */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Live Class Link
                    </label>
                    <input
                        type="text"
                        name="link"
                        value={formData.link}
                        onChange={handleChange}
                        placeholder="https://example.com/live-class"
                        className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-gray-800 dark:border-gray-700 px-3 py-2 text-base text-gray-800 dark:text-gray-100 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Status
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-gray-800 dark:border-gray-700 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                        <option value="Published">Published</option>
                        <option value="Drafted">Drafted</option>
                    </select>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-[rgb(95_113_250)] text-white hover:bg-[rgb(95_113_250)]/90 h-10 px-4 py-2 transition disabled:opacity-50"
                        type="submit"
                        disabled={createLoading}
                    >
                        {createLoading ? "Creating..." : "Create Live Class"}
                    </button>
                </div>
            </form>
        </div>
    );
}
