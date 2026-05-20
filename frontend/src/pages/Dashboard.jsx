import { useEffect, useState } from "react";
import { getCars, getSlots, getRecords, getPayments } from "../api/api";

const Card = ({ title, value, icon, color, gradient }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 transform ${isHovered ? 'scale-105' : 'scale-100'}`}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`}></div>
            <div className="relative p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{icon}</div>
                    <div className={`text-right transition-all duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
                        <p className="text-sm opacity-90 font-medium">{title}</p>
                        <p className="text-3xl font-bold mt-1">{value}</p>
                    </div>
                </div>
                <div className={`absolute bottom-0 right-0 text-6xl opacity-10 transition-all duration-300 ${isHovered ? 'transform -translate-x-2 -translate-y-2' : ''}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default function Dashboard() {
    const [data, setData] = useState({
        cars: 0,
        slots: 0,
        records: 0,
        payments: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const cars = await getCars();
            const slots = await getSlots();
            const records = await getRecords();
            const payments = await getPayments();

            setData({
                cars: cars.count || 0,
                slots: slots.count || 0,
                records: records.count || 0,
                payments: payments.count || payments.length || 0
            });
            setLoading(false);
        };

        load();
    }, []);

    const stats = [
        { title: "Total Cars", value: data.cars, icon: "🚗", gradient: "from-blue-500 to-blue-700", color: "blue" },
        { title: "Available Slots", value: data.slots, icon: "🅿️", gradient: "from-green-500 to-green-700", color: "green" },
        { title: "Active Records", value: data.records, icon: "📊", gradient: "from-orange-500 to-orange-700", color: "orange" },
        { title: "Total Payments", value: `RWF ${data.payments.toLocaleString()}`, icon: "💰", gradient: "from-purple-500 to-purple-700", color: "purple" }
    ];

    const quickActions = [
        { title: "New Parking", icon: "🚗", path: "/parking", color: "from-blue-500 to-blue-600", bg: "blue" },
        { title: "Add Slot", icon: "➕", path: "/slots", color: "from-green-500 to-green-600", bg: "green" },
        { title: "View Reports", icon: "📈", path: "/reports", color: "from-purple-500 to-purple-600", bg: "purple" },
        { title: "Manage Cars", icon: "🚙", path: "/cars", color: "from-pink-500 to-pink-600", bg: "pink" }
    ];

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-gray-500 mt-1">Welcome back! Here's your parking overview</p>
                </div>
                <div className="text-4xl">🏠</div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="animate-bounce-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <Card {...stat} />
                    </div>
                ))}
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <span className="text-white text-xl">⚡</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        {quickActions.map((action, idx) => (
                            <a
                                key={idx}
                                href={action.path}
                                className={`group relative overflow-hidden bg-gradient-to-r ${action.color} text-white p-4 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105`}
                            >
                                <div className="relative z-10 flex items-center gap-2">
                                    <span className="text-2xl">{action.icon}</span>
                                    <span className="font-semibold">{action.title}</span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* System Status */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
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
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                Active Sessions
                            </span>
                            <span className="text-blue-400 font-semibold">1</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                                Database
                            </span>
                            <span className="text-purple-400 font-semibold">Connected</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}