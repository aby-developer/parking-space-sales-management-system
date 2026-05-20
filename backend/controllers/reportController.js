const Payment = require("../models/payment");
const Report = require("../models/report");

// ================= GENERATE REPORT =================
const generateReport = async (req, res) => {
    try {
        const { date } = req.body;

        if (!date) {
            return res.status(400).json({ message: "Date is required" });
        }

        const start = new Date(date);
        start.setHours(0, 0, 0, 0);

        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        const payments = await Payment.find({
            paymentDate: { $gte: start, $lte: end }
        })
        .populate({
            path: "recordId",
            populate: {
                path: "carId",   // 🔥 IMPORTANT FIX
                model: "Car"
            }
        });

        const records = payments.map(p => {
            const record = p.recordId;
            const car = record?.carId;

            return {
                plateNumber: car?.plateNumber || "N/A",
                entryTime: record?.entryTime,
                exitTime: record?.exitTime,
                duration: record?.duration || 0,   // 🔥 FIXED
                amountPaid: p.amount || 0
            };
        });

        const total = records.reduce((sum, r) => sum + r.amountPaid, 0);

        const report = await Report.create({
            date,
            records,
            total
        });

        return res.status(201).json({
            message: "Report generated successfully",
            report
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};


// ================= GET ALL REPORTS =================
const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 });

        res.status(200).json({
            count: reports.length,
            reports
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ================= DELETE REPORT =================
const deleteReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        await report.deleteOne();

        res.status(200).json({
            message: "Report deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    generateReport,
    getAllReports,
    deleteReport
};