import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/api";
import axios from "axios";
import ThemeToggle from "../components/ThemeToggle";

const Api = axios.create({
    baseURL: "http://localhost:2000/api",
    headers: {
        "Content-Type": "application/json"
    }
});

export default function Login() {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // LOGIN FORM
    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    // FORGOT PASSWORD MODAL
    const [showForgot, setShowForgot] = useState(false);
    const [step, setStep] = useState(1);
    const [forgotForm, setForgotForm] = useState({
        username: "",
        cityOfBirth: "",
        childhoodNickname: "",
        newPassword: ""
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) navigate("/");
    }, [navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleForgotChange = (e) => {
        setForgotForm({
            ...forgotForm,
            [e.target.name]: e.target.value
        });
    };

    // ================= LOGIN =================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await login(form);
            localStorage.setItem("token", res.token);
            navigate("/");
        } catch (error) {
            alert(error.message || "Login failed");
            setIsLoading(false);
        }
    };

    // ================= FORGOT PASSWORD =================
    const handleForgotSubmit = async () => {
        try {
            const res = await Api.post("/auth/forgot-password", forgotForm);
            alert(res.data.message || "Password reset successful");
            setShowForgot(false);
            setStep(1);
            setForgotForm({
                username: "",
                cityOfBirth: "",
                childhoodNickname: "",
                newPassword: ""
            });
        } catch (error) {
            alert(error.response?.data?.message || "Reset failed");
        }
    };

    return (
        <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-[#E8F5E9] via-[#F1F5F9] to-[#E0F2FE] dark:bg-gradient-to-br dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0F172A] transition-colors duration-500 p-3 xs:p-4 sm:p-6 md:p-8 lg:p-10">
            
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-[10%] w-[min(300px,50vw)] h-[min(300px,50vw)] bg-[#16A34A]/5 dark:bg-[#16A34A]/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-[10%] w-[min(350px,60vw)] h-[min(350px,60vw)] bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(400px,70vw)] h-[min(400px,70vw)] bg-[#15803D]/3 dark:bg-[#15803D]/5 rounded-full blur-3xl"></div>
            </div>

            {/* Theme Toggle */}
            <div className="fixed top-3 right-3 xs:top-4 xs:right-4 sm:top-6 sm:right-6 z-50">
                <ThemeToggle variant="header" />
            </div>

            {/* LOGIN CARD - Perfectly responsive container */}
            <div className="w-full max-w-[420px] sm:max-w-md md:max-w-lg lg:max-w-xl relative z-10">
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl xs:rounded-2xl shadow-lg xs:shadow-xl sm:shadow-2xl overflow-hidden transition-all duration-300 border border-white/20 dark:border-gray-700/50">
                    
                    {/* Brand Header */}
                    <div className="px-4 xs:px-6 sm:px-8 pt-4 xs:pt-6 sm:pt-8 pb-3 xs:pb-4 sm:pb-6 text-center border-b border-gray-100/50 dark:border-gray-700/50">
                        {/* Logo - Responsive sizing */}
                        <div className="inline-flex items-center justify-center w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-xl xs:rounded-2xl bg-gradient-to-br from-[#16A34A] to-[#15803D] mb-3 xs:mb-4 shadow-md xs:shadow-lg">
                            <svg className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        
                        {/* Title - Responsive text */}
                        <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                            Parking Space Sales
                        </h2>
                        <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                            Management System
                        </h2>
                        <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400 mt-1 xs:mt-2">
                            Eco Smart Parking Solution
                        </p>
                    </div>

                    {/* Form - Responsive padding */}
                    <form onSubmit={handleSubmit} className="p-4 xs:p-6 sm:p-8 space-y-3 xs:space-y-4 sm:space-y-5">
                        {/* Username Field */}
                        <div className="space-y-1 xs:space-y-1.5 sm:space-y-2">
                            <label className="text-xs xs:text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5 xs:gap-2">
                                <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4 sm:h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Username
                            </label>
                            <input
                                name="username"
                                placeholder="Enter your username"
                                className="w-full px-3 xs:px-3.5 sm:px-4 py-2 xs:py-2.5 sm:py-3 text-sm xs:text-base rounded-lg xs:rounded-xl border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all duration-200"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1 xs:space-y-1.5 sm:space-y-2">
                            <label className="text-xs xs:text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5 xs:gap-2">
                                <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4 sm:h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    className="w-full px-3 xs:px-3.5 sm:px-4 py-2 xs:py-2.5 sm:py-3 text-sm xs:text-base rounded-lg xs:rounded-xl border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all duration-200 pr-16 xs:pr-18 sm:pr-20"
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-1.5 xs:right-2 top-1/2 -translate-y-1/2 px-2 xs:px-2.5 sm:px-3 py-1 xs:py-1.5 text-[10px] xs:text-xs sm:text-sm font-medium text-[#16A34A] hover:text-[#15803D] bg-[#16A34A]/10 hover:bg-[#16A34A]/20 rounded-md xs:rounded-lg transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-right">
                            <button
                                type="button"
                                onClick={() => setShowForgot(true)}
                                className="text-[10px] xs:text-xs sm:text-sm text-[#3B82F6] hover:text-[#16A34A] font-medium transition-colors"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Sign In Button */}
                        <button
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#15803D] hover:to-[#16A34A] text-white font-semibold py-2 xs:py-2.5 sm:py-3 text-sm xs:text-base rounded-lg xs:rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 xs:gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 xs:h-5 xs:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="px-4 xs:px-6 sm:px-8 pb-3 xs:pb-4 sm:pb-6 text-center">
                        <div className="flex flex-col xs:flex-row items-center justify-center gap-1 xs:gap-2 text-[10px] xs:text-xs text-gray-400 dark:text-gray-500">
                            <div className="flex items-center gap-1">
                                <svg className="w-3 h-3 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>100% Carbon-neutral</span>
                            </div>
                            <span className="hidden xs:inline">•</span>
                            <div className="flex items-center gap-1">
                                <svg className="w-3 h-3 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span>Green Technology</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= FORGOT PASSWORD MODAL ================= */}
            {showForgot && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => {
                            setShowForgot(false);
                            setStep(1);
                        }}
                    ></div>
                    
                    {/* Modal - Responsive sizing */}
                    <div className="relative w-full max-w-[400px] xs:max-w-sm sm:max-w-md bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white dark:bg-gray-800 px-4 xs:px-5 sm:px-6 py-3 xs:py-4 border-b border-gray-100/50 dark:border-gray-700/50 flex justify-between items-center">
                            <div className="flex items-center gap-2 xs:gap-3">
                                <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-lg xs:rounded-xl bg-gradient-to-br from-[#16A34A] to-[#15803D] flex items-center justify-center shadow-md">
                                    <svg className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                </div>
                                <h2 className="text-sm xs:text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                                    Reset Password
                                </h2>
                            </div>
                            <button
                                onClick={() => {
                                    setShowForgot(false);
                                    setStep(1);
                                }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-4 xs:p-5 sm:p-6 space-y-4 xs:space-y-5">
                            {/* Progress Steps - Responsive */}
                            <div className="flex items-center justify-between px-1 xs:px-2">
                                {[1, 2, 3].map((s) => (
                                    <div key={s} className="flex items-center flex-1">
                                        <div className={`w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs xs:text-sm font-medium transition-all ${
                                            step >= s 
                                                ? "bg-gradient-to-r from-[#16A34A] to-[#15803D] text-white shadow-md" 
                                                : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                        }`}>
                                            {step > s ? (
                                                <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : s}
                                        </div>
                                        {s < 3 && (
                                            <div className={`flex-1 h-0.5 xs:h-1 mx-1 xs:mx-2 rounded-full transition-all ${
                                                step > s ? "bg-[#16A34A]" : "bg-gray-200 dark:bg-gray-700"
                                            }`} />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* STEP 1 */}
                            {step === 1 && (
                                <div className="space-y-3 xs:space-y-4">
                                    <div className="space-y-1 xs:space-y-1.5">
                                        <label className="text-xs xs:text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                                            Username
                                        </label>
                                        <input
                                            name="username"
                                            placeholder="Enter your username"
                                            className="w-full px-3 xs:px-4 py-2 xs:py-2.5 text-sm xs:text-base rounded-lg xs:rounded-xl border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all"
                                            onChange={handleForgotChange}
                                        />
                                    </div>
                                    <button
                                        className="w-full bg-gradient-to-r from-[#3B82F6] to-blue-600 hover:from-blue-600 hover:to-[#3B82F6] text-white font-medium py-2 xs:py-2.5 text-sm xs:text-base rounded-lg xs:rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                                        onClick={() => setStep(2)}
                                        type="button"
                                    >
                                        Continue
                                    </button>
                                </div>
                            )}

                            {/* STEP 2 */}
                            {step === 2 && (
                                <div className="space-y-3 xs:space-y-4">
                                    <div className="space-y-1 xs:space-y-1.5">
                                        <label className="text-xs xs:text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                                            City of Birth
                                        </label>
                                        <input
                                            name="cityOfBirth"
                                            placeholder="Enter your city of birth"
                                            className="w-full px-3 xs:px-4 py-2 xs:py-2.5 text-sm xs:text-base rounded-lg xs:rounded-xl border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all"
                                            onChange={handleForgotChange}
                                        />
                                    </div>
                                    <div className="space-y-1 xs:space-y-1.5">
                                        <label className="text-xs xs:text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                                            Childhood Nickname
                                        </label>
                                        <input
                                            name="childhoodNickname"
                                            placeholder="Enter your childhood nickname"
                                            className="w-full px-3 xs:px-4 py-2 xs:py-2.5 text-sm xs:text-base rounded-lg xs:rounded-xl border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all"
                                            onChange={handleForgotChange}
                                        />
                                    </div>
                                    <button
                                        className="w-full bg-gradient-to-r from-[#3B82F6] to-blue-600 hover:from-blue-600 hover:to-[#3B82F6] text-white font-medium py-2 xs:py-2.5 text-sm xs:text-base rounded-lg xs:rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                                        onClick={() => setStep(3)}
                                        type="button"
                                    >
                                        Continue
                                    </button>
                                </div>
                            )}

                            {/* STEP 3 */}
                            {step === 3 && (
                                <div className="space-y-3 xs:space-y-4">
                                    <div className="space-y-1 xs:space-y-1.5">
                                        <label className="text-xs xs:text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            placeholder="Enter new password"
                                            className="w-full px-3 xs:px-4 py-2 xs:py-2.5 text-sm xs:text-base rounded-lg xs:rounded-xl border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all"
                                            onChange={handleForgotChange}
                                        />
                                    </div>
                                    <button
                                        className="w-full bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#15803D] hover:to-[#16A34A] text-white font-medium py-2 xs:py-2.5 text-sm xs:text-base rounded-lg xs:rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                                        onClick={handleForgotSubmit}
                                        type="button"
                                    >
                                        Reset Password
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={() => {
                                    setShowForgot(false);
                                    setStep(1);
                                }}
                                className="w-full text-gray-500 dark:text-gray-400 text-xs xs:text-sm font-medium py-1.5 xs:py-2 hover:text-gray-700 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}