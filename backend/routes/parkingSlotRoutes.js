const express = require('express');
const router = express.Router();

const parkingController = require('../controllers/parkingSlotController.js');

router.post('/add', parkingController.createSlot);
router.get('/all', parkingController.getAllSlots);

module.exports = router;