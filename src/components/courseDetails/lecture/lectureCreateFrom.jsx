/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateLectureMutation, useFinalizeUploadMutation, useUploadChunkMutation } from "../../../redux/features/api/lecture/lecture";
import { useCreateModuleDetailsMutation } from "../../../redux/features/api/moduleDetails/moduleDetails";
import { uploadVideoInChunksRTK } from "../../../utils/chunkUpload";

export default function CreateLectureForm() {
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get("courseId");
    const moduleId = searchParams.get("moduleId");

    const navigate = useNavigate();

    const [createLecture, { isLoading, data, isSuccess }] = useCreateLectureMutation();
    const [createModuleDetails] = useCreateModuleDetailsMutation();
    const [uploadChunk] = useUploadChunkMutation();
    const [finalizeUpload] = useFinalizeUploadMutation();

    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadedMediaId, setUploadedMediaId] = useState(null);

    const [form, setForm] = useState({
        title: "",
        duration: "",
        server: "Youtube",
        isFree: false,
        status: "Published",
    });

    const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

    // Upload video in chunks
    const startUpload = async () => {
        if (!file) return toast.error("Select a video file");
        if (!form.title) return toast.error("Enter video title");

        try {
            setUploading(true);
            toast.info("Uploading video...");

            const mediaId = await uploadVideoInChunksRTK({
                file,
                title: form.title,
                uploadChunk,
                finalizeUpload,
                onProgress: setProgress,
            });

            setUploadedMediaId(mediaId);
            toast.success("Upload complete");
        } catch (err) {
            console.error(err);
            toast.error(err?.data?.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    // Submit lecture
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!uploadedMediaId) return toast.error("Upload video first");
        if (!courseId || !moduleId) return toast.error("Invalid course or module ID");

        try {
            const lectureResponse = await createLecture({
                data: {
                    // ✅ correct key for RTK mutation
                    courseId,
                    moduleId,
                    title: form.title,
                    server: form.server,
                    videoId: uploadedMediaId,
                    duration: Number(form.duration),
                    isFree: form.isFree,
                    status: form.status,
                },
            }).unwrap();

            toast.success("Lecture created successfully");

            // Create module details record
            await createModuleDetails({
                data: {
                    courseId,
                    moduleId,
                    content_type: "Lecture",
                    contentId: lectureResponse.data._id,
                    status: "published",
                },
            });

            navigate(-1);
        } catch (err) {
            console.error(err);
            toast.error(err?.data?.message || "Failed to create lecture");
        }
    };

    const disableSubmit = uploading || !uploadedMediaId || isLoading;

    return (
        <div className="space-y-4">
            <input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Lecture title"
                className="w-full border p-2"
            />

            <input
                type="number"
                placeholder="Duration (minutes)"
                value={form.duration}
                onChange={(e) => update("duration", e.target.value)}
                className="w-full border p-2"
            />

            <select
                value={form.server}
                onChange={(e) => update("server", e.target.value)}
                className="w-full border p-2"
            >
                <option value="Youtube">Youtube</option>
                <option value="Vimeo">Vimeo</option>
                <option value="Bunny">Bunny</option>
                <option value="Others">Others</option>
            </select>

            <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={form.isFree}
                    onChange={(e) => update("isFree", e.target.checked)}
                />
                <span>Is Free</span>
            </label>

            <select
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
                className="w-full border p-2"
            >
                <option value="Published">Published</option>
                <option value="Drafted">Drafted</option>
            </select>

            <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files[0])}
            />

            <button
                type="button"
                onClick={startUpload}
                disabled={uploading}
                className="bg-blue-600 px-4 py-2 text-white"
            >
                {uploading ? "Uploading..." : "Upload Video"}
            </button>

            {progress > 0 && (
                <div className="h-2 w-full bg-gray-200">
                    <div
                        className="h-2 bg-green-500"
                        style={{ width: progress + "%" }}
                    />
                </div>
            )}

            <button
                onClick={handleSubmit}
                disabled={disableSubmit}
                className="bg-indigo-600 px-4 py-2 text-white"
            >
                Create Lecture
            </button>
        </div>
    );
}
