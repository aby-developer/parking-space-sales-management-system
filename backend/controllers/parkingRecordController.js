const ParkingRecord = require('../models/parkingRecord');
const ParkingSlot = require('../models/parkingSlot');
const Payment = require('../models/payment');


// ================= ENTRY =================
const createRecord = async (req, res) => {
    try {
        const { carId, slotId } = req.body;

        // check slot availability
        const slot = await ParkingSlot.findById(slotId);

        if (!slot) {
            return res.status(404).json({ message: "Slot not found" });
        }

        if (slot.status === "Occupied") {
            return res.status(400).json({ message: "Slot already occupied" });
        }

        const record = await ParkingRecord.create({
            carId,
            slotId
        });

        // UPDATE SLOT → OCCUPIED
        slot.status = "Occupied";
        await slot.save();

        res.status(201).json({
            message: "Parking record created and slot occupied",
            record
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// ================= GET ALL =================
const getAllRecords = async (req, res) => {
    try {
        const records = await ParkingRecord.find()
            .populate('carId')
            .populate('slotId');

        res.status(200).json({
            count: records.length,
            records
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// ================= GET BY ID =================
const getRecordById = async (req, res) => {
    try {
        const record = await ParkingRecord.findById(req.params.id)
            .populate('carId')
            .populate('slotId');

        if (!record) {
            return res.status(404).json({ message: "Record not found" });
        }

        res.status(200).json(record);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// ================= UPDATE =================
const updateRecord = async (req, res) => {
    try {
        const record = await ParkingRecord.findById(req.params.id);

        if (!record) {
            return res.status(404).json({ message: "Record not found" });
        }

        // only allow safe updates (optional improvement)
        if (req.body.exitTime) record.exitTime = req.body.exitTime;

        await record.save();

        res.status(200).json({
            message: "Record updated",
            record
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// ================= DELETE =================
const deleteRecord = async (req, res) => {
    try {
        const record = await ParkingRecord.findById(req.params.id);

        if (!record) {
            return res.status(404).json({ message: "Record not found" });
        }

        // FREE SLOT FIRST
        await ParkingSlot.findByIdAndUpdate(record.slotId, {
            status: "Available"
        });

        await record.deleteOne();

        res.status(200).json({
            message: "Record deleted and slot freed"
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// ================= EXIT (IMPORTANT BUSINESS LOGIC) =================
// ⚠ NOT IN ROUTES YET — ADD IT IF YOU WANT FRONTEND EXIT BUTTON
const markExit = async (req, res) => {
    try {
        const record = await ParkingRecord.findById(req.params.id);

        if (!record) {
            return res.status(404).json({ message: "Not found" });
        }

        const exitTime = new Date();
        record.exitTime = exitTime;

        // duration
        let hours = Math.ceil(
            (exitTime - record.entryTime) / (1000 * 60 * 60)
        );
        if (hours < 1) hours = 1;

        record.duration = hours;
        record.status = "completed";

        await record.save();

        // free slot
        await ParkingSlot.findByIdAndUpdate(record.slotId, {
            status: "Available"
        });

        res.status(200).json({
            message: "Exit completed",
            record
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// ================= EXPORT =================
module.exports = {
    createRecord,
    getAllRecords,
    getRecordById,
    updateRecord,
    deleteRecord,
    markExit
};