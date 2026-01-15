import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useFormSubmit from "../../../hooks/useFormSubmit";
import { useGetAllLectureQuery, useUpdateLectureMutation } from "../../../redux/features/api/lecture/lecture";
import { toast } from "react-toastify";

export default function LectureEditFrom() {
    const [searchParams] = useSearchParams();
    const slug = searchParams.get("slug");
    const { handleSubmitForm } = useFormSubmit();
    const navigate = useNavigate();
    const { data: lectureData, isLoading: fetching } = useGetAllLectureQuery();
    const [updatelecture, { isLoading: updating, isSuccess }] = useUpdateLectureMutation();
    const lecturess = useMemo(() => (lectureData?.data ? lectureData?.data : []), [lectureData]);
    const lecture = lecturess?.find(m => m?.slug === slug);





    const [form, setForm] = useState({
        title:  "",
        server: "Youtube",
        videoId: "",
        duration:  0,
        status: "Published",
    });

      useEffect(() => {
            if (lecture) {
                setForm({
                    title: lecture.title || "",
                    server: lecture.server || "",
                    videoId: lecture.videoId || "",
                    duration: lecture.duration || 0,
                    status: lecture.status || "Published",
                });
            }
        }, [lecture, slug]);

    // eslint-disable-next-line no-unused-vars
    const [errors, setErrors] = useState({});

    const helpText = useMemo(() => {
        switch (form.server) {
            case "YouTube":
                return "For YouTube, enter the video ID or full URL";
            case "Vimeo":
                return "For Vimeo, enter the numeric ID or full URL";
            case "Bunny":
                return "For Bunny, paste the GUID or pull zone URL";
            default:
                return "Paste a playable URL (HLS/DASH/MP4)";
        }
    }, [form.server]);

    function update(key, value) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSubmitForm({
            apiCall: updatelecture,
            data: form,
            params: { slug: slug }
        });
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success("Lecture Updated Successfully");
            navigate(-1);
        }
    }, [isSuccess, navigate]);

    if (fetching) return <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>;


    return (
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-full">
                <div className="rounded-lg border shadow-sm border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
                    <div className="flex items-center  space-x-1.5 p-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div className="text-2xl font-semibold leading-none tracking-tight">
                            Edit Lecture
                        </div>
                    </div>
                    <div className="p-6 pt-0">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="title">Lecture Title</label>
                                    <input
                                        id="title"
                                        name="title"
                                        placeholder="Enter lecture title"
                                        className={inputClass(errors.title)}
                                        value={form.title}
                                        onChange={(e) => update("title", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="server">Video Server</label>
                                    <div className="relative">
                                        <select
                                            id="server"
                                            name="server"
                                            className={selectClass}
                                            value={form.server}
                                            onChange={(e) => update("server", e.target.value)}
                                        >
                                            <option value="Youtube">YouTube</option>
                                            <option value="Bunny">Bunny</option>
                                            <option value="Vimeo">Vimeo</option>
                                            <option value="Others">Custom</option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-70" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="videoId">Video ID or URL</label>
                                    <input
                                        id="videoId"
                                        name="videoId"
                                        placeholder="Enter video ID or URL"
                                        className={inputClass(errors.videoId)}
                                        value={form.videoId}
                                        onChange={(e) => update("videoId", e.target.value)}
                                        aria-describedby="videoId-help"
                                    />
                                    <p id="videoId-help" className="text-sm text-slate-500 dark:text-slate-400">{helpText}</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="duration">Duration (minutes)</label>
                                    <input
                                        id="duration"
                                        name="duration"
                                        type="number"
                                        min={1}
                                        className={inputClass(errors.duration)}
                                        value={form.duration}
                                        onChange={(e) => update("duration", Number(e.target.value))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="status">Status</label>
                                    <div className="relative">
                                        <select
                                            id="status"
                                            name="status"
                                            className={selectClass}
                                            value={form.status}
                                            onChange={(e) => update("status", e.target.value)}
                                        >
                                            <option value="Drafted">Draft</option>
                                            <option value="Published">Published</option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-70" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="inline-flex items-center justify-center rounded-md border h-10 px-4 py-2 border-slate-200 bg-white hover:bg-slate-100 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-md h-10 px-4 py-2 bg-indigo-500 text-white hover:bg-indigo-500/90"
                                >
                                    {updating ? "Updating..." : "Update Lecture"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

const baseInput =
    "flex h-10 w-full rounded-md border px-3 py-2 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ring-offset-0 border-slate-300 bg-slate-50 placeholder-slate-400 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:placeholder-slate-500 dark:text-slate-100";

function inputClass(hasError) {
    return [
        baseInput,
        hasError ? "border-red-500 focus:ring-red-500" : "",
    ].join(" ");
}

const selectClass =
    "appearance-none flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300 bg-slate-50 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";
