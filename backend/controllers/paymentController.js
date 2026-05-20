const Payment = require('../models/payment');
const ParkingRecord = require('../models/parkingRecord');


// ================= GET PENDING PAYMENTS =================
const getPendingPayments = async (req, res) => {
    try {

        const records = await ParkingRecord.find({
            status: "completed",
            isPaid: false
        }).populate('carId slotId');

        res.status(200).json({
            count: records.length,
            records
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};


// ================= CREATE PAYMENT =================
const createPayment = async (req, res) => {
    try {

        // validate input
        if (!req.body.recordId) {
            return res.status(400).json({
                message: "Record ID is required"
            });
        }

        // find parking record
        const record = await ParkingRecord.findById(
            req.body.recordId
        ).populate('carId slotId');

        // check if record exists
        if (!record) {
            return res.status(404).json({
                message: "Record not found"
            });
        }

        // prevent duplicate payment
        const existingPayment = await Payment.findOne({
            recordId: record._id
        });

        if (existingPayment) {
            return res.status(400).json({
                message: "Payment already exists"
            });
        }

        // check already paid
        if (record.isPaid) {
            return res.status(400).json({
                message: "Already paid"
            });
        }

        // calculate amount
        const amount = record.duration * 500;

        // create payment + bill
        const payment = await Payment.create({
            recordId: record._id,
            amount,

            // BILL INFO
            billNumber: "BILL-" + Date.now(),

            isHidden: false,

            companyName: "PSSMS Parking",

            generatedBy: "Manager"
        });

        // mark record paid
        record.isPaid = true;

        await record.save();

        res.status(201).json({
            message: "Payment completed successfully",
            payment
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};


// ================= GET ALL PAYMENTS =================
const getAllPayments = async (req, res) => {
    try {

        const payments = await Payment.find()
            .populate({
                path: 'recordId',
                populate: [
                    { path: 'carId' },
                    { path: 'slotId' }
                ]
            });

        res.status(200).json({
            count: payments.length,
            payments
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};


// ================= GET PAYMENT BY ID =================
const getPaymentById = async (req, res) => {
    try {

        const payment = await Payment.findById(req.params.id)
            .populate({
                path: 'recordId',
                populate: [
                    { path: 'carId' },
                    { path: 'slotId' }
                ]
            });

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        res.status(200).json(payment);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};


// ================= UPDATE PAYMENT =================
const updatePayment = async (req, res) => {
    try {

        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        payment.amount = req.body.amount || payment.amount;

        payment.paymentDate =
            req.body.paymentDate || payment.paymentDate;

        await payment.save();

        res.status(200).json({
            message: "Payment updated",
            payment
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};


// ================= HIDE / SHOW BILL =================
const togglePaymentVisibility = async (req, res) => {
    try {

        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        payment.isHidden = !payment.isHidden;

        await payment.save();

        res.status(200).json({
            message: "Bill visibility updated",
            payment
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};


// ================= DELETE PAYMENT =================
const deletePayment = async (req, res) => {
    try {

        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        await payment.deleteOne();

        res.status(200).json({
            message: "Payment deleted"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};


// ================= EXPORT =================
module.exports = {
    getPendingPayments,
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    togglePaymentVisibility,
    deletePayment
};