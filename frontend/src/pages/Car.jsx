import { useEffect, useState, useRef } from "react";
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
                    type === 'success'
                        ? 'M5 13l4 4L19 7'
                        : 'M6 18L18 6M6 6l12 12'
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

// Car Card Component
const CarCard = ({ car, index, onEdit, onDelete }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 animate-[fadeInUp_0.5s_ease-out] hover:-translate-y-1"
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            <div className="p-4 xs:p-5 sm:p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3 xs:mb-4">
                    <div className="flex items-center gap-2 xs:gap-3">
                        <div className="w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 rounded-lg xs:rounded-xl bg-gradient-to-br from-[#16A34A]/10 to-[#15803D]/10 dark:from-[#16A34A]/20 dark:to-[#15803D]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-5 h-5 xs:w-6 xs:h-6 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                {car.plateNumber}
                            </p>
                            <span className={`inline-flex items-center gap-1 text-[10px] xs:text-xs px-1.5 xs:px-2 py-0.5 rounded-full font-medium ${
                                car.status === 'active' 
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                            }`}>
                                <span className="w-1 h-1 rounded-full bg-current"></span>
                                {car.status || 'inactive'}
                            </span>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-1 xs:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                            onClick={() => onEdit(car)}
                            className="p-1.5 xs:p-2 rounded-lg text-gray-400 hover:text-[#16A34A] hover:bg-[#16A34A]/10 transition-all duration-200"
                            title="Edit"
                        >
                            <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => onDelete(car._id)}
                            className="p-1.5 xs:p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200"
                            title="Delete"
                        >
                            <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-2 xs:space-y-3 pl-12 xs:pl-14 sm:pl-15">
                    <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div className="min-w-0">
                            <p className="text-[10px] xs:text-xs text-gray-400 dark:text-gray-500">Driver</p>
                            <p className="text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{car.driverName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <div className="min-w-0">
                            <p className="text-[10px] xs:text-xs text-gray-400 dark:text-gray-500">Phone</p>
                            <p className="text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{car.phoneNumber}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom gradient bar */}
            <div className="h-1 bg-gradient-to-r from-[#16A34A] via-[#15803D] to-[#16A34A] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
    );
};

// Loading Skeleton
const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6">
        {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                        <div className="space-y-2">
                            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        </div>
                    </div>
                </div>
                <div className="space-y-3 pl-14">
                    <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        ))}
    </div>
);

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
    const [notification, setNotification] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const dashboardRef = useRef(null);

    // Validation
    const isValidPlateNumber = (value) => {
        return /^[A-Za-z0-9]+$/.test(value) && value.length >= 3 && value.length <= 15;
    };

    const isValidDriverName = (value) => {
        return /^[A-Za-z\s]{2,50}$/.test(value);
    };

    const isValidPhoneNumber = (value) => {
        return /^[0-9]{7,10}$/.test(value);
    };

    const loadCars = async () => {
        setLoading(true);
        try {
            const res = await getCars();
            setCars(res.cars);
        } catch (error) {
            showNotification("Failed to load cars", "error");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadCars();
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

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCountryCodeChange = (e) => {
        setForm({ ...form, countryCode: e.target.value });
    };

    const showNotification = (message, type) => {
        setNotification({ message, type, id: Date.now() });
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
        try {
            await deleteCar(id);
            await loadCars();
            showNotification("Car deleted successfully!", "success");
        } catch (error) {
            showNotification("Failed to delete car", "error");
        }
        setLoading(false);
    };

    const handleEdit = (car) => {
        let countryCode = "+250";
        let phoneNumber = car.phoneNumber;
        
        for (const cc of countryCodes) {
            if (car.phoneNumber?.startsWith(cc.code)) {
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

    const filteredCars = cars.filter(car =>
        car.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.driverName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const headerActions = (
        <button
            onClick={() => {
                setEditingId(null);
                setForm({ plateNumber: "", driverName: "", phoneNumber: "", countryCode: "+250" });
                setShowModal(true);
            }}
            className="bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#15803D] hover:to-[#16A34A] text-white px-3 xs:px-4 sm:px-5 py-2 xs:py-2.5 rounded-lg xs:rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1.5 xs:gap-2 text-xs xs:text-sm"
        >
            <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden xs:inline">Add Car</span>
            <span className="xs:hidden">Add</span>
        </button>
    );

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
                    <div className="flex items-center gap-2 xs:gap-3">
                        <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-lg xs:rounded-xl bg-gradient-to-br from-[#16A34A] to-[#15803D] flex items-center justify-center shadow-md">
                            <span className="text-base xs:text-lg sm:text-xl">🚗</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className={`text-sm xs:text-base sm:text-lg lg:text-xl font-bold transition-colors duration-300 truncate ${
                                isScrolled ? 'text-white' : 'text-gray-900 dark:text-white'
                            }`}>
                                Car Management
                            </h1>
                            <p className={`text-[10px] xs:text-xs sm:text-sm transition-colors duration-300 truncate ${
                                isScrolled ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                                Manage registered vehicles and drivers
                            </p>
                        </div>
                    </div>
                </div>
                <div className={`h-px transition-all duration-300 ${
                    isScrolled ? 'bg-gradient-to-r from-transparent via-gray-600/30 to-transparent' : 'bg-transparent'
                }`}></div>
            </div>

            {/* Main Content */}
            <div className="space-y-4 xs:space-y-5 sm:space-y-6 pb-4 xs:pb-5 sm:pb-6 px-3 xs:px-4 sm:px-6 pt-4">
                {/* Search & Add Button Row */}
                <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
                    <div className="relative flex-1">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by plate number or driver name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 xs:pl-10 pr-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm rounded-lg xs:rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all duration-200"
                        />
                    </div>
                    <div className="xs:hidden">
                        {headerActions}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl p-3 xs:p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-1 xs:mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#16A34A]/10 flex items-center justify-center">
                                <svg className="w-4 h-4 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Total Cars</p>
                        </div>
                        <p className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{cars.length}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl p-3 xs:p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-1 xs:mb-2">
                            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Active</p>
                        </div>
                        <p className="text-lg xs:text-xl sm:text-2xl font-bold text-[#16A34A]">{cars.filter(c => c.status === "active").length}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl p-3 xs:p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-1 xs:mb-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Today</p>
                        </div>
                        <p className="text-lg xs:text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">0</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl p-3 xs:p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-1 xs:mb-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Drivers</p>
                        </div>
                        <p className="text-lg xs:text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {new Set(cars.map(c => c.driverName)).size}
                        </p>
                    </div>
                </div>

                {/* Cars Grid */}
                {loading ? (
                    <LoadingSkeleton />
                ) : filteredCars.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
                        {filteredCars.map((car, index) => (
                            <CarCard
                                key={car._id}
                                car={car}
                                index={index}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 xs:py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl xs:rounded-2xl">
                        <div className="text-4xl xs:text-5xl sm:text-6xl mb-3 xs:mb-4">🚗</div>
                        <p className="text-sm xs:text-base text-gray-500 dark:text-gray-400 font-medium">
                            {searchTerm ? "No cars match your search" : "No cars registered yet"}
                        </p>
                        <p className="text-xs xs:text-sm text-gray-400 dark:text-gray-500 mt-1">
                            {searchTerm ? "Try a different search term" : "Add your first car to get started"}
                        </p>
                    </div>
                )}

                {/* Add Car Modal */}
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
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white dark:bg-gray-800 px-4 xs:px-5 sm:px-6 py-3 xs:py-4 border-b border-gray-100 dark:border-gray-700">
                                <h2 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                    {editingId ? "Edit Car" : "Add New Car"}
                                </h2>
                                <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                    {editingId ? "Update car information" : "Enter car and driver details"}
                                </p>
                            </div>

                            {/* Form Body */}
                            <div className="p-4 xs:p-5 sm:p-6 space-y-3 xs:space-y-4">
                                {/* Plate Number */}
                                <div className="space-y-1">
                                    <label className="text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                                        className="w-full px-3 xs:px-4 py-2 xs:py-2.5 text-xs xs:text-sm rounded-lg xs:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all uppercase"
                                        maxLength={15}
                                        required
                                    />
                                    <p className="text-[9px] xs:text-[10px] text-gray-400 mt-1">3-15 characters (letters, numbers)</p>
                                </div>

                                {/* Driver Name */}
                                <div className="space-y-1">
                                    <label className="text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                                        className="w-full px-3 xs:px-4 py-2 xs:py-2.5 text-xs xs:text-sm rounded-lg xs:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all"
                                        maxLength={50}
                                        required
                                    />
                                    <p className="text-[9px] xs:text-[10px] text-gray-400 mt-1">2-50 letters and spaces only</p>
                                </div>

                                {/* Phone Number */}
                                <div className="space-y-1">
                                    <label className="text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        Phone Number
                                    </label>
                                    <div className="flex gap-1.5 xs:gap-2">
                                        <select
                                            value={form.countryCode}
                                            onChange={handleCountryCodeChange}
                                            className="w-24 xs:w-28 sm:w-32 px-2 xs:px-3 py-2 xs:py-2.5 text-xs xs:text-sm rounded-lg xs:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all"
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
                                            className="flex-1 px-3 xs:px-4 py-2 xs:py-2.5 text-xs xs:text-sm rounded-lg xs:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] transition-all"
                                            maxLength={10}
                                            required
                                        />
                                    </div>
                                    <p className="text-[9px] xs:text-[10px] text-gray-400 mt-1">7-10 digits without country code</p>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900/50 px-4 xs:px-5 sm:px-6 py-3 xs:py-4 border-t border-gray-100 dark:border-gray-700 flex flex-col xs:flex-row gap-2 xs:gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#15803D] hover:to-[#16A34A] text-white font-semibold py-2 xs:py-2.5 text-xs xs:text-sm rounded-lg xs:rounded-xl transition-all duration-200 shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 xs:h-5 xs:w-5 border-b-2 border-white"></div>
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {editingId ? "Update" : "Save"}
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-2 xs:py-2.5 text-xs xs:text-sm rounded-lg xs:rounded-xl transition-all duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
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
                
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
}