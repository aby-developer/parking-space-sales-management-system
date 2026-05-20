import { useEffect, useState } from "react";
import { createSlot, getSlots, deleteSlot } from "../api/api";

export default function Slots() {
    const [slotNumber, setSlotNumber] = useState("");
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("all");

    const loadSlots = async () => {
        setLoading(true);
        const res = await getSlots();
        setSlots(res.slots);
        setLoading(false);
    };

    useEffect(() => {
        loadSlots();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!slotNumber.trim()) return;
        
        setLoading(true);
        await createSlot({ slotNumber });
        setSlotNumber("");
        await loadSlots();
        setLoading(false);
        showNotification("Slot added successfully!", "success");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this slot?")) return;
        
        setLoading(true);
        await deleteSlot(id);
        await loadSlots();
        setLoading(false);
        showNotification("Slot deleted successfully!", "error");
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

    const filteredSlots = slots.filter(slot => {
        if (filter === "all") return true;
        return slot.status.toLowerCase() === filter;
    });

    const getStatusColor = (status) => {
        return status === "Available" 
            ? "from-green-500 to-emerald-600" 
            : "from-red-500 to-pink-600";
    };

    const getStatusIcon = (status) => {
        return status === "Available" ? "✅" : "🔴";
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Parking Slots
                    </h1>
                    <p className="text-gray-500 mt-1">Manage parking slots and their availability</p>
                </div>
                <div className="flex gap-3">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
                    >
                        <option value="all">All Slots</option>
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                    </select>
                </div>
            </div>

            {/* Add Slot Form */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg">
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Slot Number</label>
                        <input
                            placeholder="e.g., A1, B2, C3"
                            value={slotNumber}
                            onChange={(e) => setSlotNumber(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                            required
                        />
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
                            Add Slot
                        </button>
                    </div>
                </form>
            </div>

            {/* Slots Grid */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredSlots.map((slot, index) => (
                        <div
                            key={slot._id}
                            className={`bg-gradient-to-br ${getStatusColor(slot.status)} rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 animate-fade-in-up`}
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="p-6 text-white">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="text-4xl">🅿️</div>
                                    <button
                                        onClick={() => handleDelete(slot._id)}
                                        className="bg-white/20 hover:bg-red-500/50 p-2 rounded-lg transition-all duration-300"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="text-center">
                                    <div className="text-5xl font-bold mb-2">{slot.slotNumber}</div>
                                    <div className="flex items-center justify-center gap-2 mt-4">
                                        <span className="text-2xl">{getStatusIcon(slot.status)}</span>
                                        <span className="font-semibold">{slot.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {filteredSlots.length === 0 && !loading && (
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <div className="text-6xl mb-4">🅿️</div>
                    <p className="text-gray-500 text-lg">No parking slots found</p>
                    <p className="text-gray-400">Add your first slot using the form above</p>
                </div>
            )}
        </div>
    );
}