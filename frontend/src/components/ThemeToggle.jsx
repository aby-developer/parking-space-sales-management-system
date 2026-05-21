import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ variant = "default", className = "" }) {
    const { isDarkMode, toggleTheme } = useTheme();

    const variants = {
        header: {
            button: `p-2.5 rounded-full transition-all duration-200 ${
                isDarkMode 
                    ? "bg-gray-800 hover:bg-gray-700 text-yellow-500" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`,
            icon: "w-5 h-5"
        },
        floating: {
            button: `fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-200 bg-[#16A34A] hover:bg-[#15803D] text-white lg:hidden`,
            icon: "w-6 h-6"
        }
    };

    const style = variants[variant] || variants.header;

    return (
        <button
            onClick={toggleTheme}
            className={`${style.button} ${className}`}
            aria-label="Toggle theme"
        >
            {isDarkMode ? (
                <svg className={style.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ) : (
                <svg className={style.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )}
        </button>
    );
}