const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        recordId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ParkingRecord',
            required: true
        },

        amount: {
            type: Number,
            required: true
        },

        paymentDate: {
            type: Date,
            default: Date.now
        },

        // ================= BILL INFO =================

        billNumber: {
            type: String,
            unique: true
        },

        isHidden: {
            type: Boolean,
            default: false
        },

        companyName: {
            type: String,
            default: "PSSMS Parking"
        },

        generatedBy: {
            type: String,
            default: "Manager"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Payment', paymentSchema);