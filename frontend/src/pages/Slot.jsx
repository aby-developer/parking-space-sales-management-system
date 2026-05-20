import { useState } from "react";
import { createSlot } from "../api/api";

export default function Slots() {
    const [slotNumber, setSlotNumber] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createSlot({ slotNumber });

            setSlotNumber("");
            alert("Slot created successfully");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>🅿️ Add Parking Slot</h2>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Slot Number (e.g A1)"
                    value={slotNumber}
                    onChange={(e) => setSlotNumber(e.target.value)}
                    style={{ padding: 10, marginRight: 10 }}
                />

                <button type="submit">Add Slot</button>
            </form>
        </div>
    );
}