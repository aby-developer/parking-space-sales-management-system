import { useEffect, useState } from "react";
import { getCars, getSlots, getRecords, getPayments } from "../api/api";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { useTheme } from "../context/ThemeContext";

// Stats Card Component
const StatCard = ({ title, value, icon, color, trend, trendValue }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const getColorClasses = () => {
        switch(color) {
            case 'green': return 'from-[#16A34A] to-[#15803D]';
            case 'blue': return 'from-[#3B82F6] to-blue-700';
            case 'orange': return 'from-orange-500 to-orange-700';
            case 'purple': return 'from-purple-500 to-purple-700';
            default: return 'from-[#16A34A] to-[#15803D]';
        }
    };
    
    return (
        <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getColorClasses()} flex items-center justify-center shadow-md`}>
                        <span className="text-2xl">{icon}</span>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
                        {trend && (
                            <p className={`text-xs mt-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                {trend === 'up' ? '↑' : '↓'} {trendValue}%
                            </p>
                        )}
                    </div>
                </div>
                <div className={`absolute bottom-0 right-0 text-6xl opacity-5 transition-all duration-300 ${isHovered ? 'transform -translate-x-2 -translate-y-2' : ''}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

// Quick Action Button Component
const QuickAction = ({ title, icon, path, color }) => {
    return (
        <Link
            to={path}
            className={`group relative overflow-hidden bg-gradient-to-r ${color} text-white p-4 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105`}
        >
            <div className="relative z-10 flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <span className="font-semibold">{title}</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
        </Link>
    );
};

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

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                // Fetch all data
                const carsResponse = await getCars();
                const slotsResponse = await getSlots();
                const recordsResponse = await getRecords();
                const paymentsResponse = await getPayments();
                
                // Debug: Log the responses to see the structure
                console.log("Cars Response:", carsResponse);
                console.log("Slots Response:", slotsResponse);
                console.log("Records Response:", recordsResponse);
                console.log("Payments Response:", paymentsResponse);
                
                // Handle different response structures
                // Cars
                let carsCount = 0;
                if (carsResponse.cars) {
                    carsCount = carsResponse.cars.length;
                } else if (Array.isArray(carsResponse)) {
                    carsCount = carsResponse.length;
                } else if (carsResponse.count) {
                    carsCount = carsResponse.count;
                }
                
                // Slots
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
                
                // Records
                let recordsList = [];
                if (recordsResponse.records) {
                    recordsList = recordsResponse.records;
                } else if (Array.isArray(recordsResponse)) {
                    recordsList = recordsResponse;
                }
                
                const activeRecords = recordsList.filter(r => r.status === "active").length;
                const occupancyRate = totalSlots > 0 ? (activeRecords / totalSlots) * 100 : 0;
                
                // Payments
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
                
                // Set recent activities from records (show last 5 by entry time)
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

    const stats = [
        { title: "Total Vehicles", value: data.cars, icon: "🚗", color: "green", trend: "up", trendValue: "12" },
        { title: "Available Slots", value: data.slots - Math.round(data.slots * data.occupancy / 100), icon: "🅿️", color: "blue", trend: "up", trendValue: "5" },
        { title: "Occupancy Rate", value: `${data.occupancy}%`, icon: "📊", color: "orange", trend: data.occupancy > 50 ? "up" : "down", trendValue: "8" },
        { title: "Revenue", value: `RWF ${data.revenue.toLocaleString()}`, icon: "💰", color: "purple", trend: "up", trendValue: "23" }
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
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16A34A] mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up pb-6">
            <Header 
                title="Dashboard" 
                subtitle="Welcome back! Here's your parking overview"
                icon="🌿"
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                        <StatCard {...stat} />
                    </div>
                ))}
            </div>

            {/* Charts and Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions - 2 columns */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#16A34A] to-[#15803D] rounded-xl flex items-center justify-center">
                            <span className="text-white text-xl">⚡</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Quick Actions</h2>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {quickActions.map((action, idx) => (
                            <QuickAction key={idx} {...action} />
                        ))}
                    </div>
                </div>

                {/* System Status */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#16A34A] to-[#15803D] rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold">System Status</h2>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                System Status
                            </span>
                            <span className="text-green-400 font-semibold">Operational</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse"></span>
                                Server
                            </span>
                            <span className="text-[#3B82F6] font-semibold">Connected</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                                Database
                            </span>
                            <span className="text-purple-400 font-semibold">Connected</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-[#16A34A] rounded-full animate-pulse"></span>
                                Green Mode
                            </span>
                            <span className="text-[#16A34A] font-semibold">Active</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity & Tips */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#16A34A] to-[#15803D] rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recent Activity</h2>
                    </div>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {recentActivities.length > 0 ? (
                            recentActivities.map((activity, idx) => (
                                <div key={activity._id || idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
                                    <div className="w-10 h-10 rounded-full bg-[#16A34A]/10 flex items-center justify-center flex-shrink-0">
                                        <span className="text-lg">🚗</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                            {activity.carId?.plateNumber || "Unknown"} parked at slot {activity.slotId?.slotNumber || "Unknown"}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {activity.entryTime ? new Date(activity.entryTime).toLocaleString() : "Unknown time"}
                                        </p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                                        activity.status === 'active' 
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                                    }`}>
                                        {activity.status || "Unknown"}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-5xl mb-3">📭</div>
                                <p className="text-gray-500 dark:text-gray-400">No recent activities</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Create a parking record to see activity here</p>
                            </div>
                        )}
                    </div>
                    
                    {recentActivities.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <Link to="/parking" className="text-sm text-[#16A34A] hover:text-[#15803D] flex items-center justify-center gap-1 transition-colors">
                                View all records
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Tips & Insights */}
                <div className="bg-gradient-to-br from-[#16A34A]/10 to-[#15803D]/10 dark:from-[#16A34A]/20 dark:to-[#15803D]/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#16A34A] to-[#15803D] rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Green Tips</h2>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">🌿</span>
                                <h3 className="font-semibold text-gray-800 dark:text-white">Eco-Friendly Parking</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Our system promotes carbon-neutral parking. Consider carpooling to reduce emissions!
                            </p>
                        </div>
                        
                        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">💡</span>
                                <h3 className="font-semibold text-gray-800 dark:text-white">Occupancy Insight</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Current occupancy is at {data.occupancy}%. {data.occupancy > 80 ? 'Consider adding more slots during peak hours.' : data.occupancy > 50 ? 'Moderate usage. Good balance.' : 'Low occupancy. Great time for promotions!'}
                            </p>
                        </div>
                        
                        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">📈</span>
                                <h3 className="font-semibold text-gray-800 dark:text-white">Revenue Goal</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Monthly revenue target: RWF 5,000,000 | Current: RWF {data.revenue.toLocaleString()}
                            </p>
                            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-[#16A34A] rounded-full transition-all duration-500" style={{ width: `${Math.min((data.revenue / 5000000) * 100, 100)}%` }}></div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {((data.revenue / 5000000) * 100).toFixed(1)}% of target achieved
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}