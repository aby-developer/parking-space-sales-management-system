import { useEffect, useState, useRef } from "react";
import { getCars, getSlots, getRecords, getPayments } from "../api/api";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { useTheme } from "../context/ThemeContext";

// Stats Card Component
const StatCard = ({ title, value, icon, color, trend, trendValue, delay = 0 }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const getColorClasses = () => {
        switch(color) {
            case 'green': return 'from-[#16A34A] to-[#15803D] shadow-[#16A34A]/20';
            case 'blue': return 'from-[#3B82F6] to-blue-700 shadow-[#3B82F6]/20';
            case 'orange': return 'from-orange-500 to-orange-700 shadow-orange-500/20';
            case 'purple': return 'from-purple-500 to-purple-700 shadow-purple-500/20';
            default: return 'from-[#16A34A] to-[#15803D] shadow-[#16A34A]/20';
        }
    };
    
    return (
        <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative overflow-hidden rounded-xl xs:rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 group animate-[fadeInUp_0.5s_ease-out] hover:-translate-y-1"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="p-3 xs:p-4 sm:p-5 lg:p-6">
                <div className="flex items-start justify-between mb-3 xs:mb-4">
                    <div className={`w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 rounded-lg xs:rounded-xl bg-gradient-to-br ${getColorClasses()} flex items-center justify-center shadow-md flex-shrink-0`}>
                        <span className="text-lg xs:text-xl sm:text-2xl">{icon}</span>
                    </div>
                    {trend && (
                        <div className={`flex items-center gap-1 px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full text-[10px] xs:text-xs font-medium ${
                            trend === 'up' 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}>
                            <span>{trend === 'up' ? '↑' : '↓'}</span>
                            <span>{trendValue}%</span>
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400 mb-0.5 xs:mb-1">{title}</p>
                    <p className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                </div>
                <div className={`absolute -bottom-2 -right-2 xs:-bottom-3 xs:-right-3 text-4xl xs:text-5xl sm:text-6xl opacity-[0.03] group-hover:opacity-[0.06] transition-all duration-500 ${isHovered ? 'transform -translate-x-2 -translate-y-2 scale-110' : ''}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

// Quick Action Button Component
const QuickAction = ({ title, icon, path, color }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <Link
            to={path}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative overflow-hidden bg-gradient-to-r ${color} text-white p-2.5 xs:p-3 sm:p-4 rounded-lg xs:rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]`}
        >
            <div className="relative z-10 flex flex-col xs:flex-row items-center xs:items-center gap-1.5 xs:gap-2 sm:gap-3">
                <span className="text-lg xs:text-xl sm:text-2xl">{icon}</span>
                <span className="text-[10px] xs:text-xs sm:text-sm font-medium xs:font-semibold text-center xs:text-left leading-tight">{title}</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            <div className={`absolute bottom-1 right-1 xs:bottom-2 xs:right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ${isHovered ? 'translate-x-0' : 'translate-x-2'}`}>
                <svg className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </Link>
    );
};

// Activity Item Component
const ActivityItem = ({ activity }) => {
    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
        }
    };

    return (
        <div className="flex items-center gap-2 xs:gap-3 p-2.5 xs:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg xs:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group cursor-pointer">
            <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full bg-[#16A34A]/10 dark:bg-[#16A34A]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <span className="text-sm xs:text-base sm:text-lg">🚗</span>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs xs:text-sm font-medium text-gray-800 dark:text-white truncate">
                    {activity.carId?.plateNumber || "Unknown"} • Slot {activity.slotId?.slotNumber || "?"}
                </p>
                <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">
                    {activity.entryTime ? new Date(activity.entryTime).toLocaleString() : "Unknown time"}
                </p>
            </div>
            <span className={`text-[9px] xs:text-[10px] sm:text-xs px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full font-medium flex-shrink-0 ${getStatusColor(activity.status)}`}>
                {activity.status || "Unknown"}
            </span>
        </div>
    );
};

// Tip Card Component
const TipCard = ({ icon, title, description, children }) => {
    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg xs:rounded-xl p-3 xs:p-4 border border-gray-100/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-lg xs:text-xl">{icon}</span>
                <h3 className="text-xs xs:text-sm font-semibold text-gray-800 dark:text-white">{title}</h3>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2">{description}</p>
            {children}
        </div>
    );
};

// Loading Skeleton Component
const LoadingSkeleton = () => (
    <div className="space-y-6 animate-fade-in-up pb-6 p-3 xs:p-4 sm:p-6">
        <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl p-3 xs:p-4 sm:p-6">
                    <div className="flex justify-between mb-4">
                        <div className="w-10 h-10 xs:w-12 xs:h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                        <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    </div>
                </div>
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
            <div className="lg:col-span-2 animate-pulse bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl p-3 xs:p-4 sm:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 xs:gap-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-14 xs:h-16 sm:h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    ))}
                </div>
            </div>
            <div className="animate-pulse bg-gray-800 rounded-xl xs:rounded-2xl p-3 xs:p-4 sm:p-6 space-y-3">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-10 xs:h-12 bg-white/10 rounded-lg"></div>
                ))}
            </div>
        </div>
    </div>
);

export default function Dashboard() {
    const { isDarkMode } = useTheme();
    const [data, setData] = useState({
        cars: 0,
        slots: 0,
        records: 0,
        payments: 0,
        revenue: 0,
        occupancy: 0
    });
    const [loading, setLoading] = useState(true);
    const [recentActivities, setRecentActivities] = useState([]);
    const [isScrolled, setIsScrolled] = useState(false);
    const dashboardRef = useRef(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const carsResponse = await getCars();
                const slotsResponse = await getSlots();
                const recordsResponse = await getRecords();
                const paymentsResponse = await getPayments();
                
                console.log("Cars Response:", carsResponse);
                console.log("Slots Response:", slotsResponse);
                console.log("Records Response:", recordsResponse);
                console.log("Payments Response:", paymentsResponse);
                
                let carsCount = 0;
                if (carsResponse.cars) {
                    carsCount = carsResponse.cars.length;
                } else if (Array.isArray(carsResponse)) {
                    carsCount = carsResponse.length;
                } else if (carsResponse.count) {
                    carsCount = carsResponse.count;
                }
                
                let slotsList = [];
                let totalSlots = 0;
                if (slotsResponse.slots) {
                    slotsList = slotsResponse.slots;
                    totalSlots = slotsResponse.slots.length;
                } else if (Array.isArray(slotsResponse)) {
                    slotsList = slotsResponse;
                    totalSlots = slotsResponse.length;
                } else if (slotsResponse.count) {
                    totalSlots = slotsResponse.count;
                }
                
                let recordsList = [];
                if (recordsResponse.records) {
                    recordsList = recordsResponse.records;
                } else if (Array.isArray(recordsResponse)) {
                    recordsList = recordsResponse;
                }
                
                const activeRecords = recordsList.filter(r => r.status === "active").length;
                const occupancyRate = totalSlots > 0 ? (activeRecords / totalSlots) * 100 : 0;
                
                let paymentsList = [];
                let totalRevenue = 0;
                if (paymentsResponse.payments) {
                    paymentsList = paymentsResponse.payments;
                    totalRevenue = paymentsResponse.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
                } else if (Array.isArray(paymentsResponse)) {
                    paymentsList = paymentsResponse;
                    totalRevenue = paymentsResponse.reduce((sum, p) => sum + (p.amount || 0), 0);
                }
                
                setData({
                    cars: carsCount,
                    slots: totalSlots,
                    records: recordsList.length,
                    payments: paymentsList.length,
                    revenue: totalRevenue,
                    occupancy: Math.round(occupancyRate)
                });
                
                if (recordsList.length > 0) {
                    const sortedRecords = [...recordsList].sort((a, b) => 
                        new Date(b.entryTime) - new Date(a.entryTime)
                    );
                    setRecentActivities(sortedRecords.slice(0, 5));
                } else {
                    setRecentActivities([]);
                }
                
            } catch (err) {
                console.error("Error loading dashboard data:", err);
            }
            setLoading(false);
        };
        
        load();
    }, []);

    // Scroll listener to detect when page is scrolled
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

    const stats = [
        { title: "Total Vehicles", value: data.cars, icon: "🚗", color: "green", trend: "up", trendValue: "12", delay: 100 },
        { title: "Available Slots", value: data.slots - Math.round(data.slots * data.occupancy / 100), icon: "🅿️", color: "blue", trend: "up", trendValue: "5", delay: 200 },
        { title: "Occupancy Rate", value: `${data.occupancy}%`, icon: "📊", color: "orange", trend: data.occupancy > 50 ? "up" : "down", trendValue: "8", delay: 300 },
        { title: "Revenue", value: `RWF ${data.revenue.toLocaleString()}`, icon: "💰", color: "purple", trend: "up", trendValue: "23", delay: 400 }
    ];

    const quickActions = [
        { title: "New Parking", icon: "🚗", path: "/parking", color: "from-[#16A34A] to-[#15803D]" },
        { title: "Add Slot", icon: "➕", path: "/slots", color: "from-[#3B82F6] to-blue-700" },
        { title: "Process Payment", icon: "💳", path: "/payments", color: "from-purple-500 to-purple-700" },
        { title: "Register Car", icon: "🚙", path: "/cars", color: "from-pink-500 to-pink-700" },
        { title: "View Reports", icon: "📈", path: "/reports", color: "from-orange-500 to-orange-700" },
        { title: "Manage Slots", icon: "🅿️", path: "/slots", color: "from-cyan-500 to-cyan-700" }
    ];

    if (loading) {
        return <LoadingSkeleton />;
    }

    return (
        <div ref={dashboardRef} className="h-full overflow-y-auto">
            {/* Sticky Header with dynamic background */}
            <div className={`sticky top-0 z-40 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-gray-900/95 dark:bg-black/95 backdrop-blur-md shadow-lg shadow-black/10' 
                    : 'bg-transparent'
            }`}>
                <div className={`px-3 xs:px-4 sm:px-6 transition-all duration-300 ${
                    isScrolled ? 'py-2 xs:py-2.5 sm:py-3' : 'py-2 xs:py-3 sm:py-4'
                }`}>
                    <div className="flex items-center gap-2 xs:gap-3">
                        {/* Icon with animated background on scroll */}
                        <div className={`w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-lg xs:rounded-xl flex items-center justify-center shadow-md transition-all duration-300 ${
                            isScrolled 
                                ? 'bg-gradient-to-br from-[#16A34A] to-[#15803D]' 
                                : 'bg-gradient-to-br from-[#16A34A] to-[#15803D]'
                        }`}>
                            <span className="text-base xs:text-lg sm:text-xl">🌿</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className={`text-sm xs:text-base sm:text-lg lg:text-xl font-bold transition-colors duration-300 truncate ${
                                isScrolled ? 'text-white' : 'text-gray-900 dark:text-white'
                            }`}>
                                Dashboard
                            </h1>
                            <p className={`text-[10px] xs:text-xs sm:text-sm transition-colors duration-300 truncate ${
                                isScrolled ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                                Welcome back! Here's your parking overview
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Subtle bottom border when scrolled */}
                <div className={`h-px transition-all duration-300 ${
                    isScrolled ? 'bg-gradient-to-r from-transparent via-gray-600/30 to-transparent' : 'bg-transparent'
                }`}></div>
            </div>

            {/* Main Content */}
            <div className="space-y-4 xs:space-y-5 sm:space-y-6 animate-fade-in-up pb-4 xs:pb-5 sm:pb-6 px-3 xs:px-4 sm:px-6 pt-4">
                {/* Stats Grid - Fully Responsive */}
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                {/* Charts and Activity Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
                    {/* Quick Actions - Takes 2 columns on large screens */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl shadow-sm sm:shadow-md p-3 xs:p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 xs:gap-3 mb-3 xs:mb-4">
                            <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#16A34A] to-[#15803D] rounded-lg xs:rounded-xl flex items-center justify-center shadow-md">
                                <span className="text-white text-base xs:text-lg sm:text-xl">⚡</span>
                            </div>
                            <h2 className="text-base xs:text-lg sm:text-xl font-bold text-gray-800 dark:text-white">Quick Actions</h2>
                        </div>
                        
                        <div className="grid grid-cols-2 xs:grid-cols-3 gap-2 xs:gap-3">
                            {quickActions.map((action, idx) => (
                                <QuickAction key={idx} {...action} />
                            ))}
                        </div>
                    </div>

                    {/* System Status - Takes 1 column */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl xs:rounded-2xl shadow-sm sm:shadow-xl p-3 xs:p-4 sm:p-6 text-white">
                        <div className="flex items-center gap-2 xs:gap-3 mb-3 xs:mb-4">
                            <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#16A34A] to-[#15803D] rounded-lg xs:rounded-xl flex items-center justify-center shadow-md">
                                <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-base xs:text-lg sm:text-xl font-bold">System Status</h2>
                        </div>
                        
                        <div className="space-y-1.5 xs:space-y-2 sm:space-y-3">
                            {[
                                { label: "System Status", value: "Operational", color: "green" },
                                { label: "Server", value: "Connected", color: "blue" },
                                { label: "Database", value: "Connected", color: "purple" },
                                { label: "Green Mode", value: "Active", color: "green-dark" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 xs:p-2.5 sm:p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                    <span className="flex items-center gap-1.5 xs:gap-2 text-xs xs:text-sm">
                                        <span className={`w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full animate-pulse ${
                                            item.color === 'green' ? 'bg-green-500' :
                                            item.color === 'blue' ? 'bg-[#3B82F6]' :
                                            item.color === 'purple' ? 'bg-purple-500' :
                                            'bg-[#16A34A]'
                                        }`}></span>
                                        {item.label}
                                    </span>
                                    <span className={`text-xs xs:text-sm font-semibold ${
                                        item.color === 'green' ? 'text-green-400' :
                                        item.color === 'blue' ? 'text-[#3B82F6]' :
                                        item.color === 'purple' ? 'text-purple-400' :
                                        'text-[#16A34A]'
                                    }`}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activity & Tips Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 xs:gap-4 sm:gap-6">
                    {/* Recent Activity */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl shadow-sm sm:shadow-md p-3 xs:p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-3 xs:mb-4">
                            <div className="flex items-center gap-2 xs:gap-3">
                                <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#16A34A] to-[#15803D] rounded-lg xs:rounded-xl flex items-center justify-center shadow-md">
                                    <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-base xs:text-lg sm:text-xl font-bold text-gray-800 dark:text-white">Recent Activity</h2>
                            </div>
                            {recentActivities.length > 0 && (
                                <Link to="/parking" className="text-[10px] xs:text-xs sm:text-sm text-[#16A34A] hover:text-[#15803D] font-medium transition-colors hidden xs:block">
                                    View All
                                </Link>
                            )}
                        </div>
                        
                        <div className="space-y-1.5 xs:space-y-2 max-h-[300px] xs:max-h-[350px] sm:max-h-96 overflow-y-auto custom-scrollbar">
                            {recentActivities.length > 0 ? (
                                recentActivities.map((activity, idx) => (
                                    <ActivityItem key={activity._id || idx} activity={activity} />
                                ))
                            ) : (
                                <div className="text-center py-8 xs:py-10 sm:py-12">
                                    <div className="text-3xl xs:text-4xl sm:text-5xl mb-2 xs:mb-3">📭</div>
                                    <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400">No recent activities</p>
                                    <p className="text-[10px] xs:text-xs text-gray-400 dark:text-gray-500 mt-0.5 xs:mt-1">Create a parking record to see activity</p>
                                </div>
                            )}
                        </div>
                        
                        {recentActivities.length > 0 && (
                            <div className="mt-3 xs:mt-4 pt-2 xs:pt-3 border-t border-gray-100 dark:border-gray-700 xs:hidden">
                                <Link to="/parking" className="text-xs text-[#16A34A] hover:text-[#15803D] flex items-center justify-center gap-1 transition-colors">
                                    View all records
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Tips & Insights */}
                    <div className="bg-gradient-to-br from-[#16A34A]/10 to-[#15803D]/10 dark:from-[#16A34A]/20 dark:to-[#15803D]/20 rounded-xl xs:rounded-2xl p-3 xs:p-4 sm:p-6">
                        <div className="flex items-center gap-2 xs:gap-3 mb-3 xs:mb-4">
                            <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#16A34A] to-[#15803D] rounded-lg xs:rounded-xl flex items-center justify-center shadow-md">
                                <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-base xs:text-lg sm:text-xl font-bold text-gray-800 dark:text-white">Green Tips</h2>
                        </div>
                        
                        <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                            <TipCard
                                icon="🌿"
                                title="Eco-Friendly Parking"
                                description="Our system promotes carbon-neutral parking. Consider carpooling to reduce emissions!"
                            />
                            
                            <TipCard
                                icon="💡"
                                title="Occupancy Insight"
                                description={`Current occupancy is at ${data.occupancy}%. ${data.occupancy > 80 ? 'Consider adding more slots during peak hours.' : data.occupancy > 50 ? 'Moderate usage. Good balance.' : 'Low occupancy. Great time for promotions!'}`}
                            />
                            
                            <TipCard
                                icon="📈"
                                title="Revenue Goal"
                                description={`Monthly target: RWF 5,000,000`}
                            >
                                <div>
                                    <div className="flex justify-between text-[10px] xs:text-xs text-gray-600 dark:text-gray-400 mb-1">
                                        <span>Progress</span>
                                        <span>RWF {data.revenue.toLocaleString()}</span>
                                    </div>
                                    <div className="h-1.5 xs:h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-[#16A34A] to-[#15803D] rounded-full transition-all duration-1000"
                                            style={{ width: `${Math.min((data.revenue / 5000000) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[9px] xs:text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {((data.revenue / 5000000) * 100).toFixed(1)}% of target achieved
                                    </p>
                                </div>
                            </TipCard>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #16A34A33;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #16A34A66;
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}