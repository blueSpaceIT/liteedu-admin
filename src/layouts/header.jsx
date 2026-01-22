/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/use-theme.jsx";
import { Bell, Moon, Sun } from "lucide-react";
import { connect } from "react-redux";
import { ProfileHover } from "../components/profile/profileHover";
import { userStateToProps } from "../redux/state";
// import { useAdmingetAllQuery } from "../redux/features/api/admin/adminApi.js";

import DefaultProfileAvatar from "../../public/default-user-avatar.webp";
import Logo from "../assets/Logo-01.png"; // <-- put your logo here
import { cn } from "../utils/cn.js";
import { useAdminGetAllQuery } from "../redux/features/api/admin/adminApi.js";

const IconBtn = ({ className, children, ...props }) => (
    <button
        className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-md transition",
            "hover:bg-slate-100 active:scale-[0.98] dark:hover:bg-slate-800",
            className,
        )}
        {...props}
    >
        {children}
    </button>
);

/* eslint-disable no-unused-vars */
const Header = ({ collapsed, setCollapsed, userInfo }) => {
    const { theme, setTheme } = useTheme();
    const [showMenu, setShowMenu] = useState(false);

    // load user (redux -> localStorage)
    const savedUser = localStorage.getItem("userInfo");
    const [localUser, setLocalUser] = useState(savedUser ? JSON.parse(savedUser) : userInfo || null);

    useEffect(() => {
        if (userInfo) {
            setLocalUser(userInfo);
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
        }
    }, [userInfo]);

    // admins
    const { data: adminResponse, isLoading: adminLoading } = useAdminGetAllQuery();
    const matchedAdmin = adminResponse?.data?.find((admin) => admin.userId?._id === localUser?._id);

    const mergedAdmin = matchedAdmin
        ? {
              ...matchedAdmin.userId,
              _id: matchedAdmin._id,
              address: matchedAdmin.address,
              status: matchedAdmin.status,
              role: matchedAdmin.role,
              createdAt: matchedAdmin.createdAt,
              updatedAt: matchedAdmin.updatedAt,
              isDeleted: matchedAdmin.isDeleted,
              profile_picture: matchedAdmin.profile_picture,
          }
        : null;

    const isAdmin = Boolean(mergedAdmin);

    const toggleMenu = useCallback(() => setShowMenu((s) => !s), []);

    // outside click
    const menuRef = useRef(null);
    useEffect(() => {
        const onDown = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, []);

    // avatar fallback
    const onAvatarError = (e) => {
        if (e.currentTarget.src !== DefaultProfileAvatar) {
            e.currentTarget.src = DefaultProfileAvatar;
        }
    };

    return (
        <header
            className={cn(
                "relative z-40 w-full",
                "flex h-[60px] items-center justify-between",
                "border-b border-slate-200 bg-white px-3 shadow-sm md:px-4",
                "transition-colors dark:border-slate-800 dark:bg-slate-900",
            )}
        >
            {/* Left: collapse + logo */}
            <div className="flex items-center gap-2 md:gap-3">
                <Link
                    to="/"
                    className="flex items-center gap-2 md:gap-3"
                >
                    <img
                        src={Logo}
                        alt="Logo"
                        className="h-7 w-7 object-contain md:h-8 md:w-8"
                    />
                    <span className="hidden text-sm font-semibold text-slate-800 dark:text-slate-100 md:inline">Admin Dashboard</span>
                </Link>
            </div>

            {/* Right cluster */}
            <div className="relative flex items-center gap-1.5 md:gap-2">
                {/* theme toggle */}
                <IconBtn
                    aria-label="Toggle theme"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                    <Sun
                        size={18}
                        className="dark:hidden"
                    />
                    <Moon
                        size={18}
                        className="hidden dark:block"
                    />
                </IconBtn>

                {/* notifications */}
                <IconBtn aria-label="Notifications">
                    <Bell size={18} />
                </IconBtn>

                {/* profile */}
                <div
                    className="relative"
                    ref={menuRef}
                >
                    <button
                        onClick={toggleMenu}
                        aria-haspopup="menu"
                        aria-expanded={showMenu}
                        className="h-10 w-10 overflow-hidden rounded-full ring-1 ring-slate-200 transition hover:ring-slate-300 dark:ring-slate-700 dark:hover:ring-slate-600"
                    >
                        <img
                            src={mergedAdmin?.profile_picture || localUser?.avatar || DefaultProfileAvatar}
                            onError={onAvatarError}
                            alt="profile"
                            className="h-full w-full rounded-full object-cover"
                        />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-72">
                            <ProfileHover
                                userInfo={localUser}
                                matchedAdmin={mergedAdmin}
                                isAdmin={isAdmin}
                                adminLoading={adminLoading}
                            />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default connect(userStateToProps)(Header);
