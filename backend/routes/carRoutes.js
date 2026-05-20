const express = require('express');
const router = express.Router();

const {
    createCar,
    getAllCars,
    getCarById
} = require('../controllers/carController');

// CREATE
router.post('/add', createCar);

// READ ALL
router.get('/all', getAllCars);

// READ ONE
router.get('/all/:id', getCarById);

module.exports = router;