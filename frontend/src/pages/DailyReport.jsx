import { useEffect, useState, useRef } from "react";
import { generateReport, getAllReports, deleteReport } from "../api/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

// Report Card Component
const ReportCard = ({ report, index, onCopy, onDownloadPDF, onDownloadTXT, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className="bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 animate-[fadeInUp_0.5s_ease-out]"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            {/* Report Header */}
            <div className="bg-gradient-to-r from-[#16A34A] to-[#15803D] p-3 xs:p-4 sm:p-5 text-white">
                <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-3">
                    <div className="flex items-center gap-2 xs:gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                            <span className="text-base xs:text-lg sm:text-xl">📅</span>
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-sm xs:text-base sm:text-lg font-bold truncate">{report.date}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="bg-white/20 px-1.5 xs:px-2 py-0.5 rounded text-[10px] xs:text-xs">
                                    {report.records?.length || 0} records
                                </span>
                                <span className="text-[10px] xs:text-xs opacity-80">
                                    Total: {report.total?.toLocaleString() || 0} RWF
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-1 xs:gap-1.5 flex-wrap">
                        <button
                            onClick={() => onCopy(report)}
                            className="bg-white/20 hover:bg-white/30 px-2 xs:px-3 py-1 xs:py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1 xs:gap-1.5 text-[10px] xs:text-xs"
                            title="Copy to clipboard"
                        >
                            <svg className="w-3 h-3 xs:w-3.5 xs:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            <span className="hidden sm:inline">Copy</span>
                        </button>
                        <button
                            onClick={() => onDownloadPDF(report)}
                            className="bg-white/20 hover:bg-white/30 px-2 xs:px-3 py-1 xs:py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1 xs:gap-1.5 text-[10px] xs:text-xs"
                            title="Download PDF"
                        >
                            <svg className="w-3 h-3 xs:w-3.5 xs:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="hidden sm:inline">PDF</span>
                        </button>
                        <button
                            onClick={() => onDownloadTXT(report)}
                            className="bg-white/20 hover:bg-white/30 px-2 xs:px-3 py-1 xs:py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1 xs:gap-1.5 text-[10px] xs:text-xs"
                            title="Download TXT"
                        >
                            <svg className="w-3 h-3 xs:w-3.5 xs:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span className="hidden sm:inline">TXT</span>
                        </button>
                        <button
                            onClick={() => onDelete(report._id)}
                            className="bg-red-500/20 hover:bg-red-500/40 px-2 xs:px-3 py-1 xs:py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1 xs:gap-1.5 text-[10px] xs:text-xs"
                            title="Delete report"
                        >
                            <svg className="w-3 h-3 xs:w-3.5 xs:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span className="hidden sm:inline">Delete</span>
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Expand/Collapse Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-3 xs:px-4 py-2 flex items-center justify-center gap-1.5 text-xs xs:text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
                <span>{isExpanded ? "Hide Details" : "Show Details"}</span>
                <svg className={`w-3.5 h-3.5 xs:w-4 xs:h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Records Table */}
            {isExpanded && (
                <div className="overflow-x-auto animate-[fadeIn_0.3s_ease-out]">
                    <div className="min-w-[600px]">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-3 xs:px-4 py-2 xs:py-3 text-left text-[10px] xs:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Plate</th>
                                    <th className="px-3 xs:px-4 py-2 xs:py-3 text-left text-[10px] xs:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Entry</th>
                                    <th className="px-3 xs:px-4 py-2 xs:py-3 text-left text-[10px] xs:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Exit</th>
                                    <th className="px-3 xs:px-4 py-2 xs:py-3 text-left text-[10px] xs:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Duration</th>
                                    <th className="px-3 xs:px-4 py-2 xs:py-3 text-right text-[10px] xs:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {report.records?.map((rec, i) => (
                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-3 xs:px-4 py-2 xs:py-2.5 text-xs xs:text-sm font-medium text-gray-900 dark:text-white">
                                            {rec.plateNumber}
                                        </td>
                                        <td className="px-3 xs:px-4 py-2 xs:py-2.5 text-[10px] xs:text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                            {rec.entryTime}
                                        </td>
                                        <td className="px-3 xs:px-4 py-2 xs:py-2.5 text-[10px] xs:text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                            {rec.exitTime}
                                        </td>
                                        <td className="px-3 xs:px-4 py-2 xs:py-2.5 text-xs xs:text-sm text-gray-700 dark:text-gray-300">
                                            {rec.duration}h
                                        </td>
                                        <td className="px-3 xs:px-4 py-2 xs:py-2.5 text-xs xs:text-sm font-semibold text-[#16A34A] text-right">
                                            {rec.amountPaid?.toLocaleString()} RWF
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="bg-gray-50 dark:bg-gray-700/50 border-t-2 border-gray-200 dark:border-gray-600">
                                    <td colSpan="4" className="px-3 xs:px-4 py-2 xs:py-3 text-right text-xs xs:text-sm font-bold text-gray-900 dark:text-white">
                                        Total:
                                    </td>
                                    <td className="px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base font-bold text-[#16A34A] text-right">
                                        {report.total?.toLocaleString()} RWF
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function DailyReport() {
    const [date, setDate] = useState("");
    const [reports, setReports] = useState([]);
    const [show, setShow] = useState(true);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const dashboardRef = useRef(null);

    const load = async () => {
        setLoading(true);
        try {
            const res = await getAllReports();
            setReports(res.reports || []);
        } catch (error) {
            showNotification("Failed to load reports", "error");
        }
        setLoading(false);
    };

    useEffect(() => {
        load();
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

    const handleGenerate = async () => {
        if (!date) {
            showNotification("Please select a date", "error");
            return;
        }
        setLoading(true);
        try {
            await generateReport(date);
            await load();
            showNotification("Report generated successfully!", "success");
        } catch (error) {
            showNotification(error.message || "Failed to generate report", "error");
        }
        setLoading(false);
    };

    const copyReport = (r) => {
        const text = r.records?.map(rec =>
            `${rec.plateNumber} | ${rec.entryTime} | ${rec.exitTime} | ${rec.duration}h | ${rec.amountPaid} RWF`
        ).join("\n") || "";
        
        navigator.clipboard.writeText(text).then(() => {
            showNotification("Report copied to clipboard!", "success");
        }).catch(() => {
            showNotification("Failed to copy report", "error");
        });
    };

    const downloadPDF = (r) => {
        const doc = new jsPDF();
        
        doc.setFillColor(22, 163, 74);
        doc.rect(0, 0, 210, 45, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.text("Parking Space Sales Management System", 20, 20);
        doc.setFontSize(12);
        doc.text("Daily Operations Report", 20, 30);
        doc.text(`Date: ${r.date}`, 20, 40);
        
        doc.setTextColor(0, 0, 0);
        
        autoTable(doc, {
            startY: 55,
            head: [['Plate Number', 'Entry Time', 'Exit Time', 'Duration', 'Amount (RWF)']],
            body: r.records?.map(rec => [
                rec.plateNumber,
                rec.entryTime,
                rec.exitTime,
                `${rec.duration}h`,
                rec.amountPaid
            ]) || [],
            foot: [['', '', '', 'Total:', r.total]],
            headStyles: { fillColor: [22, 163, 74] },
            footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
            styles: { fontSize: 10 },
            margin: { left: 20, right: 20 }
        });
        
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        const finalY = doc.lastAutoTable?.finalY || 150;
        doc.text("Generated by Parking Space Sales Management System - Eco Smart Solution", 20, finalY + 15);
        doc.text("100% Carbon-neutral parking facility", 20, finalY + 22);
        doc.save(`eco-report-${r.date}.pdf`);
        showNotification("PDF downloaded successfully!", "success");
    };

    const downloadReport = (r) => {
        const content = `PARKING SPACE SALES MANAGEMENT SYSTEM - DAILY REPORT
${'='.repeat(60)}
Date: ${r.date}
Generated: ${new Date().toLocaleString()}
Total Records: ${r.records?.length || 0}
${'='.repeat(60)}

PLATE NUMBER     | ENTRY TIME        | EXIT TIME         | DURATION | AMOUNT
${'-'.repeat(80)}
${r.records?.map(rec => 
    `${rec.plateNumber.padEnd(16)} | ${rec.entryTime.padEnd(18)} | ${rec.exitTime.padEnd(18)} | ${String(rec.duration).padEnd(8)}h | ${rec.amountPaid} RWF`
).join('\n') || 'No records'}
${'='.repeat(80)}
TOTAL AMOUNT: ${r.total?.toLocaleString() || 0} RWF
${'='.repeat(80)}

🌿 Thank you for choosing Parking Space Sales Management System!
   This is a carbon-neutral facility.
   Eco Smart Parking Solution`;

        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `eco-report-${r.date}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification("Report downloaded successfully!", "success");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this report?")) return;
        
        setLoading(true);
        try {
            await deleteReport(id);
            await load();
            showNotification("Report deleted successfully!", "success");
        } catch (error) {
            showNotification("Failed to delete report", "error");
        }
        setLoading(false);
    };

    const totalReports = reports.length;
    const totalRecords = reports.reduce((sum, r) => sum + (r.records?.length || 0), 0);
    const totalRevenue = reports.reduce((sum, r) => sum + (r.total || 0), 0);

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
                                <span className="text-base xs:text-lg sm:text-xl">📊</span>
                            </div>
                            <div className="min-w-0">
                                <h1 className={`text-sm xs:text-base sm:text-lg lg:text-xl font-bold transition-colors duration-300 truncate ${
                                    isScrolled ? 'text-white' : 'text-gray-900 dark:text-white'
                                }`}>
                                    Daily Reports
                                </h1>
                                <p className={`text-[10px] xs:text-xs sm:text-sm transition-colors duration-300 truncate ${
                                    isScrolled ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                    Generate and manage daily parking reports
                                </p>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => setShow(!show)}
                            className={`px-2 xs:px-3 py-1.5 xs:py-2 text-xs xs:text-sm rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5 ${
                                isScrolled
                                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                        >
                            <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={show ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                            </svg>
                            {show ? "Hide" : "Show"}
                        </button>
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
                                <span className="text-sm">📊</span>
                            </div>
                            <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Total Reports</p>
                        </div>
                        <p className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{totalReports}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl p-3 xs:p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-1 xs:mb-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <span className="text-sm">📋</span>
                            </div>
                            <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Total Records</p>
                        </div>
                        <p className="text-lg xs:text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{totalRecords}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl p-3 xs:p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-1 xs:mb-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <span className="text-sm">💰</span>
                            </div>
                            <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Total Revenue</p>
                        </div>
                        <p className="text-lg xs:text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {totalRevenue.toLocaleString()} RWF
                        </p>
                    </div>
                </div>

                {/* Report Generator */}
                <div className="bg-gradient-to-br from-[#16A34A] to-[#15803D] rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 shadow-lg text-white">
                    <h2 className="text-base xs:text-lg sm:text-xl font-bold mb-3 xs:mb-4 flex items-center gap-2">
                        <span className="text-xl xs:text-2xl">📅</span>
                        Generate New Report
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-3 xs:gap-4">
                        <div className="flex-1">
                            <label className="block text-xs xs:text-sm font-medium mb-1.5 xs:mb-2">Select Date</label>
                            <input
                                type="date"
                                value={date}
                                className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-sm xs:text-base rounded-lg xs:rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="w-full sm:w-auto bg-white text-[#16A34A] px-4 xs:px-6 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 text-xs xs:text-sm"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 xs:h-5 xs:w-5 border-b-2 border-[#16A34A]"></div>
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Generate Report
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reports List */}
                {show && (
                    <div className="space-y-3 xs:space-y-4 sm:space-y-6">
                        {loading && reports.length === 0 ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl h-32 xs:h-36"></div>
                                ))}
                            </div>
                        ) : reports.length === 0 ? (
                            <div className="text-center py-12 xs:py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl xs:rounded-2xl">
                                <div className="text-4xl xs:text-5xl sm:text-6xl mb-3 xs:mb-4">📊</div>
                                <p className="text-sm xs:text-base text-gray-500 dark:text-gray-400 font-medium">No reports available</p>
                                <p className="text-xs xs:text-sm text-gray-400 dark:text-gray-500 mt-1">Generate your first report using the form above</p>
                            </div>
                        ) : (
                            reports.map((r, index) => (
                                <ReportCard
                                    key={r._id}
                                    report={r}
                                    index={index}
                                    onCopy={copyReport}
                                    onDownloadPDF={downloadPDF}
                                    onDownloadTXT={downloadReport}
                                    onDelete={handleDelete}
                                />
                            ))
                        )}
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
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
}