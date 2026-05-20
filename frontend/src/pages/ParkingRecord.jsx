import { useState, useEffect } from "react";
import {
    createRecord,
    getRecords,
    markExit,
    getCars,
    getSlots
} from "../api/api";

export default function ParkingRecord() {
    const [records, setRecords] = useState([]);
    const [cars, setCars] = useState([]);
    const [slots, setSlots] = useState([]);
    const [showRecords, setShowRecords] = useState(true);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ carId: "", slotId: "" });

    const loadData = async () => {
        setLoading(true);
        try {
            const [recRes, carRes, slotRes] = await Promise.all([
                getRecords(),
                getCars(),
                getSlots()
            ]);
            setRecords(recRes.records || []);
            setCars(carRes.cars || []);
            setSlots(slotRes.slots || []);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.carId || !form.slotId) {
            showNotification("Please select both car and slot", "error");
            return;
        }

        setLoading(true);
        try {
            await createRecord(form);
            showNotification("Parking entry created successfully!", "success");
            setForm({ carId: "", slotId: "" });
            await loadData();
        } catch (err) {
            showNotification(err.message || "Error creating record", "error");
        }
        setLoading(false);
    };

    const handleExit = async (id) => {
        setLoading(true);
        try {
            const res = await markExit(id);
            showNotification(`Exit completed! Duration: ${res.record.duration} hours`, "success");
            await loadData();
        } catch (err) {
            showNotification(err.message || "Exit failed", "error");
        }
        setLoading(false);
    };

    const showNotification = (message, type) => {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl animate-slide-in flex items-center gap-2 ${
            type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-pink-600'
        } text-white`;
        notification.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${
                    type === 'success' ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'
                }"></path>
            </svg>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    };

    const getStatusColor = (status) => {
        return status === "active" 
            ? "from-yellow-400 to-orange-500" 
            : "from-green-400 to-emerald-500";
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Parking Records
                    </h1>
                    <p className="text-gray-500 mt-1">Manage active and completed parking sessions</p>
                </div>
                <button
                    onClick={() => setShowRecords(!showRecords)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                        showRecords 
                            ? "bg-gradient-to-r from-red-500 to-pink-600 text-white" 
                            : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                    }`}
                >
                    {showRecords ? (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                            Hide Records
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Show Records
                        </>
                    )}
                </button>
            </div>

            {/* Entry Form */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Parking Entry</h2>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Car</label>
                        <select
                            name="carId"
                            value={form.carId}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                            required
                        >
                            <option value="">Choose a car</option>
                            {cars.map(car => (
                                <option key={car._id} value={car._id}>
                                    {car.plateNumber} - {car.driverName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Slot</label>
                        <select
                            name="slotId"
                            value={form.slotId}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                            required
                        >
                            <option value="">Choose a slot</option>
                            {slots
                                .filter(s => s.status === "Available")
                                .map(slot => (
                                    <option key={slot._id} value={slot._id}>
                                        {slot.slotNumber} (Available)
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Entry
                        </button>
                    </div>
                </form>
            </div>

            {/* Records List */}
            {showRecords && (
                <div className="space-y-4">
                    {loading && records.length === 0 ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                        </div>
                    ) : records.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl">
                            <div className="text-6xl mb-4">📄</div>
                            <p className="text-gray-500 text-lg">No parking records found</p>
                        </div>
                    ) : (
                        records.map((record, index) => (
                            <div
                                key={record._id}
                                className={`bg-gradient-to-r ${getStatusColor(record.status)} rounded-2xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300 animate-fade-in-up`}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className="p-6 text-white">
                                    <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className="text-3xl">🚗</div>
                                            <div>
                                                <h3 className="text-xl font-bold">{record.carId?.plateNumber}</h3>
                                                <p className="text-white/80 text-sm">{record.carId?.driverName}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold backdrop-blur-sm">
                                                {record.status}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm ${
                                                record.isPaid ? 'bg-green-500/50' : 'bg-red-500/50'
                                            }`}>
                                                {record.isPaid ? "Paid" : "Unpaid"}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">🅿️</span>
                                            <div>
                                                <p className="text-white/80 text-sm">Slot Number</p>
                                                <p className="font-semibold">{record.slotId?.slotNumber}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">⏰</span>
                                            <div>
                                                <p className="text-white/80 text-sm">Entry Time</p>
                                                <p className="font-semibold text-sm">{new Date(record.entryTime).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        {record.exitTime && (
                                            <>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl">🚪</span>
                                                    <div>
                                                        <p className="text-white/80 text-sm">Exit Time</p>
                                                        <p className="font-semibold text-sm">{new Date(record.exitTime).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl">⏱️</span>
                                                    <div>
                                                        <p className="text-white/80 text-sm">Duration</p>
                                                        <p className="font-semibold">{record.duration} hours</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    
                                    {record.status === "active" && (
                                        <div className="mt-4 pt-4 border-t border-white/20">
                                            <button
                                                onClick={() => handleExit(record._id)}
                                                disabled={loading}
                                                className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                                            >
                                                Mark Exit
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}