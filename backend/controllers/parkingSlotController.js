const ParkingSlot = require('../models/parkingSlot');

// CREATE SLOT (NO STATUS FROM USER)
const createSlot = async (req, res) => {
    try {
        const { slotNumber } = req.body;

        const exists = await ParkingSlot.findOne({ slotNumber });
        if (exists) {
            return res.status(400).json({ message: "Slot exists" });
        }

        const slot = await ParkingSlot.create({
            slotNumber
        });

        res.status(201).json({
            message: "Slot created",
            slot
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET ALL SLOTS
const getAllSlots = async (req, res) => {
    try {
        const slots = await ParkingSlot.find();

        res.json({
            count: slots.length,
            slots
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSlot,
    getAllSlots
};