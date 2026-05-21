import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Header({ title, subtitle, icon, actions }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={`sticky top-0 z-20 transition-all duration-300 ${
            scrolled 
                ? "bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg" 
                : "bg-transparent"
        } -mx-6 px-6 py-4 mb-6 rounded-b-2xl`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {icon && (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#16A34A] to-[#15803D] flex items-center justify-center shadow-md">
                            <span className="text-2xl">{icon}</span>
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#16A34A] to-[#15803D] bg-clip-text text-transparent">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle variant="header" />
                    {actions}
                </div>
            </div>
        </div>
    );
}