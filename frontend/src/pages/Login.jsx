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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8F5E9] via-[#F1F5F9] to-[#E0F2FE] dark:bg-gradient-to-br dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0F172A] transition-colors duration-500">
            
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-[#16A34A]/5 dark:bg-[#16A34A]/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#15803D]/3 dark:bg-[#15803D]/5 rounded-full blur-3xl"></div>
            </div>

            {/* Theme Toggle on Login Page */}
            <div className="fixed top-6 right-6 z-10">
                <ThemeToggle variant="header" />
            </div>

            {/* LOGIN CARD */}
            <div className="w-full max-w-md mx-4 relative z-10">
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 border border-white/20 dark:border-gray-700/50">
                    
                    {/* Brand Header */}
                    <div className="px-8 pt-8 pb-4 text-center border-b border-gray-100/50 dark:border-gray-700/50">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#16A34A] to-[#15803D] mb-4 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#16A34A] to-[#15803D] dark:from-[#22C55E] dark:to-[#16A34A] bg-clip-text text-transparent">
                            Parking Space Sales<br />Management System
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Eco Smart Parking Solution</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-5">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Username
                            </label>
                            <input
                                name="username"
                                placeholder="Enter your username"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all duration-200"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all duration-200 pr-12"
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[#16A34A] hover:text-[#15803D] transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#15803D] hover:to-[#16A34A] text-white font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Sign In
                                </>
                            )}
                        </button>

                        {/* FORGOT PASSWORD BUTTON */}
                        <p
                            onClick={() => setShowForgot(true)}
                            className="text-center text-sm text-[#3B82F6] hover:text-[#16A34A] cursor-pointer transition-colors"
                        >
                            Forgot password?
                        </p>
                    </form>

                    {/* Green energy footer */}
                    <div className="px-8 pb-6 text-center">
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                            <svg className="w-3 h-3 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>100% Carbon-neutral parking solution</span>
                            <svg className="w-3 h-3 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= FORGOT PASSWORD MODAL ================= */}
            {showForgot && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transition-all duration-300 border border-white/20 dark:border-gray-700/50">
                        <div className="px-6 py-4 border-b border-gray-100/50 dark:border-gray-700/50 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#16A34A] to-[#15803D] flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
                            </div>
                            <button
                                onClick={() => {
                                    setShowForgot(false);
                                    setStep(1);
                                }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Progress Steps */}
                            <div className="flex items-center justify-between mb-6">
                                {[1, 2, 3].map((s) => (
                                    <div key={s} className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                                            step >= s 
                                                ? "bg-gradient-to-r from-[#16A34A] to-[#15803D] text-white shadow-md" 
                                                : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                        }`}>
                                            {s}
                                        </div>
                                        {s < 3 && (
                                            <div className={`w-12 h-0.5 mx-2 transition-all ${
                                                step > s ? "bg-[#16A34A]" : "bg-gray-200 dark:bg-gray-700"
                                            }`} />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* STEP 1 */}
                            {step === 1 && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                                        <input
                                            name="username"
                                            placeholder="Enter your username"
                                            className="w-full px-4 py-2.5 mt-1 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all"
                                            onChange={handleForgotChange}
                                        />
                                    </div>
                                    <button
                                        className="w-full bg-gradient-to-r from-[#3B82F6] to-blue-600 hover:from-blue-600 hover:to-[#3B82F6] text-white font-medium py-2.5 rounded-xl transition-all duration-200 shadow-md"
                                        onClick={() => setStep(2)}
                                        type="button"
                                    >
                                        Continue
                                    </button>
                                </div>
                            )}

                            {/* STEP 2 */}
                            {step === 2 && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">City of birth</label>
                                        <input
                                            name="cityOfBirth"
                                            placeholder="Enter your city of birth"
                                            className="w-full px-4 py-2.5 mt-1 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all"
                                            onChange={handleForgotChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Childhood nickname</label>
                                        <input
                                            name="childhoodNickname"
                                            placeholder="Enter your childhood nickname"
                                            className="w-full px-4 py-2.5 mt-1 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all"
                                            onChange={handleForgotChange}
                                        />
                                    </div>
                                    <button
                                        className="w-full bg-gradient-to-r from-[#3B82F6] to-blue-600 hover:from-blue-600 hover:to-[#3B82F6] text-white font-medium py-2.5 rounded-xl transition-all duration-200 shadow-md"
                                        onClick={() => setStep(3)}
                                        type="button"
                                    >
                                        Continue
                                    </button>
                                </div>
                            )}

                            {/* STEP 3 */}
                            {step === 3 && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            placeholder="Enter new password"
                                            className="w-full px-4 py-2.5 mt-1 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all"
                                            onChange={handleForgotChange}
                                        />
                                    </div>
                                    <button
                                        className="w-full bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#15803D] hover:to-[#16A34A] text-white font-medium py-2.5 rounded-xl transition-all duration-200 shadow-md"
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
                                className="w-full text-gray-500 dark:text-gray-400 text-sm py-2 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
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