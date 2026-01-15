/* eslint-disable react/prop-types */
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileEditModal from "./profileEditModal";
import DefaultProfileAvatar from "../../../public/default-user-avatar.webp";

export const ProfileHover = ({ userInfo, matchedAdmin, isAdmin, adminLoading }) => {
    const { theme } = useTheme();
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();

    if (adminLoading) {
        return <div className="p-4 text-center text-gray-700 dark:text-gray-200">Loading profile...</div>;
    }

    const displayUser = isAdmin ? matchedAdmin : userInfo;

    const formatId = (id) => (id ? id.slice(0, 6) : "N/A");

    // Logout handler
    const handleLogout = () => {
        localStorage.removeItem("accessToken"); // Remove token
        navigate("/login"); // Navigate to login
        window.location.reload(); // Optional: reload page to reset state
    };

    return (
        <div
            className={`mt-4 rounded-2xl border p-4 px-6 shadow-xl ${
                theme === "dark" ? "border-gray-700 bg-slate-800 text-gray-200" : "border-gray-200 bg-white text-gray-700"
            } `}
        >
            <div className="flex flex-col items-center">
                {/* Profile Image */}
                <img
                    src={displayUser?.profile_picture || DefaultProfileAvatar}
                    alt="Profile"
                    className="h-16 w-16 rounded-full border-2 border-purple-400 object-cover"
                />

                {/* Status */}
                <span
                    className={`mt-2 rounded-full px-3 py-1 text-sm font-medium ${
                        displayUser?.status === "Active"
                            ? theme === "dark"
                                ? "bg-green-600 text-green-200"
                                : "bg-green-100 text-green-600"
                            : displayUser?.status === "Blocked"
                              ? theme === "dark"
                                  ? "bg-red-600 text-red-200"
                                  : "bg-red-100 text-red-600"
                              : theme === "dark"
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-100 text-gray-600"
                    }`}
                >
                    {displayUser?.status || "N/A"}
                </span>

                {/* User Info */}
                <div className="mt-3 w-full space-y-2">
                    <div className="flex justify-between">
                        <span className="font-semibold">Name:</span>
                        <span>{displayUser?.name || "Guest User"}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="font-semibold">Email:</span>
                        <span>{displayUser?.email || "N/A"}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="font-semibold">Phone:</span>
                        <span>{displayUser?.phone || "N/A"}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="font-semibold">ID:</span>
                        <span>{formatId(displayUser?._id)}</span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="mt-5 flex w-full flex-col gap-2">
                    {/* View Profile */}
                    <button
                        onClick={() => setOpenModal(true)}
                        className={`w-full rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                            theme === "dark" ? "bg-blue-600 text-white hover:bg-blue-500" : "bg-blue-500 text-white hover:bg-blue-700"
                        }`}
                    >
                        View Profile
                    </button>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className={`w-full rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                            theme === "dark" ? "bg-red-600 text-white hover:bg-red-500" : "bg-red-500 text-white hover:bg-red-700"
                        }`}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Modal */}
            {openModal && (
                <ProfileEditModal
                    user={displayUser}
                    onClose={() => setOpenModal(false)}
                />
            )}
        </div>
    );
};
