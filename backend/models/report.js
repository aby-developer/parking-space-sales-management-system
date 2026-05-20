const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        date: {
            type: String,
            required: true
        },

        records: [
            {
                plateNumber: String,
                entryTime: Date,
                exitTime: Date,
                duration: Number,
                amountPaid: Number
            }
        ],

        total: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);