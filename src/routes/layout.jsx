import { Outlet } from "react-router-dom";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";
import Header from "../layouts/header";


const Layout = () => {
    const isDesktopDevice = useMediaQuery("(min-width: 900px)");
    const [collapsed, setCollapsed] = useState(!isDesktopDevice);

    const sidebarRef = useRef(null);

    useEffect(() => {
        setCollapsed(!isDesktopDevice);
    }, [isDesktopDevice]);

    useClickOutside([sidebarRef], () => {
        if (!isDesktopDevice && !collapsed) {
            setCollapsed(true);
        }
    });

    return (
        <div className="min-h-screen bg-slate-100 transition-colors dark:bg-slate-950">
            <div
                className={cn(
                    "pointer-events-none fixed inset-0 -z-10 bg-black opacity-0 transition-opacity",
                    !collapsed && "max-md:pointer-events-auto max-md:z-50 max-md:opacity-30",
                )}
            />
             {/* <Sidebar
                ref={sidebarRef}
                collapsed={collapsed}
            /> */}
            <div>
                <Header
                  
                />
                <div className="h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-2">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
