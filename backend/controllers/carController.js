const Car = require('../models/car');

// ===================== CREATE CAR =====================
const createCar = async (req, res) => {
    try {
        const { plateNumber, driverName, phoneNumber } = req.body;

        // check if car already exists
        const carExists = await Car.findOne({ plateNumber });
        if (carExists) {
            return res.status(400).json({ message: "Car already exists" });
        }

        const car = await Car.create({
            plateNumber,
            driverName,
            phoneNumber
        });

        res.status(201).json({
            message: "Car inserted successfully",
            car
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ===================== GET ALL CARS =====================
const getAllCars = async (req, res) => {
    try {
        const cars = await Car.find();

        res.status(200).json({
            count: cars.length,
            cars
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ===================== GET SINGLE CAR =====================
const getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        res.status(200).json(car);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ===================== EXPORT =====================
module.exports = {
    createCar,
    getAllCars,
    getCarById
};