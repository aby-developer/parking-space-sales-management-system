import { useEffect, useState } from "react";
import { createCar, getCars, deleteCar, updateCar } from "../api/api";
import Header from "../components/Header";

// Country codes for phone numbers
const countryCodes = [
    { code: "+250", country: "Rwanda", flag: "🇷🇼" },
    { code: "+256", country: "Uganda", flag: "🇺🇬" },
    { code: "+254", country: "Kenya", flag: "🇰🇪" },
    { code: "+255", country: "Tanzania", flag: "🇹🇿" },
    { code: "+257", country: "Burundi", flag: "🇧🇮" },
    { code: "+243", country: "DRC", flag: "🇨🇩" },
    { code: "+1", country: "USA", flag: "🇺🇸" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+33", country: "France", flag: "🇫🇷" },
    { code: "+49", country: "Germany", flag: "🇩🇪" },
];

export default function Cars() {
    const [form, setForm] = useState({
        plateNumber: "",
        driverName: "",
        phoneNumber: "",
        countryCode: "+250"
    });

    const [cars, setCars] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // ================= VALIDATION RULES =================
    const isValidPlateNumber = (value) => {
    return /^[A-Za-z0-9]+$/.test(value) && value.length >= 3 && value.length <= 15;
};

    const isValidDriverName = (value) => {
        return /^[A-Za-z\s]{2,50}$/.test(value);
    };

    const isValidPhoneNumber = (value) => {
        // Phone number should be between 7-10 digits
        return /^[0-9]{7,10}$/.test(value);
    };

    const loadCars = async () => {
        setLoading(true);
        const res = await getCars();
        setCars(res.cars);
        setLoading(false);
    };

    useEffect(() => {
        loadCars();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCountryCodeChange = (e) => {
        setForm({ ...form, countryCode: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidPlateNumber(form.plateNumber)) {
            return showNotification(
                "Plate number must be 3-15 characters (letters, numbers)",
                "error"
            );
        }

        if (!isValidDriverName(form.driverName)) {
            return showNotification(
                "Driver name must be 2-50 letters and spaces only",
                "error"
            );
        }

        if (!isValidPhoneNumber(form.phoneNumber)) {
            return showNotification(
                "Phone number must be 7-10 digits (without country code)",
                "error"
            );
        }

        setLoading(true);

        try {
            const fullPhoneNumber = `${form.countryCode}${form.phoneNumber}`;
            const carData = {
                plateNumber: form.plateNumber.toUpperCase(),
                driverName: form.driverName.trim(),
                phoneNumber: fullPhoneNumber
            };

            if (editingId) {
                await updateCar(editingId, carData);
                showNotification("Car updated successfully!", "success");
            } else {
                await createCar(carData);
                showNotification("Car added successfully!", "success");
            }

            setForm({ plateNumber: "", driverName: "", phoneNumber: "", countryCode: "+250" });
            setEditingId(null);
            setShowModal(false);
            await loadCars();

        } catch (error) {
            showNotification(error.message || "Something went wrong", "error");
        }

        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this car?")) return;

        setLoading(true);
        await deleteCar(id);
        await loadCars();
        setLoading(false);
        showNotification("Car deleted successfully!", "success");
    };

    const handleEdit = (car) => {
        // Extract country code and number from full phone number
        let countryCode = "+250";
        let phoneNumber = car.phoneNumber;
        
        for (const cc of countryCodes) {
            if (car.phoneNumber.startsWith(cc.code)) {
                countryCode = cc.code;
                phoneNumber = car.phoneNumber.slice(cc.code.length);
                break;
            }
        }
        
        setForm({
            plateNumber: car.plateNumber,
            driverName: car.driverName,
            phoneNumber: phoneNumber,
            countryCode: countryCode
        });
        setEditingId(car._id);
        setShowModal(true);
    };

    const showNotification = (message, type) => {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl animate-slide-in flex items-center gap-2 ${
            type === 'success'
                ? 'bg-gradient-to-r from-[#16A34A] to-[#15803D]'
                : 'bg-gradient-to-r from-red-500 to-red-600'
        } text-white`;

        notification.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${
                    type === 'success'
                        ? 'M5 13l4 4L19 7'
                        : 'M6 18L18 6M6 6l12 12'
                }"></path>
            </svg>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    };

    const filteredCars = cars.filter(car =>
        car.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.driverName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const headerActions = (
        <button
            onClick={() => {
                setEditingId(null);
                setForm({ plateNumber: "", driverName: "", phoneNumber: "", countryCode: "+250" });
                setShowModal(true);
            }}
            className="bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#15803D] hover:to-[#16A34A] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
        >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Car
        </button>
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            <Header 
                title="Car Management" 
                subtitle="Manage registered vehicles and drivers"
                icon="🚗"
                actions={headerActions}
            />

            {/* SEARCH */}
            <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Search by plate number or driver name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all duration-200"
                />
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Cars</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{cars.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Today</p>
                    <p className="text-2xl font-bold text-[#16A34A]">{cars.filter(c => c.status === "active").length}</p>
                </div>
            </div>

            {/* CARS GRID */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16A34A]"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCars.map((car, index) => (
                        <div
                            key={car._id}
                            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#16A34A]/10 to-[#15803D]/10 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10" />
                                        </svg>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(car)}
                                            className="p-2 rounded-lg text-gray-400 hover:text-[#16A34A] hover:bg-[#16A34A]/10 transition-all duration-200"
                                            title="Edit"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(car._id)}
                                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200"
                                            title="Delete"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Plate Number</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">{car.plateNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Driver Name</p>
                                        <p className="text-gray-700 dark:text-gray-300">{car.driverName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Phone Number</p>
                                        <p className="text-gray-700 dark:text-gray-300">{car.phoneNumber}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* EMPTY STATE */}
            {filteredCars.length === 0 && !loading && (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                    <div className="text-6xl mb-4">🚗</div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No cars found</p>
                    <p className="text-gray-400 dark:text-gray-500">Add your first car using the button above</p>
                </div>
            )}

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up"
                    >
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingId ? "Edit Car" : "Add New Car"}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {editingId ? "Update car information" : "Enter car and driver details"}
                            </p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Plate Number
                                </label>
                                <input
                                    name="plateNumber"
                                    placeholder="e.g., RAB-123C"
                                    value={form.plateNumber}
                                    onChange={(e) => {
                                        if (/^[A-Za-z0-9]*$/.test(e.target.value)) {
                                            handleChange(e);
                                        }
                                    }}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all uppercase"
                                    maxLength={15}
                                    required
                                />
                                <p className="text-xs text-gray-400 mt-1">3-15 characters (letters, numbers)</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Driver Name
                                </label>
                                <input
                                    name="driverName"
                                    placeholder="Full name"
                                    value={form.driverName}
                                    onChange={(e) => {
                                        if (/^[A-Za-z\s]*$/.test(e.target.value)) {
                                            handleChange(e);
                                        }
                                    }}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all"
                                    maxLength={50}
                                    required
                                />
                                <p className="text-xs text-gray-400 mt-1">2-50 letters and spaces only</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    Phone Number
                                </label>
                                <div className="flex gap-2">
                                    <select
                                        value={form.countryCode}
                                        onChange={handleCountryCodeChange}
                                        className="w-32 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all"
                                    >
                                        {countryCodes.map(cc => (
                                            <option key={cc.code} value={cc.code}>
                                                {cc.flag} {cc.code}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        name="phoneNumber"
                                        type="tel"
                                        placeholder="7-10 digits"
                                        value={form.phoneNumber}
                                        onChange={(e) => {
                                            if (/^[0-9]*$/.test(e.target.value)) {
                                                handleChange(e);
                                            }
                                        }}
                                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all"
                                        maxLength={10}
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">7-10 digits without country code</p>
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
                                        {editingId ? "Update Car" : "Save Car"}
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
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