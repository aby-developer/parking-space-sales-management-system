import { useState, useEffect } from "react";
import {
    createRecord,
    getRecords,
    markExit,
    getCars,
    getSlots,
    updateRecord,
    deleteRecord
} from "../api/api";

export default function ParkingRecord() {
    const [records, setRecords] = useState([]);
    const [cars, setCars] = useState([]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showRecords, setShowRecords] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);

    const [form, setForm] = useState({
        carId: "",
        slotId: ""
    });

    // ================= LOAD DATA =================
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
            showNotification(err.message || "Failed to load data", "error");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    // ================= HANDLE CHANGE =================
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ================= CREATE OR UPDATE =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.carId || !form.slotId) {
            return showNotification("Please select both car and slot", "error");
        }

        setLoading(true);

        try {
            if (editingId) {
                await updateRecord(editingId, form);
                showNotification("Record updated successfully!", "success");
            } else {
                await createRecord(form);
                showNotification("Record created successfully!", "success");
            }

            setForm({ carId: "", slotId: "" });
            setEditingId(null);
            setShowModal(false);
            await loadData();

        } catch (err) {
            showNotification(err.message || "Operation failed", "error");
        }

        setLoading(false);
    };

    // ================= EDIT =================
    const handleEdit = (record) => {
        setForm({
            carId: record.carId?._id,
            slotId: record.slotId?._id
        });
        setEditingId(record._id);
        setShowModal(true);
    };

    // ================= DELETE =================
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;

        setLoading(true);

        try {
            await deleteRecord(id);
            showNotification("Record deleted successfully!", "success");
            await loadData();
        } catch (err) {
            showNotification(err.message || "Delete failed", "error");
        }

        setLoading(false);
    };

    // ================= EXIT =================
    const handleExit = async (id) => {
        setLoading(true);

        try {
            const res = await markExit(id);
            showNotification(
                `Exit completed! Duration: ${res.record.duration || 0} hours`,
                "success"
            );
            await loadData();
        } catch (err) {
            showNotification(err.message || "Exit failed", "error");
        }

        setLoading(false);
    };

    // ================= NOTIFICATION =================
    const showNotification = (message, type) => {
        const notification = document.createElement("div");
        notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl animate-slide-in flex items-center gap-2 ${
            type === "success"
                ? "bg-gradient-to-r from-[#16A34A] to-[#15803D]"
                : "bg-gradient-to-r from-red-500 to-red-600"
        } text-white`;

        const icon = type === "success" 
            ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
            : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';

        notification.innerHTML = `${icon}<span>${message}</span>`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    };

    // ================= FILTERS =================
    const filteredRecords = records.filter(record => {
        // Search filter
        const matchesSearch = 
            record.carId?.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.slotId?.slotNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Status filter
        const matchesStatus = statusFilter === "all" || record.status.toLowerCase() === statusFilter.toLowerCase();
        
        return matchesSearch && matchesStatus;
    });

    // Get available slots (not occupied in active records)
    const getAvailableSlots = () => {
        const occupiedSlotIds = records
            .filter(r => r.status === "active")
            .map(r => r.slotId?._id);
        
        return slots.filter(slot => !occupiedSlotIds.includes(slot._id));
    };

    const getStatusBadge = (status) => {
        if (status === "active") {
            return {
                color: "from-green-500 to-emerald-600",
                text: "Active",
                icon: "🟢"
            };
        }
        return {
            color: "from-gray-500 to-gray-600",
            text: "Completed",
            icon: "🔘"
        };
    };

    const getDuration = (record) => {
        if (record.status === "completed" && record.exitTime) {
            const entry = new Date(record.entryTime);
            const exit = new Date(record.exitTime);
            const hours = Math.abs(exit - entry) / 36e5;
            return hours.toFixed(1);
        }
        return "In progress";
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[#16A34A] to-[#15803D] bg-clip-text text-transparent">
                        Parking Records
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage active and completed parking sessions</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setForm({ carId: "", slotId: "" });
                            setShowModal(true);
                        }}
                        className="bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#15803D] hover:to-[#16A34A] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Record
                    </button>
                    
                    <button
                        onClick={() => setShowRecords(!showRecords)}
                        className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showRecords ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} />
                        </svg>
                        {showRecords ? "Hide Records" : "Show Records"}
                    </button>
                </div>
            </div>

            {/* FILTERS */}
            {showRecords && (
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by plate number or slot number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all duration-200"
                        />
                    </div>
                    
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all sm:w-40"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            )}

            {/* RECORDS GRID */}
            {showRecords && (
                <>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16A34A]"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredRecords.map((record, index) => {
                                const status = getStatusBadge(record.status);
                                const duration = getDuration(record);
                                
                                return (
                                    <div
                                        key={record._id}
                                        className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 animate-fade-in-up"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <div className={`h-2 bg-gradient-to-r ${status.color}`}></div>
                                        
                                        <div className="p-6">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16A34A]/10 to-[#15803D]/10 flex items-center justify-center">
                                                        <span className="text-2xl">🚗</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Record #{record._id?.slice(-6)}</p>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <span className="text-sm">{status.icon}</span>
                                                            <span className={`text-sm font-semibold ${
                                                                record.status === "active" ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"
                                                            }`}>
                                                                {status.text}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                    {record.status === "active" && (
                                                        <button
                                                            onClick={() => handleEdit(record)}
                                                            className="p-2 rounded-lg text-gray-400 hover:text-[#16A34A] hover:bg-[#16A34A]/10 transition-all duration-200"
                                                            title="Edit"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(record._id)}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">Car Plate</span>
                                                    <span className="font-semibold text-gray-900 dark:text-white">{record.carId?.plateNumber}</span>
                                                </div>
                                                
                                                <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">Slot Number</span>
                                                    <span className="font-semibold text-gray-900 dark:text-white">{record.slotId?.slotNumber}</span>
                                                </div>
                                                
                                                <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">Entry Time</span>
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                                        {new Date(record.entryTime).toLocaleString()}
                                                    </span>
                                                </div>
                                                
                                                {record.status === "completed" && (
                                                    <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                                                        <span className="text-sm text-gray-500 dark:text-gray-400">Exit Time</span>
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                                            {new Date(record.exitTime).toLocaleString()}
                                                        </span>
                                                    </div>
                                                )}
                                                
                                                <div className="flex justify-between items-center pt-2">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">Duration</span>
                                                    <span className="text-lg font-bold text-[#16A34A]">
                                                        {typeof duration === "number" ? `${duration} hrs` : duration}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            {record.status === "active" && (
                                                <button
                                                    onClick={() => handleExit(record._id)}
                                                    className="mt-4 w-full bg-gradient-to-r from-[#3B82F6] to-blue-600 hover:from-blue-600 hover:to-[#3B82F6] text-white py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    Process Exit
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Empty State */}
                    {filteredRecords.length === 0 && !loading && (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                            <div className="text-6xl mb-4">🅿️</div>
                            <p className="text-gray-500 dark:text-gray-400 text-lg">No parking records found</p>
                            <p className="text-gray-400 dark:text-gray-500">Create a new parking record using the button above</p>
                        </div>
                    )}
                </>
            )}

            {/* MODAL - Create/Edit Record */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up"
                    >
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingId ? "Edit Parking Record" : "New Parking Record"}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {editingId ? "Update the parking record details" : "Assign a car to a parking slot"}
                            </p>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Car Selection */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10" />
                                    </svg>
                                    Select Car
                                </label>
                                <select
                                    name="carId"
                                    value={form.carId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all"
                                    required
                                >
                                    <option value="">Choose a car...</option>
                                    {cars.map(car => (
                                        <option key={car._id} value={car._id}>
                                            {car.plateNumber} - {car.driverName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Slot Selection */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
                                    </svg>
                                    Select Slot
                                </label>
                                <select
                                    name="slotId"
                                    value={form.slotId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all"
                                    required
                                >
                                    <option value="">Choose a slot...</option>
                                    {(editingId ? slots : getAvailableSlots()).map(slot => (
                                        <option key={slot._id} value={slot._id}>
                                            {slot.slotNumber} - {slot.status}
                                        </option>
                                    ))}
                                </select>
                                {!editingId && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Only available slots are shown
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#15803D] hover:to-[#16A34A] text-white font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {editingId ? "Update Record" : "Create Record"}
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingId(null);
                                    setForm({ carId: "", slotId: "" });
                                }}
                                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-2.5 rounded-xl transition-all duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}