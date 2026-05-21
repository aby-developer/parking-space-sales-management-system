import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

export default function Sidebar() {
    const location = useLocation();
    const { isDarkMode, toggleTheme } = useTheme();
    const [open, setOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(() => {
        const saved = localStorage.getItem("sidebarCollapsed");
        return saved === "true";
    });
    const [hoveredItem, setHoveredItem] = useState(null);

    // MENU ITEMS with proper icons
    const menu = [
        {
            name: "Dashboard",
            path: "/",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            name: "Cars",
            path: "/cars",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 12h8m-7 4h6" />
                </svg>
            )
        },
        {
            name: "Slots",
            path: "/slots",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
            )
        },
        {
            name: "Parking",
            path: "/parking",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
            )
        },
        {
            name: "Payments",
            path: "/payments",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            )
        },
        {
            name: "Reports",
            path: "/reports",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        }
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.replace("/login");
    };

    const toggleCollapse = () => {
        const newState = !collapsed;
        setCollapsed(newState);
        localStorage.setItem("sidebarCollapsed", newState);
    };

    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    // Get sidebar width based on collapsed state
    const sidebarWidth = collapsed ? "w-20" : "w-[85%] sm:w-72 md:w-64 lg:w-64";

    return (
        <>
            {/* MOBILE BUTTON */}
            <button
                onClick={() => setOpen(!open)}
                className="
                    lg:hidden fixed top-4 left-4 z-50
                    bg-gradient-to-r from-[#16A34A] to-[#15803D]
                    text-white p-3 rounded-xl shadow-lg
                    hover:shadow-xl transition-all duration-200
                "
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* OVERLAY */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden transition-all duration-300"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`
                    fixed top-0 left-0 z-40
                    h-screen
                    ${sidebarWidth}
                    transition-all duration-300 ease-in-out
                    shadow-2xl
                    flex flex-col
                    bg-white dark:bg-gray-900
                    border-r border-gray-200 dark:border-gray-800

                    ${open
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                    }
                `}
            >
                {/* COLLAPSE BUTTON - Desktop only */}
                <button
                    onClick={toggleCollapse}
                    className="
                        absolute -right-3 top-20
                        hidden lg:flex items-center justify-center
                        w-6 h-6
                        bg-white dark:bg-gray-800
                        border border-gray-200 dark:border-gray-700
                        rounded-full
                        shadow-md
                        hover:shadow-lg
                        transition-all duration-200
                        z-50
                    "
                >
                    <svg 
                        className={`w-3 h-3 text-gray-600 dark:text-gray-400 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                    {/* LOGO */}
                    <div className={`mb-8 text-center transition-all duration-300 ${collapsed ? "px-0" : ""}`}>
                        <div className={`
                            rounded-2xl
                            mx-auto
                            flex items-center justify-center
                            bg-gradient-to-br from-[#16A34A] to-[#15803D]
                            shadow-lg
                            mb-3
                            transition-all duration-200
                            hover:scale-105
                            ${collapsed ? "w-12 h-12" : "w-16 h-16"}
                        `}>
                            <svg className={`text-white ${collapsed ? "w-6 h-6" : "w-8 h-8"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>

                        {!collapsed && (
                            <>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-[#16A34A] to-[#15803D] bg-clip-text text-transparent">
                                    Eco Smart Parking
                                </h1>
                                <p className="text-xs text-gray-400 mt-1">
                                    Green Management System
                                </p>
                            </>
                        )}
                    </div>

                    {/* MENU */}
                    <nav className="flex flex-col gap-2">
                        {menu.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onMouseEnter={() => setHoveredItem(item.path)}
                                onMouseLeave={() => setHoveredItem(null)}
                                className={`
                                    relative
                                    flex items-center
                                    ${collapsed ? "justify-center" : "justify-start gap-4"}
                                    p-3
                                    rounded-xl
                                    overflow-hidden
                                    transition-all duration-200
                                    group

                                    ${location.pathname === item.path
                                        ? "bg-gradient-to-r from-[#16A34A]/10 to-[#15803D]/10 text-gray-900 dark:text-white shadow-sm"
                                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                                    }
                                `}
                                title={collapsed ? item.name : ""}
                            >
                                {/* ACTIVE BAR */}
                                {location.pathname === item.path && (
                                    <div className="
                                        absolute left-0 top-1/2
                                        -translate-y-1/2
                                        w-1 h-8
                                        rounded-r-full
                                        bg-gradient-to-b from-[#16A34A] to-[#15803D]
                                    " />
                                )}

                                {/* ICON CONTAINER */}
                                <div className={`
                                    rounded-xl
                                    flex items-center justify-center
                                    transition-all duration-200
                                    z-10
                                    ${collapsed ? "w-10 h-10" : "w-10 h-10"}
                                    ${location.pathname === item.path
                                        ? "bg-[#16A34A]/10 text-[#16A34A]"
                                        : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-white/10 group-hover:text-gray-700 dark:group-hover:text-white"
                                    }
                                `}>
                                    {item.icon}
                                </div>

                                {/* TEXT - hidden when collapsed */}
                                {!collapsed && (
                                    <span className="font-medium text-sm sm:text-base z-10">
                                        {item.name}
                                    </span>
                                )}

                                {/* HOVER EFFECT */}
                                {hoveredItem === item.path &&
                                    location.pathname !== item.path && (
                                        <div className="
                                            absolute inset-0
                                            transition-all duration-300
                                            bg-gradient-to-r from-[#16A34A]/5 to-[#15803D]/5
                                        " />
                                    )}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* THEME TOGGLE IN SIDEBAR - FIXED VERSION */}
                <div className={`px-4 pb-4 ${collapsed ? "flex justify-center" : ""}`}>
                    {collapsed ? (
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-200 group"
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? (
                                <svg className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={toggleTheme}
                            className="w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400"
                        >
                            <div className="flex items-center gap-3">
                                {isDarkMode ? (
                                    <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )}
                                <span className="text-sm font-medium">
                                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                                </span>
                            </div>
                            <div className={`w-8 h-4 rounded-full transition-all duration-200 ${isDarkMode ? "bg-[#16A34A]" : "bg-gray-300"}`}>
                                <div className={`w-3 h-3 rounded-full bg-white transition-all duration-200 mt-0.5 ${isDarkMode ? "translate-x-4" : "translate-x-0.5"}`} />
                            </div>
                        </button>
                    )}
                </div>

                {/* LOGOUT */}
                <div className={`p-4 sm:p-5 border-t border-gray-200 dark:border-gray-700 ${collapsed ? "flex justify-center" : ""}`}>
                    <button
                        onClick={handleLogout}
                        className={`
                            bg-gradient-to-r from-red-500 to-red-600
                            hover:from-red-600 hover:to-red-700
                            rounded-xl
                            font-semibold
                            transition-all duration-200
                            shadow-md
                            hover:shadow-lg
                            flex items-center justify-center gap-3
                            group
                            ${collapsed ? "w-10 h-10 p-0" : "w-full p-3"}
                        `}
                        title={collapsed ? "Logout" : ""}
                    >
                        <div className={`
                            rounded-lg
                            bg-white/20
                            flex items-center justify-center
                            transition-all duration-200
                            group-hover:scale-105
                            ${collapsed ? "w-6 h-6" : "w-8 h-8"}
                        `}>
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </div>
                        {!collapsed && <span className="text-white">Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}