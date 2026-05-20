import { useState } from "react";
import { createCar } from "../api/api";

export default function Cars() {
    const [form, setForm] = useState({
        plateNumber: "",
        driverName: "",
        phoneNumber: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await createCar(form);

            alert("Car added successfully");

            setForm({
                plateNumber: "",
                driverName: "",
                phoneNumber: ""
            });

            console.log(res);

        } catch (err) {
            alert(err.message || "Error adding car");
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>🚗 Add Car</h2>

            <form onSubmit={handleSubmit} style={{ width: 300 }}>

                <input
                    name="plateNumber"
                    placeholder="Plate Number"
                    value={form.plateNumber}
                    onChange={handleChange}
                    style={{ width: "100%", marginBottom: 10 }}
                />

                <input
                    name="driverName"
                    placeholder="Driver Name"
                    value={form.driverName}
                    onChange={handleChange}
                    style={{ width: "100%", marginBottom: 10 }}
                />

                <input
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    style={{ width: "100%", marginBottom: 10 }}
                />

                <button style={{ width: "100%" }}>
                    Save Car
                </button>
            </form>
        </div>
    );
}