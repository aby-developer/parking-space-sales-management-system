const Car = require("../models/car");

// ================= CREATE =================
const createCar = async (req, res) => {
    try {
        const { plateNumber, driverName, phoneNumber } = req.body;

        const exists = await Car.findOne({ plateNumber });

        if (exists) {
            return res.status(400).json({
                message: "Car already exists"
            });
        }

        const car = await Car.create({
            plateNumber,
            driverName,
            phoneNumber
        });

        res.status(201).json({
            message: "Car created successfully",
            car
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================= READ ALL =================
const getAllCars = async (req, res) => {
    try {
        const cars = await Car.find().sort({ createdAt: -1 });

        res.status(200).json({
            count: cars.length,
            cars
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================= READ ONE =================
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

// ================= UPDATE =================
const updateCar = async (req, res) => {
    try {
        const { plateNumber, driverName, phoneNumber } = req.body;

        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        // update fields
        car.plateNumber = plateNumber || car.plateNumber;
        car.driverName = driverName || car.driverName;
        car.phoneNumber = phoneNumber || car.phoneNumber;

        const updated = await car.save();

        res.status(200).json({
            message: "Car updated successfully",
            car: updated
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================= DELETE =================
const deleteCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        await car.deleteOne();

        res.status(200).json({
            message: "Car deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCar,
    getAllCars,
    getCarById,
    updateCar,
    deleteCar
};