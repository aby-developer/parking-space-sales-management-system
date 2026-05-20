const ParkingRecord = require('../models/parkingRecord');
const ParkingSlot = require('../models/parkingSlot');


// ================= ENTRY =================
const createRecord = async (req, res) => {
    try {

        const { carId, slotId } = req.body;

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


// ================= GET ALL (HIDE DELETED) =================
const getAllRecords = async (req, res) => {
    try {

        const records = await ParkingRecord.find({
            isDeleted: false
        })
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

        const record = await ParkingRecord.findOne({
            _id: req.params.id,
            isDeleted: false
        })
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

        if (!record || record.isDeleted) {
            return res.status(404).json({ message: "Record not found" });
        }

        if (req.body.exitTime) {
            record.exitTime = req.body.exitTime;
        }

        await record.save();

        res.status(200).json({
            message: "Record updated",
            record
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// ================= SOFT DELETE =================
const deleteRecord = async (req, res) => {
    try {

        const record = await ParkingRecord.findById(req.params.id);

        if (!record || record.isDeleted) {
            return res.status(404).json({ message: "Record not found" });
        }

        // ❌ prevent deleting paid records
        if (record.isPaid) {
            return res.status(400).json({
                message: "Cannot delete a paid record"
            });
        }

        // ✅ soft delete
        record.isDeleted = true;
        await record.save();

        // free slot only if active
        if (record.status === "active") {
            await ParkingSlot.findByIdAndUpdate(record.slotId, {
                status: "Available"
            });
        }

        res.status(200).json({
            message: "Record archived successfully"
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// ================= EXIT =================
const markExit = async (req, res) => {
    try {

        const record = await ParkingRecord.findById(req.params.id);

        if (!record || record.isDeleted) {
            return res.status(404).json({ message: "Not found" });
        }

        const exitTime = new Date();
        record.exitTime = exitTime;

        let hours = Math.ceil(
            (exitTime - record.entryTime) / (1000 * 60 * 60)
        );

        if (hours < 1) hours = 1;

        record.duration = hours;
        record.status = "completed";

        await record.save();

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