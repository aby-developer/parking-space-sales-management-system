const ParkingSlot = require("../models/parkingSlot");

// ================= CREATE SLOT =================
const createSlot = async (req, res) => {
    try {
        const { slotNumber } = req.body;

        const exists = await ParkingSlot.findOne({ slotNumber });

        if (exists) {
            return res.status(400).json({
                message: "Slot already exists"
            });
        }

        const slot = await ParkingSlot.create({
            slotNumber,
            status: "Available" // default always
        });

        res.status(201).json({
            message: "Slot created successfully",
            slot
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ================= GET ALL SLOTS =================
const getAllSlots = async (req, res) => {
    try {
        const slots = await ParkingSlot.find().sort({ createdAt: -1 });

        res.status(200).json({
            count: slots.length,
            slots
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ================= DELETE SLOT =================
const deleteSlot = async (req, res) => {
    try {
        const slot = await ParkingSlot.findById(req.params.id);

        if (!slot) {
            return res.status(404).json({ message: "Slot not found" });
        }

        await slot.deleteOne();

        res.status(200).json({
            message: "Slot deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSlot,
    getAllSlots,
    deleteSlot
};