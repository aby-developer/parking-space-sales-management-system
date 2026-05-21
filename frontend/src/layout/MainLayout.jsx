import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useState, useEffect } from "react";

export default function MainLayout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        const saved = localStorage.getItem("sidebarCollapsed");
        return saved === "true";
    });

    useEffect(() => {
        const handleStorageChange = () => {
            setSidebarCollapsed(localStorage.getItem("sidebarCollapsed") === "true");
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <div className="min-h-screen bg-[#F1F5F9] dark:bg-gray-900 transition-colors duration-300">
            <Sidebar />
            <main 
                className={`
                    min-h-screen
                    transition-all duration-300
                    overflow-hidden
                    ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}
                `}
            >
                <div className="h-screen overflow-y-auto">
                    <div className="p-4 sm:p-6">
                        <Outlet />
                    </div>
                </div>
            </main>
            <ThemeToggle variant="floating" />
        </div>
    );
}