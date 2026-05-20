const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
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
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);