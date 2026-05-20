const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/paymentController');

// ================= CREATE PAYMENT =================
router.post('/payments', paymentController.createPayment);

// ================= PENDING PAYMENTS (MUST COME FIRST) =================
router.get('/payments/pending', paymentController.getPendingPayments);

// ================= GET ALL PAYMENTS =================
router.get('/payments', paymentController.getAllPayments);

// ================= GET ONE PAYMENT =================
router.get('/payments/:id', paymentController.getPaymentById);

// ================= UPDATE PAYMENT =================
router.put('/payments/:id', paymentController.updatePayment);

// ================= DELETE PAYMENT =================
router.delete('/payments/:id', paymentController.deletePayment);

module.exports = router;