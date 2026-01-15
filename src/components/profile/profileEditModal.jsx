/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Image, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import FileUpload from "../course/input/fileUpload";
import { useAdmingetAllQuery, useUpdateAdminMutation } from "../../redux/features/api/admin/adminApi";
import { useUploadImageMutation } from "../../redux/features/api/upload/uploadApi";
import DefaultProfileAvatar from "../../../public/default-user-avatar.webp"; // ✅ import fallback

const ProfileEditModal = ({ onClose, user }) => {
    const { data: allAdmins, isLoading: isAdminsLoading } = useAdmingetAllQuery();
    const [updateAdmin, { isLoading }] = useUpdateAdminMutation();
    const [uploadImage] = useUploadImageMutation();

    // Directly use user (already merged in Header)
    const normalizedUser = user || {};

    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            name: normalizedUser?.name || "",
            email: normalizedUser?.email || "",
            phone: normalizedUser?.phone || "",
            address: normalizedUser?.address || "",
            profile_picture: normalizedUser?.profile_picture || "",
            status: normalizedUser?.status || "Active",
        },
    });

    const [coverFile, setCoverFile] = useState(normalizedUser?.profile_picture || null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (normalizedUser?.profile_picture) {
            setValue("profile_picture", normalizedUser.profile_picture);
            setCoverFile(normalizedUser.profile_picture);
        }
    }, [normalizedUser, setValue]);

    const handleInputChange = async (e) => {
        const { name, value, files } = e.target;

        if (files && files[0]) {
            const file = files[0];
            const data = new FormData();
            data.append("image", file);

            try {
                setIsUploading(true);
                const uploaded = await uploadImage(data).unwrap();
                const imageUrl = uploaded?.data?.secure_url;
                if (imageUrl) {
                    setValue("profile_picture", imageUrl);
                    setCoverFile(imageUrl);
                    toast.success("Profile picture uploaded successfully");
                }
            } catch (err) {
                toast.error("Image upload failed");
            } finally {
                setIsUploading(false);
            }
        } else {
            setValue(name, value);
        }
    };

    const onSubmit = async (data) => {
        try {
            await updateAdmin({
                data,
                params: { id: normalizedUser?._id },
            }).unwrap();
            toast.success("Profile updated successfully!");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Update failed!");
        }
    };

    const inputClass =
        "w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500";

    if (isAdminsLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="rounded-lg bg-white p-6 text-center shadow-lg dark:bg-gray-900">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-500" />
                    <p className="mt-2">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2">
            <div className="grid max-h-[90vh] w-full max-w-[1000px] grid-cols-1 gap-6 overflow-y-auto rounded-lg bg-white p-4 shadow-lg dark:bg-gray-900 sm:p-6 lg:grid-cols-3">
                {/* Left side profile card */}
                <div className="flex flex-col items-center rounded-2xl bg-gradient-to-b from-purple-900 to-purple-700 p-4 text-white sm:p-6">
                    <img
                        src={coverFile || DefaultProfileAvatar} // ✅ use fallback avatar
                        alt="Profile"
                        className="h-20 w-20 rounded-full border-2 border-purple-400 object-cover"
                    />
                    <h2 className="mt-3 text-lg font-semibold">{normalizedUser?.name || "Guest User"}</h2>

                    <div className="mt-4 w-full space-y-3 text-left text-sm sm:text-[15px]">
                        <p>
                            <span className="font-semibold">Id:</span> {normalizedUser?._id?.slice(0, 6) || "No Id Found"}
                        </p>
                        <p>
                            <span className="font-semibold">Email:</span> {normalizedUser?.email || "No Email Found"}
                        </p>
                        <p>
                            <span className="font-semibold">Phone:</span> {normalizedUser?.phone || "No Phone Found"}
                        </p>
                        <p>
                            <span className="font-semibold">Address:</span> {normalizedUser?.address || "No Address Found"}
                        </p>
                        <p>
                            <span className="font-semibold">Role:</span> {normalizedUser?.role || "No Role Found"}
                        </p>
                        <p>
                            <span className="font-semibold">Status:</span> {normalizedUser?.status || "No Status Found"}
                        </p>
                        <p>
                            <span className="font-semibold">Created At:</span>{" "}
                            {normalizedUser?.createdAt ? new Date(normalizedUser.createdAt).toLocaleString() : "No Date Found"}
                        </p>
                        <p>
                            <span className="font-semibold">Updated At:</span>{" "}
                            {normalizedUser?.updatedAt ? new Date(normalizedUser.updatedAt).toLocaleString() : "No Date Found"}
                        </p>
                        <p>
                            <span className="font-semibold">Activity:</span> {normalizedUser?.isDeleted ? "Deleted" : "Active"}
                        </p>
                    </div>
                </div>

                {/* Right side form */}
                <div className="lg:col-span-2">
                    <h3 className="mb-4 text-xl font-semibold text-blue-500 dark:text-gray-200 sm:text-2xl">Edit Profile</h3>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                    >
                        {/* Name */}
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Name</label>
                            <input
                                {...register("name")}
                                className={inputClass}
                                placeholder="Name"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Email</label>
                            <input
                                {...register("email")}
                                className={inputClass}
                                placeholder="Email"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Phone</label>
                            <input
                                {...register("phone")}
                                className={inputClass}
                                placeholder="Phone"
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Address</label>
                            <input
                                {...register("address")}
                                className={inputClass}
                                placeholder="Address"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Status</label>
                            <select
                                {...register("status")}
                                className={inputClass}
                            >
                                <option value="Active">Active</option>
                                <option value="Blocked">Blocked</option>
                            </select>
                        </div>

                        {/* Profile Picture */}
                        <div className="sm:col-span-2">
                            <FileUpload
                                label="Profile Picture"
                                name="profile_picture"
                                accept=".jpg,.jpeg,.png,.gif"
                                onChange={handleInputChange}
                                file={coverFile}
                                maxSizeInfo="JPG, PNG, GIF (Max 5MB)"
                                IconComponent={Image}
                            />
                            {isUploading && (
                                <p className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                                    <Loader2 className="h-4 w-4 animate-spin" /> Uploading ...
                                </p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="col-span-2 mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full rounded-md bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 sm:w-auto"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 sm:w-auto"
                            >
                                {isLoading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileEditModal;
