const express = require("express");
const router = express.Router();

const {
    createSlot,
    getAllSlots,
    deleteSlot
} = require("../controllers/parkingSlotController");

// CREATE
router.post("/add", createSlot);

// GET ALL
router.get("/all", getAllSlots);

// DELETE
router.delete("/:id", deleteSlot);

module.exports = router;