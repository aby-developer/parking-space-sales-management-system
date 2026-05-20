import { useEffect, useState } from "react";

import {
    getPendingPayments,
    createPayment,
    getPayments
} from "../api/api";

export default function Payments() {

    const [pendingRecords, setPendingRecords] = useState([]);
    const [payments, setPayments] = useState([]);

    const [selectedRecord, setSelectedRecord] = useState(null);

    // ================= LOAD DATA =================
    const loadData = async () => {
        try {

            const pendingRes = await getPendingPayments();
            const paymentRes = await getPayments();

            setPendingRecords(pendingRes.records || []);
            setPayments(paymentRes.payments || []);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // ================= SELECT RECORD =================
    const handleSelectRecord = (e) => {

        const recordId = e.target.value;

        const found = pendingRecords.find(
            (r) => r._id === recordId
        );

        setSelectedRecord(found);
    };

    // ================= CREATE PAYMENT =================
    const handlePayment = async () => {
        try {

            if (!selectedRecord) {
                return alert("Select parking record");
            }

            await createPayment({
                recordId: selectedRecord._id
            });

            alert("Payment completed successfully");

            setSelectedRecord(null);

            loadData();

        } catch (err) {
            alert(err.message || "Payment failed");
        }
    };

    return (
        <div style={{ padding: 20 }}>

            <h2>💳 Payments & Bill Generation</h2>

            {/* ================= SELECT RECORD ================= */}
            <div
                style={{
                    border: "1px solid #ccc",
                    padding: 20,
                    marginBottom: 20,
                    borderRadius: 5
                }}
            >

                <h3>Select Parking Record</h3>

                <select
                    onChange={handleSelectRecord}
                    value={selectedRecord?._id || ""}
                    style={{
                        padding: 10,
                        width: 300
                    }}
                >

                    <option value="">
                        Select Completed Record
                    </option>

                    {pendingRecords.map((record) => (

                        <option
                            key={record._id}
                            value={record._id}
                        >
                            {record.carId?.plateNumber}
                            {" - "}
                            {record.slotId?.slotNumber}
                        </option>

                    ))}

                </select>

            </div>

            {/* ================= BILL PREVIEW ================= */}
            {selectedRecord && (

                <div
                    style={{
                        border: "2px solid black",
                        padding: 20,
                        borderRadius: 5,
                        marginBottom: 20
                    }}
                >

                    <h3>🧾 Generated Bill</h3>

                    <p>
                        <strong>Plate Number:</strong>
                        {" "}
                        {selectedRecord.carId?.plateNumber}
                    </p>

                    <p>
                        <strong>Parking Slot:</strong>
                        {" "}
                        {selectedRecord.slotId?.slotNumber}
                    </p>

                    <p>
                        <strong>Entry Time:</strong>
                        {" "}
                        {new Date(
                            selectedRecord.entryTime
                        ).toLocaleString()}
                    </p>

                    <p>
                        <strong>Exit Time:</strong>
                        {" "}
                        {new Date(
                            selectedRecord.exitTime
                        ).toLocaleString()}
                    </p>

                    <p>
                        <strong>Duration:</strong>
                        {" "}
                        {selectedRecord.duration} hour(s)
                    </p>

                    <p>
                        <strong>Amount Paid:</strong>
                        {" "}
                        {selectedRecord.duration * 500} RWF
                    </p>

                    <p>
                        <strong>Payment Date:</strong>
                        {" "}
                        {new Date().toLocaleString()}
                    </p>

                    <button
                        onClick={handlePayment}
                        style={{
                            padding: 10,
                            marginTop: 10
                        }}
                    >
                        Confirm Payment
                    </button>

                </div>

            )}

            <hr />

            {/* ================= PAYMENT HISTORY ================= */}
            <h3>📋 Payment History</h3>

            {payments.length === 0 && (
                <p>No payments found</p>
            )}

            {payments.map((payment) => (

                <div
                    key={payment._id}
                    style={{
                        border: "1px solid gray",
                        padding: 15,
                        marginBottom: 10,
                        borderRadius: 5
                    }}
                >

                    <p>
                        🚗 Plate:
                        {" "}
                        {payment.recordId?.carId?.plateNumber}
                    </p>

                    <p>
                        🅿️ Slot:
                        {" "}
                        {payment.recordId?.slotId?.slotNumber}
                    </p>

                    <p>
                        ⏰ Entry:
                        {" "}
                        {new Date(
                            payment.recordId?.entryTime
                        ).toLocaleString()}
                    </p>

                    <p>
                        🚪 Exit:
                        {" "}
                        {new Date(
                            payment.recordId?.exitTime
                        ).toLocaleString()}
                    </p>

                    <p>
                        ⏱ Duration:
                        {" "}
                        {payment.recordId?.duration} hrs
                    </p>

                    <p>
                        💰 Amount Paid:
                        {" "}
                        {payment.amount} RWF
                    </p>

                    <p>
                        📅 Payment Date:
                        {" "}
                        {new Date(
                            payment.paymentDate
                        ).toLocaleString()}
                    </p>

                </div>

            ))}

        </div>
    );
}