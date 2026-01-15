/* eslint-disable react/prop-types */

import { ProfileHover } from "./profileHover";

const ProfileLayout = ({ userInfo, matchedAdmin, isAdmin, adminLoading }) => {
    const displayUser = isAdmin ? matchedAdmin?.userId : userInfo;

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Side (ProfileHover) */}
            <div>
                <ProfileHover
                    userInfo={userInfo}
                    matchedAdmin={matchedAdmin}
                    isAdmin={isAdmin}
                    adminLoading={adminLoading}
                />
            </div>

            {/* Right Side (Profile Details + Device Activity) */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800 lg:col-span-2">
                {/* Profile Info */}
                <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">My Profile</h2>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="font-semibold">Full Name:</span>
                        <span>{displayUser?.name || "Guest User"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold">Email:</span>
                        <span>{displayUser?.email || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold">Student ID:</span>
                        <span>{displayUser?.studentId || "WEB9-XXXX"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold">Mobile Number:</span>
                        <span>{displayUser?.phone || "N/A"}</span>
                    </div>
                </div>

                {/* Device Activity */}
                <h3 className="mb-3 mt-8 text-lg font-semibold text-purple-500">Device Activity</h3>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                                <th className="p-3 text-left">Serial</th>
                                <th className="p-3 text-left">Platform</th>
                                <th className="p-3 text-left">Date</th>
                                <th className="p-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayUser?.devices?.length ? (
                                displayUser.devices.map((device, index) => (
                                    <tr
                                        key={index}
                                        className="border-t dark:border-gray-600"
                                    >
                                        <td className="p-3">{index + 1}</td>
                                        <td className="p-3">{device.platform}</td>
                                        <td className="p-3">{device.date}</td>
                                        <td className="cursor-pointer p-3 text-purple-500">Remove</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="p-3 text-center text-gray-500"
                                    >
                                        No Device Activity Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProfileLayout;
