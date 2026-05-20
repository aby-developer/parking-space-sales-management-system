const express = require('express');
const router = express.Router();

const {
    createRecord,
    getAllRecords,
    getRecordById,
    updateRecord,
    deleteRecord,
    markExit
} = require('../controllers/parkingRecordController');

// CREATE
router.post('/add', createRecord);

// READ ALL
router.get('/all', getAllRecords);

// READ ONE
router.get('/all/:id', getRecordById);

// UPDATE
router.put('/update/:id', updateRecord);

// MARK EXIT
router.put('/exit/:id', markExit);

// DELETE
router.delete('/delete/:id', deleteRecord);

module.exports = router;