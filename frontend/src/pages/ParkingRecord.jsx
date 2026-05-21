import { useState, useEffect, useRef } from "react";
import {
    createRecord,
    getRecords,
    markExit,
    getCars,
    getSlots,
    updateRecord,
    deleteRecord
} from "../api/api";

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

// Record Card Component
const RecordCard = ({ record, index, onEdit, onDelete, onExit }) => {
    const isActive = record.status === "active";
    
    const getDuration = () => {
        if (record.status === "completed" && record.exitTime) {
            const entry = new Date(record.entryTime);
            const exit = new Date(record.exitTime);
            const hours = Math.abs(exit - entry) / 36e5;
            return hours.toFixed(1);
        }
        return "In progress";
    };

    const duration = getDuration();

    return (
        <div className="group bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 animate-[fadeInUp_0.5s_ease-out] hover:-translate-y-1"
            style={{ animationDelay: `${index * 0.05}s` }}>
            {/* Status Bar */}
            <div className={`h-1.5 bg-gradient-to-r ${
                isActive ? 'from-green-500 to-emerald-600' : 'from-gray-400 to-gray-500'
            }`}></div>
            
            <div className="p-4 xs:p-5 sm:p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3 xs:mb-4">
                    <div className="flex items-center gap-2 xs:gap-3">
                        <div className={`w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 rounded-lg xs:rounded-xl flex items-center justify-center ${
                            isActive 
                                ? 'bg-gradient-to-br from-[#16A34A]/10 to-[#15803D]/10 dark:from-[#16A34A]/20 dark:to-[#15803D]/20'
                                : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                            <span className="text-lg xs:text-xl sm:text-2xl">🚗</span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Record #{record._id?.slice(-6)}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'} animate-pulse`}></span>
                                <span className={`text-xs xs:text-sm font-semibold ${
                                    isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                    {isActive ? 'Active' : 'Completed'}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {isActive && (
                            <button
                                onClick={() => onEdit(record)}
                                className="p-1.5 xs:p-2 rounded-lg text-gray-400 hover:text-[#16A34A] hover:bg-[#16A34A]/10 transition-all"
                                title="Edit"
                            >
                                <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                        )}
                        <button
                            onClick={() => onDelete(record._id)}
                            className="p-1.5 xs:p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                            title="Delete"
                        >
                            <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-2 xs:space-y-3">
                    <div className="flex justify-between items-center py-1.5 xs:py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Plate Number</span>
                        <span className="text-xs xs:text-sm font-semibold text-gray-900 dark:text-white">
                            {record.carId?.plateNumber || "N/A"}
                        </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-1.5 xs:py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Slot</span>
                        <span className="text-xs xs:text-sm font-semibold text-gray-900 dark:text-white">
                            {record.slotId?.slotNumber || "N/A"}
                        </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-1.5 xs:py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Entry Time</span>
                        <span className="text-[10px] xs:text-xs text-gray-700 dark:text-gray-300">
                            {new Date(record.entryTime).toLocaleString()}
                        </span>
                    </div>
                    
                    {!isActive && record.exitTime && (
                        <div className="flex justify-between items-center py-1.5 xs:py-2 border-b border-gray-100 dark:border-gray-700">
                            <span className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Exit Time</span>
                            <span className="text-[10px] xs:text-xs text-gray-700 dark:text-gray-300">
                                {new Date(record.exitTime).toLocaleString()}
                            </span>
                        </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-1 xs:pt-2">
                        <span className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Duration</span>
                        <span className="text-sm xs:text-base lg:text-lg font-bold text-[#16A34A]">
                            {typeof duration === "number" ? `${duration} hrs` : duration}
                        </span>
                    </div>
                </div>

                {/* Process Exit Button */}
                {isActive && (
                    <button
                        onClick={() => onExit(record._id)}
                        className="mt-3 xs:mt-4 w-full bg-gradient-to-r from-[#3B82F6] to-blue-600 hover:from-blue-600 hover:to-[#3B82F6] text-white py-2 xs:py-2.5 text-xs xs:text-sm rounded-lg xs:rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 xs:gap-2 shadow-md hover:shadow-lg"
                    >
                        <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Process Exit
                    </button>
                )}
            </div>
        </div>
    );
};

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
    const [notification, setNotification] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const dashboardRef = useRef(null);

    const [form, setForm] = useState({
        carId: "",
        slotId: ""
    });

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

    const handleEdit = (record) => {
        setForm({
            carId: record.carId?._id,
            slotId: record.slotId?._id
        });
        setEditingId(record._id);
        setShowModal(true);
    };

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

    const filteredRecords = records.filter(record => {
        const matchesSearch = 
            record.carId?.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.slotId?.slotNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === "all" || record.status?.toLowerCase() === statusFilter.toLowerCase();
        
        return matchesSearch && matchesStatus;
    });

    const getAvailableSlots = () => {
        const occupiedSlotIds = records
            .filter(r => r.status === "active")
            .map(r => r.slotId?._id);
        
        return slots.filter(slot => !occupiedSlotIds.includes(slot._id));
    };

    const activeRecords = records.filter(r => r.status === "active").length;
    const completedRecords = records.filter(r => r.status === "completed").length;

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
                                <span className="text-base xs:text-lg sm:text-xl">📋</span>
                            </div>
                            <div className="min-w-0">
                                <h1 className={`text-sm xs:text-base sm:text-lg lg:text-xl font-bold transition-colors duration-300 truncate ${
                                    isScrolled ? 'text-white' : 'text-gray-900 dark:text-white'
                                }`}>
                                    Parking Records
                                </h1>
                                <p className={`text-[10px] xs:text-xs sm:text-sm transition-colors duration-300 truncate ${
                                    isScrolled ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                    Manage active and completed parking sessions
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex gap-1.5 xs:gap-2">
                            <button
                                onClick={() => setShowRecords(!showRecords)}
                                className={`px-2 xs:px-3 py-1.5 xs:py-2 text-xs xs:text-sm rounded-lg font-medium transition-all duration-200 ${
                                    isScrolled
                                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                            >
                                {showRecords ? "Hide" : "Show"}
                            </button>
                            <button
                                onClick={() => {
                                    setEditingId(null);
                                    setForm({ carId: "", slotId: "" });
                                    setShowModal(true);
                                }}
                                className="bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#15803D] hover:to-[#16A34A] text-white px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-lg xs:rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1 xs:gap-1.5 text-xs xs:text-sm"
                            >
                                <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="hidden xs:inline">New Record</span>
                                <span className="xs:hidden">New</span>
                            </button>
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 xs:gap-3 sm:gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl p-3 xs:p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-1 xs:mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#16A34A]/10 flex items-center justify-center">
                                <span className="text-sm">📋</span>
                            </div>
                            <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Total Records</p>
                        </div>
                        <p className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{records.length}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl p-3 xs:p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-1 xs:mb-2">
                            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <span className="text-sm">🟢</span>
                            </div>
                            <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Active</p>
                        </div>
                        <p className="text-lg xs:text-xl sm:text-2xl font-bold text-green-600">{activeRecords}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl p-3 xs:p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-1 xs:mb-2">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                <span className="text-sm">✅</span>
                            </div>
                            <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Completed</p>
                        </div>
                        <p className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-600 dark:text-gray-400">{completedRecords}</p>
                    </div>
                </div>

                {/* Filters & Search */}
                {showRecords && (
                    <div className="flex flex-col sm:flex-row gap-2 xs:gap-3">
                        <div className="relative flex-1">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by plate number or slot..."
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
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                )}

                {/* Records Grid */}
                {showRecords && (
                    <>
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl h-72 xs:h-80"></div>
                                ))}
                            </div>
                        ) : filteredRecords.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
                                {filteredRecords.map((record, index) => (
                                    <RecordCard
                                        key={record._id}
                                        record={record}
                                        index={index}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onExit={handleExit}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 xs:py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl xs:rounded-2xl">
                                <div className="text-4xl xs:text-5xl sm:text-6xl mb-3 xs:mb-4">📋</div>
                                <p className="text-sm xs:text-base text-gray-500 dark:text-gray-400 font-medium">
                                    {searchTerm || statusFilter !== "all" ? "No records match your filters" : "No parking records yet"}
                                </p>
                                <p className="text-xs xs:text-sm text-gray-400 dark:text-gray-500 mt-1">
                                    {searchTerm || statusFilter !== "all" ? "Try different search or filter" : "Create a new parking record to get started"}
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* Create/Edit Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4">
                        <div 
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => {
                                setShowModal(false);
                                setEditingId(null);
                                setForm({ carId: "", slotId: "" });
                            }}
                        ></div>
                        
                        <form
                            onSubmit={handleSubmit}
                            className="relative w-full max-w-[400px] xs:max-w-sm sm:max-w-md bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto animate-[scaleIn_0.3s_ease-out]"
                        >
                            <div className="sticky top-0 bg-white dark:bg-gray-800 px-4 xs:px-5 sm:px-6 py-3 xs:py-4 border-b border-gray-100 dark:border-gray-700">
                                <h2 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                    {editingId ? "Edit Parking Record" : "New Parking Record"}
                                </h2>
                                <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                    {editingId ? "Update record details" : "Assign a car to a parking slot"}
                                </p>
                            </div>

                            <div className="p-4 xs:p-5 sm:p-6 space-y-3 xs:space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Select Car
                                    </label>
                                    <select
                                        name="carId"
                                        value={form.carId}
                                        onChange={handleChange}
                                        className="w-full px-3 xs:px-4 py-2 xs:py-2.5 text-xs xs:text-sm rounded-lg xs:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all"
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

                                <div className="space-y-1">
                                    <label className="text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
                                        </svg>
                                        Select Slot
                                    </label>
                                    <select
                                        name="slotId"
                                        value={form.slotId}
                                        onChange={handleChange}
                                        className="w-full px-3 xs:px-4 py-2 xs:py-2.5 text-xs xs:text-sm rounded-lg xs:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all"
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
                                        <p className="text-[9px] xs:text-[10px] text-gray-400 mt-1">
                                            Only available slots are shown
                                        </p>
                                    )}
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
                                    {editingId ? "Update" : "Create"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingId(null);
                                        setForm({ carId: "", slotId: "" });
                                    }}
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