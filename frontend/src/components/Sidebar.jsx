import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Sidebar() {
    const location = useLocation();

    const [open, setOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);

    // GRAPHIC STYLE MENUS
    const menu = [
        {
            name: "Dashboard",
            path: "/",
            graphic: "◫"
        },
        {
            name: "Cars",
            path: "/cars",
            graphic: "▣"
        },
        {
            name: "Slots",
            path: "/slots",
            graphic: "◧"
        },
        {
            name: "Parking",
            path: "/parking",
            graphic: "▤"
        },
        {
            name: "Payments",
            path: "/payments",
            graphic: "◈"
        },
        {
            name: "Reports",
            path: "/reports",
            graphic: "◩"
        }
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.replace("/login");
    };

    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    return (
        <>
            {/* MOBILE BUTTON */}
            <button
                onClick={() => setOpen(!open)}
                className="
                    lg:hidden fixed top-4 left-4 z-50
                    bg-gradient-to-r from-purple-500 to-pink-500
                    text-white p-3 rounded-xl shadow-xl
                "
            >
                ☰
            </button>

            {/* OVERLAY */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`
                    fixed top-0 left-0 z-40
                    h-screen
                    w-[85%] sm:w-72 md:w-64 lg:w-64
                    bg-gradient-to-b from-slate-900 to-slate-800
                    text-white
                    flex flex-col
                    transition-transform duration-300 ease-in-out
                    shadow-2xl

                    ${open
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                    }
                `}
            >
                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5">

                    {/* LOGO */}
                    <div className="mb-8 text-center">
                        <div className="
                            w-16 h-16
                            rounded-2xl
                            mx-auto
                            flex items-center justify-center
                            bg-gradient-to-br from-purple-500 to-pink-500
                            text-3xl
                            shadow-lg
                            mb-3
                        ">
                            ◈
                        </div>

                        <h1 className="
                            text-xl font-bold
                            bg-gradient-to-r from-purple-400 to-pink-400
                            bg-clip-text text-transparent
                        ">
                            PSSMS
                        </h1>

                        <p className="text-white/40 text-xs mt-1">
                            Parking System
                        </p>
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
                                    flex items-center gap-4
                                    p-3
                                    rounded-xl
                                    overflow-hidden
                                    transition-all duration-300

                                    ${location.pathname === item.path
                                        ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white shadow-lg"
                                        : "text-white/70 hover:text-white hover:bg-white/5"
                                    }
                                `}
                            >
                                {/* ACTIVE BAR */}
                                {location.pathname === item.path && (
                                    <div className="
                                        absolute left-0 top-1/2
                                        -translate-y-1/2
                                        w-1 h-8
                                        rounded-r-full
                                        bg-gradient-to-b from-purple-500 to-pink-500
                                    " />
                                )}

                                {/* GRAPHIC */}
                                <div className="
                                    w-10 h-10
                                    rounded-xl
                                    bg-white/10
                                    flex items-center justify-center
                                    text-lg
                                    backdrop-blur-sm
                                    z-10
                                ">
                                    {item.graphic}
                                </div>

                                {/* TEXT */}
                                <span className="font-medium text-sm sm:text-base z-10">
                                    {item.name}
                                </span>

                                {/* HOVER EFFECT */}
                                {hoveredItem === item.path &&
                                    location.pathname !== item.path && (
                                        <div className="
                                            absolute inset-0
                                            bg-gradient-to-r
                                            from-purple-500/10
                                            to-pink-500/10
                                        " />
                                    )}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* LOGOUT */}
                <div className="p-4 sm:p-5 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="
                            w-full
                            bg-gradient-to-r from-red-500 to-pink-600
                            hover:from-red-600 hover:to-pink-700
                            p-3
                            rounded-xl
                            font-semibold
                            transition-all duration-300
                            shadow-lg
                            flex items-center justify-center gap-3
                        "
                    >
                        <div className="
                            w-8 h-8
                            rounded-lg
                            bg-white/20
                            flex items-center justify-center
                        ">
                            ⌦
                        </div>

                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}