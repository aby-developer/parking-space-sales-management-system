import { useEffect, useState, useRef } from "react";
import { createPayment, getPayments, getRecords } from "../api/api";

// Notification Component
const Notification = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed top-4 right-4 z-[100] px-4 xs:px-6 py-3 rounded-lg xs:rounded-xl shadow-2xl animate-[slideInRight_0.3s_ease-out] flex items-center gap-2 xs:gap-3 max-w-[90vw] xs:max-w-md ${
            type === 'success'
                ? 'bg-gradient-to-r from-[#16A34A] to-[#15803D]'
                : 'bg-gradient-to-r from-red-500 to-red-600'
        } text-white`}>
            <svg className="w-4 h-4 xs:w-5 xs:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                    type === 'success' ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'
                }></path>
            </svg>
            <span className="text-xs xs:text-sm font-medium">{message}</span>
            <button onClick={onClose} className="ml-auto flex-shrink-0 hover:opacity-80">
                <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

// Payment Card Component
const PaymentCard = ({ payment, index }) => {
    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'paid': return 'from-green-500 to-emerald-600';
            case 'pending': return 'from-yellow-500 to-orange-600';
            case 'overdue': return 'from-red-500 to-red-600';
            default: return 'from-gray-400 to-gray-500';
        }
    };

    const getStatusIcon = (status) => {
        switch(status?.toLowerCase()) {
            case 'paid': return '✅';
            case 'pending': return '⏳';
            case 'overdue': return '⚠️';
            default: return '❓';
        }
    };

    return (
        <div className="group bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 animate-[fadeInUp_0.5s_ease-out] hover:-translate-y-1"
            style={{ animationDelay: `${index * 0.05}s` }}>
            {/* Status Bar */}
            <div className={`h-1.5 bg-gradient-to-r ${getStatusColor(payment.status)}`}></div>
            
            <div className="p-4 xs:p-5 sm:p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3 xs:mb-4">
                    <div className="flex items-center gap-2 xs:gap-3">
                        <div className="w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 rounded-lg xs:rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-700/10 dark:from-purple-500/20 dark:to-purple-700/20 flex items-center justify-center">
                            <span className="text-lg xs:text-xl sm:text-2xl">💰</span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Bill #{payment._id?.slice(-8) || "N/A"}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className={`w-2 h-2 rounded-full ${
                                    payment.status === 'paid' ? 'bg-green-500' : 
                                    payment.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                                } animate-pulse`}></span>
                                <span className="text-xs xs:text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    {payment.status || "Unknown"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <span className="text-2xl xs:text-3xl">{getStatusIcon(payment.status)}</span>
                </div>

                {/* Details */}
                <div className="space-y-2 xs:space-y-3">
                    <div className="flex justify-between items-center py-1.5 xs:py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Plate Number</span>
                        <span className="text-xs xs:text-sm font-semibold text-gray-900 dark:text-white">
                            {payment.recordId?.carId?.plateNumber || "N/A"}
                        </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-1.5 xs:py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Slot</span>
                        <span className="text-xs xs:text-sm font-semibold text-gray-900 dark:text-white">
                            {payment.recordId?.slotId?.slotNumber || "N/A"}
                        </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-1.5 xs:py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Duration</span>
                        <span className="text-xs xs:text-sm text-gray-700 dark:text-gray-300">
                            {payment.recordId?.duration || 0}h
                        </span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-1 xs:pt-2">
                        <span className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Amount</span>
                        <span className="text-base xs:text-lg sm:text-xl font-bold text-[#16A34A]">
                            {payment.amount?.toLocaleString() || 0} RWF
                        </span>
                    </div>
                </div>

                {/* Payment Date */}
                {payment.paymentDate && (
                    <div className="mt-3 xs:mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">
                            Paid on {new Date(payment.paymentDate).toLocaleString()}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Loading Skeleton
const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
        {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6">
                <div className="flex justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                        <div className="space-y-2">
                            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    {[...Array(4)].map((_, j) => (
                        <div key={j} className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

export default function Payments() {
    const [payments, setPayments] = useState([]);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [notification, setNotification] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const dashboardRef = useRef(null);

    const [form, setForm] = useState({
        recordId: "",
        amount: "",
        paymentMethod: "cash"
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const [payRes, recRes] = await Promise.all([
                getPayments(),
                getRecords()
            ]);
            setPayments(payRes.payments || []);
            setRecords(recRes.records || []);
        } catch (error) {
            showNotification("Failed to load data", "error");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    // Scroll listener
    useEffect(() => {
        const handleScroll = () => {
            if (dashboardRef.current) {
                const scrollPosition = dashboardRef.current.scrollTop || window.scrollY;
                setIsScrolled(scrollPosition > 10);
            }
        };

        const scrollContainer = dashboardRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
        }
        window.addEventListener('scroll', handleScroll);

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleScroll);
            }
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const showNotification = (message, type) => {
        setNotification({ message, type, id: Date.now() });
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.recordId || !form.amount) {
            return showNotification("Please fill all fields", "error");
        }

        setLoading(true);
        try {
            await createPayment(form);
            showNotification("Payment processed successfully!", "success");
            setForm({ recordId: "", amount: "", paymentMethod: "cash" });
            setShowModal(false);
            await loadData();
        } catch (error) {
            showNotification(error.message || "Payment failed", "error");
        }
        setLoading(false);
    };

    const completedRecords = records.filter(r => r.status === "completed");
    
    const filteredPayments = payments.filter(payment => {
        const matchesSearch = 
            payment.recordId?.carId?.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment._id?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === "all" || payment.status?.toLowerCase() === statusFilter.toLowerCase();
        
        return matchesSearch && matchesStatus;
    });

    const totalPaid = payments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + (p.amount || 0), 0);
    
    const totalPending = payments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

    return (
        <div ref={dashboardRef} className="h-full overflow-y-auto">
            {/* Notification */}
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            {/* Sticky Header */}
            <div className={`sticky top-0 z-40 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-gray-900/95 dark:bg-black/95 backdrop-blur-md shadow-lg shadow-black/10' 
                    : 'bg-transparent'
            }`}>
                <div className={`px-3 xs:px-4 sm:px-6 transition-all duration-300 ${
                    isScrolled ? 'py-2 xs:py-2.5 sm:py-3' : 'py-2 xs:py-3 sm:py-4'
                }`}>
                    <div className="flex items-center justify-between gap-2 xs:gap-3">
                        <div className="flex items-center gap-2 xs:gap-3 flex-1 min-w-0">
                            <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-lg xs:rounded-xl bg-gradient-to-br from-[#16A34A] to-[#15803D] flex items-center justify-center shadow-md flex-shrink-0">
                                <span className="text-base xs:text-lg sm:text-xl">💰</span>
                            </div>
                            <div className="min-w-0">
                                <h1 className={`text-sm xs:text-base sm:text-lg lg:text-xl font-bold transition-colors duration-300 truncate ${
                                    isScrolled ? 'text-white' : 'text-gray-900 dark:text-white'
                                }`}>
                                    Payments & Bills
                                </h1>
                                <p className={`text-[10px] xs:text-xs sm:text-sm transition-colors duration-300 truncate ${
                                    isScrolled ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                    Manage payments and generate parking bills
                                </p>
                            </div>
                        </div>
                        
                        
                    </div>
                </div>
                <div className={`h-px transition-all duration-300 ${
                    isScrolled ? 'bg-gradient-to-r from-transparent via-gray-600/30 to-transparent' : 'bg-transparent'
                }`}></div>
            </div>

            {/* Main Content */}
            <div className="space-y-4 xs:space-y-5 sm:space-y-6 pb-4 xs:pb-5 sm:pb-6 px-3 xs:px-4 sm:px-6 pt-4">
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl p-3 xs:p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-1 xs:mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#16A34A]/10 flex items-center justify-center">
                                <span className="text-sm">💰</span>
                            </div>
                            <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Total Payments</p>
                        </div>
                        <p className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{payments.length}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl p-3 xs:p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-1 xs:mb-2">
                            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <span className="text-sm">✅</span>
                            </div>
                            <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Paid Amount</p>
                        </div>
                        <p className="text-lg xs:text-xl sm:text-2xl font-bold text-green-600">{totalPaid.toLocaleString()} RWF</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl p-3 xs:p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-1 xs:mb-2">
                            <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                                <span className="text-sm">⏳</span>
                            </div>
                            <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Pending</p>
                        </div>
                        <p className="text-lg xs:text-xl sm:text-2xl font-bold text-yellow-600">{totalPending.toLocaleString()} RWF</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl p-3 xs:p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-1 xs:mb-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <span className="text-sm">📋</span>
                            </div>
                            <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Completed Records</p>
                        </div>
                        <p className="text-lg xs:text-xl sm:text-2xl font-bold text-purple-600">{completedRecords.length}</p>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row gap-2 xs:gap-3">
                    <div className="relative flex-1">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by plate number or bill ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 xs:pl-10 pr-4 py-2 xs:py-2.5 text-xs xs:text-sm rounded-lg xs:rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all"
                        />
                    </div>
                    
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 xs:px-4 py-2 xs:py-2.5 text-xs xs:text-sm rounded-lg xs:rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all sm:w-36"
                    >
                        <option value="all">All Status</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="overdue">Overdue</option>
                    </select>
                </div>

                {/* Payments Grid */}
                {loading ? (
                    <LoadingSkeleton />
                ) : filteredPayments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
                        {filteredPayments.map((payment, index) => (
                            <PaymentCard
                                key={payment._id}
                                payment={payment}
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 xs:py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl xs:rounded-2xl">
                        <div className="text-4xl xs:text-5xl sm:text-6xl mb-3 xs:mb-4">💰</div>
                        <p className="text-sm xs:text-base text-gray-500 dark:text-gray-400 font-medium">
                            {searchTerm || statusFilter !== "all" ? "No payments match your filters" : "No payments yet"}
                        </p>
                        <p className="text-xs xs:text-sm text-gray-400 dark:text-gray-500 mt-1">
                            {searchTerm || statusFilter !== "all" ? "Try different search or filter" : "Process your first payment to get started"}
                        </p>
                    </div>
                )}

                {/* New Payment Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4">
                        <div 
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowModal(false)}
                        ></div>
                        
                        <form
                            onSubmit={handleSubmit}
                            className="relative w-full max-w-[400px] xs:max-w-sm sm:max-w-md bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto animate-[scaleIn_0.3s_ease-out]"
                        >
                            <div className="sticky top-0 bg-white dark:bg-gray-800 px-4 xs:px-5 sm:px-6 py-3 xs:py-4 border-b border-gray-100 dark:border-gray-700">
                                <h2 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                    Process Payment
                                </h2>
                                <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                    Generate a parking bill payment
                                </p>
                            </div>

                            <div className="p-4 xs:p-5 sm:p-6 space-y-3 xs:space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        Select Record
                                    </label>
                                    <select
                                        name="recordId"
                                        value={form.recordId}
                                        onChange={handleChange}
                                        className="w-full px-3 xs:px-4 py-2 xs:py-2.5 text-xs xs:text-sm rounded-lg xs:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all"
                                        required
                                    >
                                        <option value="">Choose a completed record...</option>
                                        {completedRecords.map(rec => (
                                            <option key={rec._id} value={rec._id}>
                                                {rec.carId?.plateNumber} - {rec.slotId?.slotNumber} ({rec.duration}h)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Amount (RWF)
                                    </label>
                                    <input
                                        type="number"
                                        name="amount"
                                        placeholder="Enter amount"
                                        value={form.amount}
                                        onChange={handleChange}
                                        className="w-full px-3 xs:px-4 py-2 xs:py-2.5 text-xs xs:text-sm rounded-lg xs:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        Payment Method
                                    </label>
                                    <select
                                        name="paymentMethod"
                                        value={form.paymentMethod}
                                        onChange={handleChange}
                                        className="w-full px-3 xs:px-4 py-2 xs:py-2.5 text-xs xs:text-sm rounded-lg xs:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all"
                                    >
                                        <option value="cash">💵 Cash</option>
                                        <option value="card">💳 Card</option>
                                        <option value="mobile">📱 Mobile Money</option>
                                        <option value="bank">🏦 Bank Transfer</option>
                                    </select>
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900/50 px-4 xs:px-5 sm:px-6 py-3 xs:py-4 border-t border-gray-100 dark:border-gray-700 flex flex-col xs:flex-row gap-2 xs:gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#15803D] hover:to-[#16A34A] text-white font-semibold py-2 xs:py-2.5 text-xs xs:text-sm rounded-lg xs:rounded-xl transition-all shadow-md disabled:opacity-70 flex items-center justify-center gap-1.5 xs:gap-2"
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                    Process Payment
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-2 xs:py-2.5 text-xs xs:text-sm rounded-lg xs:rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(100%); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}