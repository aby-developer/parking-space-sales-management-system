import { useState, useEffect } from "react";

import {
    createRecord,
    getRecords,
    markExit,
    getCars,
    getSlots
} from "../api/api";

export default function ParkingRecord() {

    const [records, setRecords] = useState([]);
    const [cars, setCars] = useState([]);
    const [slots, setSlots] = useState([]);

    const [form, setForm] = useState({
        carId: "",
        slotId: ""
    });

    // ================= LOAD DATA =================
    const loadData = async () => {
        try {

            const recRes = await getRecords();
            const carRes = await getCars();
            const slotRes = await getSlots();

            // FIXED
            setRecords(recRes.records || []);
            setCars(carRes.cars || []);
            setSlots(slotRes.slots || []);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // ================= HANDLE INPUT =================
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // ================= CREATE ENTRY =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            if (!form.carId || !form.slotId) {
                return alert("Select car and slot");
            }

            await createRecord(form);

            alert("Parking entry created successfully");

            setForm({
                carId: "",
                slotId: ""
            });

            loadData();

        } catch (err) {
            alert(err.message || "Error creating record");
        }
    };

    // ================= MARK EXIT =================
    const handleExit = async (id) => {
        try {

            const res = await markExit(id);

            alert(
                `Exit completed.\nDuration: ${res.record.duration} hrs`
            );

            loadData();

        } catch (err) {
            alert(err.message || "Exit failed");
        }
    };

    return (
        <div style={{ padding: 20 }}>

            <h2>📄 Parking Records</h2>

            {/* ================= ENTRY FORM ================= */}
            <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>

                {/* CAR SELECT */}
                <select
                    name="carId"
                    value={form.carId}
                    onChange={handleChange}
                    style={{
                        padding: 10,
                        marginRight: 10
                    }}
                >
                    <option value="">
                        Select Car
                    </option>

                    {cars.map((car) => (
                        <option
                            key={car._id}
                            value={car._id}
                        >
                            {car.plateNumber}
                        </option>
                    ))}
                </select>

                {/* SLOT SELECT */}
                <select
                    name="slotId"
                    value={form.slotId}
                    onChange={handleChange}
                    style={{
                        padding: 10,
                        marginRight: 10
                    }}
                >
                    <option value="">
                        Select Available Slot
                    </option>

                    {/* 🔥 ONLY AVAILABLE SLOTS */}
                    {slots
                        .filter(slot => slot.status === "Available")
                        .map((slot) => (
                            <option
                                key={slot._id}
                                value={slot._id}
                            >
                                {slot.slotNumber}
                            </option>
                        ))}
                </select>

                <button
                    type="submit"
                    style={{
                        padding: 10
                    }}
                >
                    Create Entry
                </button>

            </form>

            <hr />

            {/* ================= RECORDS LIST ================= */}
            <h3>All Parking Records</h3>

            {records.length === 0 && (
                <p>No parking records found</p>
            )}

            {records.map((record) => (

                <div
                    key={record._id}
                    style={{
                        border: "1px solid #ccc",
                        padding: 15,
                        marginBottom: 10,
                        borderRadius: 5
                    }}
                >

                    <p>
                        🚗 Car:
                        {" "}
                        {record.carId?.plateNumber}
                    </p>

                    <p>
                        🅿️ Slot:
                        {" "}
                        {record.slotId?.slotNumber}
                    </p>

                    <p>
                        ⏰ Entry:
                        {" "}
                        {new Date(record.entryTime).toLocaleString()}
                    </p>

                    <p>
                        🚪 Exit:
                        {" "}
                        {record.exitTime
                            ? new Date(record.exitTime).toLocaleString()
                            : "Not exited"}
                    </p>

                    <p>
                        ⏱ Duration:
                        {" "}
                        {record.duration} hrs
                    </p>

                    <p>
                        📌 Status:
                        {" "}
                        {record.status}
                    </p>

                    <p>
                        💳 Paid:
                        {" "}
                        {record.isPaid ? "Yes" : "No"}
                    </p>

                    {/* EXIT BUTTON */}
                    {record.status === "active" && (
                        <button
                            onClick={() => handleExit(record._id)}
                            style={{
                                padding: 10,
                                marginTop: 10
                            }}
                        >
                            Mark Exit
                        </button>
                    )}

                </div>
            ))}

        </div>
    );
}