import { useEffect, useState, useRef } from "react";
import { createSlot, getSlots, deleteSlot } from "../api/api";

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

// Slot Card Component
const SlotCard = ({ slot, index, onDelete }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const isAvailable = slot.status?.toLowerCase() === "available";
    
    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative overflow-hidden rounded-xl xs:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group animate-[fadeInUp_0.5s_ease-out] hover:-translate-y-1 cursor-pointer ${
                isAvailable
                    ? 'bg-gradient-to-br from-[#16A34A] to-[#15803D]'
                    : 'bg-gradient-to-br from-red-500 to-red-600'
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            <div className="p-4 xs:p-5 sm:p-6 text-white">
                {/* Header */}
                <div className="flex justify-between items-start mb-3 xs:mb-4">
                    <div className="w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 rounded-lg xs:rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-xl xs:text-2xl sm:text-3xl">🅿️</span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(slot._id);
                        }}
                        className="bg-white/20 hover:bg-red-500/50 p-1.5 xs:p-2 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                        title="Delete slot"
                    >
                        <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="text-center">
                    <div className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                        {slot.slotNumber}
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-3 xs:mt-4">
                        <span className={`w-2.5 h-2.5 xs:w-3 xs:h-3 rounded-full ${isAvailable ? 'bg-green-300' : 'bg-red-300'} animate-pulse`}></span>
                        <span className="text-sm xs:text-base font-semibold">
                            {slot.status || "Unknown"}
                        </span>
                    </div>
                    
                    {/* Status Badge */}
                    <div className={`mt-3 xs:mt-4 inline-flex items-center gap-1.5 px-3 xs:px-4 py-1 xs:py-1.5 rounded-full text-xs xs:text-sm font-medium ${
                        isAvailable 
                            ? 'bg-white/20 text-white' 
                            : 'bg-white/20 text-white'
                    }`}>
                        <span>{isAvailable ? '✅' : '🔴'}</span>
                        <span>{isAvailable ? 'Ready for parking' : 'Currently occupied'}</span>
                    </div>
                </div>
            </div>

            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute -top-4 -right-4 w-24 h-24 border-4 border-white rounded-full"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 border-4 border-white rounded-full"></div>
            </div>

            {/* Hover shine effect */}
            <div className={`absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none`}></div>
        </div>
    );
};

// Loading Skeleton
const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl xs:rounded-2xl h-48 xs:h-52 sm:h-56"></div>
        ))}
    </div>
);

export default function Slots() {
    const [slotNumber, setSlotNumber] = useState("");
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("all");
    const [notification, setNotification] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const dashboardRef = useRef(null);

    const loadSlots = async () => {
        setLoading(true);
        try {
            const res = await getSlots();
            setSlots(res.slots);
        } catch (error) {
            showNotification("Failed to load slots", "error");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadSlots();
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!slotNumber.trim()) return;
        
        setLoading(true);
        try {
            await createSlot({ slotNumber });
            setSlotNumber("");
            await loadSlots();
            showNotification("Slot added successfully!", "success");
        } catch (error) {
            showNotification(error.message || "Failed to add slot", "error");
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this slot?")) return;
        
        setLoading(true);
        try {
            await deleteSlot(id);
            await loadSlots();
            showNotification("Slot deleted successfully!", "error");
        } catch (error) {
            showNotification("Failed to delete slot", "error");
        }
        setLoading(false);
    };

    const filteredSlots = slots.filter(slot => {
        if (filter === "all") return true;
        return slot.status?.toLowerCase() === filter;
    });

    const availableSlots = slots.filter(s => s.status?.toLowerCase() === "available").length;
    const occupiedSlots = slots.filter(s => s.status?.toLowerCase() === "occupied").length;

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
                                <span className="text-base xs:text-lg sm:text-xl">🅿️</span>
                            </div>
                            <div className="min-w-0">
                                <h1 className={`text-sm xs:text-base sm:text-lg lg:text-xl font-bold transition-colors duration-300 truncate ${
                                    isScrolled ? 'text-white' : 'text-gray-900 dark:text-white'
                                }`}>
                                    Parking Slots
                                </h1>
                                <p className={`text-[10px] xs:text-xs sm:text-sm transition-colors duration-300 truncate ${
                                    isScrolled ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                    Manage parking slots and availability
                                </p>
                            </div>
                        </div>
                        
                        {/* Filter - Visible on all screens in header */}
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className={`px-2 xs:px-3 py-1.5 xs:py-2 text-xs xs:text-sm rounded-lg border transition-all duration-200 ${
                                isScrolled
                                    ? 'bg-gray-800 border-gray-700 text-white'
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
                            } focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40`}
                        >
                            <option value="all">All Slots</option>
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                        </select>
                    </div>
                </div>
                <div className={`h-px transition-all duration-300 ${
                    isScrolled ? 'bg-gradient-to-r from-transparent via-gray-600/30 to-transparent' : 'bg-transparent'
                }`}></div>
            </div>

            {/* Main Content */}
            <div className="space-y-4 xs:space-y-5 sm:space-y-6 pb-4 xs:pb-5 sm:pb-6 px-3 xs:px-4 sm:px-6 pt-4">
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 xs:gap-3 sm:gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl p-3 xs:p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-1 xs:mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#16A34A]/10 flex items-center justify-center">
                                <span className="text-sm">🅿️</span>
                            </div>
                            <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Total Slots</p>
                        </div>
                        <p className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{slots.length}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl p-3 xs:p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-1 xs:mb-2">
                            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <span className="text-sm">✅</span>
                            </div>
                            <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Available</p>
                        </div>
                        <p className="text-lg xs:text-xl sm:text-2xl font-bold text-[#16A34A]">{availableSlots}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl p-3 xs:p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-1 xs:mb-2">
                            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <span className="text-sm">🔴</span>
                            </div>
                            <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Occupied</p>
                        </div>
                        <p className="text-lg xs:text-xl sm:text-2xl font-bold text-red-500">{occupiedSlots}</p>
                    </div>
                </div>

                {/* Add Slot Form */}
                <div className="bg-gradient-to-br from-[#16A34A]/5 to-[#15803D]/5 dark:from-[#16A34A]/10 dark:to-[#15803D]/10 rounded-xl xs:rounded-2xl p-3 xs:p-4 sm:p-6 shadow-sm border border-[#16A34A]/10 dark:border-[#16A34A]/20">
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 xs:gap-3 sm:gap-4">
                        <div className="flex-1">
                            <label className="block text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 xs:mb-2">
                                Slot Number
                            </label>
                            <input
                                placeholder="e.g., A1, B2, C3"
                                value={slotNumber}
                                onChange={(e) => setSlotNumber(e.target.value)}
                                className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm rounded-lg xs:rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all duration-200"
                                required
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#15803D] hover:to-[#16A34A] text-white px-4 xs:px-6 sm:px-8 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-1.5 xs:gap-2 text-xs xs:text-sm"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 xs:h-5 xs:w-5 border-b-2 border-white"></div>
                                ) : (
                                    <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                )}
                                <span className="hidden xs:inline">Add Slot</span>
                                <span className="xs:hidden">Add</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Slots Grid */}
                {loading ? (
                    <LoadingSkeleton />
                ) : filteredSlots.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
                        {filteredSlots.map((slot, index) => (
                            <SlotCard
                                key={slot._id}
                                slot={slot}
                                index={index}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 xs:py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl xs:rounded-2xl">
                        <div className="text-4xl xs:text-5xl sm:text-6xl mb-3 xs:mb-4">🅿️</div>
                        <p className="text-sm xs:text-base text-gray-500 dark:text-gray-400 font-medium">
                            {filter !== "all" ? `No ${filter} slots found` : "No parking slots yet"}
                        </p>
                        <p className="text-xs xs:text-sm text-gray-400 dark:text-gray-500 mt-1">
                            {filter !== "all" ? "Try changing the filter" : "Add your first slot using the form above"}
                        </p>
                    </div>
                )}
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(100%); }
                    to { opacity: 1; transform: translateX(0); }
                }
                
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}