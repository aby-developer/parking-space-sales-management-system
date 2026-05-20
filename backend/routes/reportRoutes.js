const express = require("express");
const router = express.Router();

const {
    generateReport,
    getAllReports,
    deleteReport
} = require("../controllers/reportController");

// generate by date
router.post("/generate", generateReport);

// get saved reports
router.get("/all", getAllReports);

// delete
router.delete("/:id", deleteReport);

module.exports = router;