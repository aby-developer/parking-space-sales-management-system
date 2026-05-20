const express = require("express");
const router = express.Router();

const {
    createCar,
    getAllCars,
    getCarById,
    updateCar,
    deleteCar
} = require("../controllers/carController");

// CREATE
router.post("/add", createCar);

// READ ALL
router.get("/all", getAllCars);

// READ ONE
router.get("/:id", getCarById);

// UPDATE
router.put("/:id", updateCar);

// DELETE
router.delete("/:id", deleteCar);

module.exports = router;